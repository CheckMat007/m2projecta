// src/app/cliente/login/page.tsx
'use client';

import { useState, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import Logo from '@/components/ui/Logo';
import ReCAPTCHA from 'react-google-recaptcha'; // 1. Importar reCAPTCHA

export default function ClientLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // 2. Estado para o token do reCAPTCHA
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const result = await signIn('credentials', {
      redirect: false,
      email: formData.get('email'),
      password: formData.get('password'),
      recaptchaToken, // 3. Enviar o token junto com as credenciais
    });

    if (result?.error) {
      toast.error(result.error === 'CredentialsSignin' ? "E-mail ou senha inválidos." : result.error);
      setIsLoading(false);
      // Reseta o reCAPTCHA em caso de erro
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
    } else {
      // SUCESSO: Redireciona para a área do cliente
      // Isso forçará o middleware a rodar e verificar o 'mustChangePassword'
      window.location.href = '/cliente';
    }
  };

  return (
    <div className="min-h-screen bg-m2-dark text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center"><div className="w-40"><Logo /></div></div>
        <div className="text-center">
            <h2 className="text-2xl font-bold text-m2-green">Área do Cliente</h2>
            <p className="text-gray-400 text-sm">Acesse seus projetos e contratos.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-900/50 p-8 rounded-lg border border-gray-800">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" required className="bg-gray-800 border-gray-700" placeholder="seu@email.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
                <Input id="password" name="password" type={showPassword ? 'text' : 'password'} required className="bg-gray-800 border-gray-700" placeholder="******" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white">
                    {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
            </div>
          </div>

          {/* 4. Componente reCAPTCHA */}
          <div className="flex justify-center my-4">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              onChange={(token) => setRecaptchaToken(token)}
              theme="dark"
            />
          </div>

          <Button type="submit" className="w-full bg-m2-green text-black hover:bg-m2-green/80" disabled={isLoading || !recaptchaToken}>
            {isLoading ? <Loader2 className="animate-spin mr-2" /> : 'Acessar'}
          </Button>
        </form>
      </div>
    </div>
  );
}