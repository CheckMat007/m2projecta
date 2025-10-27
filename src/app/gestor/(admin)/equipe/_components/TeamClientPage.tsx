// src/app/gestor/(admin)/equipe/_components/TeamClientPage.tsx
'use client';

import { useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import type { User, Permission, Role } from '@prisma/client';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, PlusCircle, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { createUserAction, updateUserAction, deleteUserAction, toggleShowOnAboutPageAction } from '../actions';
import { PasswordStrength } from '../../_components/PasswordStrength'; // Importado
import Image from 'next/image';

type UserWithPermissions = User & { permissions: Permission[] };

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
  const [confirmPassword, setConfirmPassword] = useState(''); // CORREÇÃO: Adicionado
  const formRef = useRef<HTMLFormElement>(null);
  const isEditing = !!user;
  
  // CORREÇÃO: Lógica de validação adicionada
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
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      {isEditing && <input type="hidden" name="userId" value={user.id} />}
      
      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo</Label>
        <Input id="name" name="name" defaultValue={user?.name || ''} required className="bg-gray-800 border-gray-700" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" name="email" type="email" defaultValue={user?.email || ''} required className="bg-gray-800 border-gray-700" />
      </div>

      {!isEditing && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password">Senha Provisória</Label>
              <Input id="password" name="password" type="password" required minLength={8} className="bg-gray-800 border-gray-700" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passwordConfirmation">Confirmar Senha</Label>
              <Input id="passwordConfirmation" name="passwordConfirmation" type="password" required minLength={8} className="bg-gray-800 border-gray-700" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
            </div>
          </div>
          {/* CORREÇÃO: Mensagem de erro e PasswordStrength */}
          {confirmPassword && !passwordsMatch && (
            <p className="text-xs text-red-400 -mt-2">As senhas não coincidem.</p>
          )}
          <PasswordStrength password={password} minLength={8} />
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="role">Função</Label>
        <Select name="role" defaultValue={user?.role || 'EDITOR'} disabled={currentUserRole !== 'MASTER'}>
          <SelectTrigger className="w-full bg-gray-800 border-gray-700">
            <SelectValue placeholder="Selecione uma função" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EDITOR">Editor</SelectItem>
            <SelectItem value="MASTER" disabled={currentUserRole !== 'MASTER'}>Master</SelectItem>
          </SelectContent>
        </Select>
         {currentUserRole !== 'MASTER' && <p className="text-xs text-gray-500">Apenas um MASTER pode alterar a função.</p>}
      </div>

      <div className="space-y-3 pt-2">
        <Label>Permissões</Label>
        <div className="space-y-2 rounded-md border border-gray-800 p-4 max-h-48 overflow-y-auto">
          {allPermissions.map(permission => (
            <div key={permission.id} className="flex items-center gap-3">
              <Checkbox
                id={`perm-${permission.id}-${user?.id || 'new'}`}
                name="permissionIds"
                value={permission.id}
                defaultChecked={user?.permissions.some(p => p.id === permission.id)}
              />
              <Label htmlFor={`perm-${permission.id}-${user?.id || 'new'}`} className="font-normal">{permission.description}</Label>
            </div>
          ))}
        </div>
      </div>
      
      <DialogFooter>
        <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
        <Button type="submit" disabled={isEditing ? isLoading : isCreateButtonDisabled}>{isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : isEditing ? 'Salvar Alterações' : 'Criar Usuário'}</Button>
      </DialogFooter>
    </form>
  );
}

// ... (Restante do componente TeamClientPage)
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
      loading: 'Deletando usuário...',
      success: (result) => {
        if (!result.success) throw new Error(result.message);
        return result.message;
      },
      error: (error) => error.message,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Equipe</h1>
          <p className="text-gray-400">Adicione, edite e defina permissões para os usuários do painel.</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-m2-green/90 text-black hover:bg-m2-green">
              <PlusCircle size={18} className="mr-2" />
              Adicionar Usuário
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Novo Usuário</DialogTitle></DialogHeader>
            <UserForm allPermissions={allPermissions} onFormSubmit={() => setIsCreateOpen(false)} currentUserRole={currentUserRole} />
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={!!editingUser} onOpenChange={(isOpen) => !isOpen && setEditingUser(null)}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Editar Usuário</DialogTitle></DialogHeader>
          {editingUser && <UserForm user={editingUser} allPermissions={allPermissions} onFormSubmit={() => setEditingUser(null)} currentUserRole={currentUserRole} />}
        </DialogContent>
      </Dialog>

      <div className="border border-gray-800 rounded-lg">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800 hover:bg-gray-900/50">
              <TableHead>Nome</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Permissões</TableHead>
              <TableHead>Visível no Site</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="border-gray-800">
                <TableCell className="font-medium flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden relative">
                    {user.image ? <Image src={user.image} alt={user.name || ''} fill className="object-cover" /> : <span className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">{user.name?.charAt(0).toUpperCase()}</span>}
                  </div>
                  {user.name} {user.id === session?.user?.id && '(Você)'}
                </TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell className="text-xs text-gray-400">{user.role === 'MASTER' ? 'Acesso Total' : `${user.permissions.length} permissões`}</TableCell>
                <TableCell><Switch checked={user.showOnAboutPage} onCheckedChange={(isChecked) => handleToggleVisibility(user.id, isChecked)} /></TableCell>
                <TableCell className="text-right flex justify-end gap-2">
                  <Button variant="outline" size="icon" onClick={() => setEditingUser(user)} disabled={user.role === 'MASTER' && currentUserRole !== 'MASTER'}><Edit size={16} /></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button variant="destructive" size="icon" disabled={user.id === session?.user?.id || (user.role === 'MASTER' && currentUserRole !== 'MASTER')}><Trash2 size={16} /></Button></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>Esta ação não pode ser desfeita. Isso irá deletar permanentemente o usuário &quot;{user.name}&quot;.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteUser(user.id)}>Deletar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}