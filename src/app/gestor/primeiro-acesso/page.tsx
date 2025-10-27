// src/app/gestor/primeiro-acesso/page.tsx
import Logo from "@/components/ui/Logo";
import { FirstAccessForm } from "./_components/FirstAccessForm";

export default function PrimeiroAcessoPage() {
  return (
    <div className="min-h-screen bg-m2-dark text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <div className="w-52 h-auto">
            <Logo />
          </div>
        </div>
        <div className="text-center">
            <h1 className="text-2xl font-bold">Defina sua nova senha</h1>
            <p className="text-gray-400">Por segurança, você precisa criar uma nova senha para continuar.</p>
        </div>
        <FirstAccessForm />
      </div>
    </div>
  );
}