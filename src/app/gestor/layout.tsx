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
      
      {/* 3. Adicione o Toaster aqui. 
          A propriedade theme="dark" foi removida para que o Toaster leia 
          automaticamente a preferência do next-themes configurada na sua aplicação. */}
      <Toaster richColors />
    </>
  );
}