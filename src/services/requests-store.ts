// Lightweight client-side store for requests.
// Persists in localStorage so the dashboard survives reloads.
// Swap with Firebase Firestore or Sheets API by replacing read/write internals.

import { useSyncExternalStore } from "react";

export const REQUEST_STATUSES = [
  "No responde",
  "No contestó",
  "Confirmó",
  "Llamar después",
  "Interesado",
  "No interesado",
] as const;

export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export interface RequestRecord {
  id: string;
  fullName: string;
  idNumber: string;
  city: string;
  email: string;
  phone: string;
  materialId: string;
  materialName: string;
  status: RequestStatus;
  createdAt: string; // ISO
}

const KEY = "andes:requests";

const seedRequests: RequestRecord[] = [
  [
    "Ana María López",
    "1010234567",
    "Bogotá",
    "ana.lopez@example.co",
    "3001234567",
    "solido-geometrico",
    "Sólido geométrico táctil",
    "Confirmó",
  ],
  [
    "Carlos Rodríguez",
    "1020345678",
    "Medellín",
    "crodriguez@example.co",
    "3014567890",
    "kit-robotica",
    "Kit de robótica educativa",
    "Interesado",
  ],
  [
    "Lucía Martínez",
    "1030456789",
    "Cali",
    "lucia.m@example.co",
    "3025678901",
    "placa-braille",
    "Placa señalética en Braille",
    "Llamar después",
  ],
  [
    "Jorge Hernández",
    "1040567890",
    "Barranquilla",
    "jorge.h@example.co",
    "3036789012",
    "baston-blanco",
    "Bastón blanco plegable",
    "No contestó",
  ],
  [
    "María Fernanda Ruiz",
    "1050678901",
    "Bogotá",
    "mfruiz@example.co",
    "3047890123",
    "maqueta-anatomica",
    "Maqueta anatómica del corazón",
    "Confirmó",
  ],
  [
    "Pedro Gómez",
    "1060789012",
    "Cartagena",
    "pgomez@example.co",
    "3058901234",
    "empunadura-ergonomica",
    "Empuñadura ergonómica adaptada",
    "Interesado",
  ],
  [
    "Sofía Pérez",
    "1070890123",
    "Bucaramanga",
    "sofia.p@example.co",
    "3069012345",
    "globo-terraqueo",
    "Globo terráqueo en relieve",
    "No responde",
  ],
  [
    "Andrés Castro",
    "1080901234",
    "Medellín",
    "acastro@example.co",
    "3070123456",
    "teclado-grande",
    "Teclado de teclas grandes",
    "Confirmó",
  ],
  [
    "Daniela Suárez",
    "1091012345",
    "Cali",
    "dsuarez@example.co",
    "3081234567",
    "soporte-libro",
    "Soporte adaptado para libros",
    "Llamar después",
  ],
  [
    "Felipe Moreno",
    "1101123456",
    "Bogotá",
    "fmoreno@example.co",
    "3092345678",
    "atomo-molecular",
    "Modelo atómico molecular",
    "No interesado",
  ],
  [
    "Valentina Ríos",
    "1111234567",
    "Pereira",
    "vrios@example.co",
    "3103456789",
    "solido-geometrico",
    "Sólido geométrico táctil",
    "Interesado",
  ],
  [
    "Mateo Torres",
    "1121345678",
    "Manizales",
    "mtorres@example.co",
    "3114567890",
    "kit-robotica",
    "Kit de robótica educativa",
    "Confirmó",
  ],
  [
    "Camila Vargas",
    "1131456789",
    "Bogotá",
    "cvargas@example.co",
    "3125678901",
    "placa-braille",
    "Placa señalética en Braille",
    "No contestó",
  ],
  [
    "Sebastián Niño",
    "1141567890",
    "Cali",
    "snino@example.co",
    "3136789012",
    "baston-blanco",
    "Bastón blanco plegable",
    "Interesado",
  ],
  [
    "Laura Beltrán",
    "1151678901",
    "Medellín",
    "lbeltran@example.co",
    "3147890123",
    "empunadura-ergonomica",
    "Empuñadura ergonómica adaptada",
    "Confirmó",
  ],
].map(([fullName, idNumber, city, email, phone, materialId, materialName, status], i) => ({
  id: `seed-${i + 1}`,
  fullName,
  idNumber,
  city,
  email,
  phone,
  materialId,
  materialName,
  status: status as RequestStatus,
  createdAt: new Date(Date.now() - (15 - i) * 86_400_000).toISOString(),
}));

function readAll(): RequestRecord[] {
  if (typeof window === "undefined") return seedRequests;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      window.localStorage.setItem(KEY, JSON.stringify(seedRequests));
      return seedRequests;
    }
    return JSON.parse(raw) as RequestRecord[];
  } catch {
    return seedRequests;
  }
}

function writeAll(records: RequestRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(records));
  cachedSnapshot = records; // update cache synchronously before notifying
  emit();
}

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

// Cached snapshot — useSyncExternalStore requires getSnapshot to return the
// same reference when data hasn't changed, otherwise React warns and loops.
let cachedSnapshot: RequestRecord[] | null = null;

function getSnapshot(): RequestRecord[] {
  if (cachedSnapshot === null) {
    cachedSnapshot = readAll();
  }
  return cachedSnapshot;
}

export function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export const requestsStore = {
  getAll: readAll,
  add(input: Omit<RequestRecord, "id" | "status" | "createdAt">) {
    const next: RequestRecord = {
      ...input,
      id: `req-${Date.now()}`,
      status: "Interesado",
      createdAt: new Date().toISOString(),
    };
    writeAll([next, ...readAll()]);
    return next;
  },
  updateStatus(id: string, status: RequestStatus) {
    writeAll(readAll().map((r) => (r.id === id ? { ...r, status } : r)));
  },
};

export function useRequests(): RequestRecord[] {
  return useSyncExternalStore(subscribe, getSnapshot, () => seedRequests);
}
