import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div style={{ padding: "4rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <div style={{ background: "rgba(255,255,255,0.05)", padding: "2rem", borderRadius: "50%", marginBottom: "2rem" }}>
        <Settings size={64} color="#00f0ff" />
      </div>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Configuración del Sistema</h1>
      <p style={{ fontSize: "1.1rem", color: "var(--text-muted)", maxWidth: "500px", lineHeight: "1.6" }}>
        Las configuraciones de API y enlaces con Magic Dreams están bloqueadas y cifradas en el archivo `.env.local` por seguridad del servidor.
        Próximamente agregaremos interfaz visual para cambio de cuentas.
      </p>
    </div>
  );
}
