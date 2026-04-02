import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getOrders } from "@/actions/orders";
import { getSettings } from "@/actions/menu";
import { formatPrice } from "@/lib/whatsapp";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, DollarSign, Clock, TrendingUp } from "lucide-react";
import { AdminOrdersList } from "@/components/admin/orders-list";
import { ToggleOpen } from "@/components/admin/toggle-open";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [orders, settings] = await Promise.all([getOrders(), getSettings()]);

  const totalSales = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + o.total, 0);

  const activeOrders = orders.filter(
    (o) => o.status === "RECEIVED" || o.status === "PREPARING" || o.status === "ON_THE_WAY"
  );
  const completedOrders = orders.filter((o) => o.status === "DELIVERED");

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--focaccia-dark)]">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString("es-AR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <ToggleOpen isOpen={settings?.isOpen ?? false} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          title="Pedidos hoy"
          value={orders.length.toString()}
          icon={<ShoppingCart className="w-4 h-4" />}
          color="text-blue-600 bg-blue-50"
        />
        <StatCard
          title="Ventas"
          value={formatPrice(totalSales)}
          icon={<DollarSign className="w-4 h-4" />}
          color="text-green-600 bg-green-50"
        />
        <StatCard
          title="Activos"
          value={activeOrders.length.toString()}
          icon={<Clock className="w-4 h-4" />}
          color="text-orange-600 bg-orange-50"
        />
        <StatCard
          title="Completados"
          value={completedOrders.length.toString()}
          icon={<TrendingUp className="w-4 h-4" />}
          color="text-purple-600 bg-purple-50"
        />
      </div>

      {/* Pedidos activos */}
      <div>
        <h2 className="text-lg font-bold mb-3">
          Pedidos del día{" "}
          {orders.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {orders.length}
            </Badge>
          )}
        </h2>
        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <span className="text-4xl">📭</span>
              <p className="mt-3 text-muted-foreground">
                No hay pedidos hoy todavía
              </p>
            </CardContent>
          </Card>
        ) : (
          <AdminOrdersList orders={orders} />
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <div className={`p-1.5 rounded-lg ${color}`}>{icon}</div>
        </div>
        <p className="text-xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
