"use client";

import { useState } from "react";
import { Search, Edit2 } from "lucide-react";

export default function OrdersTable({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toString().includes(search) ||
      `${order.billing?.first_name} ${order.billing?.last_name}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "#00e676";
      case "processing": return "#00f0ff";
      case "pending": return "#ff9100";
      case "cancelled": return "#ff4d4d";
      default: return "var(--text-muted)";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "completed": return "rgba(0, 230, 118, 0.1)";
      case "processing": return "rgba(0, 240, 255, 0.1)";
      case "pending": return "rgba(255, 145, 0, 0.1)";
      case "cancelled": return "rgba(255, 77, 77, 0.1)";
      default: return "rgba(255,255,255,0.05)";
    }
  };

  return (
    <div className="glass-panel" style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div style={{ position: "relative", width: "100%", maxWidth: "300px" }}>
          <Search size={18} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Buscar por ID o cliente..."
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
        <button className="btn-primary">Filtrar</button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--glass-border)", color: "var(--text-muted)", fontSize: "0.9rem" }}>
              <th style={{ padding: "12px" }}>ID Pedido</th>
              <th style={{ padding: "12px" }}>Cliente</th>
              <th style={{ padding: "12px" }}>Fecha</th>
              <th style={{ padding: "12px" }}>Estado</th>
              <th style={{ padding: "12px" }}>Total</th>
              <th style={{ padding: "12px" }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                  No se encontraron pedidos.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.02)", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor="rgba(255,255,255,0.02)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor="transparent"}>
                  <td style={{ padding: "14px 12px", fontWeight: "600", color: "var(--text-main)" }}>#{order.id}</td>
                  <td style={{ padding: "14px 12px" }}>
                    <div style={{ color: "var(--text-main)", fontWeight: "500" }}>{order.billing?.first_name} {order.billing?.last_name}</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{order.billing?.email}</div>
                  </td>
                  <td style={{ padding: "14px 12px", fontSize: "0.9rem", color: "var(--text-muted)" }}>
                    {new Date(order.date_created).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "14px 12px" }}>
                    <span style={{
                      backgroundColor: getStatusBg(order.status),
                      color: getStatusColor(order.status),
                      padding: "4px 10px",
                      borderRadius: "12px",
                      fontSize: "0.80rem",
                      fontWeight: "600",
                      textTransform: "capitalize"
                    }}>
                      {order.status === 'processing' ? 'Procesando' : order.status === 'completed' ? 'Completado' : order.status === 'pending' ? 'Pendiente' : order.status}
                    </span>
                  </td>
                  <td style={{ padding: "14px 12px", fontWeight: "600", color: "var(--primary-color)" }}>
                    ${parseFloat(order.total).toFixed(2)}
                  </td>
                  <td style={{ padding: "14px 12px" }}>
                    <button style={{ 
                      background: "transparent", 
                      border: "none", 
                      color: "var(--text-muted)", 
                      cursor: "pointer", 
                      boxShadow: "0 0 0 1px var(--glass-border)", 
                      padding: "6px", 
                      borderRadius: "6px" 
                    }}>
                      <Edit2 size={16} />
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
