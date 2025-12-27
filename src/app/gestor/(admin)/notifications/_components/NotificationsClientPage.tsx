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
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Send, Trash2 } from 'lucide-react';
import { sendNotificationAction, deleteNotificationAction } from '../actions';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Tipos para os dados que recebemos
type NotificationWithDetails = Notification & {
  sender: { name: string | null } | null;
  readStatuses?: (UserNotificationStatus & { user: { name: string | null } })[];
};
type SimpleUser = { id: string; name: string | null; email: string };

// --- Subcomponente do Formulário ---
function SendNotificationForm({ allUsers, currentUser, onFormSubmit }: { allUsers: SimpleUser[], currentUser: User, onFormSubmit: () => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isBroadcast, setIsBroadcast] = useState(true);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) return;
    setIsLoading(true);

    const formData = new FormData(formRef.current);
    formData.set('isBroadcast', String(isBroadcast));

    toast.promise(sendNotificationAction(formData), {
      loading: 'Enviando notificação...',
      success: (result) => {
        if (!result.success) throw new Error(result.message);
        onFormSubmit();
        return result.message;
      },
      error: (error) => error.message,
    });
    
    setIsLoading(false);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input id="title" name="title" required className="bg-gray-800 border-gray-700" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Mensagem</Label>
        <Textarea id="message" name="message" required rows={5} className="bg-gray-800 border-gray-700" />
      </div>
      <div className="flex items-center space-x-2 rounded-md border p-4">
        <Switch id="isBroadcast" checked={isBroadcast} onCheckedChange={setIsBroadcast} />
        <Label htmlFor="isBroadcast">Enviar para todos os usuários (Incluindo clientes)</Label>
      </div>

      {!isBroadcast && (
        <div className="space-y-2">
          <Label>Selecionar Destinatários</Label>
          <ScrollArea className="h-48 rounded-md border p-4">
            <div className="space-y-2">
              {allUsers.filter(user => user.id !== currentUser.id).map(user => (
                <div key={user.id} className="flex items-center gap-3">
                  <Checkbox id={`user-${user.id}`} name="recipientIds" value={user.id} />
                  <Label htmlFor={`user-${user.id}`} className="font-normal">{user.name} ({user.email})</Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      <DialogFooter>
        <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
        <Button type="submit" disabled={isLoading}>{isLoading ? 'Enviando...' : 'Enviar Notificação'}</Button>
      </DialogFooter>
    </form>
  );
}


// --- Componente Principal da Página ---
export function NotificationsClientPage({
  initialNotifications,
  allUsers,
  currentUser,
}: {
  initialNotifications: NotificationWithDetails[];
  allUsers: SimpleUser[];
  currentUser: User;
}) {
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [readingNotification, setReadingNotification] = useState<NotificationWithDetails | null>(null);

  const formatRecipients = (notification: NotificationWithDetails) => {
    if (notification.isBroadcast) return 'Todos';
    if (!notification.readStatuses || notification.readStatuses.length === 0) return 'N/D';
    if (notification.readStatuses.length > 2) return `${notification.readStatuses.length} usuários`;
    return notification.readStatuses.map(rs => rs.user.name || 'Desconhecido').join(', ');
  };

const handleDelete = (notificationId: string) => {
    toast.promise(deleteNotificationAction(notificationId), {
      loading: 'Deletando notificação...',
      success: (result) => {
        if (!result.success) throw new Error(result.message);
        return result.message;
      },
      error: (error) => error.message,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Notificações</h1>
          <p className="text-gray-400">Envie e visualize o histórico de notificações da equipe.</p>
        </div>
        
        {/* --- DIALOG DE ENVIO CORRIGIDO AQUI --- */}
        <Dialog open={isSendOpen} onOpenChange={setIsSendOpen}>
          <DialogTrigger asChild>
            <Button className="bg-m2-green/90 text-black hover:bg-m2-green">
              <Send size={18} className="mr-2" />
              Enviar Notificação
            </Button>
          </DialogTrigger>
          {/* Adicionado max-h-[90vh] e flex-col */}
          <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
            <DialogHeader><DialogTitle>Nova Notificação</DialogTitle></DialogHeader>
            {/* Adicionado div wrapper com overflow-y-auto */}
            <div className="overflow-y-auto pr-2">
                <SendNotificationForm allUsers={allUsers} currentUser={currentUser} onFormSubmit={() => setIsSendOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border border-gray-800 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800 hover:bg-gray-900/50">
              <TableHead>Título</TableHead>
              <TableHead>Enviado por</TableHead>
              {currentUser.role === 'MASTER' && <TableHead>Destinatários</TableHead>}
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead> 
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialNotifications.map((notification) => (
              <TableRow 
                key={notification.id} 
                className="border-gray-800 cursor-pointer hover:bg-gray-900/50"
                onClick={() => setReadingNotification(notification)} 
              >
                <TableCell className="font-medium">{notification.title}</TableCell>
                <TableCell>{notification.sender?.name || 'Sistema'}</TableCell>
                {currentUser.role === 'MASTER' && <TableCell>{formatRecipients(notification)}</TableCell>}
                <TableCell className="text-xs text-gray-400">
                  {format(new Date(notification.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </TableCell>
                <TableCell 
                  className="text-right"
                  onClick={(e) => e.stopPropagation()} 
                >
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        size="icon"
                        disabled={currentUser.role !== 'MASTER' && notification.senderId !== currentUser.id}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>Esta ação não pode ser desfeita e irá deletar permanentemente esta notificação para todos os usuários.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(notification.id)}>Deletar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {initialNotifications.length === 0 && (
          <p className="text-center text-gray-500 p-8">Nenhuma notificação encontrada.</p>
        )}
      </div>

      {/* --- Dialog de Leitura (Já corrigido anteriormente) --- */}
      <Dialog open={!!readingNotification} onOpenChange={(isOpen) => !isOpen && setReadingNotification(null)}>
        <DialogContent className="max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{readingNotification?.title}</DialogTitle>
          </DialogHeader>
          <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap py-4 overflow-y-auto max-h-[60vh] pr-2">
            {readingNotification?.message}
          </div>
          <p className="text-xs text-gray-500 pt-4 border-t border-gray-800 shrink-0">
            Enviado por: {readingNotification?.sender?.name || 'Sistema'}
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}