-- ANDES 3D PLATFORM - Supabase Seed Script
-- Este script inserta todos los datos iniciales del Dashboard y del Catálogo en la base de datos.

-- 1. Limpiar tablas (Opcional, previene duplicados si ejecutas el script más de una vez)
TRUNCATE TABLE public.materials, public.production_requests, public.production_times, public.finished_products, public.filament_inventory, public.sales_opportunities RESTART IDENTITY;

-- 2. Insertar Catálogo de Materiales
INSERT INTO public.materials (id, name, category, description, model_url, embed_url, stock, status) VALUES
('RD-012', 'Reloj Didactico Desmontable', 'didactico', 'Reloj interactivo con manecillas móviles y números desmontables con marcas táctiles para aprender la hora.', 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/ChronographWatch/glTF-Binary/ChronographWatch.glb', NULL, 10, 'Disponible'),
('RD-016', 'Figura Anatomica Corazon Humano', 'didactico', 'Modelo anatómico detallado del corazón humano, mostrando ventrículos y arterias en relieve para ciencias.', '/models/corazon__anim.glb', NULL, 6, 'Stock Bajo'),
('RD-017', 'Figura Sistema Solar Escala', 'didactico', 'Set de planetas del sistema solar impresos a escala relativa con texturas características.', '/models/solar_system.glb', NULL, 4, 'Stock Bajo'),
('RD-018', 'Figura Celula Animal Desmontable', 'didactico', 'Modelo seccionado de una célula animal que expone el núcleo, mitocondrias y orgánulos en relieve táctil.', 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/MosquitoInAmber/glTF-Binary/MosquitoInAmber.glb', 'https://sketchfab.com/models/7b30f0a5af784a65aa35a997325c94a7/embed', 6, 'Stock Bajo'),
('RD-025', 'Accesorio Silla de Ruedas Portavasos', 'accesibilidad', 'Soporte universal acoplable a sillas de ruedas para llevar vasos, botellas o termos de forma segura.', 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models/WaterBottle/glTF-Binary/WaterBottle.glb', NULL, 12, 'Disponible');

-- 3. Insertar Solicitudes de Producción
INSERT INTO public.production_requests (id, institution, resource, quantity, date, responsible, priority, status) VALUES
('SOL-001', 'Escuela Normal Superior Barranquilla', 'Reloj Didactico Desmontable', 5, '2026-05-10', 'Ana Reyes', 'Alta', 'Entregada'),
('SOL-002', 'Instituto para Ciegos del Caribe', 'Accesorio Silla de Ruedas Portavasos', 15, '2026-05-12', 'Luis Gomez', 'Alta', 'Entregada'),
('SOL-003', 'Colegio Distrital Las Nieves', 'Figura Sistema Solar Escala', 2, '2026-05-14', 'Maria Torres', 'Media', 'Entregada'),
('SOL-004', 'Fundacion Manos Abiertas', 'Figura Anatomica Corazon Humano', 4, '2026-05-16', 'Pedro Salas', 'Alta', 'Empaque y Transporte'),
('SOL-005', 'Colegio Fe y Alegria No. 1', 'Figura Celula Animal Desmontable', 6, '2026-05-18', 'Clara Pinto', 'Media', 'Empaque y Transporte'),
('SOL-006', 'IED Simon Bolivar', 'Reloj Didactico Desmontable', 10, '2026-05-19', 'Ana Reyes', 'Alta', 'Revision de Calidad'),
('SOL-007', 'Hogar Infantil Comunitario El Prado', 'Figura Sistema Solar Escala', 3, '2026-05-20', 'Luis Gomez', 'Media', 'En Produccion'),
('SOL-008', 'Escuela Normal Superior Barranquilla', 'Figura Anatomica Corazon Humano', 5, '2026-05-20', 'Maria Torres', 'Alta', 'En Produccion'),
('SOL-009', 'Instituto para Ciegos del Caribe', 'Accesorio Silla de Ruedas Portavasos', 20, '2026-05-21', 'Pedro Salas', 'Alta', 'Recibida'),
('SOL-010', 'Colegio Distrital Las Nieves', 'Figura Celula Animal Desmontable', 2, '2026-05-22', 'Clara Pinto', 'Baja', 'Recibida'),
('SOL-011', 'Asociación ANDES (Auto-asignado)', 'Reloj Didactico Desmontable', 1, '2026-05-22', 'Ana Reyes', 'Media', 'Recibida');

-- 4. Insertar Tiempos de Producción
INSERT INTO public.production_times (id, resource_name, material, print_time_hours, post_process_hours, total_time_hours, speed_mms, parts_per_unit, time_per_batch_5_hours) VALUES
('RD-012', 'Reloj Didactico Desmontable', 'PLA+', 3.5, 0.8, 4.3, 50, 14, 21.5),
('RD-016', 'Figura Anatomica Corazon Humano', 'PLA+', 7.0, 1.5, 8.5, 45, 2, 42.5),
('RD-017', 'Figura Sistema Solar Escala', 'PLA', 9.5, 2.0, 11.5, 55, 8, 57.5),
('RD-018', 'Figura Celula Animal Desmontable', 'PLA+', 8.0, 2.0, 10.0, 50, 9, 50.0),
('RD-025', 'Accesorio Silla de Ruedas Portavasos', 'PETG', 2.0, 0.5, 2.5, 50, 1, 12.5);

-- 5. Insertar Productos Terminados
INSERT INTO public.finished_products (id, product_name, category, produced, delivered, available, in_production, reserved, status) VALUES
('RD-012', 'Reloj Didactico Desmontable', 'Material Didáctico', 45, 20, 15, 5, 5, 'Disponible'),
('RD-016', 'Figura Anatomica Corazon Humano', 'Material Didáctico', 20, 12, 4, 4, 0, 'Stock Bajo'),
('RD-017', 'Figura Sistema Solar Escala', 'Material Didáctico', 15, 8, 2, 3, 2, 'Stock Bajo'),
('RD-018', 'Figura Celula Animal Desmontable', 'Material Didáctico', 18, 10, 5, 2, 1, 'Disponible'),
('RD-025', 'Accesorio Silla de Ruedas Portavasos', 'Ayuda de Accesibilidad', 60, 40, 10, 10, 0, 'Disponible');

-- 6. Insertar Inventario de Materiales
INSERT INTO public.filament_inventory (id, name, type, color, stock_kg, min_stock_kg, max_stock_kg, provider, status) VALUES
('MAT-001', 'Filamento PLA Blanco', 'PLA', 'Blanco', 4.2, 1.0, 10.0, 'Filamentos3D Colombia', 'OK'),
('MAT-002', 'Filamento PLA Amarillo', 'PLA', 'Amarillo', 2.8, 1.0, 8.0, 'Filamentos3D Colombia', 'OK'),
('MAT-003', 'Filamento PLA Rojo', 'PLA', 'Rojo', 1.5, 1.0, 8.0, 'PrintMaster Bogota', 'OK'),
('MAT-004', 'Filamento PLA Azul', 'PLA', 'Azul', 3.0, 1.0, 8.0, 'Filamentos3D Colombia', 'OK'),
('MAT-005', 'Filamento PLA Verde', 'PLA', 'Verde', 0.7, 1.0, 6.0, 'PrintMaster Bogota', 'Stock Bajo'),
('MAT-006', 'Filamento PLA Negro', 'PLA', 'Negro', 5.0, 1.5, 10.0, 'Filamentos3D Colombia', 'OK'),
('MAT-007', 'Filamento PLA+ Natural', 'PLA+', 'Natural', 2.1, 1.0, 8.0, '3DXTech Colombia', 'OK'),
('MAT-008', 'Filamento PETG Transparente', 'PETG', 'Transparente', 1.8, 1.0, 6.0, '3DXTech Colombia', 'OK'),
('MAT-009', 'Filamento PETG Blanco', 'PETG', 'Blanco', 2.5, 1.0, 6.0, '3DXTech Colombia', 'OK'),
('MAT-010', 'Filamento TPU Flexible 95A', 'TPU', 'Negro', 1.2, 0.5, 4.0, 'NinjaTek Colombia', 'OK'),
('MAT-012', 'Resina LCD Standard', 'Resina', 'Gris', 0.8, 0.5, 3.0, 'Anycubic Colombia', 'OK');

-- 7. Insertar Oportunidades de Venta
INSERT INTO public.sales_opportunities (id, name_line, category, subcategory, potential_public, reference_price_cop, complexity, observation) VALUES
('M-001', 'Modelos Anatómicos de Biología', 'Ciencia', 'Biología', 'Colegios / universidades', '$42.000', 'Alta', 'Órganos (corazón, cerebro, pulmones) seccionables'),
('M-002', 'Kits del Sistema Solar Mejorados', 'Ciencia', 'Astronomía', 'Colegios / hogares', '$18.000', 'Media', 'Inclusión de órbitas y lunas a escala'),
('M-003', 'Relojes Táctiles Avanzados', 'Accesibilidad', 'Baja visión', 'Institutos para ciegos', '$19.000', 'Media', 'Relojes con alarmas integradas y engranajes 3D'),
('M-004', 'Adaptadores Modulares Silla Ruedas', 'Accesibilidad', 'Movilidad', 'Personas con discapacidad', '$11.000', 'Baja', 'Portavasos, soportes para móviles, ganchos adaptados'),
('M-005', 'Maquetas de Células Interactivas', 'Ciencia', 'Biología', 'Colegios / museos', '$35.000', 'Alta', 'Células vegetales y animales con imanes');
