// src/app/gestor/(admin)/portfolio/_components/FeaturedSwitch.tsx
'use client';

import { useState } from 'react';
import { Switch } from "@/components/ui/switch";
import { toast } from 'sonner';
import { toggleFeaturedStatus } from '../actions';

type FeaturedSwitchProps = {
  item: { id: string; isFeatured: boolean };
  featuredCount: number;
  maxFeatured: number;
};

export function FeaturedSwitch({ item, featuredCount, maxFeatured }: FeaturedSwitchProps) {
  const [isFeatured, setIsFeatured] = useState(item.isFeatured);
  const [isLoading, setIsLoading] = useState(false);

  // Verifica se o switch deve ser desabilitado
  // Desabilita se o limite foi atingido E este item não for um dos que já está destacado
  const isDisabled = featuredCount >= maxFeatured && !isFeatured;

  const handleToggle = async (newStatus: boolean) => {
    setIsLoading(true);
    
    const result = await toggleFeaturedStatus(item.id, newStatus);
    
    if (result.success) {
      toast.success(result.message);
      setIsFeatured(newStatus); // Sincroniza o estado visual
    } else {
      toast.error(result.message);
      // Não reverte o switch visual, pois a ação falhou
    }
    setIsLoading(false);
  };

  return (
    <Switch
      checked={isFeatured}
      onCheckedChange={handleToggle}
      disabled={isLoading || isDisabled}
      aria-label="Destacar na página inicial"
    />
  );
}