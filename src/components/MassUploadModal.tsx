"use client";

import { useState, useRef } from "react";
import { X, Upload, CheckCircle } from "lucide-react";

export default function MassUploadModal({ 
  isOpen, 
  onClose,
  onUpload
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onUpload: (productsData: any[]) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setErrorMsg(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        // Basic CSV Parsing (Splitting by lines, assuming Comma Separation)
        const lines = text.split("\n").filter(line => line.trim().length > 0);
        
        if (lines.length < 2) {
          throw new Error("El archivo está vacío o no tiene encabezados.");
        }

        const headers = lines[0].toLowerCase().split(",").map(h => h.trim());
        
        // Mapeo básico a los nombres de columna esperados: nombre, precio, sku, stock
        const parsedProducts = [];

        for (let i = 1; i < lines.length; i++) {
          // Un separador simple por comas (no maneja comas integradas dentro de comillas complejas)
          const cols = lines[i].split(",").map(c => c.trim());
          if (cols.length < 2) continue; // Skip bad lines

          let product: any = { type: "simple", manage_stock: true };

          headers.forEach((header, index) => {
            const val = cols[index] || "";
            if (header.includes("nombre") || header.includes("name")) product.name = val;
            if (header.includes("precio") || header.includes("price")) product.regular_price = val;
            if (header.includes("sku")) product.sku = val;
            if (header.includes("stock") || header.includes("qty")) product.stock_quantity = parseInt(val) || 0;
            if (header.includes("categor")) product.categories = [{ id: parseInt(val) }]; // Si envían ID de categoría
          });

          if (product.name) {
            parsedProducts.push(product);
          }
        }

        if (parsedProducts.length === 0) {
          throw new Error("No se encontraron productos válidos en el archivo.");
        }

        await onUpload(parsedProducts);
        setSuccess(true);

      } catch (err: any) {
        setErrorMsg(err.message || "Error procesando el archivo CSV.");
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setErrorMsg("Error al leer el archivo desde el navegador.");
      setLoading(false);
    };

    reader.readAsText(file);
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(5px)",
      display: "flex", justifyContent: "center", alignItems: "center",
      zIndex: 1000, padding: "1rem"
    }}>
      <div className="glass-panel" style={{ 
        width: "100%", maxWidth: "550px", padding: "2.5rem", position: "relative",
        textAlign: "center"
      }}>
        <button 
          onClick={onClose}
          style={{ 
            position: "absolute", top: "15px", right: "15px", 
            background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" 
          }}>
          <X size={24} />
        </button>

        {!success ? (
          <>
            <h2 style={{ margin: "0 0 1rem 0", color: "var(--text-main)" }}>Subida Masiva de Inventario</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginBottom: "2rem" }}>
              Sube un archivo <strong>.csv</strong> con las columnas: <br/>
              <code>nombre, precio, sku, stock</code>
            </p>

            <div 
              onClick={() => !loading && fileInputRef.current?.click()}
              style={{
                border: "2px dashed var(--primary-color)",
                borderRadius: "16px",
                padding: "3rem",
                cursor: loading ? "wait" : "pointer",
                background: "rgba(255, 46, 147, 0.05)",
                transition: "all 0.2s"
              }}
            >
              <Upload size={40} color="var(--primary-color)" style={{ marginBottom: "1rem" }} />
              <h3 style={{ margin: 0, color: "var(--text-main)" }}>
                {loading ? "Procesando productos..." : "Haz clic aquí para seleccionar archivo"}
              </h3>
              <input 
                type="file" 
                accept=".csv"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>

            {errorMsg && (
              <div style={{ marginTop: "1.5rem", color: "#ff4d4d", background: "rgba(255, 77, 77, 0.1)", padding: "10px", borderRadius: "8px" }}>
                {errorMsg}
              </div>
            )}
          </>
        ) : (
          <div style={{ padding: "2rem 0" }}>
            <CheckCircle size={60} color="#00e676" style={{ margin: "0 auto 1rem auto" }} />
            <h2 style={{ color: "var(--text-main)", marginBottom: "1rem" }}>¡Éxito!</h2>
            <p style={{ color: "var(--text-muted)" }}>
              Los productos fueron importados/actualizados correctamente en tu catálogo de WooCommerce.
            </p>
            <button className="btn-primary" onClick={onClose} style={{ marginTop: "2rem", padding: "10px 30px" }}>
              Entendido
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
