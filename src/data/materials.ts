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
    description:
      "Reloj interactivo con manecillas móviles y números desmontables con marcas táctiles para aprender la hora.",
    modelUrl: `${KHA}/ChronographWatch/glTF-Binary/ChronographWatch.glb`,
    stock: 10,
    status: "Disponible",
  },
  {
    id: "RD-016",
    name: "Figura Anatomica Corazon Humano",
    category: "didactico",
    categoryName: "Figuras Didacticas",
    description:
      "Modelo anatómico detallado del corazón humano, mostrando ventrículos y arterias en relieve para ciencias.",
    modelUrl: `/models/corazon__anim.glb`,
    stock: 6,
    status: "Stock Bajo",
  },
  {
    id: "RD-017",
    name: "Figura Sistema Solar Escala",
    category: "didactico",
    categoryName: "Figuras Didacticas",
    description:
      "Set de planetas del sistema solar impresos a escala relativa con texturas características.",
    modelUrl: `/models/solar_system.glb`,
    stock: 4,
    status: "Stock Bajo",
  },
  {
    id: "RD-018",
    name: "Figura Celula Animal Desmontable",
    category: "didactico",
    categoryName: "Figuras Didacticas",
    description:
      "Modelo seccionado de una célula animal que expone el núcleo, mitocondrias y orgánulos en relieve táctil.",
    modelUrl: `${KHA}/MosquitoInAmber/glTF-Binary/MosquitoInAmber.glb`,
    embedUrl: "https://sketchfab.com/models/7b30f0a5af784a65aa35a997325c94a7/embed",
    stock: 6,
    status: "Stock Bajo",
  },
  {
    id: "RD-021",
    name: "Accesorio Silla de Ruedas Portavasos",
    category: "accesibilidad",
    categoryName: "Accesorios de Accesibilidad",
    description:
      "Soporte universal acoplable a sillas de ruedas para llevar vasos, botellas o termos de forma segura.",
    modelUrl: `${KHA}/WaterBottle/glTF-Binary/WaterBottle.glb`,
    stock: 12,
    status: "Disponible",
  },
  {
    id: "RD-026",
    name: "Maceta (piezas de juego de mesa)",
    category: "didactico",
    categoryName: "Material Didactico",
    description:
      "Set de piezas de juego de mesa diseñadas para fomentar el aprendizaje colaborativo y habilidades estratégicas en entornos educativos.",
    modelUrl: `${KHA}/WaterBottle/glTF-Binary/WaterBottle.glb`,
    embedUrl: "https://sketchfab.com/models/d820c1b9dc154d4a9c5d2654d8086991/embed",
    stock: 15,
    status: "Disponible",
  },
  {
    id: "RD-027",
    name: "Organizadores de Escritorio",
    category: "accesibilidad",
    categoryName: "Accesorios de Accesibilidad",
    description:
      "Organizador modular de escritorio tipo RISATORP, ideal para mantener el espacio de trabajo ordenado y facilitar el acceso a materiales educativos y de oficina.",
    modelUrl: `${KHA}/ChronographWatch/glTF-Binary/ChronographWatch.glb`,
    embedUrl: "https://sketchfab.com/models/b522e685298a4f7e88ec927ec28a19f2/embed",
    stock: 20,
    status: "Disponible",
  },
  {
    id: "RD-028",
    name: "Set de Animales Didácticos",
    category: "didactico",
    categoryName: "Material Didactico",
    description:
      "Colección de figuras de animales en 3D con diseño estilizado, ideal para actividades de clasificación, reconocimiento de especies y aprendizaje lúdico.",
    modelUrl: `${KHA}/MosquitoInAmber/glTF-Binary/MosquitoInAmber.glb`,
    embedUrl: "https://sketchfab.com/models/19e91ef86cd0448f9cbb5d6c538dade2/embed",
    stock: 12,
    status: "Disponible",
  },
  {
    id: "RD-029",
    name: "Adaptadores e Instrumentos AAC",
    category: "accesibilidad",
    categoryName: "Accesorios de Accesibilidad",
    description:
      "Set de instrumentos y adaptadores de comunicación aumentativa y alternativa (AAC) para apoyar la interacción de personas con dificultades del habla.",
    modelUrl: `${KHA}/WaterBottle/glTF-Binary/WaterBottle.glb`,
    embedUrl: "https://sketchfab.com/models/11a67a5e108441a1892a9d390789f9ce/embed",
    stock: 10,
    status: "Disponible",
  },
  {
    id: "RD-030",
    name: "Set de Geometría Sólida",
    category: "didactico",
    categoryName: "Material Didactico",
    description:
      "Figuras geométricas tridimensionales para la enseñanza de matemáticas, ideales para identificar volúmenes, caras, aristas y vértices de forma táctil.",
    modelUrl: `${KHA}/ChronographWatch/glTF-Binary/ChronographWatch.glb`,
    embedUrl: "https://sketchfab.com/models/2dd55a1d31384edb83afed93ca92baa0/embed",
    stock: 18,
    status: "Disponible",
  },
  {
    id: "RD-031",
    name: "Figuras Precolombinas",
    category: "didactico",
    categoryName: "Material Didactico",
    description:
      "Máscara y figuras inspiradas en la iconografía precolombina, ideales para la enseñanza de historia, arte y culturas originarias de América.",
    modelUrl: `${KHA}/MosquitoInAmber/glTF-Binary/MosquitoInAmber.glb`,
    embedUrl: "https://sketchfab.com/models/392660f56a8f461b929a73e05b346b00/embed",
    stock: 8,
    status: "Disponible",
  },
  {
    id: "RD-032",
    name: "Mapas Geográficos Regionales",
    category: "didactico",
    categoryName: "Material Didactico",
    description:
      "Mapa 3D de Colombia con relieve topográfico, ideal para la enseñanza de geografía, división política y reconocimiento del territorio nacional.",
    modelUrl: `${KHA}/ChronographWatch/glTF-Binary/ChronographWatch.glb`,
    embedUrl: "https://sketchfab.com/models/7d16ccfe4672452a8c5194604335f9cf/embed",
    stock: 10,
    status: "Disponible",
  },
  {
    id: "RD-033",
    name: "Figuras de Flora Colombiana",
    category: "didactico",
    categoryName: "Material Didactico",
    description:
      "Modelo 3D detallado de una orquídea, flor emblemática de Colombia, para el estudio de botánica y biodiversidad en el aula.",
    modelUrl: `${KHA}/WaterBottle/glTF-Binary/WaterBottle.glb`,
    embedUrl: "https://sketchfab.com/models/f92ca4a73a4848cf80c130d33cb2808c/embed",
    stock: 14,
    status: "Disponible",
  },
  {
    id: "RD-034",
    name: "Fichas de Ajedrez",
    category: "didactico",
    categoryName: "Material Didactico",
    description:
      "Set de 3 piezas clásicas de ajedrez (rey, caballo, peón) para la enseñanza de estrategia, lógica y pensamiento crítico a través del juego.",
    modelUrl: `${KHA}/MosquitoInAmber/glTF-Binary/MosquitoInAmber.glb`,
    embedUrl: "https://sketchfab.com/models/a541708852f14614bdf6a88d6a97ddc3/embed",
    stock: 20,
    status: "Disponible",
  },
  {
    id: "RD-035",
    name: "Letras y Números Decorativos",
    category: "didactico",
    categoryName: "Material Didactico",
    description:
      "Cubos con letras y números en 3D para actividades de alfabetización, matemáticas básicas y estimulación temprana en el aula.",
    modelUrl: `${KHA}/ChronographWatch/glTF-Binary/ChronographWatch.glb`,
    embedUrl: "https://sketchfab.com/models/d97af7524d414053a1bed16dd49748fa/embed",
    stock: 25,
    status: "Disponible",
  },
];

export const getMaterial = (id: string) => MATERIALS.find((m) => m.id === id);
