// src/app/gestor/(admin)/blog/_components/SeoPreview.tsx
'use client';

interface SeoPreviewProps {
  title: string;
  description: string;
}

export function SeoPreview({ title, description }: SeoPreviewProps) {
  const siteUrl = "www.m2projecta.com.br/blog/...";
  const defaultTitle = "Título do seu post aparecerá aqui";
  const defaultDescription = "Esta é a descrição que aparecerá no Google. Tente mantê-la concisa e atrativa, com até 160 caracteres.";

  return (
    <div className="p-4 border border-gray-700 rounded-lg bg-gray-900/50">
      <h4 className="text-sm font-semibold mb-2">Pré-visualização do Google</h4>
      <div className="font-sans">
        <p className="text-blue-400 text-lg truncate hover:underline cursor-pointer">
          {title || defaultTitle}
        </p>
        <p className="text-green-400 text-sm">{siteUrl}</p>
        <p className="text-gray-400 text-sm mt-1 line-clamp-2">
          {description || defaultDescription}
        </p>
      </div>
    </div>
  );
}