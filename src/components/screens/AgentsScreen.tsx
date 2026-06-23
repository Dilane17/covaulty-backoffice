"use client";

import { useState, useEffect } from "react";
import { Ic } from "@/components/ui/Icons";
import { DropChip } from "@/components/ui/DropChip";
import { Stat } from "@/components/ui/Stat";
import { Topbar } from "@/components/layout/Topbar";
import { AgentFormModal } from "@/components/modals/AgentFormModal";
import { User, CreateUserPayload } from "@/types/user.types";
import { userService } from "@/services/user.service";

export function AgentsScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editTarget, setEditTarget] = useState<User | null | undefined>(undefined);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res: any = await userService.getAll();
      setUsers(Array.isArray(res) ? res : (res.data || []));
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSaveAgent = async (data: CreateUserPayload) => {
    if (editTarget) {
      await userService.create(data); 
      setEditTarget(undefined);
      fetchUsers();
      return null;
    } else {
      const res = await userService.create(data);
      fetchUsers();
      return res;
    }
  };

  const list = Array.isArray(users) ? users : [];

  return (
    <>
      <Topbar
        crumb={["Dashboard", "Staff"]}
        title="Agents & Managers"
        sub={`${list.length} collaborateurs`}
        actions={
          <button className="btn btn-primary btn-sm" onClick={() => setEditTarget(null)}>
            <Ic.Plus /> Ajouter un compte
          </button>
        }
      />

      <div className="filter-bar" style={{ justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flex: 1 }}>
          <div className="searchbar">
            <span className="ic"><Ic.Search /></span>
            <input placeholder="Nom, email, rôle…" />
          </div>
          <DropChip label="Tous les rôles" />
          <DropChip label="Tous statuts" />
        </div>
        <div style={{ display: "flex", gap: 24 }}>
          <Stat v={list.length.toString()} l="Total" />
          <Stat v={list.filter(u => u.isActive).length.toString()} l="Actifs" />
          <Stat v={list.filter(u => u.role === "AGENT").length.toString()} l="Agents terrain" />
        </div>
      </div>

      <div className="content">
        {loading ? (
          <div className="card text-center p-8 muted">Chargement du staff...</div>
        ) : (
          <div className="agents-grid">
            {list.length === 0 && (
              <div className="card text-center p-8 muted" style={{ gridColumn: "1 / -1" }}>Aucun collaborateur trouvé.</div>
            )}
            {list.map((u) => (
              <div className="agent-card" key={u.id}>
                <div className="head">
                  <div className="av" style={{ width: 48, height: 48, fontSize: 16 }}>
                    {u.firstName?.[0] || ""}{u.lastName?.[0] || ""}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="nm">{u.firstName} {u.lastName}</div>
                    <div className="zn" style={{ fontSize: 11, textTransform: "uppercase" }}>{u.role}</div>
                  </div>
                  {u.isActive ? (
                    <span className="pill live"><span className="dot" /> Actif</span>
                  ) : (
                    <span className="pill warn"><span className="dot" /> Inactif</span>
                  )}
                </div>

                <div className="metrics" style={{ gridTemplateColumns: "1fr 1fr" }}>
                  <div>
                    <div className="v tnum" style={{ fontSize: 14 }}>{u.email}</div>
                    <div className="l">Email de connexion</div>
                  </div>
                  <div>
                    <div className="v tnum" style={{ fontSize: 14 }}>{u.agentCode || "N/A"}</div>
                    <div className="l">Code Agent</div>
                  </div>
                </div>

                <div className="between" style={{ borderTop: "1px solid var(--line-2)", paddingTop: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span className="muted" style={{ fontSize: 12 }}>
                      Date de création : {new Date(u.createdAt || Date.now()).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>

                <div className="actions" style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: "center" }} onClick={() => setEditTarget(u)}>
                    Modifier le compte <Ic.Arrow />
                  </button>
                  <button className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: "center" }} onClick={() => window.location.hash = `#transactions?agentId=${u.id}`}>
                    <span style={{ transform: "scale(0.85)", display: "flex" }}><Ic.ArrowUp /></span> Voir ses collectes
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editTarget !== undefined && (
        <AgentFormModal
          agent={editTarget ?? undefined}
          onClose={() => setEditTarget(undefined)}
          onSave={handleSaveAgent}
        />
      )}
    </>
  );
}
