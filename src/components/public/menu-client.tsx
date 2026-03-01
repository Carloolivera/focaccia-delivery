"use client";

import { useState } from "react";
import { Plus, Minus, ShoppingCart, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useCartStore, type CartItem } from "@/lib/cart-store";
import { formatPrice } from "@/lib/whatsapp";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
  products: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    image: string | null;
    available: boolean;
  }[];
}

interface MenuClientProps {
  categories: Category[];
  isOpen: boolean;
  estimatedTime: string;
}

export function MenuClient({ categories, isOpen, estimatedTime }: MenuClientProps) {
  const [activeTab, setActiveTab] = useState(categories[0]?.slug || "");
  const { items, addItem, updateQuantity, getTotal, getItemCount } = useCartStore();
  const [cartOpen, setCartOpen] = useState(false);

  const itemCount = getItemCount();
  const total = getTotal();

  const getItemQuantity = (productId: string) => {
    const item = items.find((i) => i.id === productId);
    return item?.quantity || 0;
  };

  const categoryEmojis: Record<string, string> = {
    empanadas: "🥟",
    pizzas: "🍕",
    tartas: "🥧",
  };

  return (
    <div className="max-w-lg mx-auto pb-24">
      {/* Estado y tiempo */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isOpen ? "bg-green-500 animate-pulse" : "bg-red-500"
            }`}
          />
          <span className="text-sm text-muted-foreground">
            {isOpen ? "Abierto" : "Cerrado"}
          </span>
        </div>
        <span className="text-sm text-muted-foreground">
          ⏱ {estimatedTime}
        </span>
      </div>

      {/* Tabs de categorías */}
      <div className="sticky top-[60px] z-40 bg-background border-b border-border">
        <div className="flex px-4 gap-1 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveTab(cat.slug)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === cat.slug
                  ? "border-[var(--focaccia-orange)] text-[var(--focaccia-orange)]"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <span>{categoryEmojis[cat.slug] || "📦"}</span>
              {cat.name}
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {cat.products.length}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Productos */}
      <div className="px-4 py-4 space-y-3">
        {categories
          .find((c) => c.slug === activeTab)
          ?.products.map((product) => {
            const qty = getItemQuantity(product.id);
            return (
              <div
                key={product.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-white border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Emoji placeholder */}
                <div className="shrink-0 w-14 h-14 rounded-lg bg-[var(--focaccia-warm)] flex items-center justify-center text-2xl">
                  {categoryEmojis[activeTab] || "📦"}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[var(--focaccia-dark)] truncate">
                    {product.name}
                  </p>
                  {product.description && (
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {product.description}
                    </p>
                  )}
                  <p className="text-sm font-bold text-[var(--focaccia-orange)] mt-0.5">
                    {formatPrice(product.price)}
                  </p>
                </div>

                {/* Add/Remove */}
                <div className="shrink-0">
                  {qty === 0 ? (
                    <Button
                      size="sm"
                      onClick={() =>
                        addItem({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          categoryName:
                            categories.find((c) => c.slug === activeTab)?.name || "",
                        })
                      }
                      className="bg-[var(--focaccia-orange)] hover:bg-[var(--focaccia-orange)]/90 text-white rounded-full w-9 h-9 p-0"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(product.id, qty - 1)}
                        className="rounded-full w-8 h-8 p-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-5 text-center text-sm font-bold">
                        {qty}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => updateQuantity(product.id, qty + 1)}
                        className="bg-[var(--focaccia-orange)] hover:bg-[var(--focaccia-orange)]/90 text-white rounded-full w-8 h-8 p-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>

      {/* Carrito flotante (FAB) */}
      {itemCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-background via-background to-transparent pt-8">
          <div className="max-w-lg mx-auto">
            <Sheet open={cartOpen} onOpenChange={setCartOpen}>
              <SheetTrigger asChild>
                <Button
                  size="lg"
                  className="w-full bg-[var(--focaccia-orange)] hover:bg-[var(--focaccia-orange)]/90 text-white font-bold text-base py-6 rounded-2xl shadow-xl shadow-orange-900/30 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    <span>Ver pedido</span>
                    <Badge className="bg-white text-[var(--focaccia-orange)] font-bold">
                      {itemCount}
                    </Badge>
                  </div>
                  <span className="font-bold">{formatPrice(total)}</span>
                </Button>
              </SheetTrigger>

              <SheetContent side="bottom" className="rounded-t-3xl max-h-[80vh]">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    🛒 Tu Pedido ({itemCount} {itemCount === 1 ? "item" : "items"})
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-4 space-y-3 overflow-y-auto max-h-[40vh]">
                  {items.map((item) => (
                    <CartItemRow
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                    />
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="flex items-center justify-between py-2">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-xl font-extrabold text-[var(--focaccia-orange)]">
                    {formatPrice(total)}
                  </span>
                </div>

                <Button
                  asChild
                  size="lg"
                  className="w-full mt-4 bg-[var(--focaccia-green)] hover:bg-[var(--focaccia-green-light)] text-white font-bold text-base py-6 rounded-2xl"
                  onClick={() => setCartOpen(false)}
                >
                  <Link href="/pedido">
                    Continuar con el pedido
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </Link>
                </Button>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      )}
    </div>
  );
}

function CartItemRow({
  item,
  onUpdateQuantity,
}: {
  item: CartItem;
  onUpdateQuantity: (id: string, qty: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{item.name}</p>
        <p className="text-xs text-muted-foreground">{item.categoryName}</p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          className="rounded-full w-7 h-7 p-0"
        >
          <Minus className="w-3 h-3" />
        </Button>
        <span className="w-5 text-center text-sm font-bold">{item.quantity}</span>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          className="rounded-full w-7 h-7 p-0"
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>
      <p className="text-sm font-bold w-20 text-right">
        {formatPrice(item.price * item.quantity)}
      </p>
    </div>
  );
}
