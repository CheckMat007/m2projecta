// src/lib/icons.tsx
import { Building, Building2, Trees, Clapperboard, PartyPopper, Hotel, LucideProps } from 'lucide-react';
import React from 'react';

export const iconMap: { [key: string]: React.ElementType<LucideProps> } = {
  Building: Building,
  Building2: Building2,
  Hotel: Hotel,
  Clapperboard: Clapperboard,
  PartyPopper: PartyPopper,
  Trees: Trees,
};