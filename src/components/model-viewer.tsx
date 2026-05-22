import type { DetailedHTMLProps, HTMLAttributes } from "react";

// Type shim for the <model-viewer> custom element (loaded via CDN in __root.tsx).
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": DetailedHTMLProps<
        HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          poster?: string;
          "camera-controls"?: boolean | "";
          "auto-rotate"?: boolean | "";
          "touch-action"?: string;
          "shadow-intensity"?: string | number;
          "environment-image"?: string;
          exposure?: string | number;
          ar?: boolean | "";
          loading?: "auto" | "lazy" | "eager";
          reveal?: "auto" | "manual";
        },
        HTMLElement
      >;
    }
  }
}


interface Props {
  src: string;
  alt: string;
  className?: string;
}

export function ModelViewer({ src, alt, className }: Props) {
  return (
    <model-viewer
      src={src}
      alt={alt}
      camera-controls
      auto-rotate
      touch-action="pan-y"
      shadow-intensity="1"
      exposure="1"
      loading="lazy"
      className={className}
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(180deg, #f4f7fb 0%, #e8eef7 100%)",
        borderRadius: "0.75rem",
      }}
    />
  );
}
