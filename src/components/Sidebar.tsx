"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Users, Package, Settings, LogOut, Activity, Sun, Moon, DollarSign } from "lucide-react";
import Image from "next/image";

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    // Check local storage or system preference on mount
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsLightMode(true);
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isLightMode;
    setIsLightMode(newTheme);
    if (newTheme) {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    }
  };

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/orders", label: "Pedidos", icon: ShoppingBag },
    { href: "/products", label: "Inventario", icon: Package },
    { href: "/customers", label: "Clientes", icon: Users },
    { href: "/finances", label: "Finanzas", icon: DollarSign },
    { href: "/analytics", label: "Analíticas", icon: Activity },
    { href: "/settings", label: "Configuración", icon: Settings },
  ];

  return (
    <aside className="sidebar">
      <div style={{ padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", borderBottom: "1px solid var(--glass-border)", marginBottom: "1rem" }}>
        {/* Usamos un texto premium con glow para el branding. Si tienen logo SVG después se cambia. */}
        <h2 style={{ fontSize: "1.5rem", fontWeight: "700", letterSpacing: "1px", background: "linear-gradient(90deg, #ff2e93, #00f0ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>
          MAGIC
        </h2>
        <span style={{ fontSize: "0.85rem", letterSpacing: "5px", color: "var(--text-muted)", textTransform: "uppercase" }}>Dreams</span>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem", padding: "0 1rem", flex: 1 }}>
        {links.map((link) => {
          const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
          const Icon = link.icon;
          
          return (
            <Link 
              key={link.href} 
              href={link.href}
              onClick={() => onNavigate?.()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                borderRadius: "12px",
                color: isActive ? "#ffffff" : "var(--text-muted)",
                backgroundColor: isActive ? "rgba(255, 46, 147, 0.15)" : "transparent",
                borderLeft: isActive ? "3px solid var(--primary-color)" : "3px solid transparent",
                fontWeight: isActive ? "600" : "500",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                if(!isActive) {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                  e.currentTarget.style.color = "#ffffff";
                }
              }}
              onMouseLeave={(e) => {
                if(!isActive) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "var(--text-muted)";
                }
              }}
            >
              <Icon size={20} color={isActive ? "var(--primary-color)" : "currentColor"} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: "1.5rem", borderTop: "1px solid var(--glass-border)", display: "flex", flexDirection: "column", gap: "10px" }}>
        <button 
          onClick={toggleTheme}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            width: "100%",
            padding: "12px",
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            fontWeight: "500",
            transition: "all 0.2s ease",
            textAlign: "left",
            borderRadius: "8px"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)"; e.currentTarget.style.color = "var(--text-main)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }}
        >
          {isLightMode ? <Moon size={20} /> : <Sun size={20} />}
          {isLightMode ? "Modo Oscuro" : "Modo Claro"}
        </button>

        <button 
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            width: "100%",
            padding: "12px",
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            fontWeight: "500",
            transition: "color 0.2s ease",
            textAlign: "left"
          }}
          onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.color = "#ff4d4d"}
          onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.color = "var(--text-muted)"}
        >
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
