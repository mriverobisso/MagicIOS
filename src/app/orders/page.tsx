import { fetchWooCommerce } from "@/lib/woocommerce";
import OrdersKanban from "@/components/OrdersKanban";

export default async function OrdersPage() {
  let ordersList: any[] = [];
  let errorMsg = null;

  try {
    ordersList = await fetchWooCommerce("orders?per_page=100"); // Aumentar límite para Kanban
  } catch (error: any) {
    console.error("Failed to fetch orders:", error);
    errorMsg = error?.message || "Error al obtener pedidos de WooCommerce";
  }

  return (
    <div>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", margin: 0 }}>Gestión de Pedidos (Kanban)</h1>
        <p>Administra y visualiza el ciclo de vida de tus órdenes. Arrastra una tarjeta para cambiar el estado.</p>
      </header>

      {errorMsg ? (
        <div className="glass-panel" style={{ padding: "2rem", textAlign: "center", color: "#ff4d4d" }}>
          <h3 style={{ marginBottom: "1rem" }}>⚠️ No se pudo conectar a la tienda</h3>
          <p>{errorMsg}</p>
        </div>
      ) : (
        <OrdersKanban initialOrders={ordersList} />
      )}
    </div>
  );
}
