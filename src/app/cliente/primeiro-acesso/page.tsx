// src/app/cliente/primeiro-acesso/page.tsx
'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordStrength } from '@/app/gestor/(admin)/_components/PasswordStrength'; // Reutilizando o componente
import { updatePasswordFirstAccess } from '@/app/gestor/primeiro-acesso/actions'; // Reutilizando a action
import { toast } from 'sonner';
import { Loader2, Eye} from 'lucide-react';
import Logo from '@/components/ui/Logo';

export default function ClientFirstAccessPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&=+#_.-])[A-Za-z\d@$!%*?&=+#_.-]{10,}$/;
  const isPasswordStrong = strongPasswordRegex.test(newPassword);
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    const result = await updatePasswordFirstAccess(formData);

    if (result.success) {
      toast.success("Senha definida com sucesso! Faça login novamente.");
      // Redireciona para o login DO CLIENTE
      await signOut({ callbackUrl: '/cliente/login' });
    } else {
      toast.error(result.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-m2-dark text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center"><div className="w-40"><Logo /></div></div>
        <div className="text-center">
            <h2 className="text-2xl font-bold text-white">Bem-vindo!</h2>
            <p className="text-gray-400">Para sua segurança, defina sua senha pessoal.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900/50 p-8 rounded-lg border border-gray-800">
            <div className="space-y-2">
                <Label>Nova Senha</Label>
                <div className="relative">
                    <Input name="newPassword" type={showPass ? 'text' : 'password'} required className="bg-gray-800 border-gray-700" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-white"><Eye size={18}/></button>
                </div>
                <PasswordStrength password={newPassword} minLength={10} />
            </div>
            <div className="space-y-2">
                <Label>Confirmar Senha</Label>
                <Input name="confirmPassword" type="password" required className="bg-gray-800 border-gray-700" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                {confirmPassword && !passwordsMatch && <p className="text-xs text-red-400">As senhas não coincidem.</p>}
            </div>
            <Button type="submit" className="w-full bg-m2-green text-black hover:bg-m2-green/80" disabled={isLoading || !passwordsMatch || !isPasswordStrong}>
                {isLoading ? <Loader2 className="animate-spin" /> : 'Salvar Senha'}
            </Button>
        </form>
      </div>
    </div>
  );
}