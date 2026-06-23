"use client";

import { useState, useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Ic } from "@/components/ui/Icons";
import { Topbar } from "@/components/layout/Topbar";
import { fcfa } from "@/utils/fcfa";

import { agencyService } from "@/services/agency.service";
import { userService } from "@/services/user.service";
import { trackingService, AgentLocationHistory } from "@/services/tracking.service";

const MAP_STYLE = "https://demotiles.maplibre.org/style.json";
const COTONOU_CENTER: [number, number] = [2.45, 6.42];
const DEFAULT_ZOOM = 12;

// TODO Phase 7 : Connexion Socket.io pour le tracking live
// Événement à écouter : 'agent:location:update'
// Payload : { agentId, latitude, longitude, batteryLevel }
// Room : institutionId ou agencyId
// Ref : docs/tracking/workflow.md

export function MapScreen() {
  const [agencies, setAgencies] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [history, setHistory] = useState<AgentLocationHistory[]>([]);
  const [search, setSearch] = useState("");
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());

  // Init data
  useEffect(() => {
    const fetchBaseData = async () => {
      try {
        const [agRes, usrRes] = await Promise.all([
          agencyService.getAll().catch(() => []),
          userService.getAll({ role: "AGENT", isActive: true }).catch(() => [])
        ]);
        setAgencies(Array.isArray(agRes) ? agRes : (agRes as any).data || []);
        setAgents(Array.isArray(usrRes) ? usrRes : (usrRes as any).data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBaseData();
  }, []);

  // Tracking history
  useEffect(() => {
    if (!activeAgentId) {
      setHistory([]);
      return;
    }
    const fetchHistory = async () => {
      try {
        const res = await trackingService.getHistory(activeAgentId, date).catch(() => []);
        setHistory(Array.isArray(res) ? res : (res as any).data || []);
      } catch (err) {
        setHistory([]);
      }
    };
    fetchHistory();
  }, [activeAgentId, date]);

  // Map Initialization
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_STYLE,
      center: COTONOU_CENTER,
      zoom: DEFAULT_ZOOM,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl(), "bottom-right");
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Agencies Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || agencies.length === 0) return;

    markersRef.current.forEach(m => m.remove());
    markersRef.current.clear();

    agencies.forEach((ag, i) => {
      // Mock coordinates near Cotonou for display if API doesn't provide them
      const lng = (ag.longitude != null) ? ag.longitude : COTONOU_CENTER[0] + (i * 0.015) - 0.02;
      const lat = (ag.latitude != null) ? ag.latitude : COTONOU_CENTER[1] + (i * 0.015) - 0.02;

      const el = document.createElement("div");
      el.style.cssText = `
        width: 32px; height: 32px; border-radius: 8px;
        background: var(--primary);
        border: 2px solid #fff;
        display: flex; align-items: center; justify-content: center;
        color: #fff; box-shadow: 0 4px 14px rgba(0,0,0,0.35);
        cursor: pointer;
      `;
      el.innerHTML = `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16M9 21v-4a2 2 0 012-2h2a2 2 0 012 2v4"/></svg>`;

      const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 4px; font-family: Inter, sans-serif;">
          <strong style="color: var(--ink)">${ag.name}</strong><br/>
          <div style="font-size: 11px; color: var(--ink-3); margin-bottom: 8px;">${ag.address || 'Adresse inconnue'}</div>
          <div style="font-size: 12px; color: var(--ink-3);">Chargement...</div>
        </div>
      `);

      el.addEventListener("click", async () => {
        try {
          const detail = await agencyService.getById(ag.id);
          const agentCount = agents.filter(a => a.agencyId === ag.id).length;
          popup.setHTML(`
            <div style="padding: 4px; font-family: Inter, sans-serif;">
              <strong style="color: var(--ink)">${ag.name}</strong><br/>
              <div style="font-size: 11px; color: var(--ink-3); margin-bottom: 8px;">${ag.address || 'Adresse inconnue'}</div>
              <div style="font-size: 12px; margin-bottom: 4px;"><strong>Agents rattachés:</strong> ${agentCount}</div>
              <div style="font-size: 12px;"><strong>Solde agence:</strong> ${fcfa(detail.walletBalance || 0)}</div>
            </div>
          `);
        } catch (err) {
          popup.setHTML(`
            <div style="padding: 4px; font-family: Inter, sans-serif;">
              <strong style="color: var(--ink)">${ag.name}</strong><br/>
              <div style="font-size: 11px; color: var(--ink-3); margin-bottom: 8px;">${ag.address || 'Adresse inconnue'}</div>
              <div style="font-size: 12px; color: var(--warn);">Erreur de chargement des détails</div>
            </div>
          `);
        }
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.set(ag.id, marker);
    });
  }, [agencies, agents]);

  // Draw History Trace
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (!map.isStyleLoaded()) {
      map.once("idle", draw);
    } else {
      draw();
    }

    function draw() {
      const ids = ["history-stops-labels", "history-stops-layer", "history-line-layer"];
      ids.forEach((id) => {
        if (map!.getLayer(id)) map!.removeLayer(id);
      });
      ["history-line", "history-stops"].forEach((id) => {
        if (map!.getSource(id)) map!.removeSource(id);
      });

      if (history.length > 0) {
        const coordinates = history.map((h) => [h.longitude, h.latitude]);

        map!.addSource("history-line", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: { type: "LineString", coordinates },
          },
        });

        map!.addLayer({
          id: "history-line-layer",
          type: "line",
          source: "history-line",
          paint: {
            "line-color": "#B3001B",
            "line-width": 3,
            "line-dasharray": [2, 2],
          },
        });

        map!.addSource("history-stops", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: history.map((h) => ({
              type: "Feature" as const,
              properties: { 
                n: new Date(h.timestamp).toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit' }) 
              },
              geometry: { type: "Point" as const, coordinates: [h.longitude, h.latitude] },
            })),
          },
        });

        map!.addLayer({
          id: "history-stops-layer",
          type: "circle",
          source: "history-stops",
          paint: {
            "circle-radius": 7,
            "circle-color": "#B3001B",
            "circle-stroke-width": 2,
            "circle-stroke-color": "#fff",
          },
        });

        map!.addLayer({
          id: "history-stops-labels",
          type: "symbol",
          source: "history-stops",
          layout: {
            "text-field": ["get", "n"],
            "text-size": 11,
            "text-offset": [0, -1.5],
          },
          paint: {
            "text-color": "#B3001B",
            "text-halo-color": "#fff",
            "text-halo-width": 1.5,
          },
        });

        // Zoom to fit bounds
        if (coordinates.length > 1) {
          const bounds = new maplibregl.LngLatBounds(coordinates[0] as [number, number], coordinates[0] as [number, number]);
          coordinates.forEach(coord => bounds.extend(coord as [number, number]));
          map!.fitBounds(bounds, { padding: 60, duration: 800 });
        } else if (coordinates.length === 1) {
          map!.flyTo({ center: coordinates[0] as [number, number], zoom: 15, duration: 800 });
        }
      }
    }
  }, [history]);

  const visibleAgents = agents.filter(
    (a) =>
      search === "" ||
      `${a.firstName} ${a.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Topbar
        crumb={["Dashboard", "Tracking terrain"]}
        title="Tracking terrain"
        sub={`${agents.length} agents au total · Historique consolidé`}
      />
      <div
        className="content flush"
        style={{
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          height: "calc(100vh - var(--topbar-h, 64px))",
        }}
      >
        <aside
          style={{
            background: "#fff",
            borderRight: "1px solid var(--line)",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "18px 20px",
              borderBottom: "1px solid var(--line)",
            }}
          >
            <div className="h4" style={{ marginBottom: 10 }}>
              Sélecteur d'Agent
            </div>
            
            <div className="field" style={{ marginBottom: 12 }}>
              <label htmlFor="map-date">Date de suivi</label>
              <div className="input">
                <input 
                  id="map-date"
                  type="date" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                />
              </div>
            </div>

            <div className="searchbar">
              <span className="ic">
                <Ic.Search />
              </span>
              <input
                placeholder="Rechercher un agent…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div
            style={{
              padding: 12,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            {visibleAgents.map((a) => {
              const isActive = a.id === activeAgentId;
              const agency = agencies.find(ag => ag.id === a.agencyId);
              return (
                <div
                  key={a.id}
                  onClick={() => setActiveAgentId(a.id)}
                  style={{
                    display: "flex",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: isActive ? "var(--primary-50)" : "transparent",
                    borderLeft: isActive
                      ? "3px solid var(--primary)"
                      : "3px solid transparent",
                    cursor: "pointer",
                    alignItems: "center",
                  }}
                >
                  <div className="av" style={{ width: 36, height: 36, fontSize: 13 }}>
                    {a.firstName[0]}{a.lastName?.[0] || ""}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <strong style={{ fontSize: 13, textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>
                        {a.firstName} {a.lastName}
                      </strong>
                    </div>
                    <div className="muted" style={{ fontSize: 11, marginTop: 2 }}>
                      {agency?.name || "Sans agence"}
                    </div>
                  </div>
                </div>
              );
            })}
            {visibleAgents.length === 0 && (
              <div
                className="muted"
                style={{
                  padding: "20px 12px",
                  fontSize: 13,
                  textAlign: "center",
                }}
              >
                Aucun agent trouvé
              </div>
            )}
          </div>
        </aside>

        <div style={{ position: "relative", width: "100%", height: "100%" }}>
          <div ref={mapContainer} style={{ width: "100%", height: "100%" }} />
          
          {activeAgentId && (
            <div className="map-agent-card" style={{ bottom: 24, left: 24, right: "auto", top: "auto", position: "absolute", background: "#fff", padding: 20, borderRadius: 16, boxShadow: "0 10px 30px rgba(0,0,0,0.1)", zIndex: 100, width: 300 }}>
              <div className="h4" style={{ marginBottom: 4 }}>Historique de la tournée</div>
              <div className="muted" style={{ fontSize: 12, marginBottom: 12 }}>{new Date(date).toLocaleDateString("fr-FR")}</div>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: "1px solid var(--line)" }}>
                <span className="muted" style={{ fontSize: 13 }}>Points enregistrés</span>
                <span className="fw-600">{history.length}</span>
              </div>
              
              {history.length === 0 && (
                <div style={{ fontSize: 12, color: "var(--warn)", marginTop: 8, background: "var(--warn-50)", padding: "8px 12px", borderRadius: 8 }}>
                  Aucune donnée GPS trouvée pour cette date.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
