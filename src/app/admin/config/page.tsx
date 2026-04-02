import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getSettings } from "@/actions/menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleOpen } from "@/components/admin/toggle-open";
import { MapPin, Phone, Clock, Instagram, Truck, Store } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ConfigPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const settings = await getSettings();

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--focaccia-dark)]">
          Configuración
        </h1>
        <p className="text-sm text-muted-foreground">
          Ajustes del negocio
        </p>
      </div>

      {/* Estado del negocio */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Store className="w-5 h-5" />
            Estado del negocio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Controlá si tu negocio está aceptando pedidos
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Cuando está cerrado, los clientes verán que no estás recibiendo pedidos
              </p>
            </div>
            <ToggleOpen isOpen={settings?.isOpen ?? false} />
          </div>
        </CardContent>
      </Card>

      {/* Datos del negocio */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Datos del negocio</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InfoRow
            icon={<Store className="w-4 h-4" />}
            label="Nombre"
            value={settings?.businessName || "—"}
          />
          <InfoRow
            icon={<MapPin className="w-4 h-4" />}
            label="Dirección"
            value={settings?.address || "—"}
          />
          <InfoRow
            icon={<Phone className="w-4 h-4" />}
            label="Teléfono 1"
            value={settings?.phone1 || "—"}
          />
          <InfoRow
            icon={<Phone className="w-4 h-4" />}
            label="Teléfono 2"
            value={settings?.phone2 || "—"}
          />
          <InfoRow
            icon={<Instagram className="w-4 h-4" />}
            label="Instagram"
            value={settings?.instagram ? `@${settings.instagram}` : "—"}
          />
        </CardContent>
      </Card>

      {/* Delivery */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Delivery
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InfoRow
            icon={<Clock className="w-4 h-4" />}
            label="Tiempo estimado"
            value={settings?.estimatedTime || "—"}
          />
          <InfoRow
            icon={<MapPin className="w-4 h-4" />}
            label="Zona de cobertura"
            value={settings?.deliveryNote || "—"}
          />
        </CardContent>
      </Card>

      {/* Info para edición futura */}
      <Card className="border-dashed border-2 border-muted">
        <CardContent className="py-8 text-center">
          <span className="text-3xl mb-2 block">🔧</span>
          <p className="text-sm text-muted-foreground">
            La edición de configuración estará disponible próximamente
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Por ahora podés modificar los datos desde Prisma Studio
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-border last:border-0">
      <div className="text-muted-foreground">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium truncate">{value}</p>
      </div>
    </div>
  );
}
