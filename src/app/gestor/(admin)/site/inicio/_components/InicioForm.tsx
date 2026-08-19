// src/app/gestor/(admin)/site/inicio/_components/InicioForm.tsx
'use client';

import { useFormStatus } from 'react-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { updateHeroVideo } from '../actions';

// Botão de Submit com estado de loading
function SubmitButton({ children }: { children: React.ReactNode }) {
    const { pending } = useFormStatus();
    return (
        <Button className="bg-m2-green text-black hover:bg-m2-green/80" type="submit" disabled={pending}>
            {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : children}
        </Button>
    )
}

export function InicioForm({ currentLink }: { currentLink: string }) {

  async function handleUpdate(formData: FormData) {
    const result = await updateHeroVideo(formData);
    if (result.success) {
      if (result.message === 'Nenhuma alteração detectada.') {
        toast.info(result.message);
      } else {
        toast.success(result.message);
      }
    } else {
      toast.error(result.message);
    }
  }

  return (
    <form action={handleUpdate} className="space-y-6">
      <h2 className="text-xl font-semibold">Seção Hero</h2>
      <div className="space-y-2">
        <Label htmlFor="youtubeLink">Link do Vídeo do YouTube</Label>
        <p className="text-sm text-gray-400">
          Cole o link completo da barra de endereços ou do botão COMPARTILHAR.
        </p>
        <p className="text-xs text-gray-500">
          Aceita vídeos normais (https://youtu.be/ID) e Shorts (https://www.youtube.com/shorts/ID). A orientação é detectada automaticamente.
        </p>
        <Input
          id="youtubeLink"
          name="youtubeLink"
          placeholder="https://www.youtube.com/..."
          defaultValue={currentLink}
          required
        />
      </div>
      <SubmitButton>Salvar Alterações</SubmitButton>
    </form>
  );
}