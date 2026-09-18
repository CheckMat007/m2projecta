// src/app/(main)/blog/actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { VoteType } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers'; // Importar a função de cookies do Next.js
import { randomUUID } from 'crypto'; // Para gerar IDs anônimos e seguros

// Busca só o voto do visitante atual (sessão ou cookie anônimo) para uma notícia —
// usado pelo PostInteraction no cliente após montar, já que a página do post em si
// agora é estática/ISR e não pode embutir dado pessoal do visitante no HTML.
export async function getUserVoteForPostAction(postId: string): Promise<VoteType | null> {
  const session = await getServerSession(authOptions);
  const cookieStore = cookies();

  const userId = session?.user?.id;
  const voterId = cookieStore.get('voter_id')?.value;

  if (!userId && !voterId) return null;

  const vote = await prisma.postVote.findFirst({
    where: { postId, ...(userId ? { userId } : { voterId }) },
    select: { type: true },
  });

  return vote?.type ?? null;
}

export async function voteOnPostAction({ postId, voteType, slug }: { postId: string, voteType: VoteType, slug: string }) {
  const session = await getServerSession(authOptions);
  const cookieStore = cookies();
  
  const userId = session?.user?.id;
  let voterId = cookieStore.get('voter_id')?.value;

  // Se o usuário não está logado E não tem um cookie, nós criamos um para ele.
  if (!userId && !voterId) {
    voterId = randomUUID(); // Gera um ID único
    cookieStore.set('voter_id', voterId, {
      httpOnly: true, // O cookie não pode ser acessado por JavaScript no navegador (mais seguro)
      maxAge: 60 * 60 * 24 * 365, // Expira em 1 ano
      path: '/',
      sameSite: 'lax',
    });
  }

  // A cláusula de busca agora prioriza o userId se o usuário estiver logado,
  // caso contrário, usa o voterId do cookie.
  const findClause = {
    postId,
    ...(userId ? { userId } : { voterId: voterId! }), // '!' para garantir ao TS que voterId não será nulo aqui
  };

  try {
    const existingVote = await prisma.postVote.findFirst({
      where: findClause,
    });

    if (existingVote) {
      // Se o usuário está clicando no mesmo botão de novo (ex: clicar em 'like' quando já deu 'like')
      if (existingVote.type === voteType) {
        // Remove o voto
        await prisma.postVote.delete({ where: { id: existingVote.id } });
      } else {
        // Se o usuário está mudando o voto (ex: de 'like' para 'dislike')
        await prisma.postVote.update({
          where: { id: existingVote.id },
          data: { type: voteType },
        });
      }
    } else {
      // Se não existe voto, cria um novo, associando ao userId ou ao voterId
      await prisma.postVote.create({
        data: {
          postId,
          type: voteType,
          userId: userId,     // Será null se o usuário for anônimo
          voterId: userId ? null : voterId, // Só terá valor se o usuário for anônimo
        },
      });
    }

    // Revalida o cache da página do post para que a contagem seja atualizada para todos.
    // Precisa ser o slug (a URL real da página) — revalidatePath com o id não invalida nada.
    revalidatePath(`/blog/${slug}`);
    return { success: true };
    
  } catch (error) {
    console.error("Erro ao processar voto:", error);
    return { success: false, message: "Ocorreu um erro no servidor ao processar seu voto." };
  }
}