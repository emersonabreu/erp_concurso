// src/components/dashboard/ReviewBoxes.jsx
import { motion } from "framer-motion";
import { Brain, Box } from "lucide-react";

const boxConfig = [
  { label: "Caixa 1", desc: "Todo dia", color: "border-red-500/40 bg-red-500/5" },
  { label: "Caixa 2", desc: "A cada 2 dias", color: "border-orange-500/40 bg-orange-500/5" },
  { label: "Caixa 3", desc: "A cada 5 dias", color: "border-amber-500/40 bg-amber-500/5" },
  { label: "Caixa 4", desc: "A cada 10 dias", color: "border-emerald-500/40 bg-emerald-500/5" },
  { label: "Caixa 5", desc: "A cada 30 dias", color: "border-blue-500/40 bg-blue-500/5" },
];

export default function ReviewBoxes({ revisoes }) {
  const counts = [0, 0, 0, 0, 0];
  revisoes.forEach((r) => {
    const c = (r.caixa || 1) - 1;
    if (c >= 0 && c < 5) counts[c]++;
  });

  const total = revisoes.length || 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-card border border-border rounded-xl p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <Brain className="w-5 h-5 text-primary" />
        <h3 className="font-heading font-semibold text-foreground">Revisão Espaçada — Caixas</h3>
      </div>
      <div className="grid grid-cols-5 gap-3">
        {boxConfig.map((box, i) => (
          <div key={i} className={`border rounded-lg p-3 text-center ${box.color}`}>
            <Box className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
            <p className="text-lg font-bold text-foreground font-heading">{counts[i]}</p>
            <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{box.label}</p>
            <p className="text-[9px] text-muted-foreground">{box.desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>{revisoes.length} cartões no sistema</span>
        <span>
          {revisoes.filter(r => {
            const today = new Date().toISOString().split("T")[0];
            return r.proxima_revisao && r.proxima_revisao <= today;
          }).length} pendentes hoje
        </span>
      </div>
    </motion.div>
  );
}