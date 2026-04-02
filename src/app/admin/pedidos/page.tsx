import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getOrders } from "@/actions/orders";
import { AdminOrdersList } from "@/components/admin/orders-list";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function PedidosPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const orders = await getOrders();

  const received = orders.filter((o) => o.status === "RECEIVED");
  const preparing = orders.filter((o) => o.status === "PREPARING");
  const onTheWay = orders.filter((o) => o.status === "ON_THE_WAY");
  const delivered = orders.filter((o) => o.status === "DELIVERED");
  const cancelled = orders.filter((o) => o.status === "CANCELLED");

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--focaccia-dark)]">
          Pedidos
        </h1>
        <p className="text-sm text-muted-foreground">
          Gestión de pedidos del día
        </p>
      </div>

      {/* Filtros rápidos */}
      <div className="flex flex-wrap gap-2">
        <FilterBadge label="Todos" count={orders.length} active />
        <FilterBadge label="Recibidos" count={received.length} color="bg-yellow-100 text-yellow-700" />
        <FilterBadge label="Preparando" count={preparing.length} color="bg-blue-100 text-blue-700" />
        <FilterBadge label="En camino" count={onTheWay.length} color="bg-purple-100 text-purple-700" />
        <FilterBadge label="Entregados" count={delivered.length} color="bg-green-100 text-green-700" />
        {cancelled.length > 0 && (
          <FilterBadge label="Cancelados" count={cancelled.length} color="bg-red-100 text-red-700" />
        )}
      </div>

      {/* Lista de pedidos */}
      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <span className="text-5xl mb-4 block">📭</span>
            <p className="text-lg font-medium text-muted-foreground">
              No hay pedidos hoy
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Los pedidos aparecerán aquí cuando los clientes realicen sus compras
            </p>
          </CardContent>
        </Card>
      ) : (
        <AdminOrdersList orders={orders} />
      )}
    </div>
  );
}

function FilterBadge({
  label,
  count,
  color,
  active,
}: {
  label: string;
  count: number;
  color?: string;
  active?: boolean;
}) {
  return (
    <Badge
      variant={active ? "default" : "outline"}
      className={`cursor-default ${
        active
          ? "bg-[var(--focaccia-orange)] hover:bg-[var(--focaccia-orange)]"
          : color || ""
      }`}
    >
      {label}{" "}
      <span className="ml-1 font-bold">{count}</span>
    </Badge>
  );
}
