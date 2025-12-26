// src/app/gestor/(admin)/perfil/_components/ProfileForm.tsx
'use client';

import { useState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User as UserIcon, Eye, EyeOff, Loader2, Info } from "lucide-react";
import InputMask from 'react-input-mask';
import { PasswordStrength } from '../../_components/PasswordStrength';
import { updateProfile, updatePassword } from '../actions';
import { toast } from 'sonner';
import type { User } from '@prisma/client';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';

// Componente de botão de submit para o formulário de senha
function PasswordSubmitButton({ children, disabled }: { children: React.ReactNode, disabled?: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button className="bg-m2-green text-black hover:bg-m2-green/80" type="submit" disabled={pending || disabled}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : children}
        </Button>
    )
}

// Componente de formulário principal
export function ProfileForm({ user }: { user: User }) {
  const { data: session, update: updateSession } = useSession();
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileFormRef = useRef<HTMLFormElement>(null);
  const passwordFormRef = useRef<HTMLFormElement>(null);
  const [file, setFile] = useState<File | null>(null);
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isPasswordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&=+#_.])[A-Za-z\d@$!%*?&=+#_.]{10,}$/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword;

  // Função para atualizar o perfil
  async function handleUpdateProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmittingProfile(true);
    
    let imageUrl = user.image;
    
    if (file) {
      try {
        const response = await fetch(`/api/upload?filename=${file.name}`, { method: 'POST', body: file });
        if (!response.ok) throw new Error('Falha no upload da imagem.');
        const newBlob = await response.json();
        imageUrl = newBlob.url;
      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
        toast.error('Erro ao fazer upload da imagem.');
        setIsSubmittingProfile(false);
        return;
      }
    }

    if (!profileFormRef.current) return;
    const formData = new FormData(profileFormRef.current);
    if (imageUrl) {
      formData.set('image', imageUrl);
    }
    
    const result = await updateProfile(formData);
    
    if (result.success) {
      if (result.message === 'Nenhuma alteração detectada.') {
        toast.info(result.message);
      } else {
        toast.success(result.message);
        await updateSession({ name: formData.get('name'), image: imageUrl });
      }
    } else {
      toast.error(result.message);
    }
    setIsSubmittingProfile(false);
  }
  
  // Função para atualizar a senha
  async function handleUpdatePassword(formData: FormData) {
    if (!passwordFormRef.current) return;
    const result = await updatePassword(formData);
    
    if (result.success) {
      toast.success(result.message);
      setNewPassword('');
      setConfirmPassword('');
      setCurrentPassword('');
      passwordFormRef.current.reset();
    } else {
      toast.error(result.message);
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Editar Perfil</h1>
        <p className="text-gray-400">Gerencie suas informações pessoais e de segurança.</p>
      </div>

      <Separator className="bg-gray-700" />

      {/* Formulário de Dados Pessoais */}
      <form ref={profileFormRef} onSubmit={handleUpdateProfile} className="space-y-6">
        <h2 className="text-xl font-semibold">Dados Pessoais</h2>
        <div className="bg-yellow-900/30 text-yellow-300 border border-yellow-400/20 p-4 rounded-md flex items-center gap-3">
          <Info size={20} />
          <p className="text-sm">
            <span className="font-semibold">Aviso:</span> Algumas informações serão exibidas no site público. Altere com cuidado.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center overflow-hidden">
            {file ? <Image src={URL.createObjectURL(file)} alt="Preview" width={96} height={96} className="object-cover w-full h-full" /> : user.image ? <Image src={user.image} alt="Foto de perfil" width={96} height={96} className="object-cover w-full h-full" /> : <UserIcon size={40} className="text-gray-500" />}
          </div>
          <input type="file" ref={fileInputRef} onChange={(e) => e.target.files && setFile(e.target.files[0])} className="hidden" accept="image/*" />
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()} className="bg-transparent border-gray-600 hover:bg-gray-800 hover:text-white">Alterar Foto</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" name="name" defaultValue={user.name || ''} className="bg-gray-800 border-gray-700" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" name="email" type="email" defaultValue={user.email || ''} className="bg-gray-800 border-gray-700" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Telefone de Contato</Label>
          <InputMask mask="(99) 99999-9999" id="phone" name="phone" defaultValue={user.phone || ''} placeholder="(12) 99999-9999" className="flex h-10 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm" />
        </div>

        {/* --- CORREÇÃO APLICADA AQUI --- */}
        {/* A seção agora é visível para TODOS, não apenas para o MASTER */}
        <>
          <Separator className="bg-gray-700" />
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Informações da Equipe</h2>
            <p className="text-sm text-gray-400">
              Estes campos definem como este perfil aparecerá na página &quot;Sobre Nós&quot; do site.
            </p>
            
            <div className="space-y-2">
              <Label htmlFor="jobDescription">Descrição da Função</Label>
              <Textarea 
                id="jobDescription" 
                name="jobDescription" 
                placeholder="Ex: Fundador & Piloto de Drone" 
                className="bg-gray-800 border-gray-700"
                defaultValue={user.jobDescription || ''}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="personalQuote">Comentário Pessoal (Opcional)</Label>
              <Textarea 
                id="personalQuote" 
                name="personalQuote" 
                placeholder="Ex: Apaixonado por drones e novas perspectivas." 
                className="bg-gray-800 border-gray-700"
                rows={2}
                defaultValue={user.personalQuote || ''}
              />
              <p className="text-xs text-gray-500">Uma frase curta que aparecerá abaixo da sua função.</p>
            </div>

            {/* A CONDIÇÃO AGORA ENVOLVE APENAS O SWITCH */}
            {session?.user?.role === 'MASTER' && (
              <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-800">
                <div>
                  <Label htmlFor="showOnAboutPage" className="font-bold">Aparecer na Página &quot;Sobre Nós&quot;</Label>
                  <p className="text-sm text-gray-400">Ative para que este membro da equipe seja exibido publicamente.</p>
                </div>
                <Switch 
                  id="showOnAboutPage" 
                  name="showOnAboutPage" 
                  defaultChecked={user.showOnAboutPage} 
                />
              </div>
            )}
          </div>
        </>

        <div className="pt-6">
          <Button className="bg-m2-green text-black hover:bg-m2-green/80" type="submit" disabled={isSubmittingProfile}>
            {isSubmittingProfile ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Salvar Alterações'}
          </Button>
        </div>
      </form>

      <Separator className="bg-gray-700" />

      {/* Formulário de Alterar Senha */}
      <form ref={passwordFormRef} id="password-form" action={handleUpdatePassword} className="space-y-6">
        <h2 className="text-xl font-semibold">Alterar Senha</h2>
        <div className="bg-red-500/30 text-white border border-red-700 p-4 rounded-md flex items-center gap-3">
          <Info size={20} />
          <p className="text-sm">
            <span className="font-semibold">ATENÇÃO:</span> Salve sua nova senha em um lugar seguro!
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Senha Atual</Label>
          <div className="relative">
            <Input id="currentPassword" name="currentPassword" type={showCurrentPassword ? 'text' : 'password'} className="bg-gray-800 border-gray-700 pr-10" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-white">
              {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="newPassword">Nova Senha</Label>
          <div className="relative">
            <Input id="newPassword" name="newPassword" type={showNewPassword ? 'text' : 'password'} className="bg-gray-800 border-gray-700 pr-10" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-white">
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <PasswordStrength password={newPassword} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
          <div className="relative">
            <Input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} className="bg-gray-800 border-gray-700 pr-10" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-white">
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {confirmPassword && !passwordsMatch && (
            <p className="text-xs text-red-400 mt-2">As senhas não coincidem.</p>
          )}
        </div>
        <PasswordSubmitButton disabled={!currentPassword || !newPassword || !confirmPassword || !passwordsMatch || !isPasswordValid}>
          Redefinir Senha
        </PasswordSubmitButton>
      </form>
    </div>
  );
}