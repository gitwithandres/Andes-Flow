import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { getMaterial, CATEGORY_LABEL } from "@/data/materials";
import { requestsStore } from "@/services/requests-store";
import { ModelViewer } from "@/components/model-viewer";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowLeft, Package, Send, Loader2, FileText } from "lucide-react";
import { getFactusToken, createFactusInvoice, downloadFactusPdf } from "@/services/factus";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/solicitar/$id")({
  head: ({ params }) => {
    const m = getMaterial(params.id);
    return {
      meta: [
        { title: `Solicitar ${m?.name ?? "material"} — ANDES` },
        {
          name: "description",
          content: `Solicita ${m?.name ?? "un material"} a través de la plataforma ANDES.`,
        },
      ],
    };
  },
  component: RequestPage,
});

const schema = z.object({
  fullName: z.string().trim().min(3, "Ingresa tu nombre completo").max(120),
  idNumber: z
    .string()
    .trim()
    .regex(/^[0-9]{6,15}$/, "La cédula debe contener entre 6 y 15 dígitos"),
  city: z.string().trim().min(2, "Ingresa tu ciudad").max(80),
  email: z.string().trim().email("Correo no válido").max(160),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9+\s-]{7,20}$/, "Teléfono no válido"),
});

type FieldErrors = Partial<Record<keyof z.infer<typeof schema>, string>>;

function RequestPage() {
  const { id } = Route.useParams();
  const material = getMaterial(id);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [invoiceInfo, setInvoiceInfo] = useState<{ number: string; simulated: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!material) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold text-foreground">Material no encontrado</h1>
        <p className="mt-4 text-muted-foreground text-lg">
          El recurso que intentas solicitar no existe o ha sido retirado.
        </p>
        <Link to="/catalogo" className={buttonVariants({ className: "mt-8", size: "lg" })}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al marketplace
        </Link>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = schema.safeParse({
      fullName: fd.get("fullName"),
      idNumber: fd.get("idNumber"),
      city: fd.get("city"),
      email: fd.get("email"),
      phone: fd.get("phone"),
    });
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      toast.error("Revisa los campos del formulario");
      return;
    }
    setErrors({});
    
    try {
      setIsSubmitting(true);
      
      // Integramos Factus para generar factura electrónica
      const token = await getFactusToken();
      const invoiceData = await createFactusInvoice(token, parsed.data, material);
      
      const reqId = invoiceData.number.startsWith('SIMULADA') ? `SOL-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}` : invoiceData.number;
      
      const { error: dbError } = await supabase.from('production_requests').insert([{
        id: reqId,
        institution: "Compra Online - " + parsed.data.fullName,
        resource: material!.name,
        quantity: 1,
        date: new Date().toISOString().split('T')[0],
        responsible: parsed.data.fullName,
        priority: "Media",
        status: "Recibida",
        progress_percentage: 0
      }]);

      if (dbError) {
        console.error("Supabase Error:", dbError);
        // Continuamos para no bloquear al usuario, ya que la factura sí se generó
      }
      
      setInvoiceInfo({ number: reqId, simulated: invoiceData.simulated || false });
      toast.success("Factura y solicitud generadas correctamente", {
        description: "Hemos recibido tus datos y procesado la factura electrónica con éxito."
      });
    } catch (error) {
      toast.error("Error al procesar la solicitud", {
        description: "Hubo un problema comunicándose con el servicio de facturación."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDownloadPdf() {
    if (!invoiceInfo) return;
    
    try {
      setIsDownloading(true);
      
      const token = await getFactusToken();
      const base64Pdf = await downloadFactusPdf(token, invoiceInfo.number);
      
      if (!base64Pdf) {
        throw new Error("PDF no disponible");

      }
      
      // Decodificar Base64 a Blob y descargar
      const byteCharacters = atob(base64Pdf);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {type: "application/pdf"});
      
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `Factura_${invoiceInfo.number}.pdf`;
      link.click();
      
    } catch (error) {
      toast.error("Error de descarga", { description: "Hubo un error al intentar descargar el PDF de la factura." });
    } finally {
      setIsDownloading(false);
    }
  }

  if (invoiceInfo) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 mb-6">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" aria-hidden />
        </div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">¡Solicitud y Factura registradas!</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Gracias por confiar en ANDES. Hemos reservado el material y procesado tu solicitud de facturación. Un miembro del equipo se pondrá en contacto contigo pronto.
        </p>
        <div className="mt-6 bg-muted/50 border border-border p-4 rounded-xl inline-block text-left">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">ID de Seguimiento</p>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-mono font-black text-primary">{invoiceInfo.number}</span>
            <Button variant="outline" size="sm" asChild className="h-8 shadow-sm">
              <Link to="/seguimiento">Rastrear Pedido</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Guarda este código para consultar el estado de fabricación.</p>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Button onClick={handleDownloadPdf} size="lg" disabled={isDownloading} className="font-semibold shadow-sm text-sm">
            {isDownloading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
            Descargar Factura PDF
          </Button>
          <Link to="/catalogo" className={buttonVariants({ variant: "outline", size: "lg", className: "text-sm" })}>
            Explorar más
          </Link>
          <Link to="/admin" className={buttonVariants({ variant: "outline", size: "lg", className: "text-sm" })}>
            Ver panel
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 lg:py-16">
      <Link
        to="/catalogo"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver al marketplace
      </Link>

      <div className="grid gap-8 lg:gap-12 lg:grid-cols-[1.2fr_1fr]">
        <Card className="overflow-hidden border-border/40 bg-background/60 backdrop-blur-md shadow-sm">
          <div className="relative h-96 w-full bg-linear-to-b from-secondary/30 to-secondary/80 overflow-hidden border-b border-border/40">
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_-10px_20px_rgba(0,0,0,0.03)] z-10" />
            {material.embedUrl ? (
              <iframe
                title={`Modelo 3D de ${material.name}`}
                frameBorder="0"
                allowFullScreen
                allow="autoplay; fullscreen; xr-spatial-tracking"
                src={material.embedUrl}
                className="h-full w-full object-cover"
              ></iframe>
            ) : (
              <ModelViewer src={material.modelUrl} alt={`Modelo 3D de ${material.name}`} />
            )}
          </div>
          <CardHeader className="pt-8">
            <div className="flex flex-wrap items-start justify-between mb-4 gap-3">
              <Badge
                variant="outline"
                className={
                  material.category === "accesibilidad"
                    ? "border-accent/30 bg-accent/10 text-accent text-sm py-1 px-3"
                    : "border-primary/30 bg-primary/10 text-primary text-sm py-1 px-3"
                }
              >
                {CATEGORY_LABEL[material.category]}
              </Badge>
              <Badge 
                variant="outline"
                className={
                  material.status === "Disponible" 
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 shadow-sm text-sm py-1 px-3" 
                    : "border-amber-500/30 bg-amber-500/10 text-amber-600 shadow-sm text-sm py-1 px-3"
                }
              >
                {material.status}
              </Badge>
            </div>
            <CardTitle className="text-3xl font-extrabold tracking-tight text-foreground">{material.name}</CardTitle>
            <div className="flex items-center text-sm font-medium text-muted-foreground mt-4 bg-secondary/40 w-fit px-3 py-1.5 rounded-md border border-border/50">
              <Package className="w-4 h-4 mr-2 opacity-70" />
              Stock disponible: <span className="ml-1 text-foreground font-semibold">{material.stock} uds.</span>
            </div>
          </CardHeader>
          <CardContent className="text-base text-muted-foreground leading-relaxed pb-8">
            {material.description}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-border/40 bg-background/60 backdrop-blur-md shadow-sm sticky top-24">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold tracking-tight">Detalles de la solicitud</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Completa tus datos para procesar el envío o reserva del material.</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} noValidate className="grid gap-5">
                <Field
                  id="fullName"
                  label="Nombre completo"
                  autoComplete="name"
                  placeholder="Ej. María Pérez"
                  error={errors.fullName}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Field
                    id="idNumber"
                    label="Cédula"
                    inputMode="numeric"
                    placeholder="Ej. 12345678"
                    error={errors.idNumber}
                    required
                  />
                  <Field
                    id="city"
                    label="Ciudad"
                    autoComplete="address-level2"
                    placeholder="Ej. Bogotá"
                    error={errors.city}
                    required
                  />
                </div>
                <Field
                  id="email"
                  label="Correo electrónico"
                  type="email"
                  autoComplete="email"
                  placeholder="tucorreo@ejemplo.com"
                  error={errors.email}
                  required
                />
                <Field
                  id="phone"
                  label="Teléfono"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="Ej. 300 123 4567"
                  error={errors.phone}
                  required
                />
                <div className="pt-2">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Producto seleccionado</Label>
                  <Input value={material.name} readOnly aria-readonly className="mt-1.5 bg-secondary/50 border-dashed text-foreground/80 font-medium cursor-default focus-visible:ring-0" />
                </div>
                <Button type="submit" size="lg" className="mt-4 w-full font-bold shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5" disabled={(material.status !== "Disponible" && material.stock <= 0) || isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Procesando factura...
                    </>
                  ) : (
                    <>
                      {material.stock > 0 ? "Enviar solicitud y facturar" : "Sin unidades disponibles"}
                      {material.stock > 0 && <Send className="w-4 h-4 ml-2" />}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

function Field({ id, label, error, ...rest }: FieldProps) {
  const describedBy = error ? `${id}-error` : undefined;
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="font-semibold text-foreground/90">{label}</Label>
      <Input
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`transition-colors focus-visible:ring-primary/50 ${error ? "border-destructive focus-visible:ring-destructive/50" : ""}`}
        {...rest}
      />
      {error && (
        <p id={describedBy} role="alert" className="text-[13px] font-medium text-destructive mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
