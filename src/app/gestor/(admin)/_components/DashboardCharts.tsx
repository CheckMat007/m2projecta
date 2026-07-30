// src/app/gestor/(admin)/_components/DashboardCharts.tsx
'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function DashboardCharts({ contracts }: { contracts: { value: number, updatedAt: Date }[] }) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Aguarda a montagem no cliente para evitar erros de hidratação (SSR mismatch)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Processar dados para agrupar por mês
  const dataMap = new Map<string, number>();
  
  // Inicializa os últimos 6 meses com 0
  for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = d.toLocaleDateString('pt-BR', { month: 'short' }); // "jun", "jul"
      dataMap.set(key, 0);
  }

  contracts.forEach(c => {
      const key = new Date(c.updatedAt).toLocaleDateString('pt-BR', { month: 'short' });
      if (dataMap.has(key)) {
          dataMap.set(key, (dataMap.get(key) || 0) + c.value);
      }
  });

  const data = Array.from(dataMap).map(([name, total]) => ({ name, total }));

  // Se o componente ainda não montou no cliente, renderiza um esqueleto vazio
  // para manter o tamanho e evitar flashes na tela
  if (!mounted) {
    return <div className="w-full h-[350px]"></div>;
  }

  // Define se está no modo escuro para aplicar as cores condicionais
  const isDark = theme === 'dark';

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis 
            dataKey="name" 
            stroke={isDark ? "#888888" : "#6b7280"} // Texto e linha mais escuros no modo claro
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
        />
        <YAxis
          stroke={isDark ? "#888888" : "#6b7280"}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `R$${value}`}
        />
        <Tooltip 
            contentStyle={{ 
              backgroundColor: isDark ? '#111827' : '#ffffff', 
              border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              borderRadius: '8px',
              color: isDark ? '#f9fafb' : '#111827'
            }}
            itemStyle={{
              color: isDark ? '#a3e635' : '#65a30d'
            }}
            formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Receita']}
        />
        {/* Usamos um verde mais escuro no modo claro para dar contraste com o fundo branco */}
        <Bar dataKey="total" fill={isDark ? "#a3e635" : "#65a30d"} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}