// src/app/gestor/(admin)/perfil/_components/ProfileForm.tsx
'use client';

import { useState, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  Loader2, 
  Info, 
  Mail, 
  Phone, 
  Camera, 
  Lock, 
  ShieldAlert,
  Briefcase
} from "lucide-react";
import InputMask from 'react-input-mask';
import { PasswordStrength } from '../../_components/PasswordStrength';
import { updateProfile, updatePassword } from '../actions';
import { toast } from 'sonner';
import type { User } from '@prisma/client';

// --- SUBCOMPONENTES ---

function PasswordSubmitButton({ children, disabled }: { children: React.ReactNode, disabled?: boolean }) {
    const { pending } = useFormStatus();
    return (
        <Button className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90" type="submit" disabled={pending || disabled}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : children}
        </Button>
    )
}

function ProfileSubmitButton({ isLoading }: { isLoading: boolean }) {
    return (
        <Button className="bg-m2-green text-black hover:bg-m2-green/90" type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Salvar Alterações'}
        </Button>
    )
}

// --- COMPONENTE PRINCIPAL ---
export function ProfileForm({ user }: { user: User }) {
  const { update: updateSession } = useSession();
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);

  // Refs e Estados
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileFormRef = useRef<HTMLFormElement>(null);
  const passwordFormRef = useRef<HTMLFormElement>(null);
  const [file, setFile] = useState<File | null>(null);
  
  // Senha
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isPasswordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&=+#_.])[A-Za-z\d@$!%*?&=+#_.]{10,}$/.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword;

  // --- HANDLERS ---

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
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      
      {/* Cabeçalho */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Meu Perfil</h1>
        <p className="text-muted-foreground mt-1">Gerencie suas informações pessoais e credenciais de acesso.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* COLUNA ESQUERDA: DADOS PESSOAIS */}
        <div className="lg:col-span-2 space-y-6">
            <form ref={profileFormRef} onSubmit={handleUpdateProfile}>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserIcon className="h-5 w-5" /> Dados Pessoais
                        </CardTitle>
                        <CardDescription>Informações básicas da sua conta.</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                        {/* Avatar */}
                        <div className="flex flex-col sm:flex-row items-center gap-6 pb-4 border-b border-border">
                            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <Avatar className="w-24 h-24 border-2 border-border group-hover:border-primary transition-colors">
                                    <AvatarImage src={file ? URL.createObjectURL(file) : user.image || undefined} className="object-cover" />
                                    <AvatarFallback className="bg-muted text-2xl font-bold text-muted-foreground">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="text-white h-6 w-6" />
                                </div>
                            </div>
                            <div className="text-center sm:text-left space-y-2">
                                <h3 className="font-medium text-foreground">Sua Foto</h3>
                                <p className="text-xs text-muted-foreground max-w-[200px]">Clique na imagem para alterar. Recomendado: JPG ou PNG quadrado.</p>
                                <input type="file" ref={fileInputRef} onChange={(e) => e.target.files && setFile(e.target.files[0])} className="hidden" accept="image/*" />
                                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                                    Selecionar arquivo
                                </Button>
                            </div>
                        </div>

                        {/* Campos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nome Completo</Label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input id="name" name="name" defaultValue={user.name || ''} className="pl-9" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">E-mail</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input id="email" name="email" type="email" defaultValue={user.email || ''} className="pl-9" disabled title="Entre em contato com o suporte para alterar o e-mail." />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Telefone / WhatsApp</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                                    <InputMask 
                                        mask="(99) 99999-9999" 
                                        id="phone" 
                                        name="phone" 
                                        defaultValue={user.phone || ''} 
                                        placeholder="(00) 00000-0000" 
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-9" 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Seção Sobre (Expandida) */}
                        <div className="pt-4 space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Label className="text-base font-semibold flex items-center gap-2">
                                    <Briefcase className="h-4 w-4" /> Perfil Profissional
                                </Label>
                            </div>
                            
                            <Alert className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                                <Info className="h-4 w-4" />
                                <AlertTitle>Visibilidade Pública</AlertTitle>
                                <AlertDescription className="text-xs opacity-90">
                                    Estas informações aparecerão na página &quot;Sobre Nós&quot; se o seu perfil estiver ativo.
                                </AlertDescription>
                            </Alert>

                            <div className="space-y-2">
                                <Label htmlFor="jobDescription">Cargo / Função</Label>
                                <Input 
                                    id="jobDescription" 
                                    name="jobDescription" 
                                    placeholder="Ex: Gerente de Projetos" 
                                    defaultValue={user.jobDescription || ''} 
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="personalQuote">Frase ou Bio Curta</Label>
                                <Textarea 
                                    id="personalQuote" 
                                    name="personalQuote" 
                                    placeholder="Uma breve descrição sobre você..." 
                                    defaultValue={user.personalQuote || ''} 
                                    rows={3}
                                    className="resize-none"
                                />
                            </div>

                            {/* Switch de Visibilidade */}
                            <div className="flex items-center justify-between p-3 bg-muted/40 rounded-lg border border-border">
                                <div className="space-y-0.5">
                                    <Label htmlFor="showOnAboutPage" className="text-base cursor-pointer">Exibir no Site</Label>
                                    <p className="text-xs text-muted-foreground">Tornar este perfil visível publicamente.</p>
                                </div>
                                <Switch 
                                    id="showOnAboutPage" 
                                    name="showOnAboutPage" 
                                    defaultChecked={user.showOnAboutPage} 
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <ProfileSubmitButton isLoading={isSubmittingProfile} />
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>

        {/* COLUNA DIREITA: SEGURANÇA */}
        <div className="lg:col-span-1 space-y-6">
            <form ref={passwordFormRef} action={handleUpdatePassword}>
                <Card className="border-destructive/20 shadow-none">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-destructive">
                            <ShieldAlert className="h-5 w-5" /> Segurança
                        </CardTitle>
                        <CardDescription>Alterar sua senha de acesso.</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Senha Atual</Label>
                            <div className="relative">
                                <Input 
                                    id="currentPassword" 
                                    name="currentPassword" 
                                    type={showCurrentPassword ? 'text' : 'password'} 
                                    className="pr-10" 
                                    value={currentPassword} 
                                    onChange={(e) => setCurrentPassword(e.target.value)} 
                                />
                                <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute inset-y-0 right-0 px-3 text-muted-foreground hover:text-foreground">
                                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="newPassword">Nova Senha</Label>
                            <div className="relative">
                                <Input 
                                    id="newPassword" 
                                    name="newPassword" 
                                    type={showNewPassword ? 'text' : 'password'} 
                                    className="pr-10" 
                                    value={newPassword} 
                                    onChange={(e) => setNewPassword(e.target.value)} 
                                />
                                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 px-3 text-muted-foreground hover:text-foreground">
                                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            <PasswordStrength password={newPassword} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                            <div className="relative">
                                <Input 
                                    id="confirmPassword" 
                                    name="confirmPassword" 
                                    type={showConfirmPassword ? 'text' : 'password'} 
                                    className={`pr-10 ${confirmPassword && !passwordsMatch ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                    value={confirmPassword} 
                                    onChange={(e) => setConfirmPassword(e.target.value)} 
                                />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 px-3 text-muted-foreground hover:text-foreground">
                                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            {confirmPassword && !passwordsMatch && (
                                <p className="text-xs text-destructive font-medium mt-1">As senhas não coincidem.</p>
                            )}
                        </div>

                        <div className="pt-2">
                            <PasswordSubmitButton disabled={!currentPassword || !newPassword || !confirmPassword || !passwordsMatch || !isPasswordValid}>
                                <Lock className="mr-2 h-4 w-4" /> Atualizar Senha
                            </PasswordSubmitButton>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>

      </div>
    </div>
  );
}