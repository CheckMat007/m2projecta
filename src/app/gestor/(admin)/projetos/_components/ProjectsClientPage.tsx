// src/app/gestor/(admin)/projetos/_components/ProjectsClientPage.tsx
'use client';

import { useState, useRef } from 'react';
import type { Project, ProjectStatus, ProjectUpdate } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogDescription 
} from "@/components/ui/dialog";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from "@/components/ui/card";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem,
  CommandList 
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from 'sonner';
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Check, 
  ChevronsUpDown, 
  ExternalLink, 
  Calendar, 
  History, 
  Send, 
  FolderKanban,
  Building2,
  FileText,
  Clock,
  Briefcase,
  User
} from 'lucide-react';
import { upsertProjectAction, deleteProjectAction, createProjectUpdateAction, deleteProjectUpdateAction } from '../actions';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// --- TIPOS ---
type ProjectWithRelations = Project & { 
    client: { id: string, tradeName: string },
    contract: { id: string, contractNumber: string } | null,
    updates: (ProjectUpdate & { createdBy: { name: string | null } | null })[]
};
type SimpleClient = { id: string, tradeName: string };
type SimpleContract = { id: string, contractNumber: string, clientId: string };
type SimpleService = { id: string, name: string };

// --- SUBCOMPONENTE: FORMULÁRIO DE PROJETO ---
function ProjectForm({ 
  project, 
  clients, 
  contracts, 
  services, 
  onFormSubmit 
}: { 
  project?: ProjectWithRelations, 
  clients: SimpleClient[],
  contracts: SimpleContract[],
  services: SimpleService[],
  onFormSubmit: () => void,
}) {
  const isEditing = !!project;
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(project?.clientId || '');
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus>(project?.status || 'BRIEFING');
  const [openClientCombobox, setOpenClientCombobox] = useState(false);
  
  const filteredContracts = contracts.filter(c => c.clientId === selectedClientId);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    formData.set('clientId', selectedClientId);
    
    const result = await upsertProjectAction(formData);
    
    if (result.success) {
      toast.success(result.message);
      onFormSubmit();
    } else {
      toast.error(result.message);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
      {isEditing && <input type="hidden" name="projectId" value={project.id} />}
      
      {/* Nome do Projeto */}
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Projeto <span className="text-red-500">*</span></Label>
        <Input id="name" name="name" defaultValue={project?.name} required placeholder="Ex: Campanha de Verão 2025" />
      </div>

      {/* Seleção de Cliente e Contrato */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2 flex flex-col">
            <Label>Cliente <span className="text-red-500">*</span></Label>
            <Popover open={openClientCombobox} onOpenChange={setOpenClientCombobox}>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={openClientCombobox} className="w-full justify-between">
                        {selectedClientId ? clients.find((c) => c.id === selectedClientId)?.tradeName : "Selecione um cliente..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Buscar cliente..." />
                        <CommandList>
                            <CommandEmpty>Não encontrado.</CommandEmpty>
                            <CommandGroup>
                                {clients.map((client) => (
                                    <CommandItem key={client.id} value={client.tradeName} onSelect={() => { setSelectedClientId(client.id); setOpenClientCombobox(false); }}>
                                        <Check className={`mr-2 h-4 w-4 ${selectedClientId === client.id ? "opacity-100" : "opacity-0"}`} />
                                        {client.tradeName}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2 flex flex-col">
            <Label htmlFor="contractId">Contrato Vinculado</Label>
            <Select name="contractId" defaultValue={project?.contractId || 'none'} disabled={!selectedClientId}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={!selectedClientId ? "Selecione um cliente..." : "Opcional"} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="none">-- Sem vínculo --</SelectItem>
                    {filteredContracts.map(contract => (
                        <SelectItem key={contract.id} value={contract.id}>#{contract.contractNumber}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
      </div>

      {/* Tipo e Data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="serviceType">Tipo de Serviço</Label>
            <Select name="serviceType" defaultValue={project?.serviceType}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                    {services.map((service) => (<SelectItem key={service.id} value={service.name}>{service.name}</SelectItem>))}
                </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="deliveryDate">Previsão de Entrega</Label>
            <div className="relative">
                <Input 
                    id="deliveryDate" 
                    name="deliveryDate" 
                    type="date" 
                    defaultValue={project?.deliveryDate ? new Date(project.deliveryDate).toISOString().split('T')[0] : ''} 
                    className="pl-10 block"
                />
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor="status">Status Atual</Label>
        <Select name="status" value={selectedStatus} onValueChange={(val) => setSelectedStatus(val as ProjectStatus)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
                <SelectItem value="BRIEFING">Briefing / Planejamento</SelectItem>
                <SelectItem value="IN_PROGRESS">Em Execução</SelectItem>
                <SelectItem value="REVIEW">Em Revisão</SelectItem>
                <SelectItem value="DONE">Concluído</SelectItem>
                <SelectItem value="PUBLISHED">Publicado</SelectItem>
                <SelectItem value="CANCELLED">Cancelado</SelectItem>
            </SelectContent>
        </Select>
      </div>

      {/* Link de Download (Condicional) */}
      {selectedStatus === 'PUBLISHED' && (
          <div className="space-y-2 p-4 border border-m2-green/30 bg-m2-green/5 rounded-md animate-in fade-in slide-in-from-top-2">
            <Label htmlFor="downloadUrl" className="text-m2-green flex items-center gap-2">
                <ExternalLink size={14} /> Link para Download (Cliente) <span className="text-red-500">*</span>
            </Label>
            <Input id="downloadUrl" name="downloadUrl" defaultValue={project?.downloadUrl || ''} required placeholder="https://drive.google.com/..." />
            <p className="text-xs text-muted-foreground">Este link ficará visível na área do cliente.</p>
          </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="observations">Observações Internas</Label>
        <Textarea id="observations" name="observations" defaultValue={project?.observations || ''} className="resize-none min-h-[80px]" />
      </div>

      <DialogFooter className="pt-2 gap-2 sm:gap-0">
        <Button type="button" variant="ghost" onClick={onFormSubmit}>Cancelar</Button>
        <Button type="submit" disabled={isLoading} className="bg-m2-green text-black hover:bg-m2-green/90 min-w-[120px]">
            {isLoading ? 'Salvando...' : (isEditing ? 'Salvar Projeto' : 'Criar Projeto')}
        </Button>
      </DialogFooter>
    </form>
  );
}

// --- SUBCOMPONENTE: TIMELINE OTIMIZADA ---
function TimelineManager({ project }: { project: ProjectWithRelations }) {
    const [isLoading, setIsLoading] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);
        formData.set('projectId', project.id);
        
        const result = await createProjectUpdateAction(formData);
        
        if (result.success) {
            toast.success(result.message);
            formRef.current?.reset();
        } else {
            toast.error(result.message);
        }
        setIsLoading(false);
    };

    const handleDelete = async (id: string) => {
        toast.promise(deleteProjectUpdateAction(id), {
            loading: 'Removendo...',
            success: 'Atualização removida.',
            error: 'Erro ao remover.'
        });
    }

    // Ordenar updates do mais recente para o mais antigo
    const sortedUpdates = [...project.updates].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className="flex flex-col h-[600px] max-h-[80vh]">
            {/* Área de Rolagem do Histórico */}
            <ScrollArea className="flex-1 px-6 pt-6">
                <div className="space-y-8 relative pb-6">
                    {/* Linha vertical conectora */}
                    {sortedUpdates.length > 0 && (
                        <div className="absolute left-[19px] top-2 bottom-6 w-px bg-border" />
                    )}

                    {sortedUpdates.length > 0 ? (
                        sortedUpdates.map((update) => (
                            <div key={update.id} className="relative pl-10 group">
                                {/* Marcador da Timeline */}
                                <div className="absolute left-0 top-0.5 z-10">
                                    <div className="h-10 w-10 rounded-full border-4 border-background bg-muted flex items-center justify-center shadow-sm">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                                                {update.createdBy?.name?.charAt(0).toUpperCase() || <User size={14} />}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                </div>

                                {/* Conteúdo do Card */}
                                <div className="bg-card border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <h4 className="text-sm font-semibold text-foreground">{update.title}</h4>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                                <span className="font-medium text-foreground">{update.createdBy?.name || 'Sistema'}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <Clock size={10} />
                                                    {format(new Date(update.createdAt), "dd MMM 'às' HH:mm", { locale: ptBR })}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-6 w-6 -mr-2 -mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive" 
                                            onClick={() => handleDelete(update.id)}
                                            title="Remover atualização"
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                    
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                        {update.description}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-3">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                                <History className="h-6 w-6 opacity-40" />
                            </div>
                            <p className="text-sm font-medium">Nenhuma atualização registrada.</p>
                            <p className="text-xs text-center max-w-[200px]">Use o formulário abaixo para registrar o andamento do projeto.</p>
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* Formulário Fixo no Rodapé */}
            <div className="p-4 bg-muted/30 border-t border-border mt-auto">
                <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nova Atualização</Label>
                    </div>
                    <Input 
                        name="title" 
                        placeholder="Título (Ex: Roteiro Aprovado)" 
                        required 
                        className="bg-background font-medium" 
                    />
                    <div className="flex gap-2">
                        <Textarea 
                            name="description" 
                            placeholder="Descreva o que foi feito..." 
                            required 
                            className="bg-background resize-none min-h-[40px] flex-1" 
                            rows={1} 
                        />
                        <Button type="submit" size="icon" className="h-auto w-12 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0" disabled={isLoading}>
                            <Send size={18} />
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// --- COMPONENTE PRINCIPAL (GRID) ---
export function ProjectsClientPage({ 
    initialProjects, 
    clients, 
    contracts, 
    services 
}: { 
    initialProjects: ProjectWithRelations[], 
    clients: SimpleClient[],
    contracts: SimpleContract[],
    services: SimpleService[]
}) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectWithRelations | null>(null);
  const [timelineProject, setTimelineProject] = useState<ProjectWithRelations | null>(null);

  const handleDelete = (id: string) => {
      toast.promise(deleteProjectAction(id), {
          loading: 'Deletando...',
          success: 'Projeto deletado.',
          error: 'Erro ao deletar.'
      })
  }

  const getStatusBadge = (status: ProjectStatus) => {
      switch(status) {
          case 'BRIEFING': return <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">Briefing</Badge>;
          case 'IN_PROGRESS': return <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 border-blue-500/20">Em Andamento</Badge>;
          case 'REVIEW': return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border-amber-500/20">Revisão</Badge>;
          case 'DONE': return <Badge variant="outline" className="bg-muted text-muted-foreground">Concluído</Badge>;
          case 'PUBLISHED': return <Badge className="bg-m2-green text-black hover:bg-m2-green/90 border-transparent">Publicado</Badge>;
          case 'CANCELLED': return <Badge variant="destructive">Cancelado</Badge>;
          default: return <Badge variant="outline">{status}</Badge>;
      }
  }

  return (
    <div className="space-y-6 w-full max-w-[100vw] overflow-hidden pb-20">
        
        {/* CABEÇALHO */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
                    <FolderKanban className="h-6 w-6 md:h-8 md:w-8 opacity-80" />
                    Projetos
                </h1>
                <p className="text-sm md:text-base text-muted-foreground mt-1">
                    Acompanhe o status e a timeline de entrega dos serviços.
                </p>
            </div>
            
            <Button onClick={() => setIsCreateOpen(true)} className="w-full sm:w-auto bg-m2-green text-black hover:bg-m2-green/90 font-medium shadow-sm">
                <PlusCircle size={18} className="mr-2" /> Novo Projeto
            </Button>
        </div>

        {/* --- GRID DE CARDS (Layout Otimizado) --- */}
        {initialProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {initialProjects.map((project) => (
                    <Card key={project.id} className="group hover:shadow-lg transition-all duration-300 border-border bg-card flex flex-col h-full">
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                            <div className="space-y-1 max-w-[70%]">
                                <h3 className="font-semibold text-base leading-tight line-clamp-2" title={project.name}>
                                    {project.name}
                                </h3>
                                <div className="flex items-center text-xs text-muted-foreground">
                                    <Building2 className="mr-1 h-3 w-3" />
                                    <span className="truncate">{project.client.tradeName}</span>
                                </div>
                            </div>
                            <div className="shrink-0">
                                {getStatusBadge(project.status)}
                            </div>
                        </CardHeader>
                        
                        <CardContent className="py-2 flex-grow space-y-3">
                            {/* Datas e Tipo */}
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className="bg-muted/30 p-2 rounded flex flex-col gap-1">
                                    <span className="text-muted-foreground flex items-center gap-1"><Calendar size={10} /> Entrega</span>
                                    <span className="font-medium">
                                        {project.deliveryDate ? format(new Date(project.deliveryDate), 'dd/MM/yyyy') : 'A definir'}
                                    </span>
                                </div>
                                <div className="bg-muted/30 p-2 rounded flex flex-col gap-1">
                                    <span className="text-muted-foreground flex items-center gap-1"><Briefcase size={10} /> Serviço</span>
                                    <span className="font-medium truncate">{project.serviceType || 'Geral'}</span>
                                </div>
                            </div>
                            
                            {/* Vínculo com Contrato */}
                            {project.contract && (
                                <div className="flex items-center gap-2 text-xs text-blue-500 bg-blue-500/5 p-1.5 rounded border border-blue-500/10">
                                    <FileText size={12} />
                                    <span>Contrato: #{project.contract.contractNumber}</span>
                                </div>
                            )}

                            {/* Link Publicado */}
                            {project.status === 'PUBLISHED' && project.downloadUrl && (
                                <a 
                                    href={project.downloadUrl} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="flex items-center gap-2 text-xs text-m2-green font-medium hover:underline mt-1"
                                >
                                    <ExternalLink size={12} /> Acessar Arquivos Finais
                                </a>
                            )}
                        </CardContent>

                        <Separator />

                        <CardFooter className="pt-3 pb-3 px-4 flex gap-2 bg-muted/20">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1 h-8 text-xs font-medium border-dashed hover:border-primary hover:text-primary transition-colors" 
                                onClick={() => setTimelineProject(project)}
                            >
                                <History className="mr-2 h-3.5 w-3.5" />
                                Timeline ({project.updates.length})
                            </Button>
                            
                            <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingProject(project)}>
                                    <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                                    <span className="sr-only">Editar</span>
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(project.id)}>
                                    <Trash2 className="h-3.5 w-3.5" />
                                    <span className="sr-only">Excluir</span>
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        ) : (
            // Estado Vazio
            <div className="border-2 border-dashed border-border rounded-xl p-12 text-center flex flex-col items-center justify-center gap-4 bg-muted/10">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                    <FolderKanban className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                    <h3 className="font-semibold text-lg">Nenhum projeto ativo</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                        Cadastre projetos para controlar prazos e enviar atualizações aos clientes.
                    </p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)} className="bg-m2-green text-black hover:bg-m2-green/90 mt-2">
                    Criar Primeiro Projeto
                </Button>
            </div>
        )}

        {/* Dialogs */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogContent className="sm:max-w-lg w-[95vw] rounded-lg p-0 overflow-hidden gap-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Novo Projeto</DialogTitle>
                    <DialogDescription>Defina os detalhes e prazos do serviço.</DialogDescription>
                </DialogHeader>
                <div className="p-6 pt-2 max-h-[80vh] overflow-y-auto">
                    <ProjectForm clients={clients} contracts={contracts} services={services} onFormSubmit={() => setIsCreateOpen(false)} />
                </div>
            </DialogContent>
        </Dialog>

        <Dialog open={!!editingProject} onOpenChange={(isOpen) => !isOpen && setEditingProject(null)}>
            <DialogContent className="sm:max-w-lg w-[95vw] rounded-lg p-0 overflow-hidden gap-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle>Editar Projeto</DialogTitle>
                    <DialogDescription>Altere status, prazos ou vínculos.</DialogDescription>
                </DialogHeader>
                <div className="p-6 pt-2 max-h-[80vh] overflow-y-auto">
                    {editingProject && (
                        <ProjectForm project={editingProject} clients={clients} contracts={contracts} services={services} onFormSubmit={() => setEditingProject(null)} />
                    )}
                </div>
            </DialogContent>
        </Dialog>

        {/* Modal de Timeline OTIMIZADO */}
        <Dialog open={!!timelineProject} onOpenChange={(isOpen) => !isOpen && setTimelineProject(null)}>
            <DialogContent className="sm:max-w-md w-[95vw] rounded-lg p-0 overflow-hidden gap-0">
                <DialogHeader className="p-6 pb-2 border-b border-border bg-muted/30">
                    <DialogTitle className="flex items-center gap-2 text-lg">
                        <History size={20} className="text-primary" /> Timeline
                    </DialogTitle>
                    <DialogDescription className="line-clamp-1">
                        Histórico de <strong>{timelineProject?.name}</strong>.
                    </DialogDescription>
                </DialogHeader>
                
                {/* O conteúdo agora gerencia seu próprio scroll */}
                {timelineProject && <TimelineManager project={timelineProject} />}
            </DialogContent>
        </Dialog>
    </div>
  );
}