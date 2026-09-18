// src/app/cliente/layout.tsx
// Este layout "raiz" do cliente é simples e não tem proteção nem sidebar.
// Ele serve para o Login e o Primeiro Acesso.
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Portal do Cliente | M2 Projecta',
    template: '%s | Portal do Cliente | M2 Projecta',
  },
};

export default function ClientRootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <>
        {children}
      </>
    );
  }