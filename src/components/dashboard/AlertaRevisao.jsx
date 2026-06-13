// src/components/dashboard/AlertaRevisao.jsx
import { Link } from "react-router-dom";
import { Brain, AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function AlertaRevisao({ pendentes }) {
  if (pendentes === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 bg-amber-500/10 border border-amber-500/30 rounded-xl px-5 py-3"
    >
      <div className="flex items-center gap-2 flex-1">
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-amber-300">
            {pendentes} {pendentes === 1 ? "cartão pendente" : "cartões pendentes"} para revisão hoje!
          </p>
          <p className="text-xs text-amber-400/70">
            Não perca sua sequência — revise agora para manter o progresso.
          </p>
        </div>
      </div>
      <Button asChild size="sm" className="bg-amber-500 hover:bg-amber-600 text-white gap-1.5 flex-shrink-0">
        <Link to="/revisao">
          <Brain className="w-3.5 h-3.5" /> Revisar agora <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </Button>
    </motion.div>
  );
}