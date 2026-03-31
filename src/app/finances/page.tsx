import { fetchWooCommerce } from "@/lib/woocommerce";
import FinanceDashboard from "@/components/FinanceDashboard";

export default async function FinancesPage() {
  let ordersList: any[] = [];
  let errorMsg = null;

  try {
    // Obtenemos un número extenso de órdenes para construir el gráfico de 7 a 30 días
    ordersList = await fetchWooCommerce("orders?per_page=100");
  } catch (error: any) {
    console.error("Failed to fetch orders for finances:", error);
    errorMsg = error?.message || "Error al conectar con la base de datos central";
  }

  return (
    <div>
      <header style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "2rem", margin: 0 }}>🏦 Módulo de Finanzas</h1>
          <p>Auditoría de ingresos en tiempo real, gráficos de rendimiento y cortes de caja.</p>
        </div>
        <div style={{ background: "rgba(0, 240, 255, 0.1)", padding: "10px 20px", borderRadius: "12px", border: "1px solid rgba(0, 240, 255, 0.3)" }}>
            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", display: "block" }}>Conexión Activa</span>
            <span style={{ color: "#00f0ff", fontWeight: "700" }}>WooCommerce Secure API</span>
        </div>
      </header>
      
      {errorMsg ? (
        <div className="glass-panel" style={{ padding: "2rem", textAlign: "center", color: "#ff4d4d" }}>
          <h3 style={{ marginBottom: "1rem" }}>⚠️ Hubo un problema obteniendo los datos fiscales</h3>
          <p>{errorMsg}</p>
        </div>
      ) : (
        <FinanceDashboard rawOrders={ordersList} />
      )}
    </div>
  );
}
