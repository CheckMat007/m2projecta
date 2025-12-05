// src/app/cliente/(painel)/perfil/_components/ClientProfileForm.tsx
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { PasswordStrength } from '@/app/gestor/(admin)/_components/PasswordStrength'; // Reutilizando
import { updateClientPasswordAction } from '@/app/cliente/actions';
import { toast } from 'sonner';
import { Info, Loader2, Eye, Lock } from 'lucide-react';
import Image from 'next/image';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ClientProfileForm({ client }: { client: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  
  const formRef = useRef<HTMLFormElement>(null);

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const result = await updateClientPasswordAction(formData);
    
    if (result.success) {
      toast.success(result.message);
      formRef.current?.reset();
      setNewPassword('');
    } else {
      toast.error(result.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      
      {/* SEÇÃO DE DADOS (SOMENTE LEITURA) */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 space-y-6">
        <div className="flex items-start gap-4 p-4 bg-blue-900/20 border border-blue-900/50 rounded-md text-blue-200 text-sm mb-6">
            <Info className="flex-shrink-0 mt-0.5" size={18} />
            <p>Estes dados são gerenciados pela M2 Projecta. Para solicitar alterações cadastrais, por favor entre em contato com seu gestor.</p>
        </div>

        <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center overflow-hidden">
                {client.logoUrl ? (
                    <Image src={client.logoUrl} alt="Logo" width={96} height={96} className="object-cover w-full h-full" />
                ) : (
                    <span className="text-2xl font-bold text-gray-500">{client.tradeName.charAt(0)}</span>
                )}
            </div>
            <div>
                <h3 className="text-xl font-bold">{client.tradeName}</h3>
                <p className="text-gray-400">{client.companyName || 'Razão Social não informada'}</p>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label>E-mail de Acesso</Label>
                <div className="relative">
                    <Input value={client.user.email} disabled className="bg-gray-950/50 border-gray-800 text-gray-400 pl-10" />
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-600" />
                </div>
            </div>
            <div className="space-y-2">
                <Label>CNPJ / CPF</Label>
                <div className="relative">
                     <Input value={client.cnpj || '-'} disabled className="bg-gray-950/50 border-gray-800 text-gray-400 pl-10" />
                     <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-600" />
                </div>
            </div>
            <div className="space-y-2">
                <Label>Telefone</Label>
                <div className="relative">
                    <Input value={client.phone || '-'} disabled className="bg-gray-950/50 border-gray-800 text-gray-400 pl-10" />
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-600" />
                </div>
            </div>
            <div className="space-y-2">
                <Label>Endereço</Label>
                <div className="relative">
                    <Input value={client.address || '-'} disabled className="bg-gray-950/50 border-gray-800 text-gray-400 pl-10" />
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-600" />
                </div>
            </div>
        </div>
      </div>

      <Separator className="bg-gray-800" />

      {/* SEÇÃO DE SENHA */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Segurança</h2>
        <form ref={formRef} onSubmit={handlePasswordSubmit} className="max-w-lg space-y-4">
            <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha Atual</Label>
                <div className="relative">
                    <Input id="currentPassword" name="currentPassword" type={showCurrent ? 'text' : 'password'} required className="bg-gray-800 border-gray-700" />
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute inset-y-0 right-3 flex items-center text-gray-400"><Eye size={18}/></button>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <div className="relative">
                    <Input id="newPassword" name="newPassword" type={showNew ? 'text' : 'password'} required className="bg-gray-800 border-gray-700" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute inset-y-0 right-3 flex items-center text-gray-400"><Eye size={18}/></button>
                </div>
                <PasswordStrength password={newPassword} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" required className="bg-gray-800 border-gray-700" />
            </div>
            <Button type="submit" disabled={isLoading} className="bg-m2-green text-black hover:bg-m2-green/80">
                {isLoading ? <Loader2 className="animate-spin mr-2" /> : 'Atualizar Senha'}
            </Button>
        </form>
      </div>

    </div>
  );
}