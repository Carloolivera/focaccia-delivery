import Link from "next/link";
import { signOut } from "@/auth";
import { LayoutDashboard, ClipboardList, UtensilsCrossed, Settings, LogOut } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-[var(--focaccia-dark)] text-white">
        <div className="p-4 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-2xl">🍕</span>
            <div>
              <h1 className="font-bold text-[var(--focaccia-orange)]">Focaccia</h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Panel Admin</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <NavItem href="/admin" icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" />
          <NavItem href="/admin/pedidos" icon={<ClipboardList className="w-5 h-5" />} label="Pedidos" />
          <NavItem href="/admin/menu" icon={<UtensilsCrossed className="w-5 h-5" />} label="Menú" />
          <NavItem href="/admin/config" icon={<Settings className="w-5 h-5" />} label="Configuración" />
        </nav>
        <div className="p-3 border-t border-white/10">
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-lg">
        <nav className="flex items-center justify-around py-2">
          <MobileNavItem href="/admin" icon={<LayoutDashboard className="w-5 h-5" />} label="Inicio" />
          <MobileNavItem href="/admin/pedidos" icon={<ClipboardList className="w-5 h-5" />} label="Pedidos" />
          <MobileNavItem href="/admin/menu" icon={<UtensilsCrossed className="w-5 h-5" />} label="Menú" />
          <MobileNavItem href="/admin/config" icon={<Settings className="w-5 h-5" />} label="Config" />
        </nav>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto pb-20 md:pb-0">
        {children}
      </main>
    </div>
  );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
    >
      {icon}
      {label}
    </Link>
  );
}

function MobileNavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center gap-0.5 px-3 py-1 text-muted-foreground hover:text-[var(--focaccia-orange)] transition-colors"
    >
      {icon}
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}
