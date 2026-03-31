"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Users, Package, Settings, LogOut, Activity, Sun, Moon, DollarSign } from "lucide-react";

interface SidebarProps {
  onNavigate?: () => void;
  isOpen?: boolean;
}

export default function Sidebar({ onNavigate, isOpen = false }: SidebarProps) {
  const pathname = usePathname();
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setIsLightMode(true);
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isLightMode;
    setIsLightMode(newMode);
    if (newMode) {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "dark");
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

  // Active state detection: exact match for home, prefix for others
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <aside
      className={`sidebar${isOpen ? " open" : ""}`}
      style={{
        /* Ensure full height on mobile drawer */
        minHeight: "100%",
      }}
    >
      {/* ── Brand header ── */}
      <div style={{
        padding: "1.75rem 1.5rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        borderBottom: "1px solid var(--glass-border)",
        marginBottom: "0.75rem",
      }}>
        <h2 style={{
          fontSize: "1.5rem",
          fontWeight: "800",
          letterSpacing: "2px",
          background: "linear-gradient(90deg, #ff2e93, #00f0ff)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          margin: 0,
          lineHeight: 1,
        }}>
          MAGIC
        </h2>
        <span style={{
          fontSize: "0.75rem",
          letterSpacing: "5px",
          color: "var(--text-muted)",
          textTransform: "uppercase",
          marginTop: "4px",
        }}>
          Dreams
        </span>
      </div>

      {/* ── Navigation ── */}
      <nav style={{ display: "flex", flexDirection: "column", gap: "4px", padding: "0 0.75rem", flex: 1 }}>
        {links.map((link) => {
          const active = isActive(link.href);
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
                padding: "11px 14px",
                borderRadius: "10px",
                color: active ? "var(--primary-color)" : "var(--text-muted)",
                backgroundColor: active ? "rgba(255, 46, 147, 0.12)" : "transparent",
                borderLeft: active ? "3px solid var(--primary-color)" : "3px solid transparent",
                fontWeight: active ? "600" : "400",
                fontSize: "0.95rem",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = isLightMode
                    ? "rgba(0,0,0,0.05)"
                    : "rgba(255,255,255,0.05)";
                  e.currentTarget.style.color = "var(--text-main)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "var(--text-muted)";
                }
              }}
            >
              <Icon size={19} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* ── Footer buttons ── */}
      <div style={{
        padding: "1rem 0.75rem 1.5rem",
        borderTop: "1px solid var(--glass-border)",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        marginTop: "1rem",
      }}>
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            width: "100%",
            padding: "11px 14px",
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            fontWeight: "400",
            fontSize: "0.95rem",
            transition: "all 0.15s ease",
            textAlign: "left",
            borderRadius: "10px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = isLightMode ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)";
            e.currentTarget.style.color = "var(--text-main)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "var(--text-muted)";
          }}
        >
          {isLightMode ? <Moon size={19} /> : <Sun size={19} />}
          {isLightMode ? "Modo Oscuro" : "Modo Claro"}
        </button>

        {/* Sign out */}
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            width: "100%",
            padding: "11px 14px",
            background: "transparent",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            fontWeight: "400",
            fontSize: "0.95rem",
            transition: "color 0.15s ease",
            textAlign: "left",
            borderRadius: "10px",
          }}
          onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.color = "#ff4d4d"}
          onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.color = "var(--text-muted)"}
        >
          <LogOut size={19} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
