"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function ProductModal({ 
  isOpen, 
  onClose,
  onSave
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    regular_price: "",
    sku: "",
    stock_quantity: "",
    description: ""
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Formatting for WooCommerce REST API
    const payload = {
      name: formData.name,
      type: "simple",
      regular_price: formData.regular_price,
      sku: formData.sku,
      manage_stock: true,
      stock_quantity: parseInt(formData.stock_quantity) || 0,
      description: formData.description
    };

    await onSave(payload);
    setLoading(false);
    onClose();
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(5px)",
      display: "flex", justifyContent: "center", alignItems: "center",
      zIndex: 1000, padding: "1rem"
    }}>
      <div className="glass-panel" style={{ 
        width: "100%", maxWidth: "500px", padding: "2rem", position: "relative" 
      }}>
        <button 
          onClick={onClose}
          style={{ 
            position: "absolute", top: "15px", right: "15px", 
            background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" 
          }}>
          <X size={24} />
        </button>

        <h2 style={{ margin: "0 0 1.5rem 0", color: "var(--text-main)" }}>Crear Nuevo Producto</h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "0.9rem", color: "var(--text-muted)" }}>Nombre del Producto *</label>
            <input 
              required
              type="text" 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.05)", color: "var(--text-main)", outline: "none" }}
            />
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "0.9rem", color: "var(--text-muted)" }}>Precio Regular ($) *</label>
              <input 
                required
                type="number" step="0.01"
                value={formData.regular_price}
                onChange={e => setFormData({...formData, regular_price: e.target.value})}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.05)", color: "var(--text-main)", outline: "none" }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", marginBottom: "5px", fontSize: "0.9rem", color: "var(--text-muted)" }}>SKU (Código)</label>
              <input 
                type="text" 
                value={formData.sku}
                onChange={e => setFormData({...formData, sku: e.target.value})}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.05)", color: "var(--text-main)", outline: "none" }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontSize: "0.9rem", color: "var(--text-muted)" }}>Cantidad en Stock *</label>
            <input 
              required
              type="number" 
              value={formData.stock_quantity}
              onChange={e => setFormData({...formData, stock_quantity: e.target.value})}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--glass-border)", background: "rgba(255,255,255,0.05)", color: "var(--text-main)", outline: "none" }}
            />
          </div>

          <div style={{ marginTop: "1rem" }}>
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary" 
              style={{ width: "100%", padding: "12px", fontSize: "1rem", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Guardando en WooCommerce..." : "Crear Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
