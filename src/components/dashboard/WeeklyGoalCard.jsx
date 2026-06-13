// src/components/dashboard/WeeklyGoalCard.jsx
import { motion } from "framer-motion";
import { Target, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function WeeklyGoalCard({ meta }) {
  if (!meta) return null;

  const goals = [
    { label: "Questões", done: meta.questoes_resolvidas || 0, target: meta.meta_questoes || 50, color: "bg-blue-500" },
    { label: "Simulados", done: meta.simulados_feitos || 0, target: meta.meta_simulados || 2, color: "bg-emerald-500" },
    { label: "Revisões", done: meta.revisoes_feitas || 0, target: meta.meta_revisoes || 30, color: "bg-amber-500" },
  ];

  const totalPct = goals.reduce((acc, g) => acc + Math.min((g.done / g.target) * 100, 100), 0) / goals.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card border border-border rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="font-heading font-semibold text-foreground">Metas da Semana</h3>
        </div>
        <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
          {Math.round(totalPct)}% concluído
        </span>
      </div>
      <div className="space-y-4">
        {goals.map((g) => {
          const pct = Math.min(Math.round((g.done / g.target) * 100), 100);
          const complete = pct >= 100;
          return (
            <div key={g.label}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  {complete && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  <span className="text-sm text-foreground font-medium">{g.label}</span>
                </div>
                <span className="text-xs text-muted-foreground font-mono">
                  {g.done}/{g.target}
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.5 }}
                  className={`h-full rounded-full ${g.color}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}