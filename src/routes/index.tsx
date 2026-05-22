import { createFileRoute, Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Boxes, HandHeart, Layers3, ShieldCheck, ArrowRight, Package } from "lucide-react";
import { MATERIALS, CATEGORY_LABEL } from "@/data/materials";
import { ModelViewer } from "@/components/model-viewer";
import { InteractiveViewer } from "@/components/interactive-viewer";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ANDES — Marketplace 3D Inclusivo" },
      {
        name: "description",
        content:
          "ANDES centraliza solicitudes de materiales didácticos y ayudas técnicas de accesibilidad con un catálogo 3D interactivo.",
      },
      { property: "og:title", content: "ANDES — Marketplace 3D Inclusivo" },
      {
        property: "og:description",
        content:
          "Plataforma social que acerca materiales didácticos y ayudas técnicas a quienes los necesitan.",
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  // Tomamos los primeros 3 materiales como "Destacados"
  const featuredMaterials = MATERIALS.slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-28 lg:pt-32 lg:pb-40 min-h-[85vh] flex items-center">
        {/* Background Video */}
        <div className="absolute inset-0 -z-20 w-full h-full overflow-hidden bg-gradient-to-b from-primary/20 to-primary/40">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover max-sm:object-[50%_20%]"
          >
            <source src="/videofondohero.mp4" type="video/mp4" />
          </video>
          {/* Visible overlay shadow to make text highly legible */}
          <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px]" />
        </div>

        <div className="mx-auto grid max-w-7xl gap-12 px-4 md:grid-cols-2 md:items-center">
          <div className="max-w-2xl text-white">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-md shadow-sm mb-6">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>
              Asociación Nacional para el Desarrollo Social
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1]">
              Recursos educativos <br className="hidden sm:block" />
              <span className="bg-clip-text text-transparent bg-linear-to-r from-primary via-primary/80 to-accent">
                al alcance de todos.
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-200 leading-relaxed drop-shadow-sm">
              Plataforma integral que democratiza el acceso a material educativo especializado y
              ayudas técnicas. Mediante visualización 3D interactiva en tiempo real y fabricación
              digital optimizada, facilitamos el proceso de solicitud y seguimiento para
              instituciones y comunidades de todo el país.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/catalogo"
                className={buttonVariants({
                  size: "lg",
                  className:
                    "h-14 px-8 text-base font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all bg-primary hover:bg-primary/95 text-primary-foreground border-0",
                })}
              >
                Explorar marketplace <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to="/admin"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className:
                    "h-14 px-8 text-base font-semibold bg-white/10 hover:bg-white/20 border-white/20 text-white backdrop-blur-sm",
                })}
              >
                Acceso corporativo
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:gap-6 relative">
            {[
              {
                icon: Boxes,
                label: "Inventario en tiempo real",
                desc: "Gestión y control de stock centralizado",
              },
              {
                icon: Layers3,
                label: "Visor 3D interactivo",
                desc: "Inspección 360° y Realidad Aumentada",
              },
              {
                icon: HandHeart,
                label: "Impacto y equidad social",
                desc: "Diseñado para la inclusión educativa",
              },
              {
                icon: ShieldCheck,
                label: "Seguridad y trazabilidad",
                desc: "Monitoreo completo de solicitudes",
              },
            ].map((f) => (
              <Card
                key={f.label}
                className="border-white/10 bg-black/40 backdrop-blur-md text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/50"
              >
                <CardContent className="flex flex-col items-start gap-3 p-6">
                  <span className="rounded-xl bg-primary/20 p-3 text-primary ring-1 ring-primary/30 shadow-inner">
                    <f.icon className="h-6 w-6" aria-hidden />
                  </span>
                  <div>
                    <p className="font-bold text-white leading-tight mb-1">{f.label}</p>
                    <p className="text-sm text-slate-300">{f.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-secondary/30 border-y border-border/50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Materiales Destacados
              </h2>
              <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
                Explora los recursos más solicitados e interactúa con sus modelos en 3D para
                comprender a detalle su diseño anatómico y funcional antes de realizar tu pedido.
              </p>
            </div>
            <Link
              to="/catalogo"
              className="inline-flex items-center font-semibold text-primary hover:text-primary/80 transition-colors group"
            >
              Ver todo el inventario{" "}
              <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featuredMaterials.map((m) => (
              <Card
                key={m.id}
                className="group flex flex-col overflow-hidden border-border/40 bg-background shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/30"
              >
                <div className="relative h-64 w-full">
                  <InteractiveViewer material={m} />
                </div>
                <CardHeader className="pb-3 pt-5">
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <Badge
                      variant="outline"
                      className="border-primary/30 bg-primary/10 text-primary"
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
                </CardHeader>
                <CardContent className="flex-1 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                  {m.description}
                </CardContent>
                <CardFooter className="pt-2 pb-5">
                  <Link
                    to="/solicitar/$id"
                    params={{ id: m.id }}
                    className={buttonVariants({
                      className: "w-full font-semibold shadow-sm transition-all hover:shadow-md",
                    })}
                  >
                    Ver detalles
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24 relative">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl mb-16">
            ¿Cómo funciona ANDES?
          </h2>
          <div className="grid gap-10 md:grid-cols-3 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-6 left-[16.66%] right-[16.66%] h-[2px] bg-linear-to-r from-primary/10 via-primary/30 to-primary/10 -z-10" />

            {[
              {
                title: "Explora y visualiza",
                body: "Recorre nuestro catálogo y examina los materiales didácticos con modelado 3D realista desde cualquier dispositivo.",
              },
              {
                title: "Solicita con facilidad",
                body: "Completa el formulario en pocos pasos; nuestro sistema procesará automáticamente tu reserva y orden de fabricación.",
              },
              {
                title: "Rastrea y recibe",
                body: "Sigue el progreso de fabricación en tiempo real y recibe tus materiales educativos listos para impactar a tu comunidad.",
              },
            ].map((s, i) => (
              <div key={s.title} className="flex flex-col items-center group">
                <div className="w-12 h-12 rounded-full bg-background border-2 border-primary text-primary flex items-center justify-center text-xl font-extrabold shadow-sm mb-6 transition-transform group-hover:scale-110 duration-300">
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold text-foreground">{s.title}</h3>
                <p className="mt-3 text-muted-foreground max-w-xs">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
