import Link from "next/link";
import { getSettings } from "@/actions/menu";
import { ChevronRight, MapPin, Clock, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import SecretAdminTap from "@/components/secret-admin-tap";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const settings = await getSettings();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--focaccia-dark)] text-white shadow-lg">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🍕</span>
            <div>
              <h1 className="text-lg font-bold leading-tight tracking-tight">
                <span className="text-[var(--focaccia-orange)]">Focaccia</span>
              </h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                Pizzería
              </p>
            </div>
          </Link>
          <a
            href="https://wa.me/542241693947"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-3 py-2 rounded-full transition-colors"
          >
            <span>📱</span>
            <span className="hidden min-[360px]:inline">WhatsApp</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[var(--focaccia-dark)] via-[#2a1a0a] to-[var(--focaccia-dark)] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl">🍕</div>
          <div className="absolute bottom-10 right-10 text-6xl">🥟</div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl opacity-5">
            🍕
          </div>
        </div>

        <div className="relative max-w-lg mx-auto px-4 py-12 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                settings?.isOpen
                  ? "bg-green-400 animate-pulse"
                  : "bg-red-400"
              }`}
            />
            <span className="text-sm font-medium">
              {settings?.isOpen ? "Abierto ahora" : "Cerrado"}
            </span>
          </div>

          <div className="space-y-3">
            <h2 className="text-4xl font-extrabold tracking-tight">
              Tus{" "}
              <span className="text-[var(--focaccia-orange)]">pizzas</span>{" "}
              favoritas
            </h2>
            <p className="text-lg text-gray-300">
              Empanadas <SecretAdminTap /> Pizzas · Tartas
            </p>
            <p className="text-sm text-gray-400">
              Pedí online y recibí en tu casa o retirá en el local
            </p>
          </div>

          <Button
            asChild
            size="lg"
            className="bg-[var(--focaccia-orange)] hover:bg-[var(--focaccia-orange)]/90 text-white text-lg font-bold px-8 py-6 rounded-full shadow-xl shadow-orange-900/30 transition-all hover:scale-105 active:scale-95"
          >
            <Link href="/menu">
              Ver menú y pedir
              <ChevronRight className="w-5 h-5 ml-1" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-lg mx-auto px-4 py-10 flex-1">
        <div className="grid gap-4">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-border shadow-sm">
            <div className="shrink-0 w-12 h-12 rounded-full bg-[var(--focaccia-warm)] flex items-center justify-center text-[var(--focaccia-orange)]">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-[var(--focaccia-dark)]">Delivery a domicilio</p>
              <p className="text-sm text-muted-foreground">{settings?.deliveryNote || "Envíos a la zona céntrica"}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-border shadow-sm">
            <div className="shrink-0 w-12 h-12 rounded-full bg-[var(--focaccia-warm)] flex items-center justify-center text-[var(--focaccia-orange)]">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-[var(--focaccia-dark)]">Retiro en local</p>
              <p className="text-sm text-muted-foreground">{settings?.address || "Bolivia 55, Chascomús"}</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-border shadow-sm">
            <div className="shrink-0 w-12 h-12 rounded-full bg-[var(--focaccia-warm)] flex items-center justify-center text-[var(--focaccia-orange)]">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-[var(--focaccia-dark)]">
                Tiempo estimado: {settings?.estimatedTime || "40-50 min"}
              </p>
              <p className="text-sm text-muted-foreground">Tu pedido preparado al momento</p>
            </div>
          </div>
        </div>

        {/* Cómo funciona */}
        <div className="mt-10">
          <h3 className="text-lg font-bold text-center mb-6 text-[var(--focaccia-dark)]">
            ¿Cómo pedir?
          </h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white border border-border">
              <span className="text-3xl">📋</span>
              <div className="w-6 h-6 rounded-full bg-[var(--focaccia-orange)] text-white text-xs font-bold flex items-center justify-center">1</div>
              <p className="text-xs font-medium text-[var(--focaccia-dark)]">Elegí del menú</p>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white border border-border">
              <span className="text-3xl">🛒</span>
              <div className="w-6 h-6 rounded-full bg-[var(--focaccia-orange)] text-white text-xs font-bold flex items-center justify-center">2</div>
              <p className="text-xs font-medium text-[var(--focaccia-dark)]">Armá tu pedido</p>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white border border-border">
              <span className="text-3xl">✅</span>
              <div className="w-6 h-6 rounded-full bg-[var(--focaccia-orange)] text-white text-xs font-bold flex items-center justify-center">3</div>
              <p className="text-xs font-medium text-[var(--focaccia-dark)]">¡Listo!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--focaccia-dark)] text-white py-8">
        <div className="max-w-lg mx-auto px-4 space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[var(--focaccia-orange)] shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Bolivia 55</p>
              <p className="text-sm text-gray-400">Chascomús, Buenos Aires</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-[var(--focaccia-orange)] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm">Martes a Jueves: 20:00 - 23:00</p>
              <p className="text-sm">Viernes a Domingos: 20:00 - 23:30</p>
            </div>
          </div>
          <div className="pt-4 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-500">
              Desarrollado por{" "}
              <a href="https://aidoagencia.com" target="_blank" rel="noopener noreferrer" className="text-[var(--focaccia-orange)] hover:underline">
                AIDO Digital Agency
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
