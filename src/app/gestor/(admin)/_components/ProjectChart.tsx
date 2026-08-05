// src/app/gestor/(admin)/_components/ProjectChart.tsx
'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

// Dados fictícios para o gráfico
const data = [
  { name: 'Imobiliário', projetos: 12 },
  { name: 'Corporativo', projetos: 9 },
  { name: 'Eventos', projetos: 21 },
  { name: 'Turismo', projetos: 7 },
];

export const ProjectChart = () => {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && theme === 'dark';

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Projetos por Categoria (Últimos 6 meses)</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="name" stroke={isDark ? '#9CA3AF' : '#6b7280'} fontSize={12} />
              <YAxis stroke={isDark ? '#9CA3AF' : '#6b7280'} fontSize={12} />
              <Tooltip 
                cursor={{ fill: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)' }}
                contentStyle={{ 
                  backgroundColor: isDark ? '#0b1220' : '#ffffff', 
                  borderColor: isDark ? '#374151' : '#e5e7eb',
                  color: isDark ? '#f9fafb' : '#111827'
                }}
              />
              <Bar dataKey="projetos" fill={isDark ? '#a3e635' : '#65a30d'} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};