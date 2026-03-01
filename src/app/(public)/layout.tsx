import Link from "next/link";
import { MapPin, Clock, Phone, Instagram } from "lucide-react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[var(--focaccia-dark)] text-white shadow-lg">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🍕</span>
            <div>
              <h1 className="text-lg font-bold leading-tight tracking-tight">
                <span className="text-[var(--focaccia-orange)]">Focaccia</span>
              </h1>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">
                Pizzería
              </p>
            </div>
          </Link>
          <a
            href="https://wa.me/542241693947"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-3 py-2 rounded-full transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden min-[360px]:inline">WhatsApp</span>
          </a>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-[var(--focaccia-dark)] text-white py-8">
        <div className="max-w-lg mx-auto px-4 space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-[var(--focaccia-orange)] shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Bolivia 55</p>
              <p className="text-sm text-gray-400">Chascomús, Buenos Aires</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-[var(--focaccia-orange)] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm">Martes a Jueves: 20:00 - 23:00</p>
              <p className="text-sm">Viernes a Domingos: 20:00 - 23:30</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Instagram className="w-5 h-5 text-[var(--focaccia-orange)] shrink-0" />
            <a
              href="https://www.instagram.com/focacciapizzeria_ch/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-[var(--focaccia-orange)] transition-colors"
            >
              @focacciapizzeria_ch
            </a>
          </div>

          <div className="pt-4 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-500">
              Desarrollado por{" "}
              <a
                href="https://aidoagencia.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--focaccia-orange)] hover:underline"
              >
                AIDO Digital Agency
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
