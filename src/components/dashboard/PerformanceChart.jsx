// src/components/dashboard/PerformanceChart.jsx
import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function PerformanceChart({ respostas }) {
  // Agrupa respostas por dia (últimos 14 dias)
  const today = new Date();
  const days = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    const dayResps = respostas.filter((r) => r.created_date?.startsWith(key));
    const total = dayResps.length;
    const acertos = dayResps.filter((r) => r.correta).length;
    days.push({
      dia: d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      questoes: total,
      acertos,
      taxa: total > 0 ? Math.round((acertos / total) * 100) : 0,
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-card border border-border rounded-xl p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h3 className="font-heading font-semibold text-foreground">Desempenho — Últimos 14 dias</h3>
      </div>
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={days}>
            <defs>
              <linearGradient id="colorTaxa" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(234, 89%, 64%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(234, 89%, 64%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorQuestoes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(160, 70%, 45%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(160, 70%, 45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
            <XAxis dataKey="dia" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
            <YAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222, 44%, 10%)",
                border: "1px solid hsl(222, 30%, 16%)",
                borderRadius: 8,
                color: "hsl(210, 40%, 96%)",
                fontSize: 12,
              }}
            />
            <Area type="monotone" dataKey="questoes" name="Questões" stroke="hsl(160, 70%, 45%)" fill="url(#colorQuestoes)" strokeWidth={2} />
            <Area type="monotone" dataKey="taxa" name="Taxa %" stroke="hsl(234, 89%, 64%)" fill="url(#colorTaxa)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}