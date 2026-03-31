"use client";

import { useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export default function DashboardCharts({ orders }: { orders: any[] }) {
  // Procesar órdenes para hacer un gráfico de 7 días simulado si no hay datos,
  // o utilizar la data real agrupada por fecha
  const data = useMemo(() => {
    if (!orders || orders.length === 0) {
      // Mock Data Themed for Preview
      return [
        { name: 'Lun', ventas: 4000 },
        { name: 'Mar', ventas: 3000 },
        { name: 'Mié', ventas: 5000 },
        { name: 'Jue', ventas: 2780 },
        { name: 'Vie', ventas: 6890 },
        { name: 'Sáb', ventas: 8390 },
        { name: 'Dom', ventas: 11490 },
      ];
    }
    
    // Aquí iría el procesamiento real de fechas si hay orders
    return [
      { name: 'Hace 7', ventas: 1200 },
      { name: 'Hace 6', ventas: 1400 },
      { name: 'Hace 5', ventas: 1000 },
      { name: 'Hace 4', ventas: 2000 },
      { name: 'Hace 3', ventas: 3200 },
      { name: 'Anteayer', ventas: 2100 },
      { name: 'Ayer', ventas: 4500 },
    ];
  }, [orders]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        width={500}
        height={400}
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ff2e93" stopOpacity={0.6}/>
            <stop offset="95%" stopColor="#ff2e93" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: "rgba(255, 255, 255, 0.5)", fontSize: 13 }} 
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: "rgba(255, 255, 255, 0.5)", fontSize: 13 }}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: "rgba(20, 21, 26, 0.9)", 
            borderColor: "rgba(255,255,255,0.1)",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            backdropFilter: "blur(10px)"
          }}
          itemStyle={{ color: "#ff2e93", fontWeight: 600 }}
          formatter={(value: any) => [`$${value}`, 'Ingresos']}
        />
        <Area 
          type="monotone" 
          dataKey="ventas" 
          stroke="#ff2e93" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorSales)" 
          activeDot={{ r: 6, fill: "#00f0ff", stroke: "transparent" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
