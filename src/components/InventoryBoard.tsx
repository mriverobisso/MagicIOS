"use client";

import { useState } from "react";
import { Search, Plus, UploadCloud, Edit2, Image as ImageIcon } from "lucide-react";
import ProductModal from "./ProductModal";
import MassUploadModal from "./MassUploadModal";
import { saveProduct, bulkUploadProducts } from "@/app/actions";

export default function InventoryBoard({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("Todas");
  const [isProductModalOpen, setProductModalOpen] = useState(false);
  const [isMassUploadOpen, setMassUploadOpen] = useState(false);

  // Extract unique categories from array of products
  const categoriesRaw = products.flatMap((p: any) => p.categories?.map((c: any) => c.name) || []);
  const categories = ["Todas", ...Array.from(new Set(categoriesRaw))].filter(Boolean) as string[];

  const filteredProducts = products.filter(
    (product) => {
      const matchSearch = (product.name || "").toLowerCase().includes(search.toLowerCase()) || 
                          (product.sku || "").toLowerCase().includes(search.toLowerCase());
      
      const matchCategory = activeCategory === "Todas" || 
                           (product.categories && product.categories.some((c: any) => c.name === activeCategory));
      
      return matchSearch && matchCategory;
    }
  );

  return (
    <div>
      {/* Botones de acción principales */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <button 
          onClick={() => setProductModalOpen(true)}
          className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "1rem", padding: "12px 24px" }}
        >
          <Plus size={20} /> Nuevo Producto
        </button>
        <button 
          onClick={() => setMassUploadOpen(true)}
          style={{ 
            display: "flex", alignItems: "center", gap: "8px", fontSize: "1rem", padding: "12px 24px",
            background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)",
            color: "var(--text-main)", borderRadius: "8px", cursor: "pointer", transition: "all 0.2s"
          }}
        >
          <UploadCloud size={20} /> Subida Masiva CSV
        </button>
      </div>

      <div className="glass-panel" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", flex: 1 }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "20px",
                  border: cat === activeCategory ? "1px solid var(--primary-color)" : "1px solid rgba(255,255,255,0.1)",
                  background: cat === activeCategory ? "rgba(255, 46, 147, 0.1)" : "rgba(255,255,255,0.02)",
                  color: cat === activeCategory ? "var(--primary-color)" : "var(--text-muted)",
                  fontWeight: cat === activeCategory ? "700" : "500",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div style={{ position: "relative", width: "100%", maxWidth: "350px" }}>
            <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="🔍 Buscar producto o SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%", padding: "12px 12px 12px 40px",
                background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)",
                borderRadius: "10px", color: "var(--text-main)", outline: "none", fontSize: "1rem"
              }}
            />
          </div>
        </div>
      </div>

      {/* Grid de Productos Moderno */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
        {filteredProducts.map(p => (
          <div key={p.id} className="glass-panel" style={{ overflow: "hidden", display: "flex", flexDirection: "column", padding: 0 }}>
            {/* Cabecera / Imagen */}
            <div style={{ height: "200px", width: "100%", background: "rgba(0,0,0,0.5)", position: "relative" }}>
              {p.images && p.images[0] ? (
                <img src={p.images[0].src} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.1)" }}>
                  <ImageIcon size={48} />
                </div>
              )}
              
              <div style={{ 
                position: "absolute", top: "12px", right: "12px",
                backgroundColor: p.stock_status === 'instock' ? "rgba(0, 230, 118, 0.9)" : "rgba(255, 77, 77, 0.9)",
                color: "#111", padding: "4px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "700" 
              }}>
                {p.stock_status === 'instock' ? `${p.stock_quantity || 'En Stock'} disponibles` : 'Agotado'}
              </div>
            </div>

            {/* Detalles */}
            <div style={{ padding: "1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ color: "var(--primary-color)", fontSize: "0.8rem", fontWeight: "600", marginBottom: "8px", textTransform: "uppercase" }}>
                {p.categories?.map((c: any) => c.name).join(', ') || 'Sin Categoría'}
              </div>
              
              <h3 style={{ margin: "0 0 8px 0", fontSize: "1.2rem", fontWeight: "600", color: "var(--text-main)" }}>
                {p.name}
              </h3>
              
              <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", flex: 1 }}>
                SKU: <span style={{ color: "var(--text-main)" }}>{p.sku || 'N/A'}</span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ fontSize: "1.4rem", fontWeight: "700", color: "#00f0ff" }}>
                  ${p.price || "0.00"}
                </div>
                <button style={{ 
                  background: "rgba(255,255,255,0.05)", border: "none", color: "var(--text-muted)", 
                  padding: "8px", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px"
                }}>
                  <Edit2 size={16} /> Editar
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredProducts.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "4rem", color: "var(--text-muted)" }}>
            <h3>No se encontraron productos</h3>
            <p>Intenta cambiar los filtros de búsqueda o categoría.</p>
          </div>
        )}
      </div>

      {/* Inject Modals */}
      <ProductModal 
        isOpen={isProductModalOpen} 
        onClose={() => setProductModalOpen(false)} 
        onSave={async (data) => {
          const res = await saveProduct(data);
          if(res.success) {
            alert("Producto creado exitosamente");
            // Basic optimistic append just for demo, real reload will happen due to revalidatePath
            setProducts([res.data, ...products]);
          } else {
            alert("Error: " + res.error);
          }
        }} 
      />

      <MassUploadModal 
        isOpen={isMassUploadOpen} 
        onClose={() => setMassUploadOpen(false)} 
        onUpload={async (dataArray) => {
          const res = await bulkUploadProducts(dataArray, []);
          if(res.success) {
            // refresh page manually or rely on nextJS revalidate
            window.location.reload();
          } else {
            throw new Error(res.error); // Pass to the modal's error handler
          }
        }}
      />
    </div>
  );
}
