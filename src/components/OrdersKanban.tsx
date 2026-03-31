"use client";

import { useState } from "react";
import { Search, MapPin, Calendar, CreditCard, DollarSign } from "lucide-react";
import { updateOrderStatus } from "@/app/actions";

const KANBAN_COLUMNS = [
  { id: "pending", title: "Pendiente", bg: "rgba(255, 145, 0, 0.1)", color: "#ff9100", border: "#ff9100" },
  { id: "processing", title: "Procesando / Pagado", bg: "rgba(0, 240, 255, 0.1)", color: "#00f0ff", border: "#00f0ff" },
  { id: "on-hold", title: "En Espera", bg: "rgba(255, 255, 255, 0.1)", color: "#ffffff", border: "#ffffff" },
  { id: "completed", title: "Completado", bg: "rgba(0, 230, 118, 0.1)", color: "#00e676", border: "#00e676" },
  { id: "cancelled", title: "Cancelado / Fallido", bg: "rgba(255, 77, 77, 0.1)", color: "#ff4d4d", border: "#ff4d4d" }
];

export default function OrdersKanban({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState("");
  const [draggedOrder, setDraggedOrder] = useState<any>(null);
  const [updating, setUpdating] = useState<number | null>(null);

  const filteredOrders = (orders || []).filter(
    (order) =>
      (order.id?.toString() || "").includes(search) ||
      `${order.billing?.first_name || ""} ${order.billing?.last_name || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, order: any) => {
    setDraggedOrder(order);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", order.id.toString());
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, targetStatus: string) => {
    e.preventDefault();
    if (!draggedOrder || draggedOrder.status === targetStatus) return;

    const orderId = draggedOrder.id;
    
    // Update local state optimistic UI
    const previousOrders = [...orders];
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: targetStatus } : o));
    setUpdating(orderId);
    setDraggedOrder(null);

    // Call WooCommerce backend (Server Action)
    const result = await updateOrderStatus(orderId, targetStatus);
    setUpdating(null);

    if (!result.success) {
      // Revert if API failed
      alert("Error al actualizar la orden en WooCommerce: " + result.error);
      setOrders(previousOrders);
    }
  };

  // Normalizer to group similar statuses into the columns (e.g. failed -> cancelled)
  const normalizeStatus = (status: string) => {
    if (status === "failed") return "cancelled";
    return status;
  };

  return (
    <div style={{ paddingBottom: "2rem" }}>
      <div className="glass-panel" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: "600" }}>Tablero Kanban (Interactúa y Arrastra)</h2>
            <p style={{ margin: "5px 0 0", color: "var(--text-muted)", fontSize: "0.9rem" }}>
              Cambiar un pedido de columna notificará al cliente instantáneamente mediante WooCommerce.
            </p>
          </div>
          <div style={{ position: "relative", width: "100%", maxWidth: "350px" }}>
            <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input
              type="text"
              placeholder="🔍 Buscar pedido por # o cliente..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%", padding: "12px 12px 12px 40px",
                background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)",
                borderRadius: "10px", color: "var(--text-main)", outline: "none",
                fontSize: "1rem"
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ 
        display: "flex", 
        gap: "1.5rem", 
        overflowX: "auto", 
        paddingBottom: "1rem",
        alignItems: "flex-start",
        minHeight: "70vh"
      }}>
        {KANBAN_COLUMNS.map(col => {
          const colOrders = filteredOrders.filter(o => normalizeStatus(o.status) === col.id);
          
          return (
            <div 
              key={col.id}
              className="glass-panel"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
              style={{ 
                minWidth: "320px", 
                maxWidth: "320px",
                flex: "0 0 auto",
                padding: "1rem", 
                display: "flex", 
                flexDirection: "column",
                gap: "1rem",
                borderTop: `4px solid ${col.border}`,
                backgroundColor: "rgba(15, 15, 20, 0.4)",
                transition: "background 0.2s ease"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0, fontSize: "1.1rem", color: col.color }}>{col.title}</h3>
                <span style={{ 
                  background: "rgba(255,255,255,0.1)", padding: "2px 10px", borderRadius: "12px", 
                  fontSize: "0.85rem", fontWeight: "600" 
                }}>
                  {colOrders.length}
                </span>
              </div>

              {/* Contenedor de las tarjetas de pedidos */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", minHeight: "50px" }}>
                {colOrders.map(order => (
                  <div 
                    key={order.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, order)}
                    style={{
                      background: "rgba(25, 25, 30, 0.8)",
                      border: "1px solid rgba(255,255,255,0.05)",
                      borderRadius: "12px",
                      padding: "1rem",
                      cursor: "grab",
                      opacity: updating === order.id ? 0.5 : 1,
                      position: "relative",
                      transition: "transform 0.1s ease",
                      boxShadow: "0 4px 15px rgba(0,0,0,0.2)"
                    }}
                    onDragEnd={() => setDraggedOrder(null)}
                  >
                    {updating === order.id && (
                      <div className="saving-overlay" style={{
                        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: "rgba(0,0,0,0.5)", borderRadius: "12px",
                        display: "flex", justifyContent: "center", alignItems: "center",
                        zIndex: 10, backdropFilter: "blur(2px)",
                        color: "var(--primary-color)", fontWeight: "bold", fontSize: "0.9rem"
                      }}>
                        Guardando API...
                      </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontWeight: "700", color: "#fff", fontSize: "1.1rem" }}>#{order.id}</span>
                      <span style={{ fontWeight: "600", color: "#00f0ff" }}>${parseFloat(order.total).toFixed(2)}</span>
                    </div>

                    <div style={{ fontSize: "0.95rem", color: "var(--text-main)", marginBottom: "12px" }}>
                      <strong>{order.billing?.first_name} {order.billing?.last_name}</strong>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <MapPin size={14} /> {order.billing?.city || "Sin ciudad"}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <CreditCard size={14} color={order.payment_method === 'nuvei' || order.payment_method_title?.toLowerCase().includes('nuvei') ? "#ff2e93" : "var(--text-muted)"} />
                        {order.payment_method_title || "Método desconocido"}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Calendar size={14} /> {new Date(order.date_created).toLocaleDateString()}
                      </div>
                    </div>

                    {/* Línea divisoria y cantidad de ítems */}
                    <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.05)", fontSize: "0.85rem", display: "flex", justifyContent: "space-between" }}>
                      <span>{order.line_items?.length || 0} producto(s)</span>
                    </div>
                  </div>
                ))}

                {colOrders.length === 0 && (
                  <div style={{ 
                    border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "12px", padding: "2rem 1rem",
                    textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: "0.9rem"
                  }}>
                    Soltar para {col.title.toLowerCase()}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
