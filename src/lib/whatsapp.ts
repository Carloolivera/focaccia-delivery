/**
 * Genera un link de WhatsApp con el resumen del pedido
 */
export function generateWhatsAppLink(
  phone: string,
  orderNumber: number,
  items: { name: string; quantity: number; price: number }[],
  total: number,
  type: "DELIVERY" | "PICKUP",
  customerName: string,
  address?: string | null,
  notes?: string | null
): string {
  const cleanPhone = phone.replace(/\D/g, "");
  const argPhone = cleanPhone.startsWith("54") ? cleanPhone : `54${cleanPhone}`;

  let message = `🍕 *NUEVO PEDIDO #${orderNumber}*\n`;
  message += `━━━━━━━━━━━━━━━━━━\n`;
  message += `👤 *Cliente:* ${customerName}\n`;
  message += `📦 *Tipo:* ${type === "DELIVERY" ? "🏠 Delivery" : "🏪 Retiro en local"}\n`;
  
  if (type === "DELIVERY" && address) {
    message += `📍 *Dirección:* ${address}\n`;
  }
  
  message += `\n🛒 *Detalle del pedido:*\n`;
  
  for (const item of items) {
    message += `  • ${item.quantity}x ${item.name} — $${item.price.toLocaleString("es-AR")}\n`;
  }
  
  message += `\n💰 *TOTAL: $${total.toLocaleString("es-AR")}*\n`;
  message += `💵 *Pago:* Efectivo al recibir\n`;
  
  if (notes) {
    message += `\n📝 *Notas:* ${notes}\n`;
  }
  
  message += `\n━━━━━━━━━━━━━━━━━━`;

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${argPhone}?text=${encoded}`;
}

/**
 * Genera el link de WhatsApp para que el CLIENTE confirme su pedido
 */
export function generateClientWhatsAppLink(
  businessPhone: string,
  orderNumber: number,
  customerName: string,
  total: number
): string {
  const cleanPhone = businessPhone.replace(/\D/g, "");
  const argPhone = cleanPhone.startsWith("54") ? cleanPhone : `54${cleanPhone}`;

  const message = `Hola! Soy ${customerName}, acabo de hacer el pedido #${orderNumber} por $${total.toLocaleString("es-AR")}. ¡Gracias! 🍕`;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${argPhone}?text=${encoded}`;
}

/**
 * Formatea precio en pesos argentinos
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Traduce el estado del pedido a español
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    RECEIVED: "Recibido",
    PREPARING: "Preparando",
    ON_THE_WAY: "En camino",
    DELIVERED: "Entregado",
    CANCELLED: "Cancelado",
  };
  return labels[status] || status;
}

/**
 * Color del badge según estado
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    RECEIVED: "bg-blue-100 text-blue-800",
    PREPARING: "bg-yellow-100 text-yellow-800",
    ON_THE_WAY: "bg-purple-100 text-purple-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}
