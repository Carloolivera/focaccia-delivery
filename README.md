# Focaccia Delivery

Sistema de pedidos online para pizzería. Menú interactivo, carrito persistente, panel admin y notificación por WhatsApp.

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 + Tailwind CSS v4 + shadcn/ui |
| Base de datos | PostgreSQL (Neon serverless) |
| ORM | Prisma 7 (Driver Adapter) |
| Auth | NextAuth v5 (admin) |
| Estado | Zustand 5 (carrito) |
| Deploy | Vercel |

## Features

- **Menú interactivo** — categorías, productos con imagen, descripción y precio
- **Carrito persistente** — Zustand con estado local, agregar/quitar items
- **Checkout** — delivery o retiro en local, datos del cliente
- **Notificación WhatsApp** — genera link con el pedido formateado para el negocio
- **Panel admin** — gestión de menú, pedidos, configuración del negocio
- **Auth admin** — login con credenciales, protección de rutas
- **Dark mode** — toggle de tema
- **Responsive** — adaptado a mobile

## Páginas

```
Públicas:
  /              → Landing
  /menu          → Menú interactivo con carrito
  /pedido        → Checkout (datos + envío)
  /confirmado    → Confirmación del pedido

Admin:
  /login         → Acceso admin
  /admin         → Dashboard
  /admin/menu    → CRUD de categorías y productos
  /admin/pedidos → Gestión de pedidos
  /admin/config  → Configuración del negocio
```

## Quick Start

```bash
git clone https://github.com/Carloolivera/focaccia-delivery.git
cd focaccia-delivery
npm install
```

Crear `.env`:

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
```

```bash
npx prisma db push
npx prisma db seed
npm run dev
```

## Modelo de datos

```
Category    → categorías del menú (pizzas, empanadas, etc.)
Product     → productos con precio, imagen, stock
Order       → pedidos (delivery/pickup) con estado
OrderItem   → items de cada pedido
Settings    → nombre del negocio, WhatsApp, horarios
AdminUser   → credenciales del admin
```

---

Desarrollado por [AIDO Digital Agency](https://aidoagencia.com) · Chascomús, Buenos Aires
