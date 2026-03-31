import { fetchWooCommerce } from "@/lib/woocommerce";
import ProductsTable from "@/components/ProductsTable";

export default async function ProductsPage() {
  let productsList: any[] = [];
  let errorMsg = null;

  try {
    // Obtenemos los productos más recientes o paginados
    productsList = await fetchWooCommerce("products?per_page=30");
  } catch (error: any) {
    console.error("Failed to fetch products:", error);
    errorMsg = error?.message || "Error al obtener productos de WooCommerce";
  }

  return (
    <div>
      <header style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: "2rem", margin: 0 }}>Inventario y Productos</h1>
          <p>Control visual de tus productos y stock activo de Magic Dreams.</p>
        </div>
        {!errorMsg && (
            <button className="btn-primary" style={{ padding: "0.8rem 1.5rem", height: "fit-content" }}>Nuevo Producto</button>
        )}
      </header>

      {errorMsg ? (
        <div className="glass-panel" style={{ padding: "2rem", textAlign: "center", color: "#ff4d4d" }}>
          <h3 style={{ marginBottom: "1rem" }}>⚠️ No se pudo conectar a la tienda</h3>
          <p>{errorMsg}</p>
        </div>
      ) : (
        <ProductsTable initialProducts={productsList} />
      )}
    </div>
  );
}
