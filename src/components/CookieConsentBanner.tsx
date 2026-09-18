// src/components/CookieConsentBanner.tsx
'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';

// O modal "Preferências" (Radix Dialog + Switch) raramente é aberto — a maioria dos
// visitantes só vê o banner e clica "Aceitar Todos". Carregado sob demanda em vez de
// ir no bundle de toda página pública só por causa deste banner.
const CookiePreferencesModal = dynamic(() => import('@/components/CookiePreferencesModal'), {
  ssr: false,
});

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

      {/* O Modal de Preferências só é importado/montado quando o visitante clica em "Preferências" */}
      {isModalOpen && (
        <CookiePreferencesModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          preferences={preferences}
          onPreferenceChange={handlePreferenceChange}
          onRejectAll={handleRejectAll}
          onSave={handleSavePreferences}
        />
      )}
    </>
  );
}