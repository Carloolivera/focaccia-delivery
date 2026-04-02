import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, MessageCircle, ArrowLeft } from "lucide-react";
import { formatPrice, generateClientWhatsAppLink } from "@/lib/whatsapp";
import { getSettings } from "@/actions/menu";

interface ConfirmadoPageProps {
  searchParams: Promise<{
    order?: string;
    name?: string;
    total?: string;
    type?: string;
  }>;
}

export default async function ConfirmadoPage({ searchParams }: ConfirmadoPageProps) {
  const [params, settings] = await Promise.all([searchParams, getSettings()]);
  const orderNumber = params.order || "---";
  const customerName = params.name ? decodeURIComponent(params.name) : "Cliente";
  const total = params.total ? parseFloat(params.total) : 0;
  const type = params.type || "DELIVERY";
  const phone = settings?.phone1 ?? "2241693947";

  const whatsappLink = generateClientWhatsAppLink(
    phone,
    parseInt(orderNumber) || 0,
    customerName,
    total
  );

  return (
    <div className="max-w-lg mx-auto px-4 py-12 text-center space-y-6">
      {/* Animación de check */}
      <div className="relative inline-block">
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto animate-bounce">
          <CheckCircle className="w-14 h-14 text-green-600" />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-[var(--focaccia-dark)]">
          ¡Pedido confirmado!
        </h2>
        <div className="inline-block px-4 py-2 rounded-full bg-[var(--focaccia-warm)]">
          <p className="text-lg font-bold text-[var(--focaccia-orange)]">
            Pedido #{orderNumber}
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-white border border-border space-y-2 text-left">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Cliente</span>
          <span className="text-sm font-medium">{customerName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Tipo</span>
          <span className="text-sm font-medium">
            {type === "DELIVERY" ? "🏠 Delivery" : "🏪 Retiro en local"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-sm font-bold text-[var(--focaccia-orange)]">
            {formatPrice(total)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Pago</span>
          <span className="text-sm font-medium">💵 Efectivo</span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        Tu pedido fue recibido y está siendo preparado.
        <br />
        Tiempo estimado: <strong>40-50 minutos</strong>
      </p>

      <div className="space-y-3">
        <Button
          asChild
          size="lg"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6 rounded-2xl"
        >
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="w-5 h-5 mr-2" />
            Hablar con Focaccia por WhatsApp
          </a>
        </Button>

        <Button
          asChild
          variant="outline"
          size="lg"
          className="w-full py-6 rounded-2xl"
        >
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Link>
        </Button>
      </div>

      <p className="text-xs text-muted-foreground pt-4">
        ¿Problemas con tu pedido? Llamanos al{" "}
        <a href={`tel:${phone}`} className="text-[var(--focaccia-orange)] font-medium">
          {phone}
        </a>
      </p>
    </div>
  );
}
