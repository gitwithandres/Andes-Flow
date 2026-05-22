import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabase";
import type {
  ProductionRequest,
  ProductionTime,
  FinishedProduct,
  FilamentItem,
  SalesOpportunity,
} from "@/data/dashboard-data";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Panel Administrativo — ANDES" },
      {
        name: "description",
        content: "Panel de control de inventarios, producción y oportunidades de ANDES.",
      },
    ],
  }),
  component: AdminPage,
});

type TabType =
  | "solicitudes"
  | "tiempos"
  | "productos"
  | "materiales"
  | "oportunidades"
  | "comentarios";

function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>("solicitudes");
  const [loading, setLoading] = useState(true);

  const [requests, setRequests] = useState<ProductionRequest[]>([]);
  const [tiempos, setTiempos] = useState<ProductionTime[]>([]);
  const [productos, setProductos] = useState<FinishedProduct[]>([]);
  const [materiales, setMateriales] = useState<FilamentItem[]>([]);
  const [oportunidades, setOportunidades] = useState<SalesOpportunity[]>([]);
  const [comentarios, setComentarios] = useState<any[]>([]);

  // Search states
  const [qSolicitudes, setQSolicitudes] = useState("");
  const [qTiempos, setQTiempos] = useState("");
  const [qProductos, setQProductos] = useState("");
  const [qMateriales, setQMateriales] = useState("");
  const [qOportunidades, setQOportunidades] = useState("");
  const [qComentarios, setQComentarios] = useState("");

  // Filters
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [materialTypeFilter, setMaterialTypeFilter] = useState("all");

  // CRUD Modal State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<ProductionRequest | null>(null);
  const [formData, setFormData] = useState<Partial<ProductionRequest>>({});

  const openAddModal = () => {
    setEditingRequest(null);
    setFormData({
      id: `SOL-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      institution: "",
      resource: "Reloj Didactico Desmontable",
      quantity: 1,
      date: new Date().toISOString().split("T")[0],
      responsible: "",
      priority: "Media",
      status: "Recibida",
      progress_percentage: 0,
    });
    setIsRequestModalOpen(true);
  };

  const openEditModal = (req: ProductionRequest) => {
    setEditingRequest(req);
    setFormData(req);
    setIsRequestModalOpen(true);
  };

  const handleDeleteRequest = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar esta solicitud?")) return;
    setRequests((prev) => prev.filter((r) => r.id !== id));
    await supabase.from("production_requests").delete().eq("id", id);
  };

  const handleSaveRequest = async () => {
    if (editingRequest) {
      setRequests((prev) =>
        prev.map((r) => (r.id === editingRequest.id ? (formData as ProductionRequest) : r)),
      );
      await supabase
        .from("production_requests")
        .update({
          institution: formData.institution,
          resource: formData.resource,
          quantity: formData.quantity,
          date: formData.date,
          responsible: formData.responsible,
          priority: formData.priority,
          status: formData.status,
          progress_percentage: formData.progress_percentage || 0,
        })
        .eq("id", editingRequest.id);
    } else {
      setRequests((prev) => [formData as ProductionRequest, ...prev]);
      await supabase.from("production_requests").insert([
        {
          id: formData.id,
          institution: formData.institution,
          resource: formData.resource,
          quantity: formData.quantity,
          date: formData.date,
          responsible: formData.responsible,
          priority: formData.priority,
          status: formData.status,
          progress_percentage: formData.progress_percentage || 0,
        },
      ]);
    }
    setIsRequestModalOpen(false);
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [reqs, times, prods, mats, opps, coms] = await Promise.all([
        supabase.from("production_requests").select("*").order("date", { ascending: false }),
        supabase.from("production_times").select("*"),
        supabase.from("finished_products").select("*"),
        supabase.from("filament_inventory").select("*"),
        supabase.from("sales_opportunities").select("*"),
        supabase
          .from("product_ratings")
          .select("*, production_requests(institution, resource)")
          .order("created_at", { ascending: false }),
      ]);

      if (reqs.data) {
        setRequests(
          reqs.data.map((d: any) => ({
            id: d.id,
            institution: d.institution,
            resource: d.resource,
            quantity: d.quantity,
            date: d.date,
            responsible: d.responsible,
            priority: d.priority,
            status: d.status,
            progress_percentage: d.progress_percentage || 0,
          })),
        );
      }
      if (times.data) {
        setTiempos(
          times.data.map((d: any) => ({
            id: d.id,
            resourceName: d.resource_name,
            material: d.material,
            printTimeHours: d.print_time_hours,
            postProcessHours: d.post_process_hours,
            totalTimeHours: d.total_time_hours,
            speedMms: d.speed_mms,
            partsPerUnit: d.parts_per_unit,
            timePerBatch5Hours: d.time_per_batch_5_hours,
          })),
        );
      }
      if (prods.data) {
        setProductos(
          prods.data.map((d: any) => ({
            id: d.id,
            productName: d.product_name,
            category: d.category,
            produced: d.produced,
            delivered: d.delivered,
            available: d.available,
            inProduction: d.in_production,
            reserved: d.reserved,
            status: d.status,
          })),
        );
      }
      if (mats.data) {
        setMateriales(
          mats.data.map((d: any) => ({
            id: d.id,
            name: d.name,
            type: d.type,
            color: d.color,
            stockKg: d.stock_kg,
            minStockKg: d.min_stock_kg,
            maxStockKg: d.max_stock_kg,
            provider: d.provider,
            status: d.status,
          })),
        );
      }
      if (opps.data) {
        setOportunidades(
          opps.data.map((d: any) => ({
            id: d.id,
            nameLine: d.name_line,
            category: d.category,
            subcategory: d.subcategory,
            potentialPublic: d.potential_public,
            referencePriceCop: d.reference_price_cop,
            complexity: d.complexity,
            observation: d.observation,
          })),
        );
      }
      if (coms.data) {
        setComentarios(coms.data);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Edit status handler for requests
  const handleStatusChange = async (id: string, newStatus: ProductionRequest["status"]) => {
    // Optimistic update
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
    // Supabase update
    await supabase.from("production_requests").update({ status: newStatus }).eq("id", id);
  };

  // --- SOLICITUDES DE PRODUCCION TAB ---
  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const matchQuery =
        r.institution.toLowerCase().includes(qSolicitudes.toLowerCase()) ||
        r.resource.toLowerCase().includes(qSolicitudes.toLowerCase()) ||
        r.responsible.toLowerCase().includes(qSolicitudes.toLowerCase()) ||
        r.id.toLowerCase().includes(qSolicitudes.toLowerCase());
      const matchPriority = priorityFilter === "all" || r.priority === priorityFilter;
      const matchStatus = statusFilter === "all" || r.status === statusFilter;
      return matchQuery && matchPriority && matchStatus;
    });
  }, [requests, qSolicitudes, priorityFilter, statusFilter]);

  const requestsSummary = useMemo(() => {
    const summary: Record<ProductionRequest["status"], number> = {
      Recibida: 0,
      "En Produccion": 0,
      "Revision de Calidad": 0,
      "Empaque y Transporte": 0,
      Entregada: 0,
    };
    requests.forEach((r) => {
      if (summary[r.status] !== undefined) {
        summary[r.status]++;
      }
    });
    return summary;
  }, [requests]);

  // --- TIEMPOS DE PRODUCCION TAB ---
  const filteredTiempos = useMemo(() => {
    return tiempos.filter((t) => {
      const matchQuery =
        t.resourceName.toLowerCase().includes(qTiempos.toLowerCase()) ||
        t.id.toLowerCase().includes(qTiempos.toLowerCase());
      const matchMaterial = materialTypeFilter === "all" || t.material === materialTypeFilter;
      return matchQuery && matchMaterial;
    });
  }, [tiempos, qTiempos, materialTypeFilter]);

  const tiemposAverages = useMemo(() => {
    if (filteredTiempos.length === 0) return { print: 0, post: 0, total: 0 };
    const sums = filteredTiempos.reduce(
      (acc, curr) => ({
        print: acc.print + curr.printTimeHours,
        post: acc.post + curr.postProcessHours,
        total: acc.total + curr.totalTimeHours,
      }),
      { print: 0, post: 0, total: 0 },
    );
    return {
      print: Number((sums.print / filteredTiempos.length).toFixed(1)),
      post: Number((sums.post / filteredTiempos.length).toFixed(1)),
      total: Number((sums.total / filteredTiempos.length).toFixed(1)),
    };
  }, [filteredTiempos]);

  // --- PRODUCTOS TERMINADOS TAB ---
  const filteredProductos = useMemo(() => {
    return productos.filter((p) => {
      return (
        p.productName.toLowerCase().includes(qProductos.toLowerCase()) ||
        p.category.toLowerCase().includes(qProductos.toLowerCase()) ||
        p.id.toLowerCase().includes(qProductos.toLowerCase())
      );
    });
  }, [productos, qProductos]);

  const productosTotals = useMemo(() => {
    return filteredProductos.reduce(
      (acc, curr) => ({
        produced: acc.produced + curr.produced,
        delivered: acc.delivered + curr.delivered,
        available: acc.available + curr.available,
        inProduction: acc.inProduction + curr.inProduction,
        reserved: acc.reserved + curr.reserved,
      }),
      { produced: 0, delivered: 0, available: 0, inProduction: 0, reserved: 0 },
    );
  }, [filteredProductos]);

  // --- MATERIALES E INSUMOS TAB ---
  const filteredMateriales = useMemo(() => {
    return materiales.filter((m) => {
      return (
        m.name.toLowerCase().includes(qMateriales.toLowerCase()) ||
        m.provider.toLowerCase().includes(qMateriales.toLowerCase()) ||
        m.id.toLowerCase().includes(qMateriales.toLowerCase())
      );
    });
  }, [materiales, qMateriales]);

  // --- OPORTUNIDADES DE VENTA TAB ---
  const filteredOportunidades = useMemo(() => {
    return oportunidades.filter((o) => {
      return (
        o.nameLine.toLowerCase().includes(qOportunidades.toLowerCase()) ||
        o.category.toLowerCase().includes(qOportunidades.toLowerCase()) ||
        o.subcategory.toLowerCase().includes(qOportunidades.toLowerCase()) ||
        o.potentialPublic.toLowerCase().includes(qOportunidades.toLowerCase()) ||
        o.id.toLowerCase().includes(qOportunidades.toLowerCase())
      );
    });
  }, [oportunidades, qOportunidades]);

  // --- COMENTARIOS TAB ---
  const filteredComentarios = useMemo(() => {
    return comentarios.filter((c) => {
      const q = qComentarios.toLowerCase();
      return (
        c.request_id.toLowerCase().includes(q) ||
        (c.feedback && c.feedback.toLowerCase().includes(q)) ||
        (c.production_requests?.institution &&
          c.production_requests.institution.toLowerCase().includes(q)) ||
        (c.production_requests?.resource &&
          c.production_requests.resource.toLowerCase().includes(q))
      );
    });
  }, [comentarios, qComentarios]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Premium Header */}
      <header className="mb-8 border-b border-border/60 pb-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="bg-linear-to-r from-primary to-accent bg-clip-text text-3xl font-extrabold tracking-tight text-transparent sm:text-4xl flex items-center">
              Panel de Control e Inventarios
              {loading && <Loader2 className="ml-4 w-6 h-6 animate-spin text-primary" />}
            </h1>
            <p className="mt-2 text-muted-foreground">
              Sistema integral de seguimiento de insumos, tiempos de producción, y oportunidades de
              venta de ANDES.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start rounded-lg bg-muted p-1 border border-border/40">
            <span className="px-3 py-1.5 text-xs font-semibold bg-background rounded shadow-sm text-foreground">
              Producción Activa
            </span>
          </div>
        </div>
      </header>

      {/* Tabs Selector */}
      <div className="mb-6 overflow-x-auto flex border-b border-border">
        <TabButton
          active={activeTab === "solicitudes"}
          onClick={() => setActiveTab("solicitudes")}
          label="Solicitudes de Producción"
          badge={requests.length}
        />
        <TabButton
          active={activeTab === "tiempos"}
          onClick={() => setActiveTab("tiempos")}
          label="Tiempos de Producción"
        />
        <TabButton
          active={activeTab === "productos"}
          onClick={() => setActiveTab("productos")}
          label="Productos Terminados"
        />
        <TabButton
          active={activeTab === "materiales"}
          onClick={() => setActiveTab("materiales")}
          label="Inventario de Materiales"
        />
        <TabButton
          active={activeTab === "oportunidades"}
          onClick={() => setActiveTab("oportunidades")}
          label="Oportunidades de Venta"
        />
        <TabButton
          active={activeTab === "comentarios"}
          onClick={() => setActiveTab("comentarios")}
          label="Comentarios"
          badge={comentarios.length}
        />
      </div>

      {/* TAB CONTENT: SOLICITUDES DE PRODUCCIÓN */}
      {activeTab === "solicitudes" && (
        <div className="space-y-6 animate-in fade-in-50 duration-200">
          <div className="grid gap-4 md:grid-cols-5">
            <SummaryCard
              title="Recibidas"
              count={requestsSummary["Recibida"]}
              className="border-blue-200 bg-blue-50/30 text-blue-900"
            />
            <SummaryCard
              title="En Producción"
              count={requestsSummary["En Produccion"]}
              className="border-yellow-200 bg-yellow-50/30 text-yellow-900"
            />
            <SummaryCard
              title="Revisión Calidad"
              count={requestsSummary["Revision de Calidad"]}
              className="border-purple-200 bg-purple-50/30 text-purple-900"
            />
            <SummaryCard
              title="Empaque & Transp."
              count={requestsSummary["Empaque y Transporte"]}
              className="border-orange-200 bg-orange-50/30 text-orange-900"
            />
            <SummaryCard
              title="Entregadas"
              count={requestsSummary["Entregada"]}
              className="border-green-200 bg-green-50/30 text-green-900"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-3 flex-1 w-full">
              <div>
                <Label htmlFor="q-sol">Buscar</Label>
                <Input
                  id="q-sol"
                  placeholder="Institución, recurso o responsable..."
                  value={qSolicitudes}
                  onChange={(e) => setQSolicitudes(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="priority">Prioridad</Label>
                <select
                  id="priority"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="all">Todas</option>
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </select>
              </div>
              <div>
                <Label htmlFor="status">Estado</Label>
                <select
                  id="status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="all">Todos</option>
                  <option value="Recibida">Recibida</option>
                  <option value="En Produccion">En Producción</option>
                  <option value="Revision de Calidad">Revisión de Calidad</option>
                  <option value="Empaque y Transporte">Empaque y Transporte</option>
                  <option value="Entregada">Entregada</option>
                </select>
              </div>
            </div>
            <Button onClick={openAddModal} className="shrink-0 h-[74px] sm:h-auto self-stretch">
              <Plus className="mr-2 h-4 w-4" /> Nueva Solicitud
            </Button>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="w-[100px]">ID Solicitud</TableHead>
                    <TableHead>Institución Solicitante</TableHead>
                    <TableHead>Recurso Solicitado</TableHead>
                    <TableHead className="text-center">Cantidad</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead className="text-center">Prioridad</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-center">Progreso</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((r) => (
                    <TableRow key={r.id} className="hover:bg-muted/10">
                      <TableCell className="font-semibold text-primary">{r.id}</TableCell>
                      <TableCell className="font-medium text-foreground">{r.institution}</TableCell>
                      <TableCell>{r.resource}</TableCell>
                      <TableCell className="text-center font-bold">{r.quantity}</TableCell>
                      <TableCell className="whitespace-nowrap">{r.date}</TableCell>
                      <TableCell className="text-muted-foreground">{r.responsible}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          className={
                            r.priority === "Alta"
                              ? "bg-red-100 text-red-700 hover:bg-red-100 border-red-200"
                              : r.priority === "Media"
                                ? "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200"
                                : "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200"
                          }
                        >
                          {r.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <select
                          value={r.status}
                          onChange={(e) =>
                            handleStatusChange(r.id, e.target.value as ProductionRequest["status"])
                          }
                          className={`rounded px-2.5 py-1 text-xs font-semibold border focus:outline-none focus:ring-1 focus:ring-ring ${
                            r.status === "Entregada"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : r.status === "Empaque y Transporte"
                                ? "bg-orange-50 text-orange-700 border-orange-200"
                                : r.status === "Revision de Calidad"
                                  ? "bg-purple-50 text-purple-700 border-purple-200"
                                  : r.status === "En Produccion"
                                    ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                                    : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          <option value="Recibida">Recibida</option>
                          <option value="En Produccion">En Producción</option>
                          <option value="Revision de Calidad">Revisión de Calidad</option>
                          <option value="Empaque y Transporte">Empaque y Transporte</option>
                          <option value="Entregada">Entregada</option>
                        </select>
                      </TableCell>
                      <TableCell className="text-center font-bold text-muted-foreground">
                        {r.progress_percentage || 0}%
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEditModal(r)}
                            title="Editar"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteRequest(r.id)}
                            title="Eliminar"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Solicitud Form Dialog */}
          <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editingRequest ? "Editar Solicitud" : "Nueva Solicitud"}</DialogTitle>
                <DialogDescription>
                  {editingRequest
                    ? "Modifica los datos de la solicitud existente."
                    : "Ingresa los datos para registrar una nueva solicitud de producción."}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="institution">Institución</Label>
                  <Input
                    id="institution"
                    placeholder="Ej. Colegio San José"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="resource">Recurso Solicitado</Label>
                  <Input
                    id="resource"
                    placeholder="Ej. Figura Sistema Solar"
                    value={formData.resource}
                    onChange={(e) => setFormData({ ...formData, resource: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="quantity">Cantidad</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min={1}
                      value={formData.quantity}
                      onChange={(e) =>
                        setFormData({ ...formData, quantity: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="date">Fecha</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="responsible">Responsable</Label>
                  <Input
                    id="responsible"
                    placeholder="Nombre del solicitante"
                    value={formData.responsible}
                    onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="modal-priority">Prioridad</Label>
                    <select
                      id="modal-priority"
                      className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value as any })
                      }
                    >
                      <option value="Alta">Alta</option>
                      <option value="Media">Media</option>
                      <option value="Baja">Baja</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="modal-status">Estado</Label>
                    <select
                      id="modal-status"
                      className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    >
                      <option value="Recibida">Recibida</option>
                      <option value="En Produccion">En Producción</option>
                      <option value="Revision de Calidad">Revisión de Calidad</option>
                      <option value="Empaque y Transporte">Empaque y Transporte</option>
                      <option value="Entregada">Entregada</option>
                    </select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="progress">Progreso de Fabricación (%)</Label>
                  <Input
                    id="progress"
                    type="number"
                    min={0}
                    max={100}
                    value={formData.progress_percentage || 0}
                    onChange={(e) =>
                      setFormData({ ...formData, progress_percentage: Number(e.target.value) })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRequestModalOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveRequest}>
                  {editingRequest ? "Guardar Cambios" : "Crear Solicitud"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* TAB CONTENT: TIEMPOS DE PRODUCCIÓN */}
      {activeTab === "tiempos" && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <div className="grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="q-tiempos">Buscar Recurso</Label>
              <Input
                id="q-tiempos"
                placeholder="Nombre de recurso o ID..."
                value={qTiempos}
                onChange={(e) => setQTiempos(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="material-filter">Material</Label>
              <select
                id="material-filter"
                value={materialTypeFilter}
                onChange={(e) => setMaterialTypeFilter(e.target.value)}
                className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">Todos</option>
                <option value="PLA">PLA</option>
                <option value="PLA+">PLA+</option>
                <option value="PETG">PETG</option>
                <option value="TPU">TPU</option>
              </select>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead>ID Recurso</TableHead>
                    <TableHead>Nombre del Recurso</TableHead>
                    <TableHead className="text-center">Material</TableHead>
                    <TableHead className="text-right">Tiempo Impresión (h)</TableHead>
                    <TableHead className="text-right">Tiempo Post-Proceso (h)</TableHead>
                    <TableHead className="text-right font-bold">Tiempo Total (h)</TableHead>
                    <TableHead className="text-right">Velocidad (mm/s)</TableHead>
                    <TableHead className="text-right">Piezas por Unidad</TableHead>
                    <TableHead className="text-right">Lote de 5 (h)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTiempos.map((t) => (
                    <TableRow key={t.id} className="hover:bg-muted/10">
                      <TableCell className="font-semibold text-primary">{t.id}</TableCell>
                      <TableCell className="font-medium text-foreground">
                        {t.resourceName}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{t.material}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {Number(t.printTimeHours).toFixed(1)}
                      </TableCell>
                      <TableCell className="text-right">
                        {Number(t.postProcessHours).toFixed(1)}
                      </TableCell>
                      <TableCell className="text-right font-bold text-accent">
                        {Number(t.totalTimeHours).toFixed(1)}
                      </TableCell>
                      <TableCell className="text-right">{t.speedMms}</TableCell>
                      <TableCell className="text-right">{t.partsPerUnit}</TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {Number(t.timePerBatch5Hours).toFixed(1)}
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* Averages Row matches screenshot exact values */}
                  <TableRow className="bg-muted/50 font-bold border-t-2 border-primary/20">
                    <TableCell
                      colSpan={2}
                      className="text-left uppercase tracking-wider text-primary"
                    >
                      Promedio General
                    </TableCell>
                    <TableCell className="text-center">-</TableCell>
                    <TableCell className="text-right text-primary">
                      {tiemposAverages.print.toFixed(1)} h
                    </TableCell>
                    <TableCell className="text-right text-primary">
                      {tiemposAverages.post.toFixed(1)} h
                    </TableCell>
                    <TableCell className="text-right text-accent font-extrabold">
                      {tiemposAverages.total.toFixed(1)} h
                    </TableCell>
                    <TableCell
                      colSpan={3}
                      className="text-right text-muted-foreground font-normal italic"
                    >
                      Referencia para planificación de producción
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: PRODUCTOS TERMINADOS */}
      {activeTab === "productos" && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <div>
            <Label htmlFor="q-productos">Filtrar Producto</Label>
            <Input
              id="q-productos"
              placeholder="Buscar por nombre o categoría..."
              value={qProductos}
              onChange={(e) => setQProductos(e.target.value)}
              className="mt-1.5 max-w-md"
            />
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead>ID Recurso</TableHead>
                    <TableHead>Nombre del Producto</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead className="text-right">Producidas</TableHead>
                    <TableHead className="text-right">Entregadas</TableHead>
                    <TableHead className="text-right">Disponibles</TableHead>
                    <TableHead className="text-right">En Producción</TableHead>
                    <TableHead className="text-right">Reservadas</TableHead>
                    <TableHead className="text-center">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProductos.map((p) => (
                    <TableRow key={p.id} className="hover:bg-muted/10">
                      <TableCell className="font-semibold text-primary">{p.id}</TableCell>
                      <TableCell className="font-medium text-foreground">{p.productName}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{p.category}</TableCell>
                      <TableCell className="text-right">{p.produced}</TableCell>
                      <TableCell className="text-right">{p.delivered}</TableCell>
                      <TableCell className="text-right font-semibold text-green-600">
                        {p.available}
                      </TableCell>
                      <TableCell className="text-right text-yellow-600">{p.inProduction}</TableCell>
                      <TableCell className="text-right text-purple-600">{p.reserved}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          className={
                            p.status === "Disponible"
                              ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200"
                              : "bg-red-100 text-red-700 hover:bg-red-100 border-red-200"
                          }
                        >
                          {p.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* Totals Row matches screenshot exact values */}
                  <TableRow className="bg-muted/50 font-bold border-t-2 border-primary/20">
                    <TableCell
                      colSpan={3}
                      className="text-left uppercase tracking-wider text-primary"
                    >
                      Totales
                    </TableCell>
                    <TableCell className="text-right">{productosTotals.produced}</TableCell>
                    <TableCell className="text-right">{productosTotals.delivered}</TableCell>
                    <TableCell className="text-right text-green-600">
                      {productosTotals.available}
                    </TableCell>
                    <TableCell className="text-right text-yellow-600">
                      {productosTotals.inProduction}
                    </TableCell>
                    <TableCell className="text-right text-purple-600">
                      {productosTotals.reserved}
                    </TableCell>
                    <TableCell className="text-center">-</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: MATERIALES E INSUMOS */}
      {activeTab === "materiales" && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <div>
            <Label htmlFor="q-materiales">Filtrar Insumo</Label>
            <Input
              id="q-materiales"
              placeholder="Buscar por filamento o proveedor..."
              value={qMateriales}
              onChange={(e) => setQMateriales(e.target.value)}
              className="mt-1.5 max-w-md"
            />
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead>ID Material</TableHead>
                    <TableHead>Nombre del Material</TableHead>
                    <TableHead className="text-center">Tipo</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead className="text-right">Stock (kg)</TableHead>
                    <TableHead className="text-right">Mínimo (kg)</TableHead>
                    <TableHead className="text-right">Máximo (kg)</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead className="text-center">Estado</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMateriales.map((m) => (
                    <TableRow key={m.id} className="hover:bg-muted/10">
                      <TableCell className="font-semibold text-primary">{m.id}</TableCell>
                      <TableCell className="font-medium text-foreground">{m.name}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{m.type}</Badge>
                      </TableCell>
                      <TableCell>{m.color}</TableCell>
                      <TableCell className="text-right font-bold">
                        {Number(m.stockKg).toFixed(1)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {Number(m.minStockKg).toFixed(1)}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {Number(m.maxStockKg).toFixed(1)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{m.provider}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          className={
                            m.status === "OK"
                              ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200"
                              : "bg-red-100 text-red-700 hover:bg-red-100 border-red-200 animate-pulse"
                          }
                        >
                          {m.status === "OK" ? "OK" : "Stock Bajo"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: OPORTUNIDADES DE VENTA */}
      {activeTab === "oportunidades" && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <div>
            <Label htmlFor="q-oportunidades">Filtrar Modelos 3D</Label>
            <Input
              id="q-oportunidades"
              placeholder="Buscar por línea, categoría, subcategoría o público..."
              value={qOportunidades}
              onChange={(e) => setQOportunidades(e.target.value)}
              className="mt-1.5 max-w-md"
            />
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead>ID Modelo</TableHead>
                    <TableHead>Nombre / Línea</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Subcategoría</TableHead>
                    <TableHead>Público Potencial</TableHead>
                    <TableHead className="text-right">Precio Ref.</TableHead>
                    <TableHead className="text-center">Complejidad</TableHead>
                    <TableHead>Observación</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOportunidades.map((o) => (
                    <TableRow key={o.id} className="hover:bg-muted/10">
                      <TableCell className="font-semibold text-primary">{o.id}</TableCell>
                      <TableCell className="font-medium text-foreground">{o.nameLine}</TableCell>
                      <TableCell>{o.category}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {o.subcategory}
                      </TableCell>
                      <TableCell className="text-xs">{o.potentialPublic}</TableCell>
                      <TableCell className="text-right font-bold text-accent">
                        {o.referencePriceCop}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          className={
                            o.complexity === "Alta"
                              ? "bg-red-100 text-red-700 hover:bg-red-100 border-red-200"
                              : o.complexity === "Media"
                                ? "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200"
                                : "bg-green-100 text-green-700 hover:bg-green-100 border-green-200"
                          }
                        >
                          {o.complexity}
                        </Badge>
                      </TableCell>
                      <TableCell
                        className="text-xs text-muted-foreground max-w-[280px] truncate"
                        title={o.observation}
                      >
                        {o.observation}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: COMENTARIOS DE PRODUCTOS */}
      {activeTab === "comentarios" && (
        <div className="space-y-4 animate-in fade-in-50 duration-200">
          <div className="grid gap-3 rounded-xl border border-border bg-card p-4">
            <div>
              <Label htmlFor="q-comentarios">Buscar Comentario</Label>
              <Input
                id="q-comentarios"
                placeholder="ID Solicitud, Institución, Producto o palabra en el feedback..."
                value={qComentarios}
                onChange={(e) => setQComentarios(e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow>
                    <TableHead className="w-[120px]">ID Solicitud</TableHead>
                    <TableHead>Institución</TableHead>
                    <TableHead>Recurso</TableHead>
                    <TableHead className="text-center w-[120px]">Calificación</TableHead>
                    <TableHead>Comentario (Feedback)</TableHead>
                    <TableHead className="text-right w-[150px]">Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComentarios.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No hay comentarios aún.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredComentarios.map((c) => (
                      <TableRow key={c.id} className="hover:bg-muted/10">
                        <TableCell className="font-semibold text-primary">{c.request_id}</TableCell>
                        <TableCell className="font-medium text-foreground">
                          {c.production_requests?.institution || "N/A"}
                        </TableCell>
                        <TableCell>{c.production_requests?.resource || "N/A"}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center">
                            <span className="font-bold text-lg mr-1">{c.rating}</span>
                            <span className="text-yellow-500 text-lg">★</span>
                          </div>
                        </TableCell>
                        <TableCell
                          className="italic text-muted-foreground max-w-sm truncate"
                          title={c.feedback}
                        >
                          {c.feedback || "Sin comentarios"}
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(c.created_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Compact Helpers
function TabButton({
  active,
  onClick,
  label,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors focus:outline-none ${
        active
          ? "text-primary border-b-2 border-primary"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <div className="flex items-center gap-1.5">
        {label}
        {badge !== undefined && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary font-bold">
            {badge}
          </span>
        )}
      </div>
    </button>
  );
}

function SummaryCard({
  title,
  count,
  className = "",
}: {
  title: string;
  count: number;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border p-4 shadow-sm ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-wider opacity-85">{title}</p>
      <p className="mt-1 text-2xl font-black">{count || 0}</p>
    </div>
  );
}
