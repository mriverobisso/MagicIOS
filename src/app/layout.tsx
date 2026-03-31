import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Magic Dreams Admin CRM",
  description: "Plataforma de gestión de Ecommerce",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="app-layout">
          <Sidebar />
          <div className="main-content">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
