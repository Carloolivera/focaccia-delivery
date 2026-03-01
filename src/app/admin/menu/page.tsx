import { getCategories } from "@/actions/menu";
import { formatPrice } from "@/lib/whatsapp";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminMenuPage() {
  const categories = await getCategories();

  const totalProducts = categories.reduce(
    (sum, cat) => sum + cat.products.length,
    0
  );

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--focaccia-dark)]">
            Menú
          </h1>
          <p className="text-sm text-muted-foreground">
            {totalProducts} productos en {categories.length} categorías
          </p>
        </div>
      </div>

      {categories.map((category) => (
        <Card key={category.id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                {category.slug === "empanadas" && "🥟"}
                {category.slug === "pizzas" && "🍕"}
                {category.slug === "tartas" && "🥧"}
                {category.name}
                <Badge variant="secondary" className="text-xs">
                  {category.products.length}
                </Badge>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {category.products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{product.name}</p>
                      {!product.available && (
                        <Badge
                          variant="destructive"
                          className="text-[10px] px-1.5"
                        >
                          No disponible
                        </Badge>
                      )}
                    </div>
                    {product.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {product.description}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="font-bold text-sm text-[var(--focaccia-orange)]">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Info para edición futura */}
      <Card className="border-dashed border-2 border-muted">
        <CardContent className="py-8 text-center">
          <span className="text-3xl mb-2 block">✏️</span>
          <p className="text-sm text-muted-foreground">
            La edición de productos estará disponible próximamente
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Por ahora podés gestionar el menú desde Prisma Studio
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
