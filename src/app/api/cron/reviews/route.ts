import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; 

// 1. Criamos a tipagem do objeto que o Google retorna
interface GooglePlaceReview {
  author_name: string;
  profile_photo_url: string;
  rating: number;
  text: string;
  relative_time_description: string;
  time: number;
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return NextResponse.json({ error: 'Credenciais não configuradas' }, { status: 500 });
  }

  try {
    const googleUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating,user_ratings_total&key=${apiKey}&language=pt-BR`;
    
    const response = await fetch(googleUrl);
    const data = await response.json();

    if (data.status !== 'OK' || !data.result) {
      throw new Error(`Erro na API do Google: ${data.status} - ${data.error_message || 'Sem mensagem'}`);
    }

    const reviews = data.result.reviews || [];

    await prisma.$transaction(async (tx) => {
      await tx.googleReview.deleteMany(); 

      if (reviews.length > 0) {
        await tx.googleReview.createMany({
          // 2. Aplicamos a interface aqui para remover o erro do 'any'
          data: reviews.map((review: GooglePlaceReview) => ({
            authorName: review.author_name,
            authorPhoto: review.profile_photo_url,
            rating: review.rating,
            text: review.text,
            relativeTime: review.relative_time_description,
            googleId: review.time ? String(review.time) : undefined,
          })),
        });
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: `${reviews.length} avaliações sincronizadas com sucesso.`,
      updatedAt: new Date().toISOString()
    });

  } catch (error: unknown) { // 3. Mudamos de 'any' para 'unknown'
    console.error('Falha no Cron de Reviews:', error);
    
    // Verificamos se é um erro real para extrair a mensagem com segurança
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}