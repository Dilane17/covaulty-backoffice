"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Ic } from "@/components/ui/Icons";
import { Stat } from "@/components/ui/Stat";
import { Topbar } from "@/components/layout/Topbar";
import { AgentFicheModal } from "@/components/modals/AgentFicheModal";
import { fcfa } from "@/utils/fcfa";
import { mapAgentsData, agentsData } from "@/data/agents";
import { MapAgent } from "@/types/agent";

const MAP_STYLE = "https://demotiles.maplibre.org/style.json";
const COTONOU_CENTER: [number, number] = [2.45, 6.42];
const DEFAULT_ZOOM = 11;

function getMarkerColor(st: MapAgent["st"], isActive: boolean): string {
  if (isActive) return "#B3001B";
  if (st === "on") return "#255C99";
  if (st === "off") return "#e07b00";
  return "#6b6b6b";
}

function AgentListItem({
  a,
  active,
  onClick,
}: {
  a: MapAgent;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "grid",
        gridTemplateColumns: "36px 1fr auto",
        gap: 10,
        padding: "10px 12px",
        borderRadius: 10,
        background: active ? "var(--primary-50)" : "transparent",
        borderLeft: active
          ? "3px solid var(--primary)"
          : "3px solid transparent",
        cursor: "pointer",
        alignItems: "center",
      }}
    >
      <div className="av" style={{ width: 36, height: 36, fontSize: 13 }}>
        {a.i}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <strong style={{ fontSize: 13 }}>{a.n}</strong>
          <span className="muted" style={{ fontSize: 11 }}>
            · {a.z.split(" ")[0]}
          </span>
        </div>
        <div
          className="muted"
          style={{
            fontSize: 11,
            marginTop: 2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {a.last}
        </div>
        <div style={{ marginTop: 6 }}>
          {a.st === "on" && (
            <span className="pill live">
              <span className="dot" /> Sur le terrain
            </span>
          )}
          {a.st === "off" && (
            <span className="pill warn">
              <span className="dot" /> Inactif
            </span>
          )}
          {a.st === "ofl" && (
            <span className="pill off">
              <span className="dot" /> Hors-ligne
            </span>
          )}
        </div>
      </div>
      <div
        className="tnum"
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: a.c ? "var(--ink)" : "var(--ink-3)",
        }}
      >
        {fcfa(a.c)}
      </div>
    </div>
  );
}

export function MapScreen() {
  const [active, setActive] = useState("KA");
  const [missionOnly, setMissionOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [ficheOpen, setFicheOpen] = useState(false);

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Map<string, maplibregl.Marker>>(new Map());

  const activeAgent =
    mapAgentsData.find((a) => a.i === active) || mapAgentsData[0];
  const activeFicheAgent = agentsData.find((a) => a.i === active);

  const actifs = mapAgentsData.filter((a) => a.st === "on");
  const inactifs = mapAgentsData.filter(
    (a) => a.st === "off" || a.st === "ofl",
  );

  const filterList = (list: MapAgent[]) =>
    list.filter(
      (a) =>
        search === "" ||
        a.n.toLowerCase().includes(search.toLowerCase()) ||
        a.z.toLowerCase().includes(search.toLowerCase()),
    );

  const visibleActifs = filterList(missionOnly ? actifs : actifs);
  const visibleInactifs = filterList(missionOnly ? [] : inactifs);

  const handleSelectAgent = useCallback((id: string) => {
    setActive(id);
    const agent = mapAgentsData.find((a) => a.i === id);
    if (agent && mapRef.current) {
      mapRef.current.flyTo({
        center: [agent.lng, agent.lat],
        zoom: 14,
        duration: 800,
      });
    }
  }, []);

  // Init map
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

    map.on("load", () => {
      // Add markers for each agent
      mapAgentsData.forEach((a) => {
        const el = document.createElement("div");
        el.style.cssText = `
          width: 38px; height: 38px; border-radius: 50%;
          background: ${getMarkerColor(a.st, a.i === "KA")};
          border: 3px solid #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; color: #fff;
          cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,0.35);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        `;
        el.textContent = a.i;

        el.addEventListener("click", (e) => {
          e.stopPropagation();
          handleSelectAgent(a.i);
        });

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([a.lng, a.lat])
          .addTo(map);

        markersRef.current.set(a.i, marker);
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current.clear();
    };
  }, [handleSelectAgent]);

  // Update markers style + tournee on active change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Update marker styles
    markersRef.current.forEach((marker, id) => {
      const el = marker.getElement();
      const isActive = id === active;
      const agent = mapAgentsData.find((a) => a.i === id);
      if (!agent) return;
      el.style.background = getMarkerColor(agent.st, isActive);
      el.style.transform = isActive ? "scale(1.3)" : "scale(1)";
      el.style.boxShadow = isActive
        ? "0 6px 20px rgba(179,0,27,0.5)"
        : "0 4px 14px rgba(0,0,0,0.35)";
      el.style.zIndex = isActive ? "10" : "1";
    });

    // Wait for style to be loaded before adding layers
    if (!map.isStyleLoaded()) {
      map.once("idle", () => updateTournee(map));
    } else {
      updateTournee(map);
    }

    function updateTournee(m: maplibregl.Map) {
      const ids = [
        "tournee-stops-labels",
        "tournee-stops-layer",
        "tournee-line-layer",
      ];
      ids.forEach((id) => {
        if (m.getLayer(id)) m.removeLayer(id);
      });
      ["tournee-line", "tournee-stops"].forEach((id) => {
        if (m.getSource(id)) m.removeSource(id);
      });

      if (activeAgent.tournee.length > 1) {
        const coordinates = activeAgent.tournee.map((s) => [s.lng, s.lat]);

        m.addSource("tournee-line", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: { type: "LineString", coordinates },
          },
        });

        m.addLayer({
          id: "tournee-line-layer",
          type: "line",
          source: "tournee-line",
          paint: {
            "line-color": "#B3001B",
            "line-width": 3,
            "line-dasharray": [2, 2],
          },
        });

        m.addSource("tournee-stops", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: activeAgent.tournee.map((s) => ({
              type: "Feature" as const,
              properties: { n: String(s.n) },
              geometry: { type: "Point" as const, coordinates: [s.lng, s.lat] },
            })),
          },
        });

        m.addLayer({
          id: "tournee-stops-layer",
          type: "circle",
          source: "tournee-stops",
          paint: {
            "circle-radius": 7,
            "circle-color": "#B3001B",
            "circle-stroke-width": 2,
            "circle-stroke-color": "#fff",
          },
        });

        m.addLayer({
          id: "tournee-stops-labels",
          type: "symbol",
          source: "tournee-stops",
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
      }
    }
  }, [active, activeAgent]);

  return (
    <>
      <Topbar
        crumb={["Dashboard", "Carte agents"]}
        title="Carte agents"
        sub={`${actifs.length} agents sur le terrain · Temps réel`}
        actions={
          <>
            <span className="pill live">
              <span className="dot" /> Live
            </span>
            <button className="btn btn-ghost btn-sm">
              <Ic.Refresh /> Actualiser
            </button>
          </>
        }
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
              Agents
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
            <div
              style={{
                display: "inline-flex",
                marginTop: 12,
                gap: 4,
                padding: 3,
                borderRadius: 999,
                background: "var(--paper-3)",
              }}
            >
              <button
                onClick={() => setMissionOnly(true)}
                className="tab"
                style={{
                  background: missionOnly ? "#fff" : "transparent",
                  color: missionOnly ? "var(--ink)" : "var(--ink-3)",
                  boxShadow: missionOnly
                    ? "0 1px 2px rgba(0,0,0,0.06)"
                    : "none",
                }}
              >
                En mission
              </button>
              <button
                onClick={() => setMissionOnly(false)}
                className="tab"
                style={{
                  background: !missionOnly ? "#fff" : "transparent",
                  color: !missionOnly ? "var(--ink)" : "var(--ink-3)",
                  boxShadow: !missionOnly
                    ? "0 1px 2px rgba(0,0,0,0.06)"
                    : "none",
                }}
              >
                Tous
              </button>
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
            {visibleActifs.length > 0 && (
              <>
                <div className="eyebrow" style={{ padding: "6px 10px" }}>
                  Actifs · {actifs.length}
                </div>
                {visibleActifs.map((a) => (
                  <AgentListItem
                    key={a.i}
                    a={a}
                    active={a.i === active}
                    onClick={() => handleSelectAgent(a.i)}
                  />
                ))}
              </>
            )}
            {visibleInactifs.length > 0 && (
              <>
                <div className="eyebrow" style={{ padding: "10px 10px 6px" }}>
                  Inactifs · {inactifs.length}
                </div>
                {visibleInactifs.map((a) => (
                  <AgentListItem
                    key={a.i}
                    a={a}
                    active={a.i === active}
                    onClick={() => handleSelectAgent(a.i)}
                  />
                ))}
              </>
            )}
            {visibleActifs.length === 0 && visibleInactifs.length === 0 && (
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

          <div className="map-agent-card">
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                className="av lg"
                style={{ background: "var(--primary)", color: "#fff" }}
              >
                {activeAgent.i}
              </div>
              <div style={{ flex: 1 }}>
                <div className="h3" style={{ fontSize: 18 }}>
                  {activeAgent.n}
                </div>
                <div className="muted" style={{ fontSize: 12 }}>
                  {activeAgent.z}
                  {activeAgent.tournee.length > 0 &&
                    ` · Tournée ${activeAgent.tournee.length} arrêts`}
                </div>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 8,
                padding: "14px 0",
                borderTop: "1px solid var(--line)",
                borderBottom: "1px solid var(--line)",
                marginTop: 14,
              }}
            >
              <Stat v={activeAgent.deps} l="Dépôts" />
              <Stat v={fcfa(activeAgent.c)} l="Collecté" big />
              <Stat v={`${activeAgent.obj}%`} l="Objectif" />
            </div>
            <div className="muted" style={{ fontSize: 12, marginTop: 10 }}>
              <div>Dernière position</div>
              <div
                style={{ color: "var(--ink)", marginTop: 2, fontWeight: 500 }}
              >
                {activeAgent.lastPos}
              </div>
            </div>
            {activeFicheAgent && (
              <button
                className="btn btn-ghost btn-sm"
                style={{
                  marginTop: 14,
                  color: "var(--primary)",
                  border: "1px solid var(--primary-200)",
                  justifyContent: "center",
                  width: "100%",
                }}
                onClick={() => setFicheOpen(true)}
              >
                Voir la fiche complète <Ic.Arrow />
              </button>
            )}
          </div>
        </div>
      </div>

      {ficheOpen && activeFicheAgent && (
        <AgentFicheModal
          a={activeFicheAgent}
          onClose={() => setFicheOpen(false)}
        />
      )}
    </>
  );
}
