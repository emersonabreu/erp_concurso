// src/components/layout/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Brain,
  Target,
  BarChart3,
  GraduationCap,
  Layers,
  ChevronLeft,
  ChevronRight,
  Boxes,
  Zap,
  Trophy,
  CalendarDays
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard },
  { label: "Editais", path: "/editais", icon: FileText },
  { label: "Questões (Admin)", path: "/questoes", icon: BookOpen },
  { label: "Praticar", path: "/estudo", icon: Zap },
  { label: "Disciplinas", path: "/disciplinas", icon: Layers },
  { label: "Simulados", path: "/simulados", icon: GraduationCap },
  { label: "Cronograma", path: "/cronograma", icon: Target },
  { label: "Revisão Espaçada", path: "/revisao", icon: Brain },
  { label: "Ranking", path: "/ranking", icon: Trophy },
  { label: "Metas", path: "/metas", icon: CalendarDays },
  { label: "Desempenho", path: "/desempenho", icon: BarChart3 },
  { label: "Cadastros", path: "/cadastros", icon: Boxes },
];

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col z-50 transition-all duration-300",
        collapsed ? "w-[68px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-4 h-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-heading font-bold text-sidebar-foreground text-lg tracking-tight whitespace-nowrap">
              ConcursosPro
            </span>
          )}
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = item.path === "/"
            ? location.pathname === "/"
            : location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-primary")} />
              {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Botão de recolher */}
      <div className="p-2 border-t border-sidebar-border">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}