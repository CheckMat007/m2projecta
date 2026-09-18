// src/app/providers.tsx
'use client';

import { ThemeProvider } from 'next-themes';

// SessionProvider (next-auth/react) foi removido daqui: nenhuma página pública usa
// useSession(), então envolver o site inteiro com ele só adicionava um fetch a
// /api/auth/session em toda navegação pública para nada. Ele agora vive só nos
// layout que realmente usa useSession() (gestor/(admin)).
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}