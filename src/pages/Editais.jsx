// src/pages/Editais.jsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Trash2, X, Search, FileText, Calendar, Building2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const statusOptions = [
  { value: "rascunho", label: "Rascunho" },
  { value: "publicado", label: "Publicado" },
  { value: "inscricoes_abertas", label: "Inscrições Abertas" },
  { value: "inscricoes_encerradas", label: "Inscrições Encerradas" },
  { value: "prova_realizada", label: "Prova Realizada" },
  { value: "resultado_publicado", label: "Resultado Publicado" },
  { value: "encerrado", label: "Encerrado" },
];

const statusColors = {
  rascunho: "bg-muted text-muted-foreground",
  publicado: "bg-blue-500/10 text-blue-400",
  inscricoes_abertas: "bg-emerald-500/10 text-emerald-400",
  inscricoes_encerradas: "bg-amber-500/10 text-amber-400",
  prova_realizada: "bg-violet-500/10 text-violet-400",
  resultado_publicado: "bg-cyan-500/10 text-cyan-400",
  encerrado: "bg-red-500/10 text-red-400",
};

export default function Editais() {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const queryClient = useQueryClient();

  const { data: editais = [], isLoading } = useQuery({
    queryKey: ["editais"],
    queryFn: () => base44.entities.Edital.list("-ano", 100),
  });

  const { data: orgaos = [] } = useQuery({
    queryKey: ["orgaos"],
    queryFn: () => base44.entities.Orgao.list(),
  });

  const { data: bancas = [] } = useQuery({
    queryKey: ["bancas"],
    queryFn: () => base44.entities.Banca.list(),
  });

  const [form, setForm] = useState({
    nome: "",
    numero: "",
    ano: new Date().getFullYear(),
    data_publicacao: "",
    id_orgao: "",
    id_banca: "",
    status: "rascunho",
    url_edital: "",
    observacao: "",
  });

  const saveMutation = useMutation({
    mutationFn: (data) =>
      editing
        ? base44.entities.Edital.update(editing.id, data)
        : base44.entities.Edital.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["editais"] });
      toast.success(editing ? "Edital atualizado" : "Edital criado");
      setShowForm(false);
      setEditing(null);
      setForm({
        nome: "",
        numero: "",
        ano: new Date().getFullYear(),
        data_publicacao: "",
        id_orgao: "",
        id_banca: "",
        status: "rascunho",
        url_edital: "",
        observacao: "",
      });
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Edital.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["editais"] });
      toast.success("Edital excluído");
      setDeleteTarget(null);
    },
  });

  const filteredEditais = editais.filter(
    (e) =>
      e.nome?.toLowerCase().includes(search.toLowerCase()) ||
      e.numero?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  const openEdit = (edital) => {
    setEditing(edital);
    setForm({
      nome: edital.nome || "",
      numero: edital.numero || "",
      ano: edital.ano || new Date().getFullYear(),
      data_publicacao: edital.data_publicacao || "",
      id_orgao: edital.id_orgao || "",
      id_banca: edital.id_banca || "",
      status: edital.status || "rascunho",
      url_edital: edital.url_edital || "",
      observacao: edital.observacao || "",
    });
    setShowForm(true);
  };

  const getOrgaoNome = (id) => orgaos.find((o) => o.id === id)?.nome || "—";
  const getBancaNome = (id) => bancas.find((b) => b.id === id)?.nome || "—";

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Editais</h1>
          <p className="text-sm text-muted-foreground mt-1">Gerencie os concursos e editais</p>
        </div>
        <Button onClick={() => { setEditing(null); setForm({ ...form, nome: "", numero: "" }); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Novo Edital
        </Button>
      </div>

      {/* Busca */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar edital..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Formulário (modal inline) */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-heading font-semibold">{editing ? "Editar Edital" : "Novo Edital"}</h3>
                <Button type="button" variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome do Concurso *</Label>
                  <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Número do Edital</Label>
                  <Input value={form.numero} onChange={(e) => setForm({ ...form, numero: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Ano</Label>
                  <Input type="number" value={form.ano} onChange={(e) => setForm({ ...form, ano: parseInt(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>Data de Publicação</Label>
                  <Input type="date" value={form.data_publicacao} onChange={(e) => setForm({ ...form, data_publicacao: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Órgão</Label>
                  <Select value={form.id_orgao} onValueChange={(v) => setForm({ ...form, id_orgao: v })}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {orgaos.map((o) => <SelectItem key={o.id} value={o.id}>{o.nome}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Banca</Label>
                  <Select value={form.id_banca} onValueChange={(v) => setForm({ ...form, id_banca: v })}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {bancas.map((b) => <SelectItem key={b.id} value={b.id}>{b.nome}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((opt) => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>URL do Edital</Label>
                  <Input type="url" value={form.url_edital} onChange={(e) => setForm({ ...form, url_edital: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea rows={3} value={form.observacao} onChange={(e) => setForm({ ...form, observacao: e.target.value })} />
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de editais */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Carregando...</div>
      ) : filteredEditais.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-xl">
          <FileText className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">Nenhum edital encontrado</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filteredEditais.map((edital) => (
            <motion.div
              key={edital.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-xl p-5 hover:border-primary/20 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-heading font-semibold text-foreground">{edital.nome}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[edital.status] || statusColors.rascunho}`}>
                      {statusOptions.find(s => s.value === edital.status)?.label || edital.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    {edital.numero && <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> {edital.numero}</span>}
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {edital.ano}</span>
                    {edital.id_orgao && <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {getOrgaoNome(edital.id_orgao)}</span>}
                    {edital.id_banca && <span>Banca: {getBancaNome(edital.id_banca)}</span>}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(edital)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(edital)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* AlertDialog de exclusão */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o edital "{deleteTarget?.nome}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteMutation.mutate(deleteTarget.id)} className="bg-destructive">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}