// src/lib/tiptap/custom-image.ts
import { Image } from '@tiptap/extension-image';
import { mergeAttributes } from '@tiptap/core';

export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      source: { default: null },
    };
  },

  parseHTML() {
    return [ { tag: 'figure', contentElement: 'figcaption' } ];
  },

  renderHTML({ HTMLAttributes }) {
    // A CORREÇÃO: Desestruturamos 'source' e 'alt' para usá-los diretamente
    const { source, alt, ...imgAttributes } = HTMLAttributes;

    return [
      'figure',
      { class: 'w-full my-4' },
      [ 'img', mergeAttributes(imgAttributes, { class: 'w-full rounded-lg', alt }) ],
      // A legenda só é renderizada se tiver algum conteúdo
      (source || alt) ?
      [
        'figcaption',
        { class: 'text-center text-sm text-gray-500 mt-2' },
        // E agora usamos as variáveis 'source' e 'alt'
        `Fonte: ${source || 'Não especificada'} | ${alt || ''}`
      ] : '',
    ];
  },
});