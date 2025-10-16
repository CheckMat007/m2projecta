// src/app/gestor/login/_components/login-form.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Para redirecionamento
import { signIn } from 'next-auth/react'; // Função de login do NextAuth
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, Loader2 } from 'lucide-react';

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null); // Para mensagens de erro
  const [isLoading, setIsLoading] = useState(false); // Para o estado de loading

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const result = await signIn('credentials', {
      redirect: false, // Importante: para lidarmos com o erro aqui
      email,
      password,
    });

    setIsLoading(false);

    if (result?.ok) {
      // Login bem-sucedido, redireciona para o painel
      router.push('/gestor');
    } else {
      // Login falhou
      setError('E-mail ou senha inválidos. Tente novamente.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ... (campos do formulário como antes) ... */}
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" name="email" type="email" placeholder="seu.email@exemplo.com" required className="bg-gray-800 border-gray-700" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <Input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Sua senha" required className="bg-gray-800 border-gray-700 pr-10" />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-white" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
      
      {/* Mensagem de erro */}
      {error && (
        <p className="text-sm text-red-400 bg-red-900/30 p-2 rounded-md">
          {error}
        </p>
      )}

      {/* ... (checkbox e o resto do form) ... */}
       <div className="flex items-center space-x-2">
        <Checkbox id="remember-me" onCheckedChange={(checked) => setRememberMe(Boolean(checked))}/>
        <Label htmlFor="remember-me" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Lembrar de mim</Label>
      </div>
      {rememberMe && (<p className="text-xs text-yellow-400 bg-yellow-900/30 p-2 rounded-md">Use esta opção somente se estiver em um computador confiável.</p>)}

      <Button type="submit" className="w-full bg-m2-green text-black hover:bg-m2-green/80" disabled={isLoading}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Entrar'}
      </Button>
    </form>
  );
}