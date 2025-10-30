// src/components/CookieConsentBanner.tsx
'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Chave do cookie e tipo para as preferências
const COOKIE_PREFERENCES_KEY = 'cookie_preferences';
type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

export function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado para as preferências dentro do modal
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Essenciais são sempre ativos
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = Cookies.get(COOKIE_PREFERENCES_KEY);
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleSavePreferences = () => {
    // Salva as preferências como um objeto JSON no cookie
    Cookies.set(COOKIE_PREFERENCES_KEY, JSON.stringify(preferences), { expires: 365, path: '/' });
    setShowBanner(false);
    setIsModalOpen(false);
  };

  const handleAcceptAll = () => {
    const allEnabled: CookiePreferences = { necessary: true, analytics: true, marketing: true };
    setPreferences(allEnabled);
    Cookies.set(COOKIE_PREFERENCES_KEY, JSON.stringify(allEnabled), { expires: 365, path: '/' });
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const onlyNecessary: CookiePreferences = { necessary: true, analytics: false, marketing: false };
    setPreferences(onlyNecessary);
    Cookies.set(COOKIE_PREFERENCES_KEY, JSON.stringify(onlyNecessary), { expires: 365, path: '/' });
    setShowBanner(false);
  };

  const handlePreferenceChange = (key: keyof Omit<CookiePreferences, 'necessary'>, value: boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  if (!showBanner) {
    return null;
  }

  return (
    <>
      {/* O Banner que fica fixo no rodapé */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm border-t border-gray-800 p-4 z-50">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-300">
            Nós utilizamos cookies para melhorar sua experiência. Ao continuar, você concorda com a nossa{' '}
            <Link href="/politica-de-privacidade" className="underline hover:text-white">
              Política de Privacidade
            </Link>.
          </p>
          <div className="flex gap-2 flex-shrink-0">
            <Button variant="outline" onClick={() => setIsModalOpen(true)}>
              Preferências
            </Button>
            <Button 
              onClick={handleAcceptAll}
              className="bg-m2-green text-black hover:bg-m2-green/80"
            >
              Aceitar Todos
            </Button>
          </div>
        </div>
      </div>

      {/* O Modal de Preferências */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Preferências de Cookies</DialogTitle>
            <DialogDescription>
              Gerencie suas preferências de cookies. Você pode alterar essas configurações a qualquer momento.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-700 bg-gray-900/50">
              <div>
                <Label htmlFor="necessary-cookies" className="font-bold">Cookies Necessários</Label>
                <p className="text-sm text-gray-400">Esses cookies são essenciais para o funcionamento do site e não podem ser desativados.</p>
              </div>
              <Switch id="necessary-cookies" checked={true} disabled />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-700">
              <div>
                <Label htmlFor="analytics-cookies" className="font-bold">Cookies de Análise</Label>
                <p className="text-sm text-gray-400">Nos ajudam a entender como os visitantes interagem com o site, coletando informações anonimamente.</p>
              </div>
              <Switch 
                id="analytics-cookies" 
                checked={preferences.analytics} 
                onCheckedChange={(value) => handlePreferenceChange('analytics', value)}
              />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-gray-700">
              <div>
                <Label htmlFor="marketing-cookies" className="font-bold">Cookies de Marketing</Label>
                <p className="text-sm text-gray-400">São usados para rastrear visitantes e exibir anúncios relevantes.</p>
              </div>
              <Switch 
                id="marketing-cookies"
                checked={preferences.marketing}
                onCheckedChange={(value) => handlePreferenceChange('marketing', value)}
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleRejectAll} className="w-full sm:w-auto">
              Rejeitar Todos
            </Button>
            <Button onClick={handleSavePreferences} className="w-full sm:w-auto">
              Salvar Preferências
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}