// src/app/api/upload/route.ts

import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { randomUUID } from 'crypto';

// Extensões aceitas em todo o painel (capa/galeria de portfólio, imagem de blog/serviço,
// foto de perfil, PDF de contrato/proposta). Qualquer outra extensão é rejeitada — em
// especial .svg e .html, que podem carregar script executável quando abertos diretamente
// pela URL pública do Blob.
const ALLOWED_EXTENSIONS: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25MB (cobre PDFs de contrato com imagens)

export async function POST(request: Request): Promise<NextResponse> {
  // Esta rota é genérica (capa de portfólio, PDF de contrato, imagem de serviço etc.) e só
  // é usada por formulários dentro de /gestor — sem isso, qualquer pessoa na internet,
  // sem login, conseguia subir (e sobrescrever) arquivos no Blob público do site.
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role === 'CLIENT') {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  // Esta rota é compartilhada por várias features (portfólio, blog, site, contratos, perfil),
  // cada uma com sua própria permissão granular verificada na Server Action que persiste os
  // dados. Aqui, sem saber qual feature está chamando, só validamos que o usuário é MASTER ou
  // já recebeu pelo menos uma permissão de administração — um EDITOR recém-criado sem nenhuma
  // permissão atribuída não pode usar o site como host de arquivo público arbitrário.
  if (session.user.role !== 'MASTER') {
    const permissionCount = await prisma.user.count({
      where: { id: session.user.id, permissions: { some: {} } },
    });
    if (permissionCount === 0) {
      return NextResponse.json({ message: 'Não autorizado.' }, { status: 403 });
    }
  }

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename || !request.body) {
    return NextResponse.json({ message: 'Nenhum arquivo encontrado.' }, { status: 400 });
  }

  const extension = filename.split('.').pop()?.toLowerCase();
  const mimeType = extension ? ALLOWED_EXTENSIONS[extension] : undefined;
  if (!extension || !mimeType) {
    return NextResponse.json({ message: 'Tipo de arquivo não permitido.' }, { status: 400 });
  }

  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > 0 && contentLength > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json({ message: 'Arquivo excede o tamanho máximo permitido (25MB).' }, { status: 413 });
  }

  // Nome único por upload: evita que dois uploads com o mesmo nome de arquivo original
  // colidam/sobrescrevam um ao outro no Blob.
  const uniqueFilename = `${randomUUID()}.${extension}`;

  // Envia o arquivo para o Vercel Blob
  const blob = await put(uniqueFilename, request.body, {
    access: 'public',
    contentType: mimeType,
  });

  // Retorna a URL pública do arquivo
  return NextResponse.json(blob);
}