import { fetchWooCommerce } from "@/lib/woocommerce";
import InventoryBoard from "@/components/InventoryBoard";

export default async function ProductsPage() {
  let productsList: any[] = [];
  let errorMsg = null;

  try {
    // Aumentamos per_page para tener una visión holística en el grid y en las opciones de carga masiva
    productsList = await fetchWooCommerce("products?per_page=100");
  } catch (error: any) {
    console.error("Failed to fetch products:", error);
    errorMsg = error?.message || "Error al obtener productos de WooCommerce";
  }

  return (
    <div>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", margin: 0 }}>Inventario y Productos</h1>
        <p>Control visual de tus productos con métricas de stock en tiempo real.</p>
      </header>

      {errorMsg ? (
        <div className="glass-panel" style={{ padding: "2rem", textAlign: "center", color: "#ff4d4d" }}>
          <h3 style={{ marginBottom: "1rem" }}>⚠️ No se pudo conectar a la tienda</h3>
          <p>{errorMsg}</p>
        </div>
      ) : (
        <InventoryBoard initialProducts={productsList} />
      )}
    </div>
  );
}
