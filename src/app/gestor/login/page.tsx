// src/app/gestor/login/page.tsx

import { LoginForm } from './_components/login-form';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import Logo from '@/components/ui/Logo';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-m2-dark text-white flex flex-col items-center justify-center p-4 relative">
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ChevronLeft size={20} />
        Voltar para o site
      </Link>
      
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="w-52 h-auto">
            <Logo />
          </div>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}