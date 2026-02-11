// src/app/gestor/(admin)/equipe/_components/TeamClientPage.tsx
'use client';

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import type { User, Permission, Role } from '@prisma/client';
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogFooter, 
  DialogClose,
  DialogDescription 
} from "@/components/ui/dialog";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from "@/components/ui/card";
import { 
  Loader2, 
  PlusCircle, 
  Trash2, 
  Edit, 
  Users, 
  Shield, 
  Eye,
  Mail,
  Lock,
  User as UserIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { createUserAction, updateUserAction, deleteUserAction, toggleShowOnAboutPageAction } from '../actions';
import { PasswordStrength } from '../../_components/PasswordStrength';

// --- TIPOS ---
type UserWithPermissions = User & { permissions: Permission[] };

// --- FORMULÁRIO DE USUÁRIO ---
function UserForm({
  user,
  allPermissions,
  onFormSubmit,
  currentUserRole
}: {
  user?: UserWithPermissions;
  allPermissions: Permission[];
  onFormSubmit: () => void;
  currentUserRole?: Role;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const isEditing = !!user;
  
  const passwordsMatch = password === confirmPassword;
  const isCreateButtonDisabled = isLoading || (!isEditing && (!password || !passwordsMatch));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) return;
    
    setIsLoading(true);
    const formData = new FormData(formRef.current);
    const action = isEditing ? updateUserAction : createUserAction;
    
    toast.promise(action(formData), {
        loading: isEditing ? 'Salvando alterações...' : 'Criando usuário...',
        success: (result) => {
            if (!result.success) throw new Error(result.message);
            onFormSubmit();
            return result.message;
        },
        error: (error) => error.message
    });
    
    setIsLoading(false);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-5 py-4">
      {isEditing && <input type="hidden" name="userId" value={user.id} />}
      
      {/* Dados Pessoais */}
      <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <div className="relative">
                <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="name" name="name" defaultValue={user?.name || ''} required placeholder="Ex: João Silva" className="pl-9" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input id="email" name="email" type="email" defaultValue={user?.email || ''} required placeholder="joao@exemplo.com" className="pl-9" />
            </div>
          </div>
      </div>

      {/* Senha */}
      {!isEditing && (
        <div className="p-4 bg-muted/30 rounded-lg border border-border space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Senha Provisória</Label>
              <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="password" name="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9 bg-background" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="passwordConfirmation">Confirmar Senha</Label>
              <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="passwordConfirmation" name="passwordConfirmation" type="password" required minLength={8} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={`pl-9 bg-background ${confirmPassword && !passwordsMatch ? 'border-red-500 focus-visible:ring-red-500' : ''}`} />
              </div>
            </div>
          </div>
          <div className="space-y-2">
             {confirmPassword && !passwordsMatch && <p className="text-xs text-red-500 font-medium">As senhas não coincidem.</p>}
             <PasswordStrength password={password} minLength={8} />
          </div>
        </div>
      )}

      {/* Função */}
      <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Função no Sistema</Label>
            <Select name="role" defaultValue={user?.role || 'EDITOR'} disabled={currentUserRole !== 'MASTER'}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EDITOR">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-400"></span> Editor
                    </div>
                </SelectItem>
                <SelectItem value="MASTER" disabled={currentUserRole !== 'MASTER'}>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-violet-600"></span> Master
                    </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {currentUserRole !== 'MASTER' && <p className="text-xs text-muted-foreground">Apenas um MASTER pode alterar a função.</p>}
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
                <Shield size={14} /> Permissões Específicas
            </Label>
            <ScrollArea className="h-40 rounded-md border border-border bg-muted/20 p-4">
              <div className="grid grid-cols-1 gap-3">
                {allPermissions.map(permission => (
                  <div key={permission.id} className="flex items-start space-x-3 hover:bg-muted/50 p-1.5 rounded transition-colors">
                    <Checkbox id={`perm-${permission.id}-${user?.id || 'new'}`} name="permissionIds" value={permission.id} defaultChecked={user?.permissions.some(p => p.id === permission.id)} className="mt-0.5" />
                    <div className="grid gap-1.5 leading-none">
                      <Label htmlFor={`perm-${permission.id}-${user?.id || 'new'}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">{permission.description}</Label>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
      </div>
      
      <DialogFooter>
        <DialogClose asChild><Button type="button" variant="ghost">Cancelar</Button></DialogClose>
        <Button type="submit" disabled={isEditing ? isLoading : isCreateButtonDisabled} className="bg-m2-green text-black hover:bg-m2-green/90 min-w-[120px]">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isEditing ? 'Salvar' : 'Criar Usuário')}
        </Button>
      </DialogFooter>
    </form>
  );
}

// --- PÁGINA PRINCIPAL ---
export function TeamClientPage({ users, allPermissions }: { users: UserWithPermissions[], allPermissions: Permission[] }) {
  const { data: session } = useSession();
  const currentUserRole = session?.user?.role;

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserWithPermissions | null>(null);

  const handleToggleVisibility = async (userId: string, isVisible: boolean) => {
    toast.promise(toggleShowOnAboutPageAction(userId, isVisible), {
      loading: 'Atualizando...',
      success: (result) => {
        if (!result.success) throw new Error(result.message);
        return result.message;
      },
      error: (error) => error.message,
    });
  };
  
  const handleDeleteUser = async (userId: string) => {
    toast.promise(deleteUserAction(userId), {
      loading: 'Deletando...',
      success: (result) => {
        if (!result.success) throw new Error(result.message);
        return result.message;
      },
      error: (error) => error.message,
    });
  };

  // Badge Otimizado para "Master" (Violeta/Roxo para bom contraste)
  const getRoleBadge = (role: string) => {
      return role === 'MASTER' 
        ? <Badge className="bg-violet-600 hover:bg-violet-700 text-white border-transparent px-3">Master</Badge>
        : <Badge variant="secondary" className="bg-muted text-muted-foreground">Editor</Badge>;
  };

  return (
    <div className="space-y-6 w-full max-w-[100vw] overflow-hidden pb-20">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 md:h-8 md:w-8 opacity-80" />
            Equipe
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Gerencie o acesso e visibilidade dos membros da equipe.
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto bg-m2-green text-black hover:bg-m2-green/90 font-medium shadow-sm">
              <PlusCircle size={18} className="mr-2" />
              Adicionar Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto rounded-lg">
            <DialogHeader>
                <DialogTitle>Novo Usuário</DialogTitle>
                <DialogDescription>Cadastre um novo membro e defina suas permissões.</DialogDescription>
            </DialogHeader>
            <UserForm allPermissions={allPermissions} onFormSubmit={() => setIsCreateOpen(false)} currentUserRole={currentUserRole} />
          </DialogContent>
        </Dialog>
      </div>

      {/* --- GRID DE CARDS (Layout Responsivo) --- */}
      {users.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <Card key={user.id} className="group hover:shadow-lg transition-all duration-300 border-border bg-card flex flex-col h-full">
              
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-border shadow-sm">
                        <AvatarImage src={user.image || undefined} alt={user.name || ''} className="object-cover" />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                            {user.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <h3 className="font-semibold text-base leading-tight truncate max-w-[150px]" title={user.name || ''}>
                            {user.name} 
                            {user.id === session?.user?.id && <span className="text-xs text-muted-foreground font-normal ml-1">(Você)</span>}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate max-w-[160px]" title={user.email}>
                            {user.email}
                        </p>
                    </div>
                </div>
                <div className="shrink-0">
                    {getRoleBadge(user.role)}
                </div>
              </CardHeader>

              <CardContent className="py-4 flex-grow space-y-4">
                {/* Status de Permissões */}
                <div className="flex items-center gap-2 p-2 bg-muted/40 rounded-md border border-border/50">
                    {user.role === 'MASTER' ? (
                        <>
                            <Shield className="h-4 w-4 text-violet-600" />
                            <span className="text-xs font-medium text-foreground">Acesso Administrativo Completo</span>
                        </>
                    ) : (
                        <>
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                                {user.permissions.length === 0 
                                    ? "Sem permissões extras" 
                                    : `${user.permissions.length} permissões atribuídas`
                                }
                            </span>
                        </>
                    )}
                </div>
              </CardContent>

              <CardFooter className="pt-2 pb-3 px-4 bg-muted/20 border-t border-border flex items-center justify-between">
                 {/* Visibilidade Switch */}
                 <div className="flex items-center gap-2" title="Exibir na página 'Sobre Nós'?">
                    <Switch 
                        id={`vis-${user.id}`}
                        checked={user.showOnAboutPage} 
                        onCheckedChange={(isChecked) => handleToggleVisibility(user.id, isChecked)} 
                        className="scale-90"
                    />
                    <Label htmlFor={`vis-${user.id}`} className="text-xs text-muted-foreground cursor-pointer flex items-center gap-1">
                        <Eye size={12} className={user.showOnAboutPage ? 'text-primary' : 'text-muted-foreground/50'} />
                        Visível
                    </Label>
                 </div>

                 {/* Ações */}
                 <div className="flex gap-1">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        onClick={() => setEditingUser(user)} 
                        disabled={user.role === 'MASTER' && currentUserRole !== 'MASTER'}
                        title="Editar"
                    >
                        <Edit size={16} />
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            disabled={user.id === session?.user?.id || (user.role === 'MASTER' && currentUserRole !== 'MASTER')}
                            title="Excluir"
                        >
                            <Trash2 size={16} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="sm:max-w-md w-[95vw] rounded-lg">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir usuário?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta ação é irreversível. O usuário <strong>{user.name}</strong> perderá o acesso ao painel imediatamente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteUser(user.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Sim, excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                 </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        // Estado Vazio
        <div className="border-2 border-dashed border-border rounded-xl p-12 text-center flex flex-col items-center justify-center gap-4 bg-muted/10">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
                <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
                <h3 className="font-semibold text-lg">Nenhum membro encontrado</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Adicione usuários para colaborar na gestão do sistema.
                </p>
            </div>
            <Button onClick={() => setIsCreateOpen(true)} className="bg-m2-green text-black hover:bg-m2-green/90 mt-2">
                Adicionar Primeiro Usuário
            </Button>
        </div>
      )}

      {/* DIALOG DE EDIÇÃO (Reutiliza o form) */}
      <Dialog open={!!editingUser} onOpenChange={(isOpen) => !isOpen && setEditingUser(null)}>
        <DialogContent className="sm:max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto rounded-lg">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>Altere as informações de acesso e permissões.</DialogDescription>
          </DialogHeader>
          {editingUser && (
            <UserForm 
                user={editingUser} 
                allPermissions={allPermissions} 
                onFormSubmit={() => setEditingUser(null)} 
                currentUserRole={currentUserRole} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}