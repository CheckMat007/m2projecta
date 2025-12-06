// src/app/cliente/_components/ClientLogoutButton.tsx
'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ClientLogoutButton({ isCollapsed }: { isCollapsed?: boolean }) {
    const handleLogout = () => signOut({ callbackUrl: '/cliente/login' });

    if (isCollapsed) {
        return (
            <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={handleLogout} 
                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20 h-10 w-10"
                        >
                            <LogOut size={20} />
                            <span className="sr-only">Sair</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right"><p>Sair</p></TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    return (
        <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLogout} 
            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
        >
            <LogOut size={16} className="mr-2" /> Sair
        </Button>
    )
}