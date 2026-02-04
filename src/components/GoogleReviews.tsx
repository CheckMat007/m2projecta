// src/components/GoogleReviews.tsx
import { prisma } from '@/lib/prisma';
import Image from 'next/image'; // <--- Import obrigatório

// Helper para renderizar as estrelas
function StarRating({ rating, size = "sm" }: { rating: number, size?: "sm" | "lg" }) {
  const iconSize = size === "lg" ? "w-6 h-6" : "w-4 h-4";
  
  return (
    <div className="flex text-yellow-500 gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={i < rating ? "currentColor" : "none"}
          stroke="currentColor"
          className={iconSize}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
          />
        </svg>
      ))}
    </div>
  );
}

export default async function GoogleReviews() {
  const reviews = await prisma.googleReview.findMany({
    orderBy: { rating: 'desc' },
    take: 5, 
  });

  if (reviews.length === 0) {
    return null;
  }

  const averageRating = (
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
  ).toFixed(1);

  return (
    <section className="py-20 bg-black relative border-t border-gray-900">
      <div className="container mx-auto px-6">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold uppercase text-white">
            O que dizem <span className="text-m2-green">Sobre Nós</span>
          </h2>
          <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
            A opinião de quem já confiou no nosso trabalho.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* CARD DE MÉDIA */}
          <div className="bg-m2-dark p-8 rounded-lg border-2 border-m2-green flex flex-col justify-center items-center text-center shadow-[0_0_20px_rgba(34,197,94,0.1)] transition-transform hover:-translate-y-2">
            <span className="text-gray-400 text-sm uppercase tracking-wider font-semibold mb-2">
              Nossa nota no Google
            </span>
            <div className="text-7xl font-black text-white mb-2">
              {averageRating}
            </div>
            <div className="mb-4">
              <StarRating rating={Math.round(Number(averageRating))} size="lg" />
            </div>
            <p className="text-gray-300 text-sm">
              Excelência comprovada pelos nossos clientes.
            </p>
          </div>

          {/* CARDS DE AVALIAÇÃO */}
          {reviews.map((review) => (
            <div 
              key={review.id} 
              className="group bg-m2-dark p-8 rounded-lg border border-gray-800 transition-all duration-300 hover:border-m2-green hover:-translate-y-2 flex flex-col justify-between h-full"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  {review.authorPhoto ? (
                    <Image 
                      src={review.authorPhoto} 
                      alt={review.authorName}
                      width={48}
                      height={48}
                      className="rounded-full object-cover border-2 border-gray-700 group-hover:border-m2-green transition-colors"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-m2-green font-bold text-xl border-2 border-gray-700">
                      {review.authorName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-white text-base leading-tight">
                      {review.authorName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={review.rating} />
                      <span className="text-xs text-gray-500">• {review.relativeTime}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-2 text-m2-green opacity-50 text-4xl leading-none font-serif">“</div>
                
                <p className="text-gray-300 text-sm leading-relaxed line-clamp-5 italic">
                  {review.text}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-800 flex items-center justify-between">
                 <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                    <Image 
                      src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" 
                      alt="Google"
                      width={16}
                      height={16}
                      className="transition-all" 
                      unoptimized
                    />
                    Google Reviews
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}