// src/app/gestor/layout.tsx

// 1. Importe o componente Toaster
import { Toaster } from "@/components/ui/sonner";

export default function GestorRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* 2. Renderize o conteúdo da página (seja login, primeiro-acesso, ou o dashboard) */}
      {children}
      
      {/* 3. Adicione o Toaster aqui. Ele agora estará disponível para todas as páginas do gestor. */}
      <Toaster richColors theme="dark" />
    </>
  );
}