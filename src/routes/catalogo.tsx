import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CATEGORY_LABEL, MATERIALS, type Category } from "@/data/materials";
import { ModelViewer } from "@/components/model-viewer";
import { InteractiveViewer } from "@/components/interactive-viewer";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Package } from "lucide-react";

export const Route = createFileRoute("/catalogo")({
  head: () => ({
    meta: [
      { title: "Marketplace 3D — ANDES" },
      {
        name: "description",
        content:
          "Explora materiales didácticos y ayudas de accesibilidad con visor 3D interactivo.",
      },
      { property: "og:title", content: "Marketplace 3D — ANDES" },
      {
        property: "og:description",
        content: "Catálogo interactivo de materiales accesibles con visor 3D.",
      },
    ],
  }),
  component: CatalogPage,
});

const FILTERS: Array<{ value: Category | "all"; label: string }> = [
  { value: "all", label: "Todos los productos" },
  { value: "didactico", label: "Material didáctico" },
  { value: "accesibilidad", label: "Ayudas de accesibilidad" },
];

function CatalogPage() {
  const [filter, setFilter] = useState<Category | "all">("all");

  const items = useMemo(
    () => (filter === "all" ? MATERIALS : MATERIALS.filter((m) => m.category === filter)),
    [filter],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:py-16">
      <header className="mb-12 flex flex-col items-center text-center sm:items-start sm:text-left">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl bg-clip-text text-transparent bg-linear-to-r from-primary via-primary/80 to-accent pb-2">
          Marketplace Interactivo
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">
          Explora, rota y acerca cada material en 3D. Selecciona el recurso que necesitas y verifica
          su disponibilidad en tiempo real antes de solicitarlo.
        </p>

        <div
          role="tablist"
          aria-label="Filtrar por categoría"
          className="mt-8 flex flex-wrap justify-center sm:justify-start gap-2 p-1 bg-secondary/50 backdrop-blur-sm rounded-full border border-border/50"
        >
          {FILTERS.map((f) => (
            <button
              key={f.value}
              role="tab"
              aria-selected={filter === f.value}
              onClick={() => setFilter(f.value)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                filter === f.value
                  ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>

      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10">
        {items.map((m) => (
          <li key={m.id}>
            <Card className="group flex h-full flex-col overflow-hidden border-border/40 bg-background/60 backdrop-blur-md shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30">
              <div className="relative h-72 w-full">
                <InteractiveViewer material={m} />
              </div>
              <CardHeader className="pb-3 pt-5">
                <div className="flex items-start justify-between mb-3 gap-2">
                  <Badge
                    variant="outline"
                    className={
                      m.category === "accesibilidad"
                        ? "border-accent/30 bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                        : "border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    }
                  >
                    {CATEGORY_LABEL[m.category]}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={
                      m.status === "Disponible"
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 shadow-sm"
                        : "border-amber-500/30 bg-amber-500/10 text-amber-600 shadow-sm"
                    }
                  >
                    {m.status}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold tracking-tight line-clamp-1">
                  {m.name}
                </CardTitle>
                <div className="flex items-center text-sm font-medium text-muted-foreground mt-2 bg-secondary/40 w-fit px-2.5 py-1 rounded-md border border-border/50">
                  <Package className="w-4 h-4 mr-1.5 opacity-70" />
                  Stock: <span className="ml-1 text-foreground font-semibold">{m.stock} uds.</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 text-sm text-muted-foreground leading-relaxed">
                {m.description}
              </CardContent>
              <CardFooter className="pt-4 pb-5">
                <Link
                  to="/solicitar/$id"
                  params={{ id: m.id }}
                  className={buttonVariants({
                    className: "w-full font-semibold shadow-sm transition-all hover:shadow-md",
                    size: "lg",
                  })}
                >
                  Solicitar recurso
                </Link>
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
