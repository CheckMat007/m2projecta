// src/app/gestor/(admin)/blog/_components/PostForm.tsx
'use client';

import { useState, useRef, useEffect, type ChangeEvent, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Loader2, Bold, Italic, Strikethrough, List, ListOrdered, UploadCloud, X, ChevronsUpDown, Image as ImageIcon, Link as LinkIcon, AlignLeft, AlignCenter, AlignRight, AlignJustify, Quote, Underline, Highlighter } from 'lucide-react';
import { createPostAction, updatePostAction } from '../actions';
import { useEditor } from '@/hooks/use-editor';
import { Status, Post, Category, Tag } from '@prisma/client';
import { SeoPreview } from './SeoPreview';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Badge } from '@/components/ui/badge';
import type { Editor } from '@tiptap/react';

// --- TIPOS E SUBCOMPONENTES ---

type PostWithRelations = Post & { categories: Category[], tags: Tag[] };
interface PostFormProps {
  post?: PostWithRelations;
  allCategories: Category[];
  allTags: Tag[];
}

// Toolbar do Editor (CORRIGIDA)
const EditorToolbar = ({ editor, onImageUploadClick }: { editor: Editor | null, onImageUploadClick: () => void }) => {
  const setLink = useCallback(() => {
    if (!editor) return;
    const event = new CustomEvent('open-link-modal');
    window.dispatchEvent(event);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="border border-b-gray-700 border-t-0 border-x-0 p-2 flex items-center gap-1 flex-wrap">
      <Button variant={editor.isActive('bold') ? 'secondary' : 'ghost'} size="icon" type="button" onClick={() => editor.chain().focus().toggleBold().run()} title="Negrito"><Bold size={16} /></Button>
      <Button variant={editor.isActive('italic') ? 'secondary' : 'ghost'} size="icon" type="button" onClick={() => editor.chain().focus().toggleItalic().run()} title="Itálico"><Italic size={16} /></Button>
      <Button variant={editor.isActive('underline') ? 'secondary' : 'ghost'} size="icon" type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} title="Sublinhado"><Underline size={16} /></Button>
      <Button variant={editor.isActive('strike') ? 'secondary' : 'ghost'} size="icon" type="button" onClick={() => editor.chain().focus().toggleStrike().run()} title="Riscado"><Strikethrough size={16} /></Button>
      <Button variant={editor.isActive('highlight') ? 'secondary' : 'ghost'} size="icon" type="button" onClick={() => editor.chain().focus().toggleHighlight().run()} title="Destaque"><Highlighter size={16} /></Button>
      <Button variant={editor.isActive('link') ? 'secondary' : 'ghost'} size="icon" type="button" onClick={setLink} title="Link"><LinkIcon size={16} /></Button>
      <div className="h-6 w-px bg-gray-700 mx-1" />
      <Button variant={editor.isActive({ textAlign: 'left' }) ? 'secondary' : 'ghost'} size="icon" type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} title="Alinhar à Esquerda"><AlignLeft size={16} /></Button>
      <Button variant={editor.isActive({ textAlign: 'center' }) ? 'secondary' : 'ghost'} size="icon" type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} title="Centralizar"><AlignCenter size={16} /></Button>
      <Button variant={editor.isActive({ textAlign: 'right' }) ? 'secondary' : 'ghost'} size="icon" type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} title="Alinhar à Direita"><AlignRight size={16} /></Button>
      <Button variant={editor.isActive({ textAlign: 'justify' }) ? 'secondary' : 'ghost'} size="icon" type="button" onClick={() => editor.chain().focus().setTextAlign('justify').run()} title="Justificar"><AlignJustify size={16} /></Button>
      <div className="h-6 w-px bg-gray-700 mx-1" />
      <Button variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'} size="icon" type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} title="Lista"><List size={16} /></Button>
      <Button variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'} size="icon" type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Lista Numerada"><ListOrdered size={16} /></Button>
      <Button variant={editor.isActive('blockquote') ? 'secondary' : 'ghost'} size="icon" type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Citação"><Quote size={16} /></Button>
      <Button variant="ghost" size="icon" type="button" onClick={onImageUploadClick} title="Imagem"><ImageIcon size={16} /></Button>
    </div>
  );
};

// Botões de Submit
const SubmitButton = ({ status, isUploading }: { status: Status, isUploading: boolean }) => {
    const { pending, data } = useFormStatus();
    const isLoading = isUploading || (pending && data?.get('status') === status);
    return (
        <Button type="submit" name="status" value={status} disabled={isLoading} className={status === 'PUBLISHED' ? "bg-m2-green text-black hover:bg-m2-green/80" : ""}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (status === 'PUBLISHED' ? 'Publicar' : 'Salvar Rascunho')}
        </Button>
    );
};

// Modal de Metadados da Imagem
function ImageMetadataModal({ open, onOpenChange, onSave }: { open: boolean, onOpenChange: (open: boolean) => void, onSave: (metadata: { alt: string, source: string }) => void }) {
    const [alt, setAlt] = useState('');
    const [source, setSource] = useState('');
    const handleSave = () => { onSave({ alt, source }); setAlt(''); setSource(''); };
    return (
        <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>Metadados da Imagem</DialogTitle></DialogHeader><div className="space-y-4"><div className="space-y-2"><Label htmlFor="img-alt">Descrição (Alt Text)</Label><Input id="img-alt" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Ex: Drone sobrevoando a Amazônia" /></div><div className="space-y-2"><Label htmlFor="img-source">Fonte da Imagem</Label><Input id="img-source" value={source} onChange={(e) => setSource(e.target.value)} placeholder="Ex: M2 Projecta © 2025" /></div></div><DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button><Button onClick={handleSave}>Inserir Imagem</Button></DialogFooter></DialogContent></Dialog>
    );
}

// Modal de Link
function LinkModal({ open, onOpenChange, editor }: { open: boolean, onOpenChange: (open: boolean) => void, editor: Editor | null }) {
    const [url, setUrl] = useState('');
    useEffect(() => { if (open && editor) { setUrl(editor.getAttributes('link').href || ''); } }, [open, editor]);
    const handleSave = () => {
        if (url && editor) {
            let finalUrl = url;
            if (!/^https?:\/\//i.test(finalUrl)) { finalUrl = `https://${finalUrl}`; }
            editor.chain().focus().extendMarkRange('link').setLink({ href: finalUrl }).run();
        } else {
            editor?.chain().focus().unsetLink().run();
        }
        onOpenChange(false);
    };
    return (
        <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>Editar Link</DialogTitle></DialogHeader><div className="space-y-2"><Label htmlFor="link-url">URL do Link</Label><Input id="link-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://exemplo.com" /></div><DialogFooter><Button variant="outline" onClick={() => { editor?.chain().focus().unsetLink().run(); onOpenChange(false); }}>Remover Link</Button><Button onClick={handleSave}>Salvar</Button></DialogFooter></DialogContent></Dialog>
    );
}


// --- COMPONENTE PRINCIPAL DO FORMULÁRIO ---
export function PostForm({ post, allCategories, allTags }: PostFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const isEditing = !!post;
  const { editor, EditorContent } = useEditor({ content: post?.content || '' });

  // Estados
  const [openCategories, setOpenCategories] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>(post?.categories || []);
  const [openTags, setOpenTags] = useState(false);
  const [selectedTags, setSelectedTags] = useState<Tag[]>(post?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(post?.featuredImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageContentInputRef = useRef<HTMLInputElement>(null);
  const [seoTitle, setSeoTitle] = useState(post?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(post?.seoDescription || '');
  const [isUploading, setIsUploading] = useState(false);
  const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false);
  const [pendingImageUrl, setPendingImageUrl] = useState<string | null>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  
  useEffect(() => {
    const openModal = () => setIsLinkModalOpen(true);
    window.addEventListener('open-link-modal', openModal);
    return () => window.removeEventListener('open-link-modal', openModal);
  }, []);

  const handleFeaturedImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleContentImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editor) return;
    const uploadToast = toast.loading("Enviando imagem...");
    try {
      const uploadResponse = await fetch(`/api/upload?filename=${file.name}`, { method: 'POST', body: file });
      if (!uploadResponse.ok) throw new Error("Falha no upload da imagem");
      const newBlob = await uploadResponse.json();
      setPendingImageUrl(newBlob.url);
      setIsMetadataModalOpen(true);
      toast.dismiss(uploadToast);
    } catch (error) {
      toast.error((error as Error).message || "Erro ao enviar imagem.", { id: uploadToast });
    } finally {
      if(event.target) event.target.value = '';
    }
  };

  const handleSaveImageMetadata = ({ alt, source }: { alt: string, source: string }) => {
    if (pendingImageUrl && editor) {
        editor.chain().focus().insertContent({
            type: 'image',
            attrs: { src: pendingImageUrl, alt, source },
        }).run();
    }
    setIsMetadataModalOpen(false);
    setPendingImageUrl(null);
  };

  const handleSubmit = async (formData: FormData) => {
    let imageUrl = post?.featuredImageUrl || '';
    if (file) {
      setIsUploading(true);
      try {
        const uploadResponse = await fetch(`/api/upload?filename=${file.name}`, { method: 'POST', body: file });
        if (!uploadResponse.ok) throw new Error("Falha no upload da imagem de destaque");
        const newBlob = await uploadResponse.json();
        imageUrl = newBlob.url;
      } catch (error) {
        toast.error((error as Error).message);
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }
    
    formData.set('content', editor?.getHTML() || '');
    formData.set('featuredImageUrl', imageUrl);
    formData.set('categories', selectedCategories.map(c => c.name).join(', '));
    formData.set('tags', selectedTags.map(t => t.name).join(', '));
    
    const action = isEditing ? updatePostAction : createPostAction;
    const actionPromise = action(formData);
    toast.promise(actionPromise, {
      loading: isEditing ? 'Atualizando post...' : 'Criando post...',
      success: (result) => {
        if (!result.success) throw new Error(result.message);
        router.push('/gestor/blog');
        return result.message;
      },
      error: (error: Error) => error.message,
    });
  };

  return (
    <>
      <ImageMetadataModal open={isMetadataModalOpen} onOpenChange={setIsMetadataModalOpen} onSave={handleSaveImageMetadata} />
      <LinkModal open={isLinkModalOpen} onOpenChange={setIsLinkModalOpen} editor={editor} />
      <input type="file" ref={imageContentInputRef} onChange={handleContentImageUpload} className="hidden" accept="image/*" />

      <form action={handleSubmit} ref={formRef} className="space-y-8">
        {isEditing && <input type="hidden" name="postId" value={post.id} />}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <Label htmlFor="title" className="text-lg font-semibold">Título do Post</Label>
              <Input id="title" name="title" required defaultValue={post?.title} className="bg-gray-800 border-gray-700 h-12 text-lg mt-2" placeholder="Digite o título principal aqui..." />
            </div>
            <div>
              <Label className="text-lg font-semibold">Conteúdo</Label>
              <div className="mt-2 border border-gray-700 rounded-lg bg-gray-900">
                <EditorToolbar editor={editor} onImageUploadClick={() => imageContentInputRef.current?.click()} />
                <EditorContent editor={editor} />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
              <div className="bg-gray-900/50 p-4 rounded-lg space-y-4 border border-gray-800">
                   <h3 className="font-semibold text-lg">{isEditing ? 'Atualizar' : 'Publicar'}</h3>
                   <div className="grid grid-cols-3 gap-2">
                      <Button asChild variant="outline" className="col-span-1"><Link href="/gestor/blog">Cancelar</Link></Button>
                      <div className="col-span-2 flex justify-end gap-2">
                          <SubmitButton status={Status.DRAFT} isUploading={isUploading} />
                          <SubmitButton status={Status.PUBLISHED} isUploading={isUploading} />
                      </div>
                   </div>
              </div>
              
              <div className="space-y-4">
                <Label className="text-base font-semibold">Imagem de Destaque</Label>
                <div className="w-full aspect-video border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center relative overflow-hidden bg-gray-900">
                  {preview ? <Image src={preview} alt="Preview da Imagem de Destaque" fill className="object-cover" /> : <UploadCloud size={40} className="text-gray-600"/>}
                </div>
                <Input type="file" className="hidden" ref={fileInputRef} onChange={handleFeaturedImageChange} accept="image/*" />
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>Selecionar Imagem</Button>
                <div className="space-y-2"><Label htmlFor="featuredImageAlt">Descrição da Imagem (Alt Text)</Label><Input id="featuredImageAlt" name="featuredImageAlt" defaultValue={post?.featuredImageAlt || ''} className="bg-gray-800 border-gray-700" placeholder="Ex: Drone sobrevoando montanhas"/></div>
                <div className="space-y-2"><Label htmlFor="featuredImageSource">Fonte da Imagem</Label><Input id="featuredImageSource" name="featuredImageSource" defaultValue={post?.featuredImageSource || ''} className="bg-gray-800 border-gray-700" placeholder="Ex: M2 Projecta © 2025"/></div>
              </div>

              <div className="space-y-2 flex items-center justify-between p-4 rounded-lg border border-gray-700">
                  <div><Label htmlFor="isFeatured" className="font-bold">Post em Destaque</Label><p className="text-xs text-gray-400">Marcar como post principal do blog.</p></div>
                  <Switch id="isFeatured" name="isFeatured" defaultChecked={post?.isFeatured} />
              </div>

              <div>
                  <Label>Categorias</Label>
                  <Popover open={openCategories} onOpenChange={setOpenCategories}><PopoverTrigger asChild><Button variant="outline" role="combobox" aria-expanded={openCategories} className="w-full justify-between h-auto min-h-10"><div className="flex gap-1 flex-wrap">{selectedCategories.length > 0 ? selectedCategories.map(cat => (<Badge key={cat.id} variant="secondary" className="flex items-center gap-1">{cat.name}<button type="button" className="rounded-full hover:bg-red-500/20" onClick={(e) => { e.stopPropagation(); setSelectedCategories(selectedCategories.filter(s => s.id !== cat.id)); }}><X size={12} /></button></Badge>)) : "Selecione categorias..."}</div><ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /></Button></PopoverTrigger><PopoverContent className="w-[300px] p-0"><Command><CommandInput placeholder="Buscar ou criar categoria..." /><CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty><CommandGroup>{allCategories.map((category) => (<CommandItem key={category.id} value={category.name} onSelect={() => { const isSelected = selectedCategories.some(s => s.id === category.id); if (isSelected) { setSelectedCategories(selectedCategories.filter(s => s.id !== category.id)); } else { setSelectedCategories([...selectedCategories, category]); } }}>{category.name}</CommandItem>))}</CommandGroup></Command></PopoverContent></Popover>
              </div>
              
              <div>
                  <Label>Tags</Label>
                  <Popover open={openTags} onOpenChange={setOpenTags}><PopoverTrigger asChild><Button variant="outline" role="combobox" aria-expanded={openTags} className="w-full justify-between h-auto min-h-10"><div className="flex gap-1 flex-wrap">{selectedTags.length > 0 ? selectedTags.map(tag => (<Badge key={tag.id} variant="secondary" className="flex items-center gap-1">{tag.name}<button type="button" className="rounded-full hover:bg-red-500/20" onClick={(e) => { e.stopPropagation(); setSelectedTags(selectedTags.filter(s => s.id !== tag.id)); }}><X size={12} /></button></Badge>)) : "Selecione ou crie tags..."}</div><ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /></Button></PopoverTrigger><PopoverContent className="w-[300px] p-0"><Command><CommandInput placeholder="Buscar ou criar tag..." value={tagInput} onValueChange={setTagInput}/><CommandEmpty><Button variant="ghost" className="w-full justify-start" onClick={() => { const newTag = { id: tagInput, name: tagInput } as Tag; setSelectedTags([...selectedTags, newTag]); setTagInput(''); }}>Criar tag: &quot;{tagInput}&quot;</Button></CommandEmpty><CommandGroup>{allTags.map((tag) => (<CommandItem key={tag.id} value={tag.name} onSelect={() => { const isSelected = selectedTags.some(s => s.id === tag.id); if (!isSelected) { setSelectedTags([...selectedTags, tag]); } }}>{tag.name}</CommandItem>))}</CommandGroup></Command></PopoverContent></Popover>
              </div>

              <div className="space-y-4">
                  <h3 className="font-semibold text-lg border-t border-gray-700 pt-4">SEO</h3>
                  <div className="space-y-2"><Label htmlFor="seoTitle">Título para SEO</Label><Input id="seoTitle" name="seoTitle" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} defaultValue={post?.seoTitle || ''} className="bg-gray-800 border-gray-700"/></div>
                  <div className="space-y-2"><Label htmlFor="seoDescription">Descrição para SEO</Label><Textarea id="seoDescription" name="seoDescription" value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} defaultValue={post?.seoDescription || ''} className="bg-gray-800 border-gray-700" rows={3}/></div>
                  <SeoPreview title={seoTitle} description={seoDescription} />
              </div>
          </div>
        </div>
      </form>
    </>
  );
}