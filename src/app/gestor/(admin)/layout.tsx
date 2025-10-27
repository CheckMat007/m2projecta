// src/app/gestor/(admin)/layout.tsx

import { Sidebar } from './_components/sidebar';


// O Layout agora é um componente simples, sem 'async' e sem buscar dados
export default function GestorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-m2-dark text-white">
      <div className="flex">
        {/* Não passamos mais a prop 'user' */}
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
      
    </div>
  );
}