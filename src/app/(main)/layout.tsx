// src/app/(main)/layout.tsx

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Este layout se aplica apenas às páginas públicas do site.
  // Futuramente, se você tiver um rodapé ou cabeçalho SÓ para o site principal,
  // eles viriam aqui.
  return <>{children}</>;
}