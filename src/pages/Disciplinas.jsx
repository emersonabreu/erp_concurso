// src/pages/Disciplinas.jsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Layers, ChevronRight, Pencil, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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

export default function Disciplinas() {
  const [showForm, setShowForm] = useState(null); // "disciplina" | "tema" | "topico"
  const [parentId, setParentId] = useState(null);
  const [parentDiscId, setParentDiscId] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [formName, setFormName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const queryClient = useQueryClient();

  const { data: disciplinas = [] } = useQuery({
    queryKey: ["disciplinas"],
    queryFn: () => base44.entities.Disciplina.list(),
  });
  const { data: temas = [] } = useQuery({
    queryKey: ["temas"],
    queryFn: () => base44.entities.Tema.list(),
  });
  const { data: topicos = [] } = useQuery({
    queryKey: ["topicos"],
    queryFn: () => base44.entities.Topico.list(),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["disciplinas"] });
    queryClient.invalidateQueries({ queryKey: ["temas"] });
    queryClient.invalidateQueries({ queryKey: ["topicos"] });
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (showForm === "disciplina") {
        if (editItem) await base44.entities.Disciplina.update(editItem.id, { nome: formName });
        else await base44.entities.Disciplina.create({ nome: formName });
      } else if (showForm === "tema") {
        if (editItem) await base44.entities.Tema.update(editItem.id, { nome: formName });
        else await base44.entities.Tema.create({ nome: formName, id_disciplina: parentId });
      } else if (showForm === "topico") {
        if (editItem) await base44.entities.Topico.update(editItem.id, { nome: formName });
        else await base44.entities.Topico.create({ nome: formName, id_tema: parentId, id_disciplina: parentDiscId });
      }
    },
    onSuccess: () => {
      invalidate();
      closeForm();
      toast.success(`${showForm === "disciplina" ? "Disciplina" : showForm === "tema" ? "Tema" : "Tópico"} salvo!`);
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: ({ type, id }) => {
      if (type === "disciplina") return base44.entities.Disciplina.delete(id);
      if (type === "tema") return base44.entities.Tema.delete(id);
      return base44.entities.Topico.delete(id);
    },
    onSuccess: () => {
      invalidate();
      toast.success("Excluído com sucesso");
      setDeleteTarget(null);
    },
  });

  const closeForm = () => {
    setShowForm(null);
    setParentId(null);
    setEditItem(null);
    setFormName("");
    setParentDiscId(null);
  };

  const openForm = (type, parent, discId, item) => {
    setShowForm(type);
    setParentId(parent);
    setParentDiscId(discId);
    setEditItem(item);
    setFormName(item?.nome || "");
  };

  return (
    <div className="p-6 max-w-[1000px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Disciplinas</h1>
          <p className="text-sm text-muted-foreground mt-1">Hierarquia: Disciplina → Tema → Tópico</p>
        </div>
        <Button onClick={() => openForm("disciplina", null, null, null)}>
          <Plus className="w-4 h-4 mr-2" /> Nova Disciplina
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="p-5 flex items-end gap-4">
              <div className="flex-1 space-y-2">
                <Label>
                  {showForm === "disciplina" ? "Nome da Disciplina" : showForm === "tema" ? "Nome do Tema" : "Nome do Tópico"}
                </Label>
                <Input value={formName} onChange={(e) => setFormName(e.target.value)} required autoFocus />
              </div>
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? "Salvando..." : (editItem ? "Atualizar" : "Criar")}
              </Button>
              <Button type="button" variant="ghost" size="icon" onClick={closeForm}>
                <X className="w-4 h-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {disciplinas.map((disc) => {
          const discTemas = temas.filter((t) => t.id_disciplina === disc.id);
          return (
            <Collapsible key={disc.id}>
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="flex items-center gap-3 p-4">
                  <CollapsibleTrigger className="flex items-center gap-2 flex-1 text-left">
                    <ChevronRight className="w-4 h-4 text-muted-foreground transition-transform data-[state=open]:rotate-90" />
                    <Layers className="w-4 h-4 text-primary" />
                    <span className="font-medium text-foreground">{disc.nome}</span>
                    <span className="text-xs text-muted-foreground ml-2">{discTemas.length} temas</span>
                  </CollapsibleTrigger>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => openForm("tema", disc.id, null, null)}>
                      <Plus className="w-3 h-3" /> Tema
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openForm("disciplina", null, null, disc)}>
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-destructive" onClick={() => setDeleteTarget({ type: "disciplina", id: disc.id, nome: disc.nome })}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <CollapsibleContent>
                  <div className="pl-10 pr-4 pb-3 space-y-1">
                    {discTemas.map((tema) => {
                      const temaTopicos = topicos.filter((tp) => tp.id_tema === tema.id);
                      return (
                        <Collapsible key={tema.id}>
                          <div className="flex items-center gap-2 py-1.5 px-3 rounded-lg hover:bg-muted/50">
                            <CollapsibleTrigger className="flex items-center gap-2 flex-1 text-left">
                              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground transition-transform data-[state=open]:rotate-90" />
                              <span className="text-sm text-foreground">{tema.nome}</span>
                              <span className="text-xs text-muted-foreground">{temaTopicos.length}</span>
                            </CollapsibleTrigger>
                            <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1" onClick={() => openForm("topico", tema.id, disc.id, null)}>
                              <Plus className="w-2.5 h-2.5" /> Tópico
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openForm("tema", disc.id, null, tema)}>
                              <Pencil className="w-2.5 h-2.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6 hover:text-destructive" onClick={() => setDeleteTarget({ type: "tema", id: tema.id, nome: tema.nome })}>
                              <Trash2 className="w-2.5 h-2.5" />
                            </Button>
                          </div>
                          <CollapsibleContent>
                            <div className="pl-8 space-y-0.5 pb-1">
                              {temaTopicos.map((top) => (
                                <div key={top.id} className="flex items-center gap-2 py-1 px-3 text-xs text-muted-foreground hover:bg-muted/30 rounded">
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                  <span className="flex-1">{top.nome}</span>
                                  <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => openForm("topico", tema.id, disc.id, top)}>
                                    <Pencil className="w-2.5 h-2.5" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-5 w-5 hover:text-destructive" onClick={() => setDeleteTarget({ type: "topico", id: top.id, nome: top.nome })}>
                                    <Trash2 className="w-2.5 h-2.5" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          );
        })}
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir "{deleteTarget?.nome}"? Esta ação removerá todos os itens filhos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteMutation.mutate({ type: deleteTarget.type, id: deleteTarget.id })} className="bg-destructive">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}