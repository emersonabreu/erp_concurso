// src/pages/Dashboard.jsx
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import StatsGrid from "@/components/dashboard/StatsGrid";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import AlertaRevisao from "@/components/dashboard/AlertaRevisao";
import WeeklyGoalCard from "@/components/dashboard/WeeklyGoalCard";
import ReviewBoxes from "@/components/dashboard/ReviewBoxes";

export default function Dashboard() {

  const { data: respostas = [] } = useQuery({
    queryKey: ["respostas"],
    queryFn: () => base44.entities.Resposta?.list?.("-created_date", 500) || Promise.resolve([]),
  });

  const { data: revisoes = [] } = useQuery({
    queryKey: ["revisoes"],
    queryFn: () => base44.entities.RevisaoEspacada?.list?.("-created_date", 200) || Promise.resolve([]),
  });

  const { data: metas = [] } = useQuery({
    queryKey: ["metas"],
    queryFn: () => base44.entities.MetaSemanal?.list?.("-semana_inicio", 10) || Promise.resolve([]),
  });

  // Dados para StatsGrid
  const totalQuestoes = respostas.length;
  const acertos = respostas.filter(r => r.correta).length;
  const taxa = totalQuestoes > 0 ? Math.round((acertos / totalQuestoes) * 100) : 0;
  const hoje = new Date().toISOString().split("T")[0];
  const pendentes = revisoes.filter(r => r.proxima_revisao && r.proxima_revisao <= hoje).length;
  const simuladosFeitos = 0; // Placeholder, depois implementar

  const stats = {
    questoes: totalQuestoes,
    taxa,
    revisoes: pendentes,
    simulados: simuladosFeitos,
  };

  // Meta da semana atual
  const now = new Date();
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay() + 1)).toISOString().split("T")[0];
  const metaAtual = metas.find(m => m.semana_inicio === weekStart);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-heading font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral do seu progresso nos estudos</p>
      </div>

      <AlertaRevisao pendentes={pendentes} />

      <StatsGrid data={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PerformanceChart respostas={respostas} />
          {/* Adicionar DisciplineProgress depois */}
        </div>
        <div className="space-y-6">
          <WeeklyGoalCard meta={metaAtual} />
          <ReviewBoxes revisoes={revisoes} />
          {/* Adicionar UltimasRespostas depois */}
        </div>
      </div>
    </div>
  );
}