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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { 
  Loader2, Bold, Italic, Strikethrough, List, ListOrdered, UploadCloud, X, 
  ChevronsUpDown, Image as ImageIcon, Link as LinkIcon, AlignLeft, AlignCenter, 
  AlignRight, AlignJustify, Quote, Underline, Highlighter, Save, Globe,
  ArrowLeft,
  type LucideIcon // <--- ADICIONADO: Importação do tipo para os ícones
} from 'lucide-react';
import { createPostAction, updatePostAction } from '../actions';
import { useEditor } from '@/hooks/use-editor';
import { Status, Post, Category, Tag } from '@prisma/client';
import { SeoPreview } from './SeoPreview';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Editor } from '@tiptap/react';


// --- TIPOS ---
type PostWithRelations = Post & { categories: Category[], tags: Tag[] };
interface PostFormProps {
  post?: PostWithRelations;
  allCategories: Category[];
  allTags: Tag[];
}

// --- SUBCOMPONENTES ---

// Toolbar do Editor Refatorada
const EditorToolbar = ({ editor, onImageUploadClick }: { editor: Editor | null, onImageUploadClick: () => void }) => {
  const setLink = useCallback(() => {
    if (!editor) return;
    const event = new CustomEvent('open-link-modal');
    window.dispatchEvent(event);
  }, [editor]);

  if (!editor) return null;

  const ToolbarButton = ({ 
    isActive, 
    onClick, 
    icon: Icon, 
    title 
  }: { 
    isActive?: boolean, 
    onClick: () => void, 
    icon: LucideIcon, // <--- CORRIGIDO: Tipo específico em vez de any
    title: string 
  }) => (
    <Button
      variant={isActive ? "secondary" : "ghost"}
      size="icon"
      type="button"
      onClick={onClick}
      className={`h-8 w-8 ${isActive ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
      title={title}
    >
      <Icon size={16} />
      <span className="sr-only">{title}</span>
    </Button>
  );

  return (
    <div className="border-b border-border bg-muted/30 p-2 flex items-center gap-1 flex-wrap sticky top-0 z-10 rounded-t-lg">
      <div className="flex items-center gap-1">
        <ToolbarButton isActive={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} icon={Bold} title="Negrito" />
        <ToolbarButton isActive={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} icon={Italic} title="Itálico" />
        <ToolbarButton isActive={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} icon={Underline} title="Sublinhado" />
        <ToolbarButton isActive={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} icon={Strikethrough} title="Riscado" />
        <ToolbarButton isActive={editor.isActive('highlight')} onClick={() => editor.chain().focus().toggleHighlight().run()} icon={Highlighter} title="Marca-texto" />
      </div>
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <div className="flex items-center gap-1">
        <ToolbarButton isActive={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()} icon={AlignLeft} title="Esquerda" />
        <ToolbarButton isActive={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()} icon={AlignCenter} title="Centro" />
        <ToolbarButton isActive={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()} icon={AlignRight} title="Direita" />
        <ToolbarButton isActive={editor.isActive({ textAlign: 'justify' })} onClick={() => editor.chain().focus().setTextAlign('justify').run()} icon={AlignJustify} title="Justificar" />
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <div className="flex items-center gap-1">
        <ToolbarButton isActive={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} icon={List} title="Lista" />
        <ToolbarButton isActive={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} icon={ListOrdered} title="Lista Numerada" />
        <ToolbarButton isActive={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} icon={Quote} title="Citação" />
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <div className="flex items-center gap-1">
        <ToolbarButton isActive={editor.isActive('link')} onClick={setLink} icon={LinkIcon} title="Link" />
        <ToolbarButton isActive={false} onClick={onImageUploadClick} icon={ImageIcon} title="Inserir Imagem" />
      </div>
    </div>
  );
};

// Botões de Submit
const SubmitButton = ({ status, isUploading, label, icon: Icon }: { status: Status, isUploading: boolean, label: string, icon: LucideIcon }) => { // <--- CORRIGIDO: Tipo LucideIcon
    const { pending, data } = useFormStatus();
    // Verifica se está carregando especificamente para este status
    const isLoading = isUploading || (pending && data?.get('status') === status);
    
    return (
        <Button 
          type="submit" 
          name="status" 
          value={status} 
          disabled={isUploading || pending} 
          variant={status === 'PUBLISHED' ? 'default' : 'secondary'}
          className={status === 'PUBLISHED' ? "bg-m2-green text-black hover:bg-m2-green/90 min-w-[120px]" : "min-w-[120px]"}
        >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Icon className="mr-2 h-4 w-4" />}
            {label}
        </Button>
    );
};

// --- MODAIS ---
function ImageMetadataModal({ open, onOpenChange, onSave }: { open: boolean, onOpenChange: (open: boolean) => void, onSave: (metadata: { alt: string, source: string }) => void }) {
    const [alt, setAlt] = useState('');
    const [source, setSource] = useState('');
    const handleSave = () => { onSave({ alt, source }); setAlt(''); setSource(''); };
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Atributos da Imagem</DialogTitle>
                    <DialogDescription>Melhore a acessibilidade e SEO da sua imagem.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="img-alt">Texto Alternativo (Alt)</Label>
                        <Input id="img-alt" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Descreva a imagem para leitores de tela..." />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="img-source">Fonte / Créditos</Label>
                        <Input id="img-source" value={source} onChange={(e) => setSource(e.target.value)} placeholder="Ex: Divulgação / M2 Projecta" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button onClick={handleSave} className="bg-m2-green text-black hover:bg-m2-green/90">Inserir Imagem</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

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
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader><DialogTitle>Gerenciar Link</DialogTitle></DialogHeader>
                <div className="py-4">
                    <Label htmlFor="link-url">URL de destino</Label>
                    <Input id="link-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className="mt-2" />
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => { editor?.chain().focus().unsetLink().run(); onOpenChange(false); }} className="text-destructive hover:text-destructive">Remover Link</Button>
                    <Button onClick={handleSave}>Salvar Link</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// --- COMPONENTE PRINCIPAL ---
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
  
  // Imagens
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(post?.featuredImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageContentInputRef = useRef<HTMLInputElement>(null);
  
  // SEO & Upload
  const [seoTitle, setSeoTitle] = useState(post?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(post?.seoDescription || '');
  const [isUploading, setIsUploading] = useState(false);
  
  // Modais Auxiliares
  const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false);
  const [pendingImageUrl, setPendingImageUrl] = useState<string | null>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  
  // Listeners
  useEffect(() => {
    const openModal = () => setIsLinkModalOpen(true);
    window.addEventListener('open-link-modal', openModal);
    return () => window.removeEventListener('open-link-modal', openModal);
  }, []);

  // Handlers
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
      if (!uploadResponse.ok) throw new Error("Falha no upload");
      const newBlob = await uploadResponse.json();
      setPendingImageUrl(newBlob.url);
      setIsMetadataModalOpen(true);
      toast.dismiss(uploadToast);
    } catch { // <--- CORRIGIDO: Removida a variável 'error' que não estava sendo usada
      toast.error("Erro ao enviar imagem.");
      toast.dismiss(uploadToast);
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
        if (!uploadResponse.ok) throw new Error("Falha no upload da imagem destaque");
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
      loading: 'Processando requisição...',
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

      <form action={handleSubmit} ref={formRef} className="space-y-6 pb-20">
        {isEditing && <input type="hidden" name="postId" value={post.id} />}

        {/* --- HEADER DE AÇÕES STICKY (Melhoria de UX) --- */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 bg-background/95 backdrop-blur z-20 py-4 border-b border-border">
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" asChild>
                <Link href="/gestor/blog"><ArrowLeft className="h-5 w-5" /></Link>
             </Button>
             <div>
                <h1 className="text-2xl font-bold tracking-tight">{isEditing ? 'Editar Post' : 'Novo Post'}</h1>
                <p className="text-sm text-muted-foreground hidden sm:block">Preencha os dados abaixo para publicar.</p>
             </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
             <Button asChild variant="ghost" className="hidden sm:flex">
                <Link href="/gestor/blog">Cancelar</Link>
             </Button>
             <SubmitButton status={Status.DRAFT} isUploading={isUploading} label="Salvar Rascunho" icon={Save} />
             <SubmitButton status={Status.PUBLISHED} isUploading={isUploading} label="Publicar" icon={Globe} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- COLUNA PRINCIPAL (ESQUERDA) --- */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-lg font-semibold">Título Principal</Label>
              <Input 
                id="title" 
                name="title" 
                required 
                defaultValue={post?.title} 
                className="text-lg py-6 font-medium" 
                placeholder="Ex: Como otimizar seus processos em 2025" 
              />
            </div>

            {/* Editor */}
            <Card className="border-border overflow-hidden">
                <EditorToolbar editor={editor} onImageUploadClick={() => imageContentInputRef.current?.click()} />
                <div className="min-h-[500px] p-4 bg-background">
                    <EditorContent editor={editor} />
                </div>
            </Card>

            {/* SEO */}
            <Card>
                <CardHeader>
                    <CardTitle>Otimização para Buscadores (SEO)</CardTitle>
                    <CardDescription>Visualize como este post aparecerá no Google.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="seoTitle">Título SEO</Label>
                        <Input id="seoTitle" name="seoTitle" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="Título otimizado..." />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="seoDescription">Meta Descrição</Label>
                        <Textarea id="seoDescription" name="seoDescription" value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={3} placeholder="Breve resumo do conteúdo..." />
                    </div>
                    <div className="pt-4 border-t border-border">
                        <Label className="mb-2 block text-muted-foreground">Prévia do resultado:</Label>
                        <SeoPreview title={seoTitle} description={seoDescription} />
                    </div>
                </CardContent>
            </Card>
          </div>

          {/* --- SIDEBAR (DIREITA) --- */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Status e Destaque */}
            <Card>
                <CardHeader><CardTitle className="text-base">Publicação</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                      <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="isFeatured" className="flex flex-col space-y-1 cursor-pointer">
                            <span>Post em Destaque</span>
                            <span className="font-normal text-xs text-muted-foreground">Exibir no topo do blog?</span>
                        </Label>
                        <Switch id="isFeatured" name="isFeatured" defaultChecked={post?.isFeatured} />
                    </div>
                </CardContent>
            </Card>

            {/* Imagem de Destaque */}
            <Card>
                <CardHeader><CardTitle className="text-base">Imagem de Destaque</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                      <div 
                        className="w-full aspect-video border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center relative overflow-hidden bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {preview ? (
                             <Image src={preview} alt="Preview" fill className="object-cover" />
                        ) : (
                             <div className="text-center p-4">
                                <UploadCloud className="mx-auto h-8 w-8 text-muted-foreground mb-2"/>
                                <span className="text-sm text-muted-foreground font-medium">Clique para carregar</span>
                             </div>
                        )}
                      </div>
                      <Input type="file" className="hidden" ref={fileInputRef} onChange={handleFeaturedImageChange} accept="image/*" />
                      
                      <div className="space-y-3 pt-2">
                          <div className="space-y-1">
                             <Label htmlFor="featuredImageAlt" className="text-xs">Texto Alternativo</Label>
                             <Input id="featuredImageAlt" name="featuredImageAlt" defaultValue={post?.featuredImageAlt || ''} className="h-8 text-sm"/>
                          </div>
                          <div className="space-y-1">
                             <Label htmlFor="featuredImageSource" className="text-xs">Fonte da Imagem</Label>
                             <Input id="featuredImageSource" name="featuredImageSource" defaultValue={post?.featuredImageSource || ''} className="h-8 text-sm"/>
                          </div>
                      </div>
                </CardContent>
            </Card>

            {/* Categorias */}
            <Card>
                <CardHeader><CardTitle className="text-base">Categorias</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    <Popover open={openCategories} onOpenChange={setOpenCategories}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" role="combobox" className="w-full justify-between">
                                Selecionar categorias...
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0" align="start">
                            <Command>
                                <CommandInput placeholder="Buscar categoria..." />
                                <CommandList>
                                    <CommandEmpty>Nenhuma categoria.</CommandEmpty>
                                    <CommandGroup>
                                        {allCategories.map((category) => (
                                            <CommandItem
                                                key={category.id}
                                                value={category.name}
                                                onSelect={() => {
                                                    const isSelected = selectedCategories.some(s => s.id === category.id);
                                                    setSelectedCategories(isSelected 
                                                        ? selectedCategories.filter(s => s.id !== category.id)
                                                        : [...selectedCategories, category]
                                                    );
                                                }}
                                            >
                                                <div className={`mr-2 flex h-4 w-4 items-center justify-center rounded-sm border ${selectedCategories.some(s => s.id === category.id) ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"}`}>
                                                    <X className="h-3 w-3" /> 
                                                </div>
                                                {category.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <div className="flex flex-wrap gap-2 min-h-[2rem]">
                        {selectedCategories.map(cat => (
                            <Badge key={cat.id} variant="secondary" className="hover:bg-destructive/10">
                                {cat.name}
                                <X 
                                    className="ml-1 h-3 w-3 cursor-pointer text-muted-foreground hover:text-destructive" 
                                    onClick={() => setSelectedCategories(selectedCategories.filter(s => s.id !== cat.id))}
                                />
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Tags */}
            <Card>
                <CardHeader><CardTitle className="text-base">Tags</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    <Popover open={openTags} onOpenChange={setOpenTags}>
                        <PopoverTrigger asChild>
                            <Button variant="outline" role="combobox" className="w-full justify-between">
                                Adicionar tags...
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0" align="start">
                            <Command>
                                <CommandInput placeholder="Buscar ou criar tag..." value={tagInput} onValueChange={setTagInput}/>
                                <CommandList>
                                    <CommandEmpty className="py-2 px-2">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="w-full justify-start text-xs" 
                                            onClick={() => {
                                                if(!tagInput) return;
                                                const newTag = { id: `new-${Date.now()}`, name: tagInput } as Tag;
                                                setSelectedTags([...selectedTags, newTag]);
                                                setTagInput('');
                                                setOpenTags(false);
                                            }}
                                        >
                                            <span className="truncate">Criar tag: &quot;{tagInput}&quot;</span>
                                        </Button>
                                    </CommandEmpty>
                                    <CommandGroup>
                                        {allTags.map((tag) => (
                                            <CommandItem
                                                key={tag.id}
                                                value={tag.name}
                                                onSelect={() => {
                                                    if (!selectedTags.some(s => s.id === tag.id)) {
                                                        setSelectedTags([...selectedTags, tag]);
                                                    }
                                                    setOpenTags(false);
                                                }}
                                            >
                                                {tag.name}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    <div className="flex flex-wrap gap-2 min-h-[2rem]">
                        {selectedTags.map(tag => (
                            <Badge key={tag.id} variant="outline" className="border-dashed">
                                # {tag.name}
                                <X 
                                    className="ml-1 h-3 w-3 cursor-pointer hover:text-destructive" 
                                    onClick={() => setSelectedTags(selectedTags.filter(s => s.id !== tag.id))}
                                />
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>

          </div>
        </div>
      </form>
    </>
  );
}