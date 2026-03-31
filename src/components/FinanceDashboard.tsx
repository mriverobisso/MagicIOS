"use client";

import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, Calendar, CreditCard } from "lucide-react";

export default function FinanceDashboard({ rawOrders }: { rawOrders: any[] }) {
  // Fase 2: Motor de Filtrado Lógico Matemático
  const finances = useMemo(() => {
    // 1. Filtrar únicamente las órdenes válidas que significan dinero real
    const validOrders = rawOrders.filter(
      (order) => order.status === "completed" || order.status === "processing"
    );

    // 2. Establecer límites de tiempo (Hoy, Semana, Mes) con precisión a 00:00:00
    const now = new Date();
    
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const startOfWeek = new Date(startOfToday);
    // Suponemos semana que inicia en lunes (1), domingo es 0
    const dayOfWeek = startOfWeek.getDay() === 0 ? 6 : startOfWeek.getDay() - 1; 
    startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 3. Variables Acumuladoras
    let incomeToday = 0;
    let incomeWeek = 0;
    let incomeMonth = 0;
    let totalAllTime = 0;

    // 4. Proceso de agrupación de los últimos 7 días para el gráfico
    // Array pre-llenado con los últimos 7 días con totales en 0
    const last7Days: { name: string; date: Date; ingresos: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(startOfToday);
      d.setDate(d.getDate() - i);
      last7Days.push({
        // Lógica sencilla para nombre de día: Ej 'Lun 24'
        name: `${['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][d.getDay()]} ${d.getDate()}`,
        date: d,
        ingresos: 0
      });
    }

    // 5. Motor contable
    validOrders.forEach(order => {
      const total = parseFloat(order.total) || 0;
      const orderDate = new Date(order.date_created);
      
      totalAllTime += total;

      if (orderDate >= startOfToday) incomeToday += total;
      if (orderDate >= startOfWeek) incomeWeek += total;
      if (orderDate >= startOfMonth) incomeMonth += total;

      // Buscar si pertenece a los últimos 7 días para sumarlo al bin del Chart
      const orderDateZero = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate());
      const dayBin = last7Days.find(d => d.date.getTime() === orderDateZero.getTime());
      if (dayBin) {
        dayBin.ingresos += total;
      }
    });

    const averageTicket = validOrders.length > 0 ? (totalAllTime / validOrders.length) : 0;

    return {
      incomeToday,
      incomeWeek,
      incomeMonth,
      averageTicket,
      chartData: last7Days,
      orders: validOrders
    };

  }, [rawOrders]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* 4 KPIs de Resumen */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)" }}>
            <Calendar size={18} /> <span>Ingresos Hoy</span>
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "700", color: "#00e676" }}>
            ${finances.incomeToday.toFixed(2)}
          </div>
        </div>
        
        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)" }}>
            <TrendingUp size={18} /> <span>Ingresos Esta Semana</span>
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "700", color: "#00f0ff" }}>
            ${finances.incomeWeek.toFixed(2)}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "10px" }}>
           <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)" }}>
            <DollarSign size={18} /> <span>Ingresos Este Mes</span>
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "700", color: "var(--primary-color)" }}>
            ${finances.incomeMonth.toFixed(2)}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "10px", background: "rgba(255,255,255,0.02)" }}>
           <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)" }}>
            <CreditCard size={18} /> <span>Ticket Promedio (Global)</span>
          </div>
          <div style={{ fontSize: "2rem", fontWeight: "700", color: "#fff" }}>
            ${finances.averageTicket.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Gráfico Analítico de Área (Recharts) */}
      <div className="glass-panel" style={{ padding: "2rem", height: "400px" }}>
        <h2 style={{ fontSize: "1.2rem", color: "var(--text-main)", marginBottom: "1.5rem", marginTop: 0 }}>Tendencia de Ingresos (Últimos 7 Días)</h2>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={finances.chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.6}/>
                <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "rgba(255, 255, 255, 0.5)", fontSize: 13 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "rgba(255, 255, 255, 0.5)", fontSize: 13 }} tickFormatter={(val) => `$${val}`} />
            <Tooltip 
              contentStyle={{ backgroundColor: "rgba(20, 21, 26, 0.9)", borderColor: "rgba(255,255,255,0.1)", borderRadius: "12px", boxShadow: "0 10px 30px rgba(0,0,0,0.5)", backdropFilter: "blur(10px)" }}
              itemStyle={{ color: "#00f0ff", fontWeight: 600 }}
              formatter={(value: any) => [`$${parseFloat(value).toFixed(2)}`, 'Ventas Cajón']}
            />
            <Area type="monotone" dataKey="ingresos" stroke="#00f0ff" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" activeDot={{ r: 6, fill: "#ff2e93", stroke: "transparent" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla Desglose de Rendimiento */}
      <div className="glass-panel" style={{ padding: "1.5rem" }}>
        <h2 style={{ fontSize: "1.2rem", color: "var(--text-main)", marginBottom: "1.5rem", marginTop: 0 }}>Registro Oficial (Ventas Concretadas)</h2>
        
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--glass-border)", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                <th style={{ padding: "12px" }}>Nº Factura / Pedido</th>
                <th style={{ padding: "12px" }}>Fecha de Cobro</th>
                <th style={{ padding: "12px" }}>Cliente</th>
                <th style={{ padding: "12px" }}>Vía de Pago</th>
                <th style={{ padding: "12px", textAlign: "right" }}>Ingreso Total</th>
              </tr>
            </thead>
            <tbody>
              {finances.orders.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
                    No hay ingresos registrados en tu base contable de pedidos completados/procesando.
                  </td>
                </tr>
              ) : (
                finances.orders.slice(0, 15).map((o: any) => (
                  <tr key={o.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.02)", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor="rgba(255,255,255,0.02)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor="transparent"}>
                    <td style={{ padding: "14px 12px", fontWeight: "600", color: "#fff" }}>#{o.id}</td>
                    <td style={{ padding: "14px 12px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                      {new Date(o.date_created).toLocaleString()}
                    </td>
                    <td style={{ padding: "14px 12px", color: "var(--text-main)" }}>
                      {o.billing?.first_name} {o.billing?.last_name}
                    </td>
                    <td style={{ padding: "14px 12px" }}>
                      <span style={{ 
                        display: "inline-flex", alignItems: "center", gap: "6px",
                        padding: "4px 12px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: "600",
                        background: o.payment_method?.toLowerCase().includes('nuvei') ? "rgba(255, 46, 147, 0.1)" : "rgba(255,255,255,0.1)",
                        color: o.payment_method?.toLowerCase().includes('nuvei') ? "#ff2e93" : "var(--text-muted)"
                      }}>
                        {o.payment_method_title || "Manual / Efectivo"}
                      </span>
                    </td>
                    <td style={{ padding: "14px 12px", textAlign: "right", fontWeight: "700", color: "#00e676", fontSize: "1.1rem" }}>
                      + ${parseFloat(o.total).toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
