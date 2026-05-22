import { Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ModelViewer } from "@/components/model-viewer";
import type { Material } from "@/data/materials";

interface Props {
  material: Material;
}

export function InteractiveViewer({ material }: Props) {
  return (
    <Dialog>
      <div className="relative h-full w-full group/viewer bg-linear-to-b from-secondary/30 to-secondary/80 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_-10px_20px_rgba(0,0,0,0.03)] z-10" />
        
        {/* Fullscreen Button Trigger */}
        <DialogTrigger asChild>
          <button 
            className="absolute top-3 right-3 z-20 p-2.5 bg-background/80 backdrop-blur-md rounded-full shadow-sm opacity-0 group-hover/viewer:opacity-100 focus:opacity-100 transition-all duration-300 hover:bg-background hover:scale-110 border border-border/50"
            aria-label="Ver en pantalla completa"
          >
            <Maximize2 className="w-4 h-4 text-foreground" />
          </button>
        </DialogTrigger>

        {/* Small Viewer */}
        {material.embedUrl ? (
          <iframe
            title={`Modelo 3D de ${material.name}`}
            frameBorder="0"
            allowFullScreen
            allow="autoplay; fullscreen; xr-spatial-tracking"
            src={material.embedUrl}
            className="h-full w-full object-cover transition-transform duration-700 group-hover/viewer:scale-[1.02]"
          ></iframe>
        ) : (
          <div className="h-full w-full transition-transform duration-700 group-hover/viewer:scale-[1.02]">
            <ModelViewer src={material.modelUrl} alt={`Modelo 3D de ${material.name}`} />
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] w-full h-[90vh] p-0 overflow-hidden border-border/40 bg-secondary/80 backdrop-blur-xl shadow-2xl">
        <div className="w-full h-full relative flex items-center justify-center pt-10 sm:pt-0">
          {material.embedUrl ? (
            <iframe
              title={`Modelo 3D de ${material.name} (Fullscreen)`}
              frameBorder="0"
              allowFullScreen
              allow="autoplay; fullscreen; xr-spatial-tracking"
              src={material.embedUrl}
              className="w-full h-full"
            ></iframe>
          ) : (
            <div className="w-full h-full">
              <ModelViewer src={material.modelUrl} alt={`Modelo 3D de ${material.name}`} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
