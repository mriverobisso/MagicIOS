import { fetchWooCommerce } from "@/lib/woocommerce";
import OrdersTable from "@/components/OrdersTable";

export default async function OrdersPage() {
  let ordersList: any[] = [];
  let errorMsg = null;

  try {
    ordersList = await fetchWooCommerce("orders?per_page=30");
  } catch (error: any) {
    console.error("Failed to fetch orders:", error);
    errorMsg = error?.message || "Error al obtener pedidos de WooCommerce";
  }

  return (
    <div>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", margin: 0 }}>Gestión de Pedidos</h1>
        <p>Administra los pedidos de compras y gestiona sus estados en tiempo real.</p>
      </header>

      {errorMsg ? (
        <div className="glass-panel" style={{ padding: "2rem", textAlign: "center", color: "#ff4d4d" }}>
          <h3 style={{ marginBottom: "1rem" }}>⚠️ No se pudo conectar a la tienda</h3>
          <p>{errorMsg}</p>
          <p style={{ marginTop: "1rem", color: "var(--text-muted)" }}>
            Asegúrate de configurar `.env.local` con las claves API de WooCommerce actualizadas.
          </p>
        </div>
      ) : (
        <OrdersTable initialOrders={ordersList} />
      )}
    </div>
  );
}
