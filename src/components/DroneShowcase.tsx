// src/components/DroneShowcase.tsx
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Settings } from 'lucide-react';
import { DRONES, type DroneModel } from '@/lib/drones-data';

const DroneViewer3D = dynamic(() => import('./DroneViewer3D'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[320px] flex items-center justify-center">
      <div className="w-14 h-14 rounded-full border-2 border-gray-700 border-t-m2-green animate-spin" aria-hidden="true" />
    </div>
  ),
});

export function DroneShowcase() {
  const [selectedId, setSelectedId] = useState<DroneModel['id']>(DRONES[0].id);
  const drone = DRONES.find((d) => d.id === selectedId) ?? DRONES[0];

  return (
    <div className="container mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold uppercase text-white">
          Nosso <span className="text-m2-green">Equipamento</span>
        </h2>
        <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
          Tecnologia de ponta para capturar cada projeto com precisão e qualidade cinematográfica.
        </p>
      </div>

      <div className="flex justify-center gap-4 mb-10" role="tablist" aria-label="Selecionar modelo de drone">
        {DRONES.map((d) => (
          <button
            key={d.id}
            type="button"
            role="tab"
            aria-selected={d.id === selectedId}
            onClick={() => setSelectedId(d.id)}
            className={`px-6 py-3 rounded-lg font-bold border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-m2-green ${
              d.id === selectedId
                ? 'bg-m2-green text-black border-m2-green'
                : 'bg-black text-white border-gray-800 hover:border-m2-green'
            }`}
          >
            {d.name}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-center bg-black/60 rounded-2xl border border-gray-800 p-6 md:p-10">
        <div className="w-full h-[320px] md:h-[420px]">
          <DroneViewer3D key={drone.id} topImage={drone.topImage} bottomImage={drone.bottomImage} label={drone.name} />
        </div>

        <div>
          <h3 className="text-2xl font-bold text-white">{drone.name}</h3>
          <p className="text-gray-400 mt-2">{drone.tagline}</p>

          <ul className="mt-6 space-y-3">
            {drone.specs.map((spec) => (
              <li key={spec.label} className="flex items-start gap-3 border-b border-gray-800 pb-3">
                <Settings className="w-5 h-5 text-m2-green mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <span className="text-white font-semibold">{spec.label}: </span>
                  <span className="text-gray-400">{spec.value}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
