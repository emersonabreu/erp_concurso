// src/components/dashboard/StatsGrid.jsx
import { motion } from "framer-motion";
import { BookOpen, GraduationCap, Brain, Target, TrendingUp, TrendingDown } from "lucide-react";

const stats = [
  { label: "Questões Resolvidas", icon: BookOpen, key: "questoes", color: "text-blue-400", bg: "bg-blue-500/10" },
  { label: "Simulados Feitos", icon: GraduationCap, key: "simulados", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { label: "Revisões Pendentes", icon: Brain, key: "revisoes", color: "text-amber-400", bg: "bg-amber-500/10" },
  { label: "Taxa de Acerto", icon: Target, key: "taxa", color: "text-violet-400", bg: "bg-violet-500/10" },
];

export default function StatsGrid({ data }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold mt-2 text-foreground font-heading">
                {stat.key === "taxa" ? `${data[stat.key] || 0}%` : (data[stat.key] || 0)}
              </p>
            </div>
            <div className={`p-2.5 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </div>
          {data[`${stat.key}_trend`] !== undefined && (
            <div className="flex items-center gap-1 mt-3">
              {data[`${stat.key}_trend`] >= 0 ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-red-400" />
              )}
              <span className={`text-xs font-medium ${data[`${stat.key}_trend`] >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {Math.abs(data[`${stat.key}_trend`])}% vs semana anterior
              </span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}