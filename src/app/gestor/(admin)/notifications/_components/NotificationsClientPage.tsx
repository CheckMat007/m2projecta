// src/app/gestor/(admin)/notifications/_components/NotificationsClientPage.tsx
'use client';

import { useState, useRef } from 'react';
import type { User, Notification, UserNotificationStatus } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Send, Trash2, Clock, User as UserIcon, MailOpen, AlertCircle } from 'lucide-react';
import { sendNotificationAction, deleteNotificationAction } from '../actions';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// --- TIPOS ---
type NotificationWithDetails = Notification & {
  sender: { name: string | null } | null;
  readStatuses?: (UserNotificationStatus & { user: { name: string | null } })[];
};
type SimpleUser = { id: string; name: string | null; email: string; role: 'MASTER' | 'EDITOR' | 'CLIENT' };
type Audience = 'STAFF' | 'CLIENTS' | 'ALL' | 'CUSTOM';

const AUDIENCE_OPTIONS: { value: Audience; label: string; hint: string }[] = [
  { value: 'STAFF', label: 'Toda a equipe', hint: 'Apenas usuários internos (Master/Editor), inclusive futuros.' },
  { value: 'CLIENTS', label: 'Todos os clientes', hint: 'Todos os clientes ativos no momento do envio.' },
  { value: 'ALL', label: 'Todos (equipe + clientes)', hint: 'Equipe e clientes ativos no momento do envio.' },
  { value: 'CUSTOM', label: 'Selecionar manualmente', hint: 'Escolha pessoas específicas abaixo.' },
];

// --- FORMULÁRIO DE ENVIO ---
function SendNotificationForm({ allUsers, currentUser, onFormSubmit }: { allUsers: SimpleUser[], currentUser: User, onFormSubmit: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [audience, setAudience] = useState<Audience>('STAFF');
  const formRef = useRef<HTMLFormElement>(null);

  const staffUsers = allUsers.filter(user => user.id !== currentUser.id && user.role !== 'CLIENT');
  const clientUsers = allUsers.filter(user => user.id !== currentUser.id && user.role === 'CLIENT');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) return;
    setIsLoading(true);

    const formData = new FormData(formRef.current);
    formData.set('audience', audience);

    try {
        const result = await sendNotificationAction(formData);
        if (!result.success) throw new Error(result.message);
        toast.success(result.message);
        onFormSubmit();
    } catch (error) { // <--- CORREÇÃO: Removemos o ': any'
        // Verificamos se é uma instância de Error para acessar .message com segurança
        const errorMessage = error instanceof Error ? error.message : 'Erro ao enviar notificação';
        toast.error(errorMessage);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 pt-2">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-gray-700 dark:text-gray-200">Título</Label>
        <Input id="title" name="title" required placeholder="Ex: Manutenção do Sistema" className="bg-background border-input focus:border-m2-green" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="message" className="text-gray-700 dark:text-gray-200">Mensagem</Label>
        <Textarea id="message" name="message" required rows={4} placeholder="Digite o conteúdo da notificação..." className="bg-background border-input focus:border-m2-green resize-none" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="audience" className="text-gray-700 dark:text-gray-200">Destinatários</Label>
        <Select value={audience} onValueChange={(value) => setAudience(value as Audience)}>
          <SelectTrigger id="audience" className="bg-background border-input focus:border-m2-green">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {AUDIENCE_OPTIONS.map(option => (
              <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">{AUDIENCE_OPTIONS.find(o => o.value === audience)?.hint}</p>
      </div>

      {audience === 'CUSTOM' && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
          <Label className="text-gray-700 dark:text-gray-200">Selecionar Destinatários</Label>
          <div className="rounded-md border border-border bg-muted/30">
            <ScrollArea className="h-48 p-2">
              <div className="space-y-3">
                {staffUsers.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground px-2">Equipe</span>
                    {staffUsers.map(user => (
                      <div key={user.id} className="flex items-center gap-3 p-2 hover:bg-muted rounded transition-colors">
                        <Checkbox id={`user-${user.id}`} name="recipientIds" value={user.id} />
                        <Label htmlFor={`user-${user.id}`} className="font-normal text-sm cursor-pointer flex-1 text-gray-700 dark:text-gray-300">
                            {user.name} <span className="text-muted-foreground text-xs">({user.email})</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
                {clientUsers.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground px-2">Clientes</span>
                    {clientUsers.map(user => (
                      <div key={user.id} className="flex items-center gap-3 p-2 hover:bg-muted rounded transition-colors">
                        <Checkbox id={`user-${user.id}`} name="recipientIds" value={user.id} />
                        <Label htmlFor={`user-${user.id}`} className="font-normal text-sm cursor-pointer flex-1 text-gray-700 dark:text-gray-300">
                            {user.name} <span className="text-muted-foreground text-xs">({user.email})</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      )}

      <DialogFooter className="gap-2 sm:gap-0">
        <DialogClose asChild><Button type="button" variant="ghost" className="hover:bg-muted">Cancelar</Button></DialogClose>
        <Button type="submit" disabled={isLoading} className="bg-m2-green text-black hover:bg-m2-green/90">
            {isLoading ? 'Enviando...' : 'Enviar Notificação'}
        </Button>
      </DialogFooter>
    </form>
  );
}


// --- PÁGINA PRINCIPAL ---
export function NotificationsClientPage({
  initialNotifications,
  allUsers,
  currentUser,
  canSend,
}: {
  initialNotifications: NotificationWithDetails[];
  allUsers: SimpleUser[];
  currentUser: User;
  canSend: boolean;
}) {
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [readingNotification, setReadingNotification] = useState<NotificationWithDetails | null>(null);

  const formatRecipients = (notification: NotificationWithDetails) => {
    if (notification.isBroadcast) return <span className="inline-flex items-center text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full">Toda a equipe</span>;
    if (!notification.readStatuses || notification.readStatuses.length === 0) return <span className="text-muted-foreground text-xs">N/D</span>;
    if (notification.readStatuses.length > 2) return <span className="text-xs text-gray-700 dark:text-gray-300">{notification.readStatuses.length} destinatários</span>;
    return <span className="text-xs text-gray-700 dark:text-gray-300">{notification.readStatuses.map(rs => rs.user.name || 'User').join(', ')}</span>;
  };

  const handleDelete = async (notificationId: string) => {
    const result = await deleteNotificationAction(notificationId);
    if (result.success) {
        toast.success(result.message);
    } else {
        toast.error(result.message);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Cabeçalho e Botão de Ação */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notificações</h1>
          <p className="text-muted-foreground text-sm">Gerencie a comunicação interna da equipe.</p>
        </div>
        
        {canSend && (
          <Dialog open={isSendOpen} onOpenChange={setIsSendOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto bg-m2-green text-black hover:bg-m2-green/90 shadow-[0_0_15px_rgba(34,197,94,0.15)] transition-all">
                <Send size={16} className="mr-2" />
                Nova Mensagem
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col bg-card border-border">
              <DialogHeader>
                  <DialogTitle>Nova Notificação</DialogTitle>
              </DialogHeader>
              <div className="overflow-y-auto pr-2 -mr-2">
                  <SendNotificationForm allUsers={allUsers} currentUser={currentUser} onFormSubmit={() => setIsSendOpen(false)} />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* --- VISUALIZAÇÃO DESKTOP (TABELA) --- */}
      <div className="hidden md:block rounded-lg border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/10 dark:bg-gray-900/80">
            <TableRow className="border-border hover:bg-muted/50">
              <TableHead className="text-muted-foreground font-medium w-[40%]">Título</TableHead>
              <TableHead className="text-muted-foreground font-medium">Enviado por</TableHead>
              {currentUser.role === 'MASTER' && <TableHead className="text-muted-foreground font-medium">Destinatários</TableHead>}
              <TableHead className="text-muted-foreground font-medium">Data</TableHead>
              <TableHead className="text-right text-muted-foreground font-medium">Ações</TableHead> 
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialNotifications.map((notification) => (
              <TableRow 
                key={notification.id} 
                className="border-border cursor-pointer hover:bg-muted/50 transition-colors group"
                onClick={() => setReadingNotification(notification)} 
              >
                <TableCell className="font-medium text-gray-900 dark:text-white group-hover:text-m2-green transition-colors">
                    <div className="flex items-center gap-2">
                        {!notification.isBroadcast && <MailOpen size={14} className="text-muted-foreground" />}
                        {notification.title}
                    </div>
                </TableCell>
                <TableCell className="text-gray-700 dark:text-gray-300">{notification.sender?.name || 'Sistema'}</TableCell>
                {currentUser.role === 'MASTER' && <TableCell>{formatRecipients(notification)}</TableCell>}
                <TableCell className="text-xs text-muted-foreground">
                  {format(new Date(notification.createdAt), "dd MMM, HH:mm", { locale: ptBR })}
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  {(currentUser.role === 'MASTER' || notification.senderId === currentUser.id) && (
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-400 hover:bg-red-950/20">
                                <Trash2 size={16} />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-card border-border">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Excluir notificação?</AlertDialogTitle>
                                <AlertDialogDescription>Isso removerá a mensagem para todos os destinatários. Esta ação é irreversível.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel className="bg-transparent border-border hover:bg-muted text-gray-900 dark:text-white">Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(notification.id)} className="bg-red-600 hover:bg-red-700 text-white border-0">Excluir</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* --- VISUALIZAÇÃO MOBILE (CARDS) --- */}
      <div className="md:hidden space-y-3">
        {initialNotifications.map((notification) => (
            <div 
                key={notification.id}
                onClick={() => setReadingNotification(notification)}
                className="bg-card border border-border rounded-lg p-4 active:bg-muted/30 transition-colors cursor-pointer relative"
            >
                <div className="flex justify-between items-start mb-2">
                    <div className="pr-8">
                        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">{notification.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <UserIcon size={10} /> {notification.sender?.name || 'Sistema'}
                        </p>
                    </div>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap bg-muted px-1.5 py-0.5 rounded border border-border">
                        {format(new Date(notification.createdAt), "dd/MM", { locale: ptBR })}
                    </span>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {notification.message}
                </p>

                <div className="flex items-center justify-between border-t border-border pt-3 mt-1">
                    <span className="text-xs flex items-center gap-1 text-muted-foreground">
                        {notification.isBroadcast ? 'Para: Toda a equipe' : 'Mensagem direta'}
                    </span>
                    
                    {/* Ação de Deletar Mobile */}
                    {(currentUser.role === 'MASTER' || notification.senderId === currentUser.id) && (
                        <div onClick={(e) => e.stopPropagation()}>
                           <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-9 px-3 text-red-400 hover:text-red-300 hover:bg-red-950/20 text-xs">
                                        <Trash2 size={12} className="mr-1" /> Excluir
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-card border-border w-[90%] rounded-lg">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Excluir?</AlertDialogTitle>
                                        <AlertDialogDescription className="text-sm">Essa ação não pode ser desfeita.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="flex-row gap-2 justify-end">
                                        <AlertDialogCancel className="mt-0 bg-transparent border-border text-gray-900 dark:text-white h-8 text-xs">Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDelete(notification.id)} className="bg-red-600 text-white h-8 text-xs">Sim, excluir</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    )}
                </div>
            </div>
        ))}
      </div>

      {initialNotifications.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-muted-foreground bg-muted/10 rounded-lg border border-border border-dashed">
            <AlertCircle className="w-10 h-10 mb-3 opacity-20" />
            <p>Nenhuma notificação encontrada.</p>
        </div>
      )}

      {/* --- DIALOG DE LEITURA --- */}
      <Dialog open={!!readingNotification} onOpenChange={(isOpen) => !isOpen && setReadingNotification(null)}>
        <DialogContent className="max-h-[85vh] flex flex-col bg-card border-border w-[90%] sm:w-full rounded-xl">
          <DialogHeader className="border-b border-border pb-4">
            <div className="flex flex-col gap-1">
                <span className="text-xs text-m2-green font-medium uppercase tracking-wider">Notificação</span>
                <DialogTitle className="text-xl">{readingNotification?.title}</DialogTitle>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                    <Clock size={12} />
                    {readingNotification && format(new Date(readingNotification.createdAt), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto py-6 text-gray-700 dark:text-gray-300 leading-relaxed text-sm whitespace-pre-wrap">
            {readingNotification?.message}
          </div>

          <div className="pt-4 border-t border-border flex justify-between items-center text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                    <UserIcon size={12} />
                </div>
                <span>Enviado por: <span className="text-gray-700 dark:text-gray-300">{readingNotification?.sender?.name || 'Sistema'}</span></span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setReadingNotification(null)} className="h-7 text-xs border-border bg-transparent hover:bg-muted">
                Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}