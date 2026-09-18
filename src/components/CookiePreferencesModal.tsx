// src/components/CookiePreferencesModal.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

interface CookiePreferencesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preferences: CookiePreferences;
  onPreferenceChange: (key: keyof Omit<CookiePreferences, 'necessary'>, value: boolean) => void;
  onRejectAll: () => void;
  onSave: () => void;
}

export default function CookiePreferencesModal({
  open,
  onOpenChange,
  preferences,
  onPreferenceChange,
  onRejectAll,
  onSave,
}: CookiePreferencesModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              onCheckedChange={(value) => onPreferenceChange('analytics', value)}
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
              onCheckedChange={(value) => onPreferenceChange('marketing', value)}
            />
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onRejectAll} className="w-full sm:w-auto">
            Rejeitar Todos
          </Button>
          <Button onClick={onSave} className="w-full sm:w-auto">
            Salvar Preferências
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
