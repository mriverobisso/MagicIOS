import { fetchWooCommerce } from "@/lib/woocommerce";
import CustomersTable from "@/components/CustomersTable";

export default async function CustomersPage() {
  let customersList: any[] = [];
  let errorMsg = null;

  try {
    customersList = await fetchWooCommerce("customers?per_page=30");
  } catch (error: any) {
    console.error("Failed to fetch customers:", error);
    errorMsg = error?.message || "Error al obtener clientes de WooCommerce";
  }

  return (
    <div>
      <header style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "2rem", margin: 0 }}>Directorio de Clientes</h1>
          <p>Gestiona los usuarios registrados en tu tienda mágica.</p>
        </div>
      </header>

      {errorMsg ? (
        <div className="glass-panel" style={{ padding: "2rem", textAlign: "center", color: "#ff4d4d" }}>
          <h3 style={{ marginBottom: "1rem" }}>⚠️ No se pudo conectar a la tienda</h3>
          <p>{errorMsg}</p>
        </div>
      ) : (
        <CustomersTable initialCustomers={customersList} />
      )}
    </div>
  );
}
