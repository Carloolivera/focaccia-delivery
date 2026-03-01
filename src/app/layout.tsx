import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pizzería Focaccia — Pedidos Online | Chascomús",
  description:
    "Pedí tus pizzas, empanadas y tartas favoritas online. Delivery y retiro en local. Bolivia 55, Chascomús.",
  keywords: [
    "pizza",
    "pizzería",
    "focaccia",
    "chascomús",
    "delivery",
    "empanadas",
    "pedidos online",
  ],
  openGraph: {
    title: "Pizzería Focaccia — Pedidos Online",
    description:
      "Pedí tus pizzas, empanadas y tartas favoritas online. Delivery y retiro en local.",
    type: "website",
    locale: "es_AR",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#E8651A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased bg-background`}>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
