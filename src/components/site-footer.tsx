import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/20">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 col-span-1 md:col-span-2">
            <div className="flex items-center gap-2">
              <img
                src="/Logo.png"
                alt="Logo ANDES"
                className="h-9 w-auto rounded-lg object-contain"
              />
              <span className="text-lg font-black tracking-tight text-foreground">ANDES</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Asociación Nacional para el Desarrollo Social. Impulsando la inclusión educativa y el
              acceso universal a recursos didácticos de calidad a través de la tecnología 3D.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Plataforma
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  to="/catalogo"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Catálogo
                </Link>
              </li>
              <li>
                <Link
                  to="/seguimiento"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Seguimiento
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Administración
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/admin"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Panel de Control
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Soporte Técnico
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} ANDES. Todos los derechos reservados. Plataforma MVP —
            Hackathon.
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacidad
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Términos
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
