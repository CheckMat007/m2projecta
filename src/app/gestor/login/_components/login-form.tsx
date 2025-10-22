// src/app/gestor/login/_components/login-form.tsx
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha'; // 1. Importa o componente

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // 2. Estado para o token do reCAPTCHA
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // 3. Envia o token do reCAPTCHA junto com as credenciais
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      recaptchaToken, // Envia o token para o backend
    });

    setIsLoading(false);

    if (result?.ok) {
      router.push('/gestor');
    } else {
      setError('E-mail ou senha inválidos. Tente novamente.');
      // Reseta o reCAPTCHA em caso de erro
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
      
      {/* 4. ADICIONA O COMPONENTE RECAPTCHA AO FORMULÁRIO */}
      <div className="flex justify-center">
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
          onChange={(token) => setRecaptchaToken(token)}
          theme="dark" // Usa o tema escuro para combinar com seu site
        />
      </div>
      
      {error && (
        <p className="text-sm text-red-400 bg-red-900/30 p-2 rounded-md">
          {error}
        </p>
      )}

      {/* 5. O botão agora é desabilitado se o reCAPTCHA não for preenchido */}
      <Button type="submit" className="w-full bg-m2-green text-black hover:bg-m2-green/80" disabled={isLoading || !recaptchaToken}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Entrar'}
      </Button>
    </form>
  );
}