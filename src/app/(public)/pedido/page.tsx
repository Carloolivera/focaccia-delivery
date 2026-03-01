"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { createOrder } from "@/actions/orders";
import { formatPrice } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Home,
  Store,
  Loader2,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function PedidoPage() {
  const router = useRouter();
  const { items, getTotal, getItemCount, updateQuantity, removeItem, clearCart } =
    useCartStore();
  const [type, setType] = useState<"DELIVERY" | "PICKUP">("DELIVERY");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [addressNote, setAddressNote] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const total = getTotal();
  const itemCount = getItemCount();

  if (itemCount === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center space-y-4">
        <span className="text-6xl">🛒</span>
        <h2 className="text-xl font-bold">Tu carrito está vacío</h2>
        <p className="text-muted-foreground">
          Agregá productos del menú para hacer tu pedido
        </p>
        <Button asChild className="mt-4">
          <Link href="/menu">Ver menú</Link>
        </Button>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Ingresá tu nombre");
      return;
    }
    if (!phone.trim()) {
      toast.error("Ingresá tu teléfono");
      return;
    }
    if (type === "DELIVERY" && !address.trim()) {
      toast.error("Ingresá tu dirección para el delivery");
      return;
    }

    setLoading(true);
    try {
      const order = await createOrder({
        type,
        customerName: name.trim(),
        customerPhone: phone.trim(),
        address: type === "DELIVERY" ? address.trim() : undefined,
        addressNote: type === "DELIVERY" ? addressNote.trim() || undefined : undefined,
        notes: notes.trim() || undefined,
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      clearCart();
      router.push(
        `/confirmado?order=${order.orderNumber}&name=${encodeURIComponent(name)}&total=${total}&type=${type}`
      );
    } catch {
      toast.error("Error al crear el pedido. Intentá de nuevo.");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-4 space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm" className="rounded-full">
          <Link href="/menu">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <h2 className="text-xl font-bold">Tu Pedido</h2>
      </div>

      {/* Items */}
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 rounded-xl bg-white border border-border"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.categoryName}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="rounded-full w-7 h-7 p-0"
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="w-6 text-center text-sm font-bold">
                {item.quantity}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="rounded-full w-7 h-7 p-0"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            <p className="text-sm font-bold w-20 text-right shrink-0">
              {formatPrice(item.price * item.quantity)}
            </p>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => removeItem(item.id)}
              className="text-red-500 hover:text-red-700 rounded-full w-7 h-7 p-0 shrink-0"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <span className="text-lg font-bold">Total</span>
        <span className="text-xl font-extrabold text-[var(--focaccia-orange)]">
          {formatPrice(total)}
        </span>
      </div>

      <Separator />

      {/* Tipo de entrega */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">¿Cómo lo querés?</Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setType("DELIVERY")}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
              type === "DELIVERY"
                ? "border-[var(--focaccia-orange)] bg-[var(--focaccia-warm)]"
                : "border-border bg-white hover:border-gray-300"
            }`}
          >
            <Home
              className={`w-6 h-6 ${
                type === "DELIVERY"
                  ? "text-[var(--focaccia-orange)]"
                  : "text-muted-foreground"
              }`}
            />
            <span className="text-sm font-medium">Delivery</span>
          </button>
          <button
            onClick={() => setType("PICKUP")}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
              type === "PICKUP"
                ? "border-[var(--focaccia-orange)] bg-[var(--focaccia-warm)]"
                : "border-border bg-white hover:border-gray-300"
            }`}
          >
            <Store
              className={`w-6 h-6 ${
                type === "PICKUP"
                  ? "text-[var(--focaccia-orange)]"
                  : "text-muted-foreground"
              }`}
            />
            <span className="text-sm font-medium">Retiro en local</span>
          </button>
        </div>
      </div>

      {/* Dirección (solo delivery) */}
      {type === "DELIVERY" && (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="address">Dirección *</Label>
            <Input
              id="address"
              placeholder="Ej: Mitre 320"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="py-5"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="addressNote">Entre calles / Aclaraciones</Label>
            <Input
              id="addressNote"
              placeholder="Ej: entre Laprida y Belgrano, timbre 2"
              value={addressNote}
              onChange={(e) => setAddressNote(e.target.value)}
              className="py-5"
            />
          </div>
        </div>
      )}

      <Separator />

      {/* Datos del cliente */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Tus datos</Label>
        <div className="space-y-1.5">
          <Label htmlFor="name">Nombre *</Label>
          <Input
            id="name"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="py-5"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Teléfono *</Label>
          <Input
            id="phone"
            type="tel"
            inputMode="tel"
            placeholder="Ej: 2241 123456"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="py-5"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="notes">Notas (opcional)</Label>
          <Textarea
            id="notes"
            placeholder="Ej: sin aceitunas, extra muzzarella..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
          />
        </div>
      </div>

      {/* Método de pago */}
      <div className="p-4 rounded-xl bg-green-50 border border-green-200">
        <p className="text-sm font-medium text-green-800">
          💵 Pago: Efectivo al recibir
        </p>
      </div>

      {/* Confirmar */}
      <Button
        size="lg"
        disabled={loading}
        onClick={handleSubmit}
        className="w-full bg-[var(--focaccia-green)] hover:bg-[var(--focaccia-green-light)] text-white font-bold text-base py-6 rounded-2xl shadow-xl"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Procesando...
          </>
        ) : (
          <>Confirmar pedido · {formatPrice(total)}</>
        )}
      </Button>
    </div>
  );
}
