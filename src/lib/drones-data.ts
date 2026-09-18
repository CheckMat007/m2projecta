// src/lib/drones-data.ts

export type DroneSpec = { label: string; value: string };

export type DroneModel = {
  id: 'mini-2' | 'mini-4-pro';
  name: string;
  tagline: string;
  topImage: string;
  bottomImage: string;
  specs: DroneSpec[];
};

export const DRONES: DroneModel[] = [
  {
    id: 'mini-2',
    name: 'DJI Mini 2',
    tagline: 'Leve, ágil e confiável para captações rápidas.',
    topImage: '/assets/drones/dji-mini-2-top.webp',
    bottomImage: '/assets/drones/dji-mini-2-bottom.webp',
    specs: [
      { label: 'Peso', value: '249 g' },
      { label: 'Câmera', value: 'Sensor 1/2.3", fotos 12 MP' },
      { label: 'Vídeo', value: '4K a 30 fps (100 Mbps)' },
      { label: 'Estabilização', value: 'Gimbal mecânico de 3 eixos' },
      { label: 'Autonomia de voo', value: 'Até 31 minutos' },
      { label: 'Alcance de transmissão', value: 'Até 10 km (OcuSync 2.0)' },
      { label: 'Resistência ao vento', value: 'Nível 5 (até 38 km/h)' },
    ],
  },
  {
    id: 'mini-4-pro',
    name: 'DJI Mini 4 Pro',
    tagline: 'Sensor maior, mais alcance e detecção de obstáculos.',
    topImage: '/assets/drones/dji-mini-4-pro-top.png',
    bottomImage: '/assets/drones/dji-mini-4-pro-bottom.png',
    specs: [
      { label: 'Peso', value: '249 g' },
      { label: 'Câmera', value: 'Sensor 1/1.3", fotos até 48 MP' },
      { label: 'Vídeo', value: '4K/60fps HDR · 4K/100fps câmera lenta · 10-bit D-Log M' },
      { label: 'Detecção de obstáculos', value: 'Omnidirecional (frente, trás, cima, baixo e laterais)' },
      { label: 'Autonomia de voo', value: 'Até 34 minutos' },
      { label: 'Alcance de transmissão', value: 'Até 20 km (O4)' },
      { label: 'Resistência ao vento', value: 'Nível 5' },
    ],
  },
];
