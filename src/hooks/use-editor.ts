// src/hooks/use-editor.ts
'use client';

import { useEditor as useTiptapEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import { CustomImage } from '@/lib/tiptap/custom-image';

export const useEditor = ({ content }: { content?: string }) => {
  const editor = useTiptapEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      CustomImage.configure({
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        // Habilita a opção 'justify'
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      // Adiciona as novas extensões
      Underline,
      Highlight,
      Superscript,
      Subscript,
    ],
    immediatelyRender: false, 
    content: content || '',
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-lg max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
  });

  return { editor, EditorContent };
};