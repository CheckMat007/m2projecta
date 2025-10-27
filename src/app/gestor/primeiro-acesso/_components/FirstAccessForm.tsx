// src/app/gestor/primeiro-acesso/_components/FirstAccessForm.tsx
'use client';

import { useState } from 'react';
// Importa a função `signOut` do NextAuth
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { PasswordStrength } from '../../(admin)/_components/PasswordStrength';
import { updatePasswordFirstAccess } from '../actions';

export function FirstAccessForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Regex de validação atualizada para incluir o símbolo '#'
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&=+#_])[A-Za-z\d@$!%*?&=+#_]{10,}$/;
  
  const isPasswordStrong = strongPasswordRegex.test(newPassword);
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;
  const isButtonDisabled = isLoading || !passwordsMatch || !isPasswordStrong;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await updatePasswordFirstAccess(formData);

    if (result.success) {
      toast.success("Senha atualizada com sucesso! Faça login novamente.");
      
      // A correção final: desconecta o usuário e o redireciona para a página de login.
      // Isso limpa a sessão antiga e força a criação de uma nova e atualizada no próximo login.
      await signOut({ callbackUrl: '/gestor/login' });

    } else {
      toast.error(result.message);
      // Habilita o formulário novamente em caso de erro para que o usuário possa tentar de novo.
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="newPassword">Nova Senha</Label>
        <div className="relative">
          <Input 
            id="newPassword" 
            name="newPassword" 
            type={showNewPassword ? 'text' : 'password'} 
            required 
            className="bg-gray-800 border-gray-700 pr-10" 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
          />
          <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400">
            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        <PasswordStrength password={newPassword} minLength={10} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
        <div className="relative">
          <Input 
            id="confirmPassword" 
            name="confirmPassword" 
            type={showConfirmPassword ? 'text' : 'password'} 
            required 
            className="bg-gray-800 border-gray-700 pr-10" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
          />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400">
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {/* Feedback visual em tempo real se as senhas não coincidirem */}
        {confirmPassword && !passwordsMatch && (
          <p className="text-xs text-red-400 mt-2">As senhas não coincidem.</p>
        )}
      </div>
      <Button type="submit" className="w-full bg-m2-green text-black hover:bg-m2-green/80" disabled={isButtonDisabled}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Salvar e Continuar'}
      </Button>
    </form>
  );
}