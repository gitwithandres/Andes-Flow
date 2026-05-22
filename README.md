# ANDES — Plataforma de gestión de materiales accesibles (MVP)

MVP para la **Asociación Nacional para el Desarrollo Social (ANDES)** que centraliza solicitudes de materiales didácticos y ayudas técnicas de accesibilidad, con un **catálogo 3D interactivo**.

## ✨ Funcionalidades

- **Landing page** con propósito social y CTA al catálogo.
- **Catálogo 3D** con `<model-viewer>` (rotación, zoom, auto-rotate, controles táctiles).
- **Filtros** por categoría: *Material Didáctico* y *Ayudas de Accesibilidad*.
- **Formulario de solicitud** con validación (zod) y confirmación visual.
- **Dashboard administrativo** con búsqueda, filtros por ciudad/estado y edición inline del estado.
- 10 materiales y 15 solicitudes mock precargadas.

## 🧱 Stack

- **TanStack Start v1** (React 19 + Vite 7) + **TypeScript**
- **Tailwind CSS v4** + shadcn/ui + design tokens en `oklch`
- **`<model-viewer>`** de Google (vía CDN)
- **Persistencia**: `localStorage` (intercambiable por Firestore o Google Sheets API)
- **Validación**: zod

## 📁 Estructura

```
src/
  components/      # site-header, site-footer, model-viewer, ui/*
  data/            # materials.ts — 10 materiales mock
  services/        # requests-store.ts — persistencia + 15 solicitudes seed
  routes/          # index, catalogo, solicitar.$id, admin
  styles.css       # design tokens ANDES (azul + blanco + verde accesibilidad)
```

## 🚀 Ejecutar localmente

```bash
bun install
bun dev
```

## 🌐 Despliegue (Vercel / Netlify)

1. Sube el repo a GitHub.
2. Importa el proyecto en [Vercel](https://vercel.com/new) o [Netlify](https://app.netlify.com/start).
3. Build command: `bun run build` — Output: `dist/`.
4. No requiere variables de entorno para el MVP.

## 🔄 Conectar Firestore / Google Sheets (opcional)

Reemplaza las funciones `readAll` / `writeAll` en `src/services/requests-store.ts` por llamadas a Firestore o la Sheets API. La interfaz pública (`requestsStore.add`, `updateStatus`, `useRequests`) se mantiene igual, así que ningún componente necesita cambiar.

## ♿ Accesibilidad

- Contraste AA con tokens semánticos.
- Labels asociados, `aria-invalid`, `aria-describedby` en formularios.
- Navegación por teclado y `focus-visible` visible.
- `lang="es"` en `<html>` y un único landmark `<main>`.

## 📝 Licencia

MIT — uso libre para fines sociales y educativos.
