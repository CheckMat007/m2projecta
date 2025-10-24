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
      className="w-full justify-start gap-3 hover:bg-red-600  hover:text-white text-red-600 bg-white "
    >
      <LogOut size={20} />
      Logout
    </Button>
  );
};