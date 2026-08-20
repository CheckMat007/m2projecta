// src/app/api/upload/route.ts

import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request): Promise<NextResponse> {
  // Esta rota é genérica (capa de portfólio, PDF de contrato, imagem de serviço etc.) e só
  // é usada por formulários dentro de /gestor — sem isso, qualquer pessoa na internet,
  // sem login, conseguia subir (e sobrescrever) arquivos no Blob público do site.
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role === 'CLIENT') {
    return NextResponse.json({ message: 'Não autorizado.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename || !request.body) {
    return NextResponse.json({ message: 'Nenhum arquivo encontrado.' }, { status: 400 });
  }

  // Envia o arquivo para o Vercel Blob
  const blob = await put(filename, request.body, {
    access: 'public',
    allowOverwrite: true, // Adicione esta linha
  });

  // Retorna a URL pública do arquivo
  return NextResponse.json(blob);
}