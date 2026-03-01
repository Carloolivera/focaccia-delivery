import { getCategories, getSettings } from "@/actions/menu";
import { MenuClient } from "@/components/public/menu-client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Menú — Pizzería Focaccia | Chascomús",
  description: "Empanadas, pizzas y tartas. Pedí online con delivery o retiro en local.",
};

export default async function MenuPage() {
  const [categories, settings] = await Promise.all([
    getCategories(),
    getSettings(),
  ]);

  return (
    <MenuClient
      categories={categories}
      isOpen={settings?.isOpen ?? false}
      estimatedTime={settings?.estimatedTime ?? "40-50 min"}
    />
  );
}
