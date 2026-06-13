// src/pages/Cadastros.jsx (versão mínima para teste)
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export default function Cadastros() {
  const { data: orgaos, isLoading } = useQuery({
    queryKey: ["orgaos"],
    queryFn: () => base44.entities.Orgao.list(),
  });

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div>
      <h1>Cadastros</h1>
      <pre>{JSON.stringify(orgaos, null, 2)}</pre>
    </div>
  );
}