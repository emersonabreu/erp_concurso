import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground p-8">
        <h1 className="text-2xl font-bold text-primary">Sistema de Concursos - Carregado!</h1>
        <p className="mt-4">Se você está vendo esta mensagem, o React está funcionando.</p>
      </div>
    </QueryClientProvider>
  );
}

export default App;