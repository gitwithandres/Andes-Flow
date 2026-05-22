export interface FilamentItem {
  id: string;
  name: string;
  type: string;
  color: string;
  stockKg: number;
  minStockKg: number;
  maxStockKg: number;
  provider: string;
  status: "OK" | "Stock Bajo";
}

export interface ProductionRequest {
  id: string;
  institution: string;
  resource: string;
  quantity: number;
  date: string;
  responsible: string;
  priority: "Alta" | "Media" | "Baja";
  status: "Recibida" | "En Produccion" | "Revision de Calidad" | "Empaque y Transporte" | "Entregada";
  progress_percentage?: number;
}

export interface ProductionTime {
  id: string;
  resourceName: string;
  material: string;
  printTimeHours: number;
  postProcessHours: number;
  totalTimeHours: number;
  speedMms: number;
  partsPerUnit: number;
  timePerBatch5Hours: number;
}

export interface FinishedProduct {
  id: string;
  productName: string;
  category: string;
  produced: number;
  delivered: number;
  available: number;
  inProduction: number;
  reserved: number;
  status: "Disponible" | "Stock Bajo";
}

export interface SalesOpportunity {
  id: string;
  nameLine: string;
  category: string;
  subcategory: string;
  potentialPublic: string;
  referencePriceCop: string;
  complexity: "Baja" | "Media" | "Alta";
  observation: string;
}

export const FILAMENT_INVENTORY: FilamentItem[] = [
  { id: "MAT-001", name: "Filamento PLA Blanco", type: "PLA", color: "Blanco", stockKg: 4.2, minStockKg: 1.0, maxStockKg: 10.0, provider: "Filamentos3D Colombia", status: "OK" },
  { id: "MAT-002", name: "Filamento PLA Amarillo", type: "PLA", color: "Amarillo", stockKg: 2.8, minStockKg: 1.0, maxStockKg: 8.0, provider: "Filamentos3D Colombia", status: "OK" },
  { id: "MAT-003", name: "Filamento PLA Rojo", type: "PLA", color: "Rojo", stockKg: 1.5, minStockKg: 1.0, maxStockKg: 8.0, provider: "PrintMaster Bogota", status: "OK" },
  { id: "MAT-004", name: "Filamento PLA Azul", type: "PLA", color: "Azul", stockKg: 3.0, minStockKg: 1.0, maxStockKg: 8.0, provider: "Filamentos3D Colombia", status: "OK" },
  { id: "MAT-005", name: "Filamento PLA Verde", type: "PLA", color: "Verde", stockKg: 0.7, minStockKg: 1.0, maxStockKg: 6.0, provider: "PrintMaster Bogota", status: "Stock Bajo" },
  { id: "MAT-006", name: "Filamento PLA Negro", type: "PLA", color: "Negro", stockKg: 5.0, minStockKg: 1.5, maxStockKg: 10.0, provider: "Filamentos3D Colombia", status: "OK" },
  { id: "MAT-007", name: "Filamento PLA+ Natural", type: "PLA+", color: "Natural", stockKg: 2.1, minStockKg: 1.0, maxStockKg: 8.0, provider: "3DXTech Colombia", status: "OK" },
  { id: "MAT-008", name: "Filamento PETG Transparente", type: "PETG", color: "Transparente", stockKg: 1.8, minStockKg: 1.0, maxStockKg: 6.0, provider: "3DXTech Colombia", status: "OK" },
  { id: "MAT-009", name: "Filamento PETG Blanco", type: "PETG", color: "Blanco", stockKg: 2.5, minStockKg: 1.0, maxStockKg: 6.0, provider: "3DXTech Colombia", status: "OK" },
  { id: "MAT-010", name: "Filamento TPU Flexible 95A", type: "TPU", color: "Negro", stockKg: 1.2, minStockKg: 0.5, maxStockKg: 4.0, provider: "NinjaTek Colombia", status: "OK" },
  { id: "MAT-012", name: "Resina LCD Standard", type: "Resina", color: "Gris", stockKg: 0.8, minStockKg: 0.5, maxStockKg: 3.0, provider: "Anycubic Colombia", status: "OK" },
];

export const INITIAL_PRODUCTION_REQUESTS: ProductionRequest[] = [
  { id: "SOL-001", institution: "Escuela Normal Superior Barranquilla", resource: "Reloj Didactico Desmontable", quantity: 5, date: "2026-05-10", responsible: "Ana Reyes", priority: "Alta", status: "Entregada" },
  { id: "SOL-002", institution: "Instituto para Ciegos del Caribe", resource: "Accesorio Silla de Ruedas Portavasos", quantity: 15, date: "2026-05-12", responsible: "Luis Gomez", priority: "Alta", status: "Entregada" },
  { id: "SOL-003", institution: "Colegio Distrital Las Nieves", resource: "Figura Sistema Solar Escala", quantity: 2, date: "2026-05-14", responsible: "Maria Torres", priority: "Media", status: "Entregada" },
  { id: "SOL-004", institution: "Fundacion Manos Abiertas", resource: "Figura Anatomica Corazon Humano", quantity: 4, date: "2026-05-16", responsible: "Pedro Salas", priority: "Alta", status: "Empaque y Transporte" },
  { id: "SOL-005", institution: "Colegio Fe y Alegria No. 1", resource: "Figura Celula Animal Desmontable", quantity: 6, date: "2026-05-18", responsible: "Clara Pinto", priority: "Media", status: "Empaque y Transporte" },
  { id: "SOL-006", institution: "IED Simon Bolivar", resource: "Reloj Didactico Desmontable", quantity: 10, date: "2026-05-19", responsible: "Ana Reyes", priority: "Alta", status: "Revision de Calidad" },
  { id: "SOL-007", institution: "Hogar Infantil Comunitario El Prado", resource: "Figura Sistema Solar Escala", quantity: 3, date: "2026-05-20", responsible: "Luis Gomez", priority: "Media", status: "En Produccion" },
  { id: "SOL-008", institution: "Escuela Normal Superior Barranquilla", resource: "Figura Anatomica Corazon Humano", quantity: 5, date: "2026-05-20", responsible: "Maria Torres", priority: "Alta", status: "En Produccion" },
  { id: "SOL-009", institution: "Instituto para Ciegos del Caribe", resource: "Accesorio Silla de Ruedas Portavasos", quantity: 20, date: "2026-05-21", responsible: "Pedro Salas", priority: "Alta", status: "Recibida" },
  { id: "SOL-010", institution: "Colegio Distrital Las Nieves", resource: "Figura Celula Animal Desmontable", quantity: 2, date: "2026-05-22", responsible: "Clara Pinto", priority: "Baja", status: "Recibida" },
  { id: "SOL-011", institution: "Asociación ANDES (Auto-asignado)", resource: "Reloj Didactico Desmontable", quantity: 1, date: "2026-05-22", responsible: "Ana Reyes", priority: "Media", status: "Recibida" }
];

export const PRODUCTION_TIMES: ProductionTime[] = [
  { id: "RD-012", resourceName: "Reloj Didactico Desmontable", material: "PLA+", printTimeHours: 3.5, postProcessHours: 0.8, totalTimeHours: 4.3, speedMms: 50, partsPerUnit: 14, timePerBatch5Hours: 21.5 },
  { id: "RD-016", resourceName: "Figura Anatomica Corazon Humano", material: "PLA+", printTimeHours: 7.0, postProcessHours: 1.5, totalTimeHours: 8.5, speedMms: 45, partsPerUnit: 2, timePerBatch5Hours: 42.5 },
  { id: "RD-017", resourceName: "Figura Sistema Solar Escala", material: "PLA", printTimeHours: 9.5, postProcessHours: 2.0, totalTimeHours: 11.5, speedMms: 55, partsPerUnit: 8, timePerBatch5Hours: 57.5 },
  { id: "RD-018", resourceName: "Figura Celula Animal Desmontable", material: "PLA+", printTimeHours: 8.0, postProcessHours: 2.0, totalTimeHours: 10.0, speedMms: 50, partsPerUnit: 9, timePerBatch5Hours: 50.0 },
  { id: "RD-025", resourceName: "Accesorio Silla de Ruedas Portavasos", material: "PETG", printTimeHours: 2.0, postProcessHours: 0.5, totalTimeHours: 2.5, speedMms: 50, partsPerUnit: 1, timePerBatch5Hours: 12.5 }
];

export const FINISHED_PRODUCTS: FinishedProduct[] = [
  { id: "RD-012", productName: "Reloj Didactico Desmontable", category: "Material Didáctico", produced: 45, delivered: 20, available: 15, inProduction: 5, reserved: 5, status: "Disponible" },
  { id: "RD-016", productName: "Figura Anatomica Corazon Humano", category: "Material Didáctico", produced: 20, delivered: 12, available: 4, inProduction: 4, reserved: 0, status: "Stock Bajo" },
  { id: "RD-017", productName: "Figura Sistema Solar Escala", category: "Material Didáctico", produced: 15, delivered: 8, available: 2, inProduction: 3, reserved: 2, status: "Stock Bajo" },
  { id: "RD-018", productName: "Figura Celula Animal Desmontable", category: "Material Didáctico", produced: 18, delivered: 10, available: 5, inProduction: 2, reserved: 1, status: "Disponible" },
  { id: "RD-025", productName: "Accesorio Silla de Ruedas Portavasos", category: "Ayuda de Accesibilidad", produced: 60, delivered: 40, available: 10, inProduction: 10, reserved: 0, status: "Disponible" }
];

export const SALES_OPPORTUNITIES: SalesOpportunity[] = [
  { id: "M-001", nameLine: "Modelos Anatómicos de Biología", category: "Ciencia", subcategory: "Biología", potentialPublic: "Colegios / universidades", referencePriceCop: "$42.000", complexity: "Alta", observation: "Órganos (corazón, cerebro, pulmones) seccionables" },
  { id: "M-002", nameLine: "Kits del Sistema Solar Mejorados", category: "Ciencia", subcategory: "Astronomía", potentialPublic: "Colegios / hogares", referencePriceCop: "$18.000", complexity: "Media", observation: "Inclusión de órbitas y lunas a escala" },
  { id: "M-003", nameLine: "Relojes Táctiles Avanzados", category: "Accesibilidad", subcategory: "Baja visión", potentialPublic: "Institutos para ciegos", referencePriceCop: "$19.000", complexity: "Media", observation: "Relojes con alarmas integradas y engranajes 3D" },
  { id: "M-004", nameLine: "Adaptadores Modulares Silla Ruedas", category: "Accesibilidad", subcategory: "Movilidad", potentialPublic: "Personas con discapacidad", referencePriceCop: "$11.000", complexity: "Baja", observation: "Portavasos, soportes para móviles, ganchos adaptados" },
  { id: "M-005", nameLine: "Maquetas de Células Interactivas", category: "Ciencia", subcategory: "Biología", potentialPublic: "Colegios / museos", referencePriceCop: "$35.000", complexity: "Alta", observation: "Células vegetales y animales con imanes" }
];
