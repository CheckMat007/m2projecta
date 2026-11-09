'use client';

import { useState } from 'react';

type LazyYouTubeEmbedProps = {
  videoid: string;
  params?: string;
};

export function LazyYouTubeEmbed({ videoid, params = '' }: LazyYouTubeEmbedProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const query = params ? `${params}&autoplay=1` : 'autoplay=1';

  if (isLoaded) {
    return (
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube.com/embed/${videoid}?${query}`}
        title="Vídeo do YouTube"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      className="group absolute inset-0 h-full w-full bg-cover bg-center"
      style={{ backgroundImage: `url(https://i.ytimg.com/vi/${videoid}/hqdefault.jpg)` }}
      onClick={() => setIsLoaded(true)}
      aria-label="Reproduzir vídeo do YouTube"
    >
      <span className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/35" />
      <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition-transform group-hover:scale-110">
        <span className="ml-1 text-2xl" aria-hidden="true">▶</span>
      </span>
    </button>
  );
}
