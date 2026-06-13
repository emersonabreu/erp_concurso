// src/App.jsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import AppLayout from "@/components/layout/AppLayout";
import Cadastros from "@/pages/Cadastros";
import Dashboard from "@/pages/Dashboard";
// Importe outras páginas aqui conforme forem criadas (ex: Dashboard, Editais, etc.)

const queryClient = new QueryClient();

// Componente temporário para páginas não implementadas
const PlaceholderPage = ({ title }) => (
  <div className="p-8">
    <h1 className="text-2xl font-bold text-foreground">{title}</h1>
    <p className="text-muted-foreground mt-2">Página em construção.</p>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Rotas protegidas com layout */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cadastros" element={<Cadastros />} />
            {/* Adicione outras rotas conforme forem criadas */}
            <Route path="/editais" element={<PlaceholderPage title="Editais" />} />
            <Route path="/questoes" element={<PlaceholderPage title="Questões" />} />
            <Route path="/estudo" element={<PlaceholderPage title="Praticar" />} />
            <Route path="/disciplinas" element={<PlaceholderPage title="Disciplinas" />} />
            <Route path="/simulados" element={<PlaceholderPage title="Simulados" />} />
            <Route path="/cronograma" element={<PlaceholderPage title="Cronograma" />} />
            <Route path="/revisao" element={<PlaceholderPage title="Revisão Espaçada" />} />
            <Route path="/ranking" element={<PlaceholderPage title="Ranking" />} />
            <Route path="/metas" element={<PlaceholderPage title="Metas" />} />
            <Route path="/desempenho" element={<PlaceholderPage title="Desempenho" />} />
          </Route>
        </Routes>
        <Toaster richColors position="bottom-right" />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;