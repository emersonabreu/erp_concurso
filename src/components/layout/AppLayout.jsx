// src/components/layout/AppLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-[240px] min-h-screen transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
}