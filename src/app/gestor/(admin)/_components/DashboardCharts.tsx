// src/app/gestor/(admin)/_components/DashboardCharts.tsx
'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

export function DashboardCharts({ contracts }: { contracts: { value: number, updatedAt: Date }[] }) {
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

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis 
            dataKey="name" 
            stroke="#888888" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `R$${value}`}
        />
        <Tooltip 
            contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
            formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Receita']}
        />
        <Bar dataKey="total" fill="#a3e635" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}