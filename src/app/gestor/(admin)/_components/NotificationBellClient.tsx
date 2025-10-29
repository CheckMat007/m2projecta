// src/app/gestor/(admin)/_components/NotificationBellClient.tsx
'use client';

import { useState } from 'react';
import { Bell, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { markNotificationsAsReadAction, refreshNotificationsAction } from '../notifications/actions';
import { toast } from 'sonner';

// Tipos
type NotificationWithReadStatus = { id: string; title: string; message: string; createdAt: Date; isRead: boolean; sender: { name: string | null } | null; };
interface NotificationBellClientProps { initialNotifications: NotificationWithReadStatus[]; initialUnreadCount: number; }

export function NotificationBellClient({ initialNotifications, initialUnreadCount }: NotificationBellClientProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationWithReadStatus | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleOpenPopover = async (isOpen: boolean) => {
    setIsPopoverOpen(isOpen);
    if (isOpen && unreadCount > 0) {
      setUnreadCount(0); 
      const result = await markNotificationsAsReadAction();
      if (!result.success) {
        setUnreadCount(initialUnreadCount);
        toast.error("Erro ao marcar notificações como lidas.");
      }
    }
  };

  const handleNotificationClick = (notification: NotificationWithReadStatus) => {
    setSelectedNotification(notification);
    setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n));
  };
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const { notifications: newNotifications, unreadCount: newUnreadCount } = await refreshNotificationsAction();
      setNotifications(newNotifications);
      setUnreadCount(newUnreadCount);
      toast.success("Notificações atualizadas!");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) { 
      console.error("Falha ao recarregar notificações:", error);
      toast.error(error.message || "Falha ao buscar novas notificações.");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <>
      <Popover open={isPopoverOpen} onOpenChange={handleOpenPopover}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0">
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 border-b border-gray-800">
                <h4 className="font-medium leading-none px-2">Notificações</h4>
                <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isRefreshing}>
                    <RotateCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                </Button>
            </div>
            {notifications.length === 0 ? (
              <p className="text-sm text-center text-gray-500 p-4">Nenhuma notificação encontrada.</p>
            ) : (
              <div className="max-h-96 overflow-y-auto p-2">
                {notifications.map((notification) => (
                  <div key={notification.id} onClick={() => handleNotificationClick(notification)} className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-800 cursor-pointer">
                    {!notification.isRead && <div className="mt-1.5 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />}
                    <div className={notification.isRead ? 'pl-5' : ''}>
                      <p className="text-sm font-semibold">{notification.title}</p>
                      <p className="text-xs text-gray-400">
                        Enviado por: {notification.sender?.name || 'Sistema'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={!!selectedNotification} onOpenChange={(isOpen) => !isOpen && setSelectedNotification(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{selectedNotification?.title}</DialogTitle></DialogHeader>
          <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap">{selectedNotification?.message}</div>
          <p className="text-xs text-gray-500 pt-4 border-t border-gray-800">
            Enviado por: {selectedNotification?.sender?.name || 'Sistema'}
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}