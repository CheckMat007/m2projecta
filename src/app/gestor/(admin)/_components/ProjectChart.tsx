// src/app/gestor/(admin)/_components/ProjectChart.tsx
'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// Dados fictícios para o gráfico
const data = [
  { name: 'Imobiliário', projetos: 12 },
  { name: 'Corporativo', projetos: 9 },
  { name: 'Eventos', projetos: 21 },
  { name: 'Turismo', projetos: 7 },
];

export const ProjectChart = () => {
  return (
    <Card className="bg-black/30 border-gray-800 text-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Projetos por Categoria (Últimos 6 meses)</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <XAxis dataKey="name" stroke="#888888" fontSize={12} />
              <YAxis stroke="#888888" fontSize={12} />
              <Tooltip 
                cursor={{ fill: 'rgba(151, 249, 1, 0.1)' }}
                contentStyle={{ 
                  backgroundColor: '#111111', 
                  borderColor: '#97f901',
                  color: '#FFFFFF' 
                }}
              />
              <Bar dataKey="projetos" fill="#97f901" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};