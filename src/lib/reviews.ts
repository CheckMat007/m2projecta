// src/lib/reviews.ts
import { cache } from 'react';
import { prisma } from '@/lib/prisma';

// `cache()` garante que o layout público (JSON-LD) e o componente GoogleReviews
// (card "Nossa nota") compartilhem uma única consulta de agregação por requisição,
// em vez de duas, e que ambos exibam exatamente a mesma nota média.
export const getGoogleReviewStats = cache(async () => {
  return prisma.googleReview.aggregate({
    _avg: { rating: true },
    _count: { rating: true },
  });
});
