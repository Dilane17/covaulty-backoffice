"use client";

import { useState, useEffect } from "react";
import { Topbar } from "@/components/layout/Topbar";
import { analyticsService } from "@/services/analytics.service";
import { KpiCard } from "@/components/ui/KpiCard";
import { fcfa } from "@/utils/fcfa";

interface PlatformData {
  totalInstitutions: number;
  totalUsers: number;
  totalClients: number;
  platformDailyCollection: number;
}

export function PlatformDashboardScreen() {
  const [data, setData] = useState<PlatformData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await analyticsService.getPlatformDashboard();
        setData(res);
      } catch (err) {
        setError("Impossible de charger les données de la plateforme.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Topbar crumb={["Plateforme"]} title="Vue Globale (SUPER_ADMIN)" />
      <div className="content">
        <h2 className="text-2xl font-semibold mb-6">Supervision de la Plateforme</h2>

        {loading && <p className="text-sm text-gray-500">Chargement des indicateurs...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="kpi-enter delay-0">
              <KpiCard
                lbl="Institutions Actives"
                val={data.totalInstitutions}
              />
            </div>
            <div className="kpi-enter delay-[60ms]">
              <KpiCard
                lbl="Utilisateurs"
                val={data.totalUsers}
              />
            </div>
            <div className="kpi-enter delay-[120ms]">
              <KpiCard
                lbl="Clients Plateforme"
                val={data.totalClients}
              />
            </div>
            <div className="kpi-enter delay-[180ms]">
              <KpiCard
                lbl="Volume Collecte Jour"
                val={fcfa(data.platformDailyCollection)}
                highlight
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
