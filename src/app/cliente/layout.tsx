// src/app/cliente/layout.tsx
// Este layout "raiz" do cliente é simples e não tem proteção nem sidebar.
// Ele serve para o Login e o Primeiro Acesso.

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