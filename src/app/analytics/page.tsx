import { Activity } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div style={{ padding: "4rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <div style={{ background: "rgba(255,255,255,0.05)", padding: "2rem", borderRadius: "50%", marginBottom: "2rem" }}>
        <Activity size={64} color="var(--primary-color)" />
      </div>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Analíticas Predictivas</h1>
      <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", maxWidth: "500px", lineHeight: "1.6" }}>
        Este módulo está actualmente en desarrollo. Pronto podrás observar predicciones de demanda, comportamiento por zona geográfica y análisis profundo de clientes.
      </p>
    </div>
  );
}
