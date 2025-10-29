// src/app/gestor/(admin)/_components/NotificationBell.tsx
import { getNotificationsForBell } from '../notifications/actions';
import { NotificationBellClient } from './NotificationBellClient'; // Vamos criar este a seguir

export async function NotificationBell() {
  // 1. Chama a Server Action para buscar os dados no servidor
  const { notifications, unreadCount } = await getNotificationsForBell();

  // 2. Passa os dados para o componente de cliente, que cuidará da renderização
  return (
    <NotificationBellClient 
      initialNotifications={notifications} 
      initialUnreadCount={unreadCount} 
    />
  );
}