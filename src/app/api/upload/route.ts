// src/app/api/upload/route.ts

import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
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