// src/app/cliente/_components/ClientNotificationBell.tsx
'use client';

import { useState } from 'react';
import { Bell, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
// Importa as actions específicas do cliente
import { 
    markClientNotificationsAsRead, 
    markSingleClientNotificationAsRead, 
    refreshClientNotifications 
} from '../actions';

type NotificationItem = { 
    id: string; 
    title: string; 
    message: string; 
    createdAt: Date; 
    isRead: boolean; 
    sender: { name: string | null } | null; 
};

export function ClientNotificationBell({ initialNotifications, initialUnreadCount }: { initialNotifications: NotificationItem[]; initialUnreadCount: number; }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleOpenPopover = async (isOpen: boolean) => {
    setIsPopoverOpen(isOpen);
    if (isOpen && unreadCount > 0) {
      setUnreadCount(0);
      await markClientNotificationsAsRead();
    }
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    setSelectedNotification(notification);
    if (!notification.isRead) {
        setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n));
        markSingleClientNotificationAsRead(notification.id);
    }
  };
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const { notifications: newNotes, unreadCount: newCount } = await refreshClientNotifications();
      setNotifications(newNotes);
      setUnreadCount(newCount);
      toast.success("Atualizado!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar.");
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <>
      <Popover open={isPopoverOpen} onOpenChange={handleOpenPopover}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-white">
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-m2-green text-black text-xs font-bold">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0 border-gray-800 bg-black text-white" align="end">
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 border-b border-gray-800">
                <h4 className="font-medium leading-none px-2 text-m2-green">Notificações</h4>
                <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={isRefreshing} className="h-8 w-8">
                    <RotateCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                </Button>
            </div>
            {notifications.length === 0 ? (
              <p className="text-sm text-center text-gray-500 p-4">Nenhuma notificação.</p>
            ) : (
              <div className="max-h-80 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-700">
                {notifications.map((notif) => (
                  <div key={notif.id} onClick={() => handleNotificationClick(notif)} className="flex items-start gap-3 p-3 rounded-md hover:bg-gray-900 cursor-pointer transition-colors">
                    {!notif.isRead && <div className="mt-1.5 h-2 w-2 rounded-full bg-m2-green flex-shrink-0" />}
                    <div className={notif.isRead ? 'pl-5' : ''}>
                      <p className="text-sm font-semibold text-gray-200">{notif.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notif.sender?.name || 'M2 Projecta'}
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
        <DialogContent className="bg-black border-gray-800 text-white">
          <DialogHeader><DialogTitle className="text-m2-green">{selectedNotification?.title}</DialogTitle></DialogHeader>
          <div className="prose prose-invert prose-sm max-w-none whitespace-pre-wrap text-gray-300">
            {selectedNotification?.message}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}