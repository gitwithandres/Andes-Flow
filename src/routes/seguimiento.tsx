import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Package, Activity, ArrowLeft, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/seguimiento")({
  head: () => ({
    meta: [
      { title: "Seguimiento de Producción — ANDES" },
      { name: "description", content: "Rastrea el progreso de tu material didáctico." }
    ]
  }),
  component: SeguimientoPage,
});

function SeguimientoPage() {
  const [requestId, setRequestId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [searched, setSearched] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);
  const [hasRated, setHasRated] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!requestId.trim()) {
      toast.error("Ingresa un número de solicitud válido");
      return;
    }

    setLoading(true);
    setSearched(true);
    setResult(null);
    setRating(0);
    setFeedback("");
    setHasRated(false);

    // Búsqueda real en Supabase
    const { data, error } = await supabase
      .from('production_requests')
      .select('*')
      .eq('id', requestId.trim().toUpperCase())
      .single();

    if (error || !data) {
      toast.error("No se encontró la solicitud", {
        description: "Asegúrate de que el ID sea correcto (ej: SOL-123)"
      });
    } else {
      setResult(data);
      // Verificar si ya calificó
      const { data: ratingData } = await supabase
        .from('product_ratings')
        .select('*')
        .eq('request_id', data.id)
        .single();
        
      if (ratingData) {
        setHasRated(true);
      }
    }
    setLoading(false);
  }

  // Helper para el color de la barra de progreso
  const getProgressColor = (status: string) => {
    switch (status) {
      case "Recibida": return "bg-blue-500";
      case "En Produccion": return "bg-yellow-500";
      case "Revision de Calidad": return "bg-purple-500";
      case "Empaque y Transporte": return "bg-orange-500";
      case "Entregada": return "bg-green-500";
      default: return "bg-primary";
    }
  };

  const handleSubmitRating = async () => {
    if (rating === 0) {
      toast.error("Por favor selecciona una calificación");
      return;
    }
    
    setSubmittingRating(true);
    const { error } = await supabase.from('product_ratings').insert([{
      request_id: result.id,
      rating,
      feedback
    }]);

    setSubmittingRating(false);
    
    if (error) {
      toast.error("Error al guardar la calificación");
    } else {
      toast.success("¡Gracias por tu calificación!");
      setHasRated(true);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 lg:py-20 animate-fade-in">
      <Link
        to="/"
        className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver al Inicio
      </Link>

      <div className="text-center mb-10">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
          <Activity className="h-8 w-8 text-primary" aria-hidden />
        </div>
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight">Seguimiento de Fabricación</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Ingresa el ID de tu solicitud para conocer en tiempo real el porcentaje de avance y el estado de tu material.
        </p>
      </div>

      <Card className="shadow-lg border-border/50 max-w-2xl mx-auto overflow-hidden">
        <CardHeader className="bg-muted/30 pb-6">
          <CardTitle className="text-lg">Buscar Solicitud</CardTitle>
          <CardDescription>El ID lo encuentras en el correo de confirmación de tu pedido.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                value={requestId}
                onChange={(e) => setRequestId(e.target.value)}
                placeholder="Ej. SOL-001" 
                className="pl-10 h-12 text-lg font-mono tracking-wider rounded-xl uppercase"
              />
            </div>
            <Button type="submit" size="lg" disabled={loading} className="h-12 px-8 rounded-xl font-bold">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Rastrear"}
            </Button>
          </form>

          {searched && !loading && result && (
            <div className="mt-8 pt-8 border-t border-border animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-bold text-xl text-foreground flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    {result.resource}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">Institución: {result.institution}</p>
                </div>
                <Badge variant="outline" className="text-base px-4 py-1.5 font-bold shadow-sm self-start">
                  {result.status}
                </Badge>
              </div>

              <div className="bg-muted/30 rounded-xl p-6 border border-border/50">
                <div className="flex justify-between items-end mb-3">
                  <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Porcentaje de Fabricación</span>
                  <span className="text-3xl font-black text-primary">{result.progress_percentage || 0}%</span>
                </div>
                
                <div className="relative w-full h-4 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out ${getProgressColor(result.status)}`}
                    style={{ width: `${result.progress_percentage || 0}%` }}
                  />
                </div>
                
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div className="space-y-1">
                    <div className={`w-3 h-3 mx-auto rounded-full ${result.progress_percentage >= 0 ? 'bg-blue-500' : 'bg-muted'}`} />
                    <p className="text-xs font-medium text-muted-foreground">Recibida</p>
                  </div>
                  <div className="space-y-1">
                    <div className={`w-3 h-3 mx-auto rounded-full ${result.progress_percentage >= 20 ? 'bg-yellow-500' : 'bg-muted'}`} />
                    <p className="text-xs font-medium text-muted-foreground">Fabricación</p>
                  </div>
                  <div className="space-y-1">
                    <div className={`w-3 h-3 mx-auto rounded-full ${result.progress_percentage >= 80 ? 'bg-purple-500' : 'bg-muted'}`} />
                    <p className="text-xs font-medium text-muted-foreground">Calidad</p>
                  </div>
                  <div className="space-y-1">
                    <div className={`w-3 h-3 mx-auto rounded-full ${result.progress_percentage >= 100 ? 'bg-green-500' : 'bg-muted'}`} />
                    <p className="text-xs font-medium text-muted-foreground">Entregada</p>
                  </div>
                </div>
              </div>

              {/* RATING SECTION */}
              {result.status === "Entregada" && (
                <div className="mt-8 bg-card border border-border shadow-sm rounded-xl p-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h4 className="text-xl font-bold mb-2">¿Cómo calificarías este material didáctico?</h4>
                  
                  {hasRated ? (
                    <div className="py-6 space-y-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-2">
                        <Star className="w-8 h-8 fill-current" />
                      </div>
                      <p className="text-lg font-medium text-foreground">¡Gracias por tu reseña!</p>
                      <p className="text-muted-foreground text-sm">Tu opinión nos ayuda a mejorar nuestros recursos educativos para todos.</p>
                    </div>
                  ) : (
                    <div className="mt-6 max-w-md mx-auto">
                      <div className="flex justify-center gap-2 mb-6">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className="transition-transform hover:scale-110 focus:outline-none"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                          >
                            <Star 
                              className={`w-10 h-10 ${
                                star <= (hoverRating || rating) 
                                  ? "fill-yellow-400 text-yellow-400" 
                                  : "text-muted-foreground/30"
                              } transition-colors`} 
                            />
                          </button>
                        ))}
                      </div>
                      <div className="space-y-4 text-left">
                        <label htmlFor="feedback" className="text-sm font-medium text-foreground">
                          Déjanos un comentario (opcional)
                        </label>
                        <textarea
                          id="feedback"
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                          placeholder="¿Qué tal te pareció el material? ¿Llegó en buenas condiciones?"
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                        />
                        <Button 
                          className="w-full h-11 font-bold" 
                          onClick={handleSubmitRating}
                          disabled={submittingRating || rating === 0}
                        >
                          {submittingRating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Enviar Calificación"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
