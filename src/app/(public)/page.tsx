import Link from "next/link";
import { getSettings } from "@/actions/menu";
import { ChevronRight, MapPin, Clock, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const settings = await getSettings();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[var(--focaccia-dark)] via-[#2a1a0a] to-[var(--focaccia-dark)] text-white overflow-hidden">
        {/* Patrón decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl">🍕</div>
          <div className="absolute bottom-10 right-10 text-6xl">🥟</div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl opacity-5">
            🍕
          </div>
        </div>

        <div className="relative max-w-lg mx-auto px-4 py-12 text-center space-y-6">
          {/* Estado abierto/cerrado */}
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
              Empanadas · Pizzas · Tartas
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
      <section className="max-w-lg mx-auto px-4 py-10">
        <div className="grid gap-4">
          <FeatureCard
            icon={<Truck className="w-6 h-6" />}
            title="Delivery a domicilio"
            description={settings?.deliveryNote || "Envíos a la zona céntrica"}
          />
          <FeatureCard
            icon={<MapPin className="w-6 h-6" />}
            title="Retiro en local"
            description={settings?.address || "Bolivia 55, Chascomús"}
          />
          <FeatureCard
            icon={<Clock className="w-6 h-6" />}
            title={`Tiempo estimado: ${settings?.estimatedTime || "40-50 min"}`}
            description="Tu pedido preparado al momento"
          />
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="max-w-lg mx-auto px-4 pb-10">
        <h3 className="text-lg font-bold text-center mb-6 text-[var(--focaccia-dark)]">
          ¿Cómo pedir?
        </h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <StepCard number="1" label="Elegí del menú" emoji="📋" />
          <StepCard number="2" label="Armá tu pedido" emoji="🛒" />
          <StepCard number="3" label="¡Listo!" emoji="✅" />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-xl bg-white border border-border shadow-sm">
      <div className="shrink-0 w-12 h-12 rounded-full bg-[var(--focaccia-warm)] flex items-center justify-center text-[var(--focaccia-orange)]">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-[var(--focaccia-dark)]">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function StepCard({
  number,
  label,
  emoji,
}: {
  number: string;
  label: string;
  emoji: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white border border-border">
      <span className="text-3xl">{emoji}</span>
      <div className="w-6 h-6 rounded-full bg-[var(--focaccia-orange)] text-white text-xs font-bold flex items-center justify-center">
        {number}
      </div>
      <p className="text-xs font-medium text-[var(--focaccia-dark)]">{label}</p>
    </div>
  );
}
