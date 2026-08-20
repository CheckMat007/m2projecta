// src/app/gestor/login/_components/login-form.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
// useRouter não é mais necessário para o redirecionamento
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import { RECAPTCHA_SITE_KEY } from '@/lib/site';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // --- CORREÇÃO FINAL APLICADA ---
    // 1. Mantemos `redirect: false` para controlar o fluxo manualmente.
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      recaptchaToken,
    });

    // 2. Verificamos se o login foi bem-sucedido.
    if (result?.ok && !result.error) {
      // 3. Forçamos um RECARREGAMENTO COMPLETO da página para o /gestor.
      // Isso garante que o middleware será executado no servidor.
      window.location.href = '/gestor';
    } else {
      // O código abaixo só é executado se houver um erro.
      setIsLoading(false);
      setError('E-mail ou senha inválidos. Tente novamente.');
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* O resto do seu JSX permanece o mesmo */}
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" name="email" type="email" placeholder="seu.email@exemplo.com" required className="bg-background border-input" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <Input id="password" name="password" type={showPassword ? 'text' : 'password'} placeholder="Sua senha" required className="bg-background border-input pr-10" />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-white" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>
      <div className="flex justify-center">
        {RECAPTCHA_SITE_KEY ? (
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={(token) => setRecaptchaToken(token)}
            theme={mounted && theme === 'dark' ? 'dark' : 'light'}
          />
        ) : (
          <p className="text-xs text-red-400 text-center">
            Verificação de segurança indisponível no momento. Tente novamente mais tarde.
          </p>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-400 dark:text-red-300 bg-red-900/30 dark:bg-red-900/20 p-2 rounded-md">
          {error}
        </p>
      )}
      <Button type="submit" className="w-full bg-m2-green text-black hover:bg-m2-green/80" disabled={isLoading || !recaptchaToken}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Entrar'}
      </Button>
    </form>
  );
}