-- ANDES 3D PLATFORM - Supabase SQL Schema
-- Este script crea todas las tablas necesarias para manejar el catálogo y el Panel de Control.

-- 1. Catálogo de Materiales (Los modelos 3D mostrados al público)
CREATE TABLE public.materials (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    model_url TEXT NOT NULL,
    embed_url TEXT,
    stock INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Disponible'
);

-- 2. Solicitudes de Producción (Pedidos de las instituciones)
CREATE TABLE public.production_requests (
    id TEXT PRIMARY KEY,
    institution TEXT NOT NULL,
    resource TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    date DATE NOT NULL,
    responsible TEXT NOT NULL,
    priority TEXT CHECK (priority IN ('Alta', 'Media', 'Baja')),
    status TEXT CHECK (status IN ('Recibida', 'En Produccion', 'Revision de Calidad', 'Empaque y Transporte', 'Entregada')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tiempos de Producción (Métricas de fabricación 3D)
CREATE TABLE public.production_times (
    id TEXT PRIMARY KEY,
    resource_name TEXT NOT NULL,
    material TEXT NOT NULL,
    print_time_hours NUMERIC NOT NULL,
    post_process_hours NUMERIC NOT NULL,
    total_time_hours NUMERIC NOT NULL,
    speed_mms INTEGER NOT NULL,
    parts_per_unit INTEGER NOT NULL,
    time_per_batch_5_hours NUMERIC NOT NULL
);

-- 4. Productos Terminados (Inventario de salida)
CREATE TABLE public.finished_products (
    id TEXT PRIMARY KEY,
    product_name TEXT NOT NULL,
    category TEXT NOT NULL,
    produced INTEGER NOT NULL DEFAULT 0,
    delivered INTEGER NOT NULL DEFAULT 0,
    available INTEGER NOT NULL DEFAULT 0,
    in_production INTEGER NOT NULL DEFAULT 0,
    reserved INTEGER NOT NULL DEFAULT 0,
    status TEXT CHECK (status IN ('Disponible', 'Stock Bajo'))
);

-- 5. Inventario de Materiales (Filamentos y Resina)
CREATE TABLE public.filament_inventory (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    color TEXT NOT NULL,
    stock_kg NUMERIC NOT NULL,
    min_stock_kg NUMERIC NOT NULL,
    max_stock_kg NUMERIC NOT NULL,
    provider TEXT NOT NULL,
    status TEXT CHECK (status IN ('OK', 'Stock Bajo'))
);

-- 6. Oportunidades de Venta (Nuevos mercados)
CREATE TABLE public.sales_opportunities (
    id TEXT PRIMARY KEY,
    name_line TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT NOT NULL,
    potential_public TEXT NOT NULL,
    reference_price_cop TEXT NOT NULL,
    complexity TEXT CHECK (complexity IN ('Baja', 'Media', 'Alta')),
    observation TEXT
);

-- ==========================================
-- POLÍTICAS DE SEGURIDAD (Row Level Security)
-- ==========================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_times ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.finished_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.filament_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_opportunities ENABLE ROW LEVEL SECURITY;

-- Para este MVP, permitiremos acceso total (CRUD) al cliente anon para facilitar el desarrollo.
-- En producción, deberías restringir las operaciones de INSERT, UPDATE y DELETE solo a usuarios autenticados.

CREATE POLICY "Acceso total anon materials" ON public.materials FOR ALL USING (true);
CREATE POLICY "Acceso total anon requests" ON public.production_requests FOR ALL USING (true);
CREATE POLICY "Acceso total anon times" ON public.production_times FOR ALL USING (true);
CREATE POLICY "Acceso total anon finished" ON public.finished_products FOR ALL USING (true);
CREATE POLICY "Acceso total anon filament" ON public.filament_inventory FOR ALL USING (true);
CREATE POLICY "Acceso total anon sales" ON public.sales_opportunities FOR ALL USING (true);
