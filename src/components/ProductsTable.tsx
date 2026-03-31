"use client";

import { useState } from "react";
import { Search, Edit2, Archive } from "lucide-react";

export default function ProductsTable({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");

  const filteredProducts = (products || []).filter(
    (product) =>
      (product.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (product.sku || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="glass-panel" style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div style={{ position: "relative", width: "100%", maxWidth: "300px" }}>
          <Search size={18} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 10px 10px 35px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--glass-border)",
              borderRadius: "8px",
              color: "var(--text-main)",
              outline: "none"
            }}
          />
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--glass-border)", color: "var(--text-muted)", fontSize: "0.9rem" }}>
              <th style={{ padding: "12px", width: "60px" }}>Img</th>
              <th style={{ padding: "12px" }}>Producto</th>
              <th style={{ padding: "12px" }}>SKU</th>
              <th style={{ padding: "12px" }}>Stock</th>
              <th style={{ padding: "12px" }}>Precio</th>
              <th style={{ padding: "12px" }}>Categoría</th>
              <th style={{ padding: "12px" }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                  No se encontraron productos.
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.02)", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor="rgba(255,255,255,0.02)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor="transparent"}>
                  <td style={{ padding: "14px 12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                        {p.images && p.images[0] ? (
                            <img src={p.images[0].src} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : null}
                    </div>
                  </td>
                  <td style={{ padding: "14px 12px", fontWeight: "600", color: "var(--text-main)" }}>{p.name}</td>
                  <td style={{ padding: "14px 12px", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    {p.sku || 'N/A'}
                  </td>
                  <td style={{ padding: "14px 12px" }}>
                    <span style={{
                      backgroundColor: p.stock_status === 'instock' ? "rgba(0, 230, 118, 0.1)" : "rgba(255, 77, 77, 0.1)",
                      color: p.stock_status === 'instock' ? "#00e676" : "#ff4d4d",
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "0.80rem",
                      fontWeight: "600",
                    }}>
                      {p.stock_status === 'instock' ? (p.stock_quantity || 'En Stock') : 'Agotado'}
                    </span>
                  </td>
                  <td style={{ padding: "14px 12px", fontWeight: "600", color: "#00f0ff" }}>
                    ${parseFloat(p.price || 0).toFixed(2)}
                  </td>
                  <td style={{ padding: "14px 12px", color: "var(--primary-color)", fontSize: "0.85rem", fontWeight: "500" }}>
                    {p.categories?.map((c: any) => c.name).join(', ')}
                  </td>
                  <td style={{ padding: "14px 12px", display: "flex", gap: "8px" }}>
                    <button style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "6px", borderRadius: "6px", transition: "all 0.2s" }} onMouseEnter={(e)=> e.currentTarget.style.color="var(--text-main)"} onMouseLeave={(e)=> e.currentTarget.style.color="var(--text-muted)"}>
                      <Edit2 size={16} />
                    </button>
                    <button style={{ background: "transparent", border: "1px solid var(--glass-border)", color: "var(--text-muted)", cursor: "pointer", padding: "6px", borderRadius: "6px", transition: "all 0.2s" }} onMouseEnter={(e)=> {e.currentTarget.style.borderColor="#ff4d4d"; e.currentTarget.style.color="#ff4d4d"}} onMouseLeave={(e)=> {e.currentTarget.style.borderColor="var(--glass-border)"; e.currentTarget.style.color="var(--text-muted)"}}>
                      <Archive size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
