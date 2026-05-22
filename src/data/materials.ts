export type Category = "didactico" | "accesibilidad";

export interface Material {
  id: string;
  name: string;
  category: Category;
  description: string;
  modelUrl: string;
  categoryName: string;
  embedUrl?: string;
  stock: number;
  status: "Disponible" | "Stock Bajo";
}

export const CATEGORY_LABEL: Record<Category, string> = {
  didactico: "Material Didáctico",
  accesibilidad: "Ayuda de Accesibilidad",
};

const KHA = "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models";

export const MATERIALS: Material[] = [
  {
    id: "RD-012",
    name: "Reloj Didactico Desmontable",
    category: "didactico",
    categoryName: "Material Didactico",
    description: "Reloj interactivo con manecillas móviles y números desmontables con marcas táctiles para aprender la hora.",
    modelUrl: `${KHA}/ChronographWatch/glTF-Binary/ChronographWatch.glb`,
    stock: 10,
    status: "Disponible"
  },
  {
    id: "RD-016",
    name: "Figura Anatomica Corazon Humano",
    category: "didactico",
    categoryName: "Figuras Didacticas",
    description: "Modelo anatómico detallado del corazón humano, mostrando ventrículos y arterias en relieve para ciencias.",
    modelUrl: `/models/corazon__anim.glb`,
    stock: 6,
    status: "Stock Bajo"
  },
  {
    id: "RD-017",
    name: "Figura Sistema Solar Escala",
    category: "didactico",
    categoryName: "Figuras Didacticas",
    description: "Set de planetas del sistema solar impresos a escala relativa con texturas características.",
    modelUrl: `/models/solar_system.glb`,
    stock: 4,
    status: "Stock Bajo"
  },
  {
    id: "RD-018",
    name: "Figura Celula Animal Desmontable",
    category: "didactico",
    categoryName: "Figuras Didacticas",
    description: "Modelo seccionado de una célula animal que expone el núcleo, mitocondrias y orgánulos en relieve táctil.",
    modelUrl: `${KHA}/MosquitoInAmber/glTF-Binary/MosquitoInAmber.glb`,
    embedUrl: "https://sketchfab.com/models/7b30f0a5af784a65aa35a997325c94a7/embed",
    stock: 6,
    status: "Stock Bajo"
  },
  {
    id: "RD-021",
    name: "Accesorio Silla de Ruedas Portavasos",
    category: "accesibilidad",
    categoryName: "Accesorios de Accesibilidad",
    description: "Soporte universal acoplable a sillas de ruedas para llevar vasos, botellas o termos de forma segura.",
    modelUrl: `${KHA}/WaterBottle/glTF-Binary/WaterBottle.glb`,
    stock: 12,
    status: "Disponible"
  }
];

export const getMaterial = (id: string) => MATERIALS.find((m) => m.id === id);
