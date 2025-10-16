// src/app/(gestor)/_components/logout-button.tsx
'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export const LogoutButton = () => {
  return (
    <Button 
      variant="ghost" 
      onClick={() => signOut({ callbackUrl: '/gestor/login' })}
      className="w-full justify-start gap-3"
    >
      <LogOut size={20} />
      Sair
    </Button>
  );
};