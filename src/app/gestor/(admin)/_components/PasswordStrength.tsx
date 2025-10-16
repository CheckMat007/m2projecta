// src/app/gestor/(admin)/_components/PasswordStrength.tsx
import { CheckCircle2, XCircle } from 'lucide-react';

type PasswordStrengthProps = {
  password?: string;
};

// Componente para um item individual do checklist
const Requirement = ({ label, meets }: { label: string; meets: boolean }) => (
  <div className={`flex items-center transition-colors ${meets ? 'text-green-400' : 'text-red-400'}`}>
    {meets ? <CheckCircle2 size={16} className="mr-2" /> : <XCircle size={16} className="mr-2" />}
    <span className="text-xs">{label}</span>
  </div>
);

export const PasswordStrength = ({ password = '' }: PasswordStrengthProps) => {
  // Define as regras de validação
  const has10Chars = password.length >= 10;
  const hasUppercase = /(?=.*[A-Z])/.test(password);
  const hasLowercase = /(?=.*[a-z])/.test(password);
  const hasNumber = /(?=.*\d)/.test(password);
  const hasSymbol = /(?=.*[@$!%*?&=+])/.test(password);

  // Não mostra o checklist se a senha estiver vazia
  if (!password) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 p-3 bg-gray-900/50 rounded-md">
      <Requirement label="Pelo menos 10 caracteres" meets={has10Chars} />
      <Requirement label="Uma letra maiúscula" meets={hasUppercase} />
      <Requirement label="Uma letra minúscula" meets={hasLowercase} />
      <Requirement label="Pelo menos um número" meets={hasNumber} />
      <Requirement label="Pelo menos um símbolo (!@#$*?&=+)" meets={hasSymbol} />
    </div>
  );
};