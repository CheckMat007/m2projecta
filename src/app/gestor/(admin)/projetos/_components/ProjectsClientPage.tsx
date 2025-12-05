// src/app/gestor/(admin)/projetos/_components/ProjectsClientPage.tsx
'use client';

import { useState, useRef } from 'react';
import type { Project, ProjectStatus, ProjectUpdate } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from 'sonner';
import { PlusCircle, Edit, Trash2, Check, ChevronsUpDown, ExternalLink, Calendar, History, Send } from 'lucide-react';
import { upsertProjectAction, deleteProjectAction, createProjectUpdateAction, deleteProjectUpdateAction } from '../actions';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Tipos auxiliares
type ProjectWithRelations = Project & { 
    client: { id: string, tradeName: string },
    contract: { id: string, contractNumber: string } | null,
    updates: (ProjectUpdate & { createdBy: { name: string | null } | null })[]
};
type SimpleClient = { id: string, tradeName: string };
type SimpleContract = { id: string, contractNumber: string, clientId: string };
type SimpleService = { id: string, name: string };

// --- SUBCOMPONENTE: FORMULÁRIO DE PROJETO ---
function ProjectForm({ project, clients, contracts, services, onFormSubmit }: { 
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {isEditing && <input type="hidden" name="projectId" value={project.id} />}
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Projeto *</Label>
        <Input id="name" name="name" defaultValue={project?.name} required className="bg-gray-800 border-gray-700" placeholder="Ex: Filmagem Obra Alpha" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 flex flex-col">
            <Label>Cliente *</Label>
            <Popover open={openClientCombobox} onOpenChange={setOpenClientCombobox}>
                <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={openClientCombobox} className="w-full justify-between bg-gray-800 border-gray-700">
                        {selectedClientId ? clients.find((c) => c.id === selectedClientId)?.tradeName : "Selecione um cliente..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                    <Command>
                        <CommandInput placeholder="Buscar cliente..." />
                        <CommandEmpty>Não encontrado.</CommandEmpty>
                        <CommandGroup>
                            {clients.map((client) => (
                                <CommandItem key={client.id} value={client.tradeName} onSelect={() => { setSelectedClientId(client.id); setOpenClientCombobox(false); }}>
                                    <Check className={`mr-2 h-4 w-4 ${selectedClientId === client.id ? "opacity-100" : "opacity-0"}`} />
                                    {client.tradeName}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2 flex flex-col">
            <Label htmlFor="contractId">Contrato Vinculado</Label>
            <Select name="contractId" defaultValue={project?.contractId || 'none'} disabled={!selectedClientId}>
                <SelectTrigger className="bg-gray-800 border-gray-700 w-full"><SelectValue placeholder={!selectedClientId ? "Selecione um cliente..." : "Selecione (Opcional)"} /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="none">Sem contrato vinculado</SelectItem>
                    {filteredContracts.map(contract => (
                        <SelectItem key={contract.id} value={contract.id}>{contract.contractNumber}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="serviceType">Tipo de Serviço *</Label>
            <Select name="serviceType" defaultValue={project?.serviceType}>
                <SelectTrigger className="bg-gray-800 border-gray-700"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                    {services.map((service) => (<SelectItem key={service.id} value={service.name}>{service.name}</SelectItem>))}
                </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="deliveryDate">Previsão de Entrega</Label>
            <div className="relative">
                <Input id="deliveryDate" name="deliveryDate" type="date" defaultValue={project?.deliveryDate ? new Date(project.deliveryDate).toISOString().split('T')[0] : ''} className="bg-gray-800 border-gray-700 pl-10" />
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status do Projeto</Label>
        <Select name="status" value={selectedStatus} onValueChange={(val) => setSelectedStatus(val as ProjectStatus)}>
            <SelectTrigger className="bg-gray-800 border-gray-700"><SelectValue /></SelectTrigger>
            <SelectContent>
                <SelectItem value="BRIEFING">Briefing / Planejamento</SelectItem>
                <SelectItem value="IN_PROGRESS">Em Execução</SelectItem>
                <SelectItem value="REVIEW">Em Revisão</SelectItem>
                <SelectItem value="DONE">Concluído</SelectItem>
                <SelectItem value="PUBLISHED">Publicado (Acesso Cliente)</SelectItem>
                <SelectItem value="CANCELLED">Cancelado</SelectItem>
            </SelectContent>
        </Select>
      </div>
      {selectedStatus === 'PUBLISHED' && (
          <div className="space-y-2 p-4 border border-m2-green/30 bg-m2-green/10 rounded-md animate-in fade-in slide-in-from-top-2">
            <Label htmlFor="downloadUrl" className="text-m2-green">Link para Download dos Arquivos *</Label>
            <Input id="downloadUrl" name="downloadUrl" defaultValue={project?.downloadUrl || ''} required className="bg-gray-900 border-m2-green/50" placeholder="https://drive.google.com/..." />
            <p className="text-xs text-gray-400">Este link ficará visível para o cliente na área dele.</p>
          </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="observations">Observações Internas</Label>
        <Textarea id="observations" name="observations" defaultValue={project?.observations || ''} className="bg-gray-800 border-gray-700" />
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onFormSubmit}>Cancelar</Button>
        <Button type="submit" disabled={isLoading} className="bg-m2-green text-black hover:bg-m2-green/80">{isLoading ? 'Salvando...' : (isEditing ? 'Atualizar Projeto' : 'Criar Projeto')}</Button>
      </DialogFooter>
    </form>
  );
}

// --- SUBCOMPONENTE: GERENCIADOR DE TIMELINE ---
function TimelineManager({ project }: { project: ProjectWithRelations, onClose: () => void }) {
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

    return (
        <div className="space-y-6">
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-800">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"><Send size={16} /> Nova Atualização</h3>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
                    <Input name="title" placeholder="Título (Ex: Filmagem Concluída)" required className="bg-gray-800 border-gray-700" />
                    <Textarea name="description" placeholder="Descreva o que foi feito..." required className="bg-gray-800 border-gray-700" rows={2} />
                    <Button type="submit" size="sm" className="w-full bg-m2-green text-black hover:bg-m2-green/80" disabled={isLoading}>
                        {isLoading ? 'Enviando...' : 'Publicar na Timeline do Cliente'}
                    </Button>
                </form>
            </div>

            <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-400">Histórico</h3>
                <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-4">
                        {project.updates.map(update => (
                            <div key={update.id} className="relative pl-4 border-l border-gray-700">
                                <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-gray-600 border-2 border-gray-900"></div>
                                <div className="flex justify-between items-start group">
                                    <div>
                                        <p className="text-sm font-medium text-white">{update.title}</p>
                                        <p className="text-xs text-gray-500">{format(new Date(update.createdAt), "dd/MM/yyyy 'às' HH:mm", {locale: ptBR})} • Por {update.createdBy?.name}</p>
                                        <p className="text-sm text-gray-400 mt-1">{update.description}</p>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDelete(update.id)}>
                                        <Trash2 size={14} className="text-red-400" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {project.updates.length === 0 && <p className="text-center text-gray-500 text-sm py-4">Nenhuma atualização registrada.</p>}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}

// --- COMPONENTE PRINCIPAL ---
export function ProjectsClientPage({ initialProjects, clients, contracts, services }: { 
    initialProjects: ProjectWithRelations[], 
    clients: SimpleClient[],
    contracts: SimpleContract[],
    services: SimpleService[]
}) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectWithRelations | null>(null);
  const [timelineProject, setTimelineProject] = useState<ProjectWithRelations | null>(null); // Estado para o modal de timeline

  const handleDelete = (id: string) => {
      toast.promise(deleteProjectAction(id), {
          loading: 'Deletando...',
          success: 'Projeto deletado.',
          error: 'Erro ao deletar.'
      })
  }

  const getStatusBadge = (status: ProjectStatus) => {
      switch(status) {
          case 'BRIEFING': return <Badge variant="secondary">Briefing</Badge>;
          case 'IN_PROGRESS': return <Badge className="bg-blue-900 text-blue-100 hover:bg-blue-900">Em Andamento</Badge>;
          case 'REVIEW': return <Badge className="bg-yellow-900 text-yellow-100 hover:bg-yellow-900">Revisão</Badge>;
          case 'DONE': return <Badge className="bg-gray-700 text-gray-100 hover:bg-gray-700">Concluído</Badge>;
          case 'PUBLISHED': return <Badge className="bg-m2-green text-black hover:bg-m2-green">Publicado</Badge>;
          case 'CANCELLED': return <Badge className="bg-red-900 text-red-100 hover:bg-red-900">Cancelado</Badge>;
          default: return <Badge variant="outline">{status}</Badge>;
      }
  }

  return (
    <>
        <div className="text-right">
            <Button onClick={() => setIsCreateOpen(true)} className="bg-m2-green text-black hover:bg-m2-green/80">
                <PlusCircle size={18} className="mr-2" />
                Novo Projeto
            </Button>
        </div>

        <div className="border border-gray-800 rounded-lg mt-4">
            <Table>
                <TableHeader>
                    <TableRow className="border-gray-800 hover:bg-gray-900/50">
                        <TableHead>Projeto</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Entrega</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {initialProjects.map((project) => (
                        <TableRow key={project.id} className="border-gray-800">
                            <TableCell className="font-medium">{project.name}</TableCell>
                            <TableCell>{project.client.tradeName}</TableCell>
                            <TableCell>{getStatusBadge(project.status)}</TableCell>
                            <TableCell>
                                {project.deliveryDate ? format(new Date(project.deliveryDate), 'dd/MM/yyyy', { locale: ptBR }) : '-'}
                            </TableCell>
                            <TableCell className="text-right flex justify-end gap-2">
                                {/* BOTÃO TIMELINE */}
                                <Button variant="secondary" size="sm" onClick={() => setTimelineProject(project)} title="Gerenciar Timeline">
                                    <History size={16} className="mr-2" /> Timeline
                                </Button>

                                <Button variant="outline" size="icon" onClick={() => setEditingProject(project)}>
                                    <Edit size={16} />
                                </Button>
                                {project.downloadUrl && (
                                    <Button variant="ghost" size="icon" asChild title="Link de Download">
                                        <a href={project.downloadUrl} target="_blank" rel="noopener noreferrer"><ExternalLink size={16} className="text-m2-green" /></a>
                                    </Button>
                                )}
                                <Button variant="destructive" size="icon" onClick={() => handleDelete(project.id)}>
                                    <Trash2 size={16} />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {initialProjects.length === 0 && (
                         <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500">Nenhum projeto encontrado.</TableCell></TableRow>
                    )}
                </TableBody>
            </Table>
        </div>

        {/* Dialogs */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader><DialogTitle>Novo Projeto</DialogTitle></DialogHeader>
                <ProjectForm clients={clients} contracts={contracts} services={services} onFormSubmit={() => setIsCreateOpen(false)} />
            </DialogContent>
        </Dialog>

        <Dialog open={!!editingProject} onOpenChange={(isOpen) => !isOpen && setEditingProject(null)}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader><DialogTitle>Editar Projeto</DialogTitle></DialogHeader>
                {editingProject && (
                    <ProjectForm project={editingProject} clients={clients} contracts={contracts} services={services} onFormSubmit={() => setEditingProject(null)} />
                )}
            </DialogContent>
        </Dialog>

        {/* Modal de Timeline */}
        <Dialog open={!!timelineProject} onOpenChange={(isOpen) => !isOpen && setTimelineProject(null)}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Timeline do Projeto</DialogTitle>
                    <DialogDescription>Atualize o cliente sobre o andamento de <strong>{timelineProject?.name}</strong>.</DialogDescription>
                </DialogHeader>
                {timelineProject && <TimelineManager project={timelineProject} onClose={() => setTimelineProject(null)} />}
            </DialogContent>
        </Dialog>
    </>
  );
}