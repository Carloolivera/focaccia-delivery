"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/actions/orders";
import { formatPrice, getStatusLabel, getStatusColor, generateWhatsAppLink } from "@/lib/whatsapp";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageCircle, ChevronDown, ChevronUp, MapPin, User, Phone, Clock } from "lucide-react";
import { toast } from "sonner";

interface OrderWithItems {
  id: string;
  orderNumber: number;
  status: string;
  type: string;
  customerName: string;
  customerPhone: string;
  address: string | null;
  addressNote: string | null;
  notes: string | null;
  total: number;
  createdAt: Date;
  items: {
    id: string;
    quantity: number;
    price: number;
    product: { name: string };
  }[];
}

export function AdminOrdersList({ orders }: { orders: OrderWithItems[] }) {
  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}

function OrderCard({ order }: { order: OrderWithItems }) {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    try {
      await updateOrderStatus(
        order.id,
        newStatus as "RECEIVED" | "PREPARING" | "ON_THE_WAY" | "DELIVERED" | "CANCELLED"
      );
      setStatus(newStatus);
      toast.success(`Pedido #${order.orderNumber}: ${getStatusLabel(newStatus)}`);
    } catch {
      toast.error("Error al actualizar estado");
    } finally {
      setUpdating(false);
    }
  };

  const whatsappLink = generateWhatsAppLink(
    order.customerPhone,
    order.orderNumber,
    order.items.map((i) => ({
      name: i.product.name,
      quantity: i.quantity,
      price: i.price * i.quantity,
    })),
    order.total,
    order.type as "DELIVERY" | "PICKUP",
    order.customerName,
    order.address,
    order.notes
  );

  const timeAgo = getTimeAgo(new Date(order.createdAt));

  return (
    <Card
      className={`overflow-hidden transition-all ${
        status === "CANCELLED" ? "opacity-50" : ""
      }`}
    >
      <CardContent className="p-0">
        {/* Header del pedido */}
        <div
          className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-bold text-base">#{order.orderNumber}</span>
              <Badge className={`text-[10px] ${getStatusColor(status)}`}>
                {getStatusLabel(status)}
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                {order.type === "DELIVERY" ? "🏠 Delivery" : "🏪 Retiro"}
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {order.customerName}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {timeAgo}
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="font-bold text-[var(--focaccia-orange)]">
              {formatPrice(order.total)}
            </p>
            <p className="text-xs text-muted-foreground">
              {order.items.length} {order.items.length === 1 ? "item" : "items"}
            </p>
          </div>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
          )}
        </div>

        {/* Detalles expandidos */}
        {expanded && (
          <div className="border-t border-border p-4 space-y-4 bg-gray-50/50">
            {/* Items */}
            <div className="space-y-1.5">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span>
                    {item.quantity}x {item.product.name}
                  </span>
                  <span className="font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Datos del cliente */}
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                <a
                  href={`tel:${order.customerPhone}`}
                  className="text-[var(--focaccia-orange)] hover:underline"
                >
                  {order.customerPhone}
                </a>
              </div>
              {order.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5" />
                  <div>
                    <p>{order.address}</p>
                    {order.addressNote && (
                      <p className="text-xs text-muted-foreground">{order.addressNote}</p>
                    )}
                  </div>
                </div>
              )}
              {order.notes && (
                <p className="text-xs text-muted-foreground bg-yellow-50 p-2 rounded-lg">
                  📝 {order.notes}
                </p>
              )}
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-2">
              <Select
                value={status}
                onValueChange={handleStatusChange}
                disabled={updating}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RECEIVED">📥 Recibido</SelectItem>
                  <SelectItem value="PREPARING">👨‍🍳 Preparando</SelectItem>
                  <SelectItem value="ON_THE_WAY">🛵 En camino</SelectItem>
                  <SelectItem value="DELIVERED">✅ Entregado</SelectItem>
                  <SelectItem value="CANCELLED">❌ Cancelado</SelectItem>
                </SelectContent>
              </Select>

              <Button
                asChild
                variant="outline"
                size="sm"
                className="shrink-0 text-green-600 border-green-300 hover:bg-green-50"
              >
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return "ahora";
  if (diffMin < 60) return `hace ${diffMin} min`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `hace ${diffHours}h`;
  return date.toLocaleDateString("es-AR");
}
