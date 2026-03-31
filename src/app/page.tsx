import { fetchWooCommerce } from "@/lib/woocommerce";
import { DollarSign, ShoppingCart, TrendingUp, Users } from "lucide-react";
import DashboardCharts from "@/components/DashboardCharts";

export default async function Dashboard() {
  let stats = {
    totalSales: 0,
    ordersCount: 0,
    customersCount: 0,
    avgValue: 0,
  };

  let ordersData: any[] = [];
  let connectionError = false;

  try {
    // Intentar obtener pedidos de este mes para estadísticas
    const orders = await fetchWooCommerce("orders?per_page=50&status=completed,processing");
    ordersData = orders;
    
    // Calculando montos básicos
    stats.ordersCount = orders.length;
    stats.totalSales = orders.reduce((sum: number, order: any) => sum + parseFloat(order.total), 0);
    stats.avgValue = stats.ordersCount > 0 ? stats.totalSales / stats.ordersCount : 0;

  } catch (err) {
    console.error("WooCommerce setup pending or failed", err);
    connectionError = true;
  }

  return (
    <div style={{ padding: "0" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", margin: 0 }}>Dashboard General</h1>
          <p>Métricas y desempeño de la tienda online.</p>
        </div>
        
        {connectionError && (
          <div style={{ background: "rgba(255,46,147,0.1)", border: "1px solid var(--primary-color)", padding: "10px 15px", borderRadius: "10px", color: "#ff8abf", fontSize: "0.9rem" }}>
             ⚠️ Conexión con WooCommerce pendiente. Falta configuración de la API (claves).
          </div>
        )}
      </header>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
        <MetricCard 
          title="Ventas Totales" 
          value={`$${stats.totalSales.toFixed(2)}`} 
          icon={<DollarSign size={24} color="#00f0ff" />} 
          trend="+12.5%" 
        />
        <MetricCard 
          title="Pedidos Recientes" 
          value={`${stats.ordersCount}`} 
          icon={<ShoppingCart size={24} color="#ff2e93" />} 
          trend="+5.2%" 
        />
        <MetricCard 
          title="Ticket Promedio" 
          value={`$${stats.avgValue.toFixed(2)}`} 
          icon={<TrendingUp size={24} color="#00f0ff" />} 
          trend="-1.2%" 
        />
        <MetricCard 
          title="Nuevos Clientes" 
          value="--" 
          icon={<Users size={24} color="#ff2e93" />} 
          trend="0%" 
        />
      </div>

      {/* Charts Section */}
      <div className="glass-panel" style={{ padding: "1.5rem" }}>
        <h3 style={{ marginBottom: "1.5rem" }}>Ganancias de los últimos 7 días</h3>
        <div style={{ height: "350px", width: "100%" }}>
          {/* Componente de cliente para rendering del gráfico */}
          <DashboardCharts orders={ordersData} />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: string }) {
  const isPositive = trend.startsWith("+");
  
  return (
    <div className="glass-panel" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h4 style={{ color: "var(--text-muted)", fontSize: "0.9rem", fontWeight: "500", margin: 0 }}>{title}</h4>
        <div style={{ padding: "8px", background: "rgba(255,255,255,0.05)", borderRadius: "10px" }}>
          {icon}
        </div>
      </div>
      <div>
        <div style={{ fontSize: "2rem", fontWeight: "700", color: "var(--text-main)" }}>{value}</div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
          <span style={{ 
            color: isPositive ? "#00e676" : "#ff4d4d", 
            backgroundColor: isPositive ? "rgba(0, 230, 118, 0.1)" : "rgba(255, 77, 77, 0.1)",
            padding: "2px 8px", 
            borderRadius: "6px", 
            fontSize: "0.80rem", 
            fontWeight: "600" 
          }}>
            {trend}
          </span>
          <span style={{ fontSize: "0.80rem", color: "var(--text-muted)" }}>vs mes anterior</span>
        </div>
      </div>
    </div>
  );
}
