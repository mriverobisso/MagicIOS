"use client";

import { useState } from "react";
import { Search, Mail, ExternalLink } from "lucide-react";

export default function CustomersTable({ initialCustomers }: { initialCustomers: any[] }) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");

  const filtered = (customers || []).filter(
    (c) =>
      (c.first_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.last_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.email || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="glass-panel" style={{ padding: "1.5rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div style={{ position: "relative", width: "100%", maxWidth: "300px" }}>
          <Search size={18} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Buscar clientes..."
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
              <th style={{ padding: "12px", width: "50px" }}>ID</th>
              <th style={{ padding: "12px" }}>Nombre Completo</th>
              <th style={{ padding: "12px" }}>Email</th>
              <th style={{ padding: "12px" }}>Pedidos</th>
              <th style={{ padding: "12px" }}>Total Gastado</th>
              <th style={{ padding: "12px" }}>Registrado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "2rem", color: "var(--text-muted)" }}>
                  No se encontraron clientes.
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.02)", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor="rgba(255,255,255,0.02)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor="transparent"}>
                  <td style={{ padding: "14px 12px", color: "var(--text-muted)", fontSize: "0.9rem" }}>#{c.id}</td>
                  <td style={{ padding: "14px 12px", fontWeight: "600", color: "var(--text-main)" }}>
                    {c.first_name} {c.last_name}
                  </td>
                  <td style={{ padding: "14px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--primary-color)", fontSize: "0.9rem" }}>
                      <Mail size={14} />
                      {c.email}
                    </div>
                  </td>
                  <td style={{ padding: "14px 12px", color: "var(--text-main)" }}>
                    <span style={{ padding: "2px 8px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "6px" }}>
                        --
                    </span>
                  </td>
                  <td style={{ padding: "14px 12px", fontWeight: "600", color: "#00f0ff" }}>
                    $--
                  </td>
                  <td style={{ padding: "14px 12px", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    {new Date(c.date_created).toLocaleDateString()}
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
