"use client";

import { useState } from "react";
import { Ic } from "@/components/ui/Icons";
import { DropChip } from "@/components/ui/DropChip";
import { Stars } from "@/components/ui/Stars";
import { Stat } from "@/components/ui/Stat";
import { Topbar } from "@/components/layout/Topbar";
import { AgentFicheModal } from "@/components/modals/AgentFicheModal";
import {
  AgentFormModal,
  AgentFormData,
} from "@/components/modals/AgentFormModal";
import { fcfa } from "@/utils/fcfa";
import { agentsData } from "@/data/agents";
import { Agent } from "@/types/agent";

export function AgentsScreen() {
  const [open, setOpen] = useState<Agent | null>(null);
  // null = formulaire création ouvert · Agent = formulaire édition ouvert · undefined = fermé
  const [editTarget, setEditTarget] = useState<Agent | null | undefined>(
    undefined,
  );

  function openCreateForm() {
    setEditTarget(null);
  }

  function openEditForm(agent: Agent) {
    setOpen(null);
    setEditTarget(agent);
  }

  function closeForm() {
    setEditTarget(undefined);
  }

  function handleSaveAgent(data: AgentFormData) {
    console.log("[TODO] Sauvegarder agent via API:", data);
    setEditTarget(undefined);
  }

  return (
    <>
      <Topbar
        crumb={["Dashboard", "Agents"]}
        title="Agents"
        sub="22 agents · 18 actifs"
        actions={
          <button className="btn btn-primary btn-sm" onClick={openCreateForm}>
            <Ic.Plus /> Ajouter un agent
          </button>
        }
      />

      <div className="filter-bar" style={{ justifyContent: "space-between" }}>
        <div
          style={{ display: "flex", gap: 10, alignItems: "center", flex: 1 }}
        >
          <div className="searchbar">
            <span className="ic">
              <Ic.Search />
            </span>
            <input placeholder="Nom, zone, code…" />
          </div>
          <DropChip label="Toutes les zones" />
          <DropChip label="Tous statuts" />
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          <Stat v="22" l="Total" />
          <Stat v="18" l="Actifs" />
          <Stat v="82%" l="Objectif moyen" />
        </div>
      </div>

      <div className="content">
        <div className="agents-grid">
          {agentsData.map((a) => (
            <div className="agent-card" key={a.i}>
              <div className="head">
                <div
                  className="av"
                  style={{ width: 48, height: 48, fontSize: 16 }}
                >
                  {a.i}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="nm">{a.n}</div>
                  <div className="zn">{a.z}</div>
                </div>
                {a.s === "on" && (
                  <span className="pill live">
                    <span className="dot" /> Actif
                  </span>
                )}
                {a.s === "off" && (
                  <span className="pill warn">
                    <span className="dot" /> Inactif
                  </span>
                )}
                {a.s === "ofl" && (
                  <span className="pill off">
                    <span className="dot" /> Hors-ligne
                  </span>
                )}
              </div>

              <div className="metrics">
                <div>
                  <div className="v tnum">{a.d}</div>
                  <div className="l">Dépôts j.</div>
                </div>
                <div>
                  <div className="v tnum">{fcfa(a.c)}</div>
                  <div className="l">Collecté j.</div>
                </div>
                <div>
                  <div className="v tnum">{a.o}%</div>
                  <div className="l">Objectif</div>
                </div>
              </div>

              <div className="bar full">
                <span style={{ width: `${a.o}%` }} />
              </div>

              <div
                className="between"
                style={{ borderTop: "1px solid var(--line-2)", paddingTop: 12 }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Stars value={Math.round(a.rt)} />
                  <span style={{ fontSize: 12, fontWeight: 500 }}>
                    {a.rt.toFixed(1)}
                  </span>
                  <span className="muted" style={{ fontSize: 11 }}>
                    · {a.dj} j. actifs
                  </span>
                </div>
                <span className="pill off" style={{ fontSize: 11 }}>
                  {a.lastSync}
                </span>
              </div>

              <div className="actions">
                <button
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1, justifyContent: "center" }}
                  onClick={() => setOpen(a)}
                >
                  Voir la fiche <Ic.Arrow />
                </button>
                <a
                  href={`tel:${a.tel}`}
                  className="btn-icon"
                  title={`Appeler ${a.n}`}
                  style={{
                    width: 36,
                    height: 36,
                    border: "1px solid var(--line-strong)",
                    borderRadius: 999,
                    color: "var(--ink-2)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Ic.Phone />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {open && (
        <AgentFicheModal
          a={open}
          onClose={() => setOpen(null)}
          onEdit={() => openEditForm(open)}
        />
      )}
      {editTarget !== undefined && (
        <AgentFormModal
          agent={editTarget ?? undefined}
          onClose={closeForm}
          onSave={handleSaveAgent}
        />
      )}
    </>
  );
}
