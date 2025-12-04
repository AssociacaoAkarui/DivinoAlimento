import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { UserMenuLarge } from "@/components/layout/UserMenuLarge";
import { FiltersBar } from "@/components/admin/FiltersBar";
import { FiltersPanel } from "@/components/admin/FiltersPanel";
import { useFilters } from "@/hooks/useFilters";
import {
  ArrowLeft,
  Plus,
  Store,
  MapPin,
  Trash2,
  Edit,
  Save,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { RoleTitle } from "@/components/layout/RoleTitle";
import { useAuth } from "@/contexts/AuthContext";
import {
  useListarMercadosPorResponsavel,
  useCriarMercado,
  useAtualizarMercado,
  useDeletarMercado,
  useListarPontosEntrega,
} from "@/hooks/graphql";
import {
  filterMercadosBySearch,
  filterMercadosByStatus,
  filterMercadosByTipo,
  prepareMercadoForBackend,
  getTotalPontosEntrega,
} from "@/lib/mercado-helpers";
import {
  formatTipoMercado,
  formatStatusMercado,
  formatCreateSuccessMessage,
  formatUpdateSuccessMessage,
  formatDeleteSuccessMessage,
  formatCreateError,
  formatUpdateError,
} from "@/lib/mercado-formatters";

const marketTypeOptions = [
  { value: "cesta", label: "Cesta" },
  { value: "lote", label: "Lote" },
  { value: "venda_direta", label: "Venda Direta" },
];

const AdminMercadoMercados = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const CURRENT_ADMIN_ID = user?.id ? parseInt(String(user.id), 10) : 0;
  const CURRENT_ADMIN_NAME = user?.nome || "";

  const {
    filters,
    debouncedSearch,
    updateFilter,
    toggleArrayValue,
    clearFilters,
    clearFilterGroup,
    getActiveChips,
    hasActiveFilters,
    isOpen,
    setIsOpen,
  } = useFilters("/adminmercado/mercados");

  const { data: mercadosData, isLoading: mercadosLoading } =
    useListarMercadosPorResponsavel(CURRENT_ADMIN_ID);
  const { data: pontosEntregaData, isLoading: pontosLoading } =
    useListarPontosEntrega();
  const criarMercadoMutation = useCriarMercado();
  const atualizarMercadoMutation = useAtualizarMercado();
  const deletarMercadoMutation = useDeletarMercado();

  const [selectedMarket, setSelectedMarket] = useState<any>(null);
  const [isEditingMarket, setIsEditingMarket] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [newMarket, setNewMarket] = useState({
    name: "",
    pontoEntregaIds: [] as string[],
    type: "",
    valorMaximoCesta: null as number | null,
    administrativeFee: null as number | null,
    status: "ativo" as "ativo" | "inativo",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [marketToDelete, setMarketToDelete] = useState<number | null>(null);

  const markets = useMemo(() => {
    if (!mercadosData?.listarMercadosPorResponsavel) return [];
    return mercadosData.listarMercadosPorResponsavel.map((m: any) => ({
      id: m.id,
      name: m.nome,
      deliveryPoints: m.pontosEntrega?.map((p: any) => p.nome) || [],
      type: m.tipo,
      valorMaximoCesta: m.valorMaximoCesta,
      administratorId: CURRENT_ADMIN_ID,
      administratorName: CURRENT_ADMIN_NAME,
      administrativeFee: m.taxaAdministrativa,
      status: m.status,
      pontosEntrega: m.pontosEntrega || [],
    }));
  }, [mercadosData, CURRENT_ADMIN_ID, CURRENT_ADMIN_NAME]);

  const availablePontos = !pontosEntregaData?.listarPontosEntrega
    ? []
    : pontosEntregaData.listarPontosEntrega;

  const [selectedPontoId, setSelectedPontoId] = useState("");

  const addDeliveryPoint = () => {
    if (!selectedPontoId) {
      toast({
        title: "Erro",
        description: "Selecione um ponto de entrega",
        variant: "destructive",
      });
      return;
    }
    if (newMarket.pontoEntregaIds.includes(selectedPontoId)) {
      toast({
        title: "Erro",
        description: "Este ponto já foi adicionado",
        variant: "destructive",
      });
      return;
    }
    setNewMarket((prev) => ({
      ...prev,
      pontoEntregaIds: [...prev.pontoEntregaIds, selectedPontoId],
    }));
    setSelectedPontoId("");
    toast({
      title: "Ponto adicionado",
      description: "O ponto de entrega foi adicionado à lista",
    });
  };

  const removeDeliveryPoint = (pontoId: string) => {
    setNewMarket((prev) => ({
      ...prev,
      pontoEntregaIds: prev.pontoEntregaIds.filter((id) => id !== pontoId),
    }));
  };

  const getMarketTypeLabel = (type: string) => {
    return formatTipoMercado(type);
  };

  const startEditMarket = (market: any) => {
    setEditData({ ...market });
    setIsEditingMarket(true);
  };

  const saveEditMarket = async () => {
    if (!editData) return;

    if (editData.administratorId !== CURRENT_ADMIN_ID) {
      toast({
        title: "Erro",
        description:
          "Você só pode gerenciar os mercados sob sua responsabilidade.",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        id: editData.id.toString(),
        input: {
          nome: editData.name,
          tipo: editData.type,
          responsavelId: editData.administratorId,
          taxaAdministrativa: editData.administrativeFee,
          valorMaximoCesta:
            editData.type === "cesta" ? editData.valorMaximoCesta : null,
          status: editData.status,
        },
      };

      await atualizarMercadoMutation.mutateAsync(payload);

      setSelectedMarket(editData);
      setIsEditingMarket(false);
      toast({
        title: "Sucesso",
        description: formatUpdateSuccessMessage(editData.name),
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: formatUpdateError(error),
        variant: "destructive",
      });
    }
  };

  const cancelEditMarket = () => {
    setEditData(null);
    setIsEditingMarket(false);
  };

  const filteredMarkets = useMemo(() => {
    let result = [...markets];

    if (debouncedSearch) {
      result = filterMercadosBySearch(
        result.map((m) => ({
          nome: m.name,
          pontosEntrega: m.pontosEntrega,
          status: m.status,
          tipo: m.type,
        })),
        debouncedSearch,
      )
        .map((filtered) => {
          return markets.find((m) => m.name === filtered.nome);
        })
        .filter(Boolean) as any[];
    }

    if (filters.status.length > 0) {
      result = filterMercadosByStatus(
        result.map((m) => ({
          status: m.status,
          nome: m.name,
        })),
        filters.status,
      )
        .map((filtered) => {
          return markets.find((m) => m.name === filtered.nome);
        })
        .filter(Boolean) as any[];
    }

    if (filters.tipo.length > 0) {
      result = filterMercadosByTipo(
        result.map((m) => ({
          tipo: m.type,
          nome: m.name,
        })),
        filters.tipo,
      )
        .map((filtered) => {
          return markets.find((m) => m.name === filtered.nome);
        })
        .filter(Boolean) as any[];
    }

    return result;
  }, [markets, filters, debouncedSearch]);

  const saveMarket = async () => {
    if (!newMarket.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome do mercado não pode estar vazio",
        variant: "destructive",
      });
      return;
    }
    if (!newMarket.type) {
      toast({
        title: "Erro",
        description: "Selecione o tipo de mercado",
        variant: "destructive",
      });
      return;
    }
    if (newMarket.type === "cesta") {
      if (
        !newMarket.valorMaximoCesta ||
        isNaN(newMarket.valorMaximoCesta) ||
        newMarket.valorMaximoCesta <= 0
      ) {
        toast({
          title: "Erro",
          description: "Informe o valor máximo por cesta",
          variant: "destructive",
        });
        return;
      }
    }

    if (newMarket.pontoEntregaIds.length === 0) {
      toast({
        title: "Erro",
        description: "Ao menos um ponto de entrega deve estar vinculado",
        variant: "destructive",
      });
      return;
    }

    if (
      newMarket.administrativeFee !== null &&
      (newMarket.administrativeFee < 0 || newMarket.administrativeFee > 100)
    ) {
      toast({
        title: "Erro",
        description: "Taxa administrativa deve estar entre 0 e 100%",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload: any = {
        nome: newMarket.name,
        tipo: newMarket.type,
        responsavelId: parseInt(String(CURRENT_ADMIN_ID), 10),
        status: newMarket.status,
        pontoEntregaIds: newMarket.pontoEntregaIds,
      };

      if (newMarket.administrativeFee !== null) {
        payload.taxaAdministrativa = newMarket.administrativeFee;
      }

      if (newMarket.type === "cesta" && newMarket.valorMaximoCesta) {
        payload.valorMaximoCesta = newMarket.valorMaximoCesta;
      }

      await criarMercadoMutation.mutateAsync({ input: payload });

      setNewMarket({
        name: "",
        pontoEntregaIds: [] as string[],
        type: "",
        valorMaximoCesta: null,
        administrativeFee: null,
        status: "ativo",
      });
      setSelectedPontoId("");
      setIsDialogOpen(false);

      toast({
        title: "Sucesso",
        description: formatCreateSuccessMessage(newMarket.name),
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: formatCreateError(error),
        variant: "destructive",
      });
    }
  };

  const confirmDeleteMarket = (marketId: number) => {
    setMarketToDelete(marketId);
    setDeleteDialogOpen(true);
  };

  const deleteMarket = async () => {
    if (marketToDelete === null) return;

    try {
      await deletarMercadoMutation.mutateAsync({
        id: marketToDelete.toString(),
      });

      if (selectedMarket?.id === marketToDelete) {
        setSelectedMarket(null);
        setIsEditingMarket(false);
      }

      const deletedMarket = markets.find((m) => m.id === marketToDelete);
      toast({
        title: "Sucesso",
        description: formatDeleteSuccessMessage(
          deletedMarket?.name || "Mercado",
        ),
      });

      setDeleteDialogOpen(false);
      setMarketToDelete(null);
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao excluir mercado",
        variant: "destructive",
      });
    }
  };

  if (mercadosLoading) {
    return (
      <ResponsiveLayout
        leftHeaderContent={
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate("/adminmercado/dashboard")}
            className="text-primary-foreground hover:bg-primary-hover"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        }
        headerContent={<UserMenuLarge />}
      >
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout
      leftHeaderContent={
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => navigate("/adminmercado/dashboard")}
          className="text-primary-foreground hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
      headerContent={<UserMenuLarge />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 lg:p-0">
        <div className="lg:col-span-12 mb-4 lg:mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="text-left mb-4 lg:mb-0">
              <RoleTitle
                page="Cadastro de Mercados"
                className="text-2xl lg:text-3xl"
              />
              <p className="text-sm lg:text-lg text-muted-foreground mt-2">
                Gerencie mercados e pontos de entrega
              </p>
            </div>
            <div className="hidden lg:grid lg:grid-cols-2 gap-4">
              <Card className="text-center bg-primary/10">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-primary">
                    {markets.length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Total Mercados
                  </div>
                </CardContent>
              </Card>
              <Card className="text-center bg-accent/10">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-accent">
                    {getTotalPontosEntrega(
                      markets.map((m) => ({
                        pontosEntrega: m.pontosEntrega,
                      })),
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Pontos de Entrega
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-6 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base lg:text-lg">
                  Lista de Mercados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FiltersBar
                  searchValue={filters.search}
                  onSearchChange={(value) => updateFilter("search", value)}
                  onFiltersClick={() => setIsOpen(true)}
                  activeChips={getActiveChips()}
                  onRemoveChip={clearFilterGroup}
                  resultCount={filteredMarkets.length}
                  hasActiveFilters={hasActiveFilters()}
                  filtersOpen={isOpen}
                />
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Mercado
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </CardContent>
            </Card>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
              {filteredMarkets.map((market) => (
                <Card
                  key={market.id}
                  className={`transition-all hover:shadow-md ${
                    selectedMarket?.id === market.id
                      ? "ring-2 ring-primary bg-primary/5 border-primary"
                      : "hover:border-primary/30"
                  }`}
                >
                  <CardContent className="p-4">
                    <div
                      className="cursor-pointer"
                      onClick={() => setSelectedMarket(market)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground truncate">
                            {market.name}
                          </h3>
                          <div className="flex items-center space-x-1 mt-1">
                            <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                            <span className="text-xs text-muted-foreground">
                              {market.deliveryPoints.length} pontos
                            </span>
                          </div>
                          <div className="mt-2">
                            <Badge
                              variant={
                                market.status === "ativo"
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                market.status === "ativo"
                                  ? "bg-success text-white"
                                  : ""
                              }
                            >
                              {formatStatusMercado(market.status)}
                            </Badge>
                          </div>
                        </div>
                        {selectedMarket?.id === market.id && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2 pt-3 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMarket(market);
                          startEditMarket(market);
                        }}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDeleteMarket(market.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredMarkets.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center space-y-4">
                    <Store className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      {hasActiveFilters()
                        ? "Sem resultados para os filtros selecionados."
                        : "Nenhum mercado cadastrado"}
                    </p>
                    {hasActiveFilters() && (
                      <Button variant="outline" onClick={clearFilters}>
                        Limpar filtros
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8">
          {selectedMarket ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg lg:text-xl flex items-center space-x-3">
                    <Store className="w-5 h-5 lg:w-6 lg:h-6 text-primary" />
                    <span>{selectedMarket.name}</span>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Detalhes e configurações do mercado
                  </p>
                </div>
                {!isEditingMarket ? (
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => startEditMarket(selectedMarket)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => confirmDeleteMarket(selectedMarket.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Excluir
                    </Button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Button variant="outline" onClick={cancelEditMarket}>
                      Cancelar
                    </Button>
                    <Button onClick={saveEditMarket}>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      Informações Básicas
                    </h4>
                    <div>
                      <Label htmlFor="marketName">Nome do Mercado</Label>
                      <Input
                        id="marketName"
                        value={
                          isEditingMarket
                            ? editData?.name || ""
                            : selectedMarket.name
                        }
                        onChange={(e) =>
                          setEditData((prev: any) =>
                            prev ? { ...prev, name: e.target.value } : null,
                          )
                        }
                        disabled={!isEditingMarket}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label>Tipo de Mercado</Label>
                      {isEditingMarket ? (
                        <div className="mt-2">
                          <RadioGroup
                            value={editData?.type || ""}
                            onValueChange={(value: string) =>
                              setEditData((prev: any) =>
                                prev ? { ...prev, type: value } : null,
                              )
                            }
                          >
                            {marketTypeOptions.map((option) => (
                              <div
                                key={option.value}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem
                                  value={option.value}
                                  id={`edit-market-type-${option.value}`}
                                />
                                <Label
                                  htmlFor={`edit-market-type-${option.value}`}
                                  className="cursor-pointer font-normal"
                                >
                                  {option.label}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                          {editData?.type === "cesta" && (
                            <div className="mt-4 space-y-2">
                              <Label htmlFor="edit-valorMaximoCesta">
                                Valor Máximo por Cesta *
                              </Label>
                              <Input
                                id="edit-valorMaximoCesta"
                                type="text"
                                value={
                                  editData.valorMaximoCesta !== null &&
                                  editData.valorMaximoCesta !== undefined
                                    ? String(editData.valorMaximoCesta).replace(
                                        ".",
                                        ",",
                                      )
                                    : ""
                                }
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    ",",
                                    ".",
                                  );
                                  setEditData((prev: any) =>
                                    prev
                                      ? {
                                          ...prev,
                                          valorMaximoCesta: value
                                            ? parseFloat(value)
                                            : null,
                                        }
                                      : null,
                                  );
                                }}
                                placeholder="Ex: 150,00"
                              />
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="mt-2 p-3 bg-muted/30 rounded-lg border">
                          <span className="text-sm font-medium">
                            {getMarketTypeLabel(selectedMarket.type)}
                          </span>
                          {selectedMarket.type === "cesta" &&
                            selectedMarket.valorMaximoCesta && (
                              <div className="text-xs text-muted-foreground mt-1">
                                Valor Máximo por Cesta: R${" "}
                                {selectedMarket.valorMaximoCesta
                                  .toFixed(2)
                                  .replace(".", ",")}
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                    <div>
                      <Label>Administrador(a) Responsável</Label>
                      <div className="mt-2 p-3 bg-muted/30 rounded-lg border">
                        <span className="text-sm font-medium">
                          {CURRENT_ADMIN_NAME}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">
                          Este campo não pode ser alterado
                        </p>
                      </div>
                    </div>
                    <div>
                      <Label>Taxa Administrativa (%)</Label>
                      {isEditingMarket ? (
                        <Input
                          type="number"
                          value={editData?.administrativeFee || ""}
                          onChange={(e) =>
                            setEditData((prev: any) =>
                              prev
                                ? {
                                    ...prev,
                                    administrativeFee: e.target.value
                                      ? parseFloat(e.target.value)
                                      : null,
                                  }
                                : null,
                            )
                          }
                          placeholder="Ex: 5.0"
                          min="0"
                          max="100"
                          step="0.1"
                          className="mt-2"
                        />
                      ) : (
                        <div className="mt-2 p-3 bg-muted/30 rounded-lg border">
                          <span className="text-sm font-medium">
                            {selectedMarket.administrativeFee
                              ? `${selectedMarket.administrativeFee}%`
                              : "Não aplicável"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <Label>Status</Label>
                      {isEditingMarket ? (
                        <RadioGroup
                          value={editData?.status || "ativo"}
                          onValueChange={(value: "ativo" | "inativo") =>
                            setEditData((prev: any) =>
                              prev ? { ...prev, status: value } : null,
                            )
                          }
                          className="mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="ativo"
                              id="edit-status-ativo"
                            />
                            <Label
                              htmlFor="edit-status-ativo"
                              className="cursor-pointer"
                            >
                              Ativo
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="inativo"
                              id="edit-status-inativo"
                            />
                            <Label
                              htmlFor="edit-status-inativo"
                              className="cursor-pointer"
                            >
                              Inativo
                            </Label>
                          </div>
                        </RadioGroup>
                      ) : (
                        <div
                          className={`mt-2 p-3 rounded-lg border ${
                            selectedMarket.status === "ativo"
                              ? "bg-success/10"
                              : "bg-muted/30"
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                selectedMarket.status === "ativo"
                                  ? "bg-success"
                                  : "bg-muted-foreground"
                              }`}
                            ></div>
                            <span
                              className={`text-sm font-medium ${
                                selectedMarket.status === "ativo"
                                  ? "text-success"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {formatStatusMercado(selectedMarket.status)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground">
                      Pontos de Entrega
                    </h4>
                    {isEditingMarket ? (
                      <div className="space-y-2">
                        {editData?.deliveryPoints.map(
                          (point: string, index: number) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={point}
                                onChange={(e) => {
                                  const newPoints = [
                                    ...(editData?.deliveryPoints || []),
                                  ];
                                  newPoints[index] = e.target.value;
                                  setEditData((prev: any) =>
                                    prev
                                      ? { ...prev, deliveryPoints: newPoints }
                                      : null,
                                  );
                                }}
                                placeholder="Nome do ponto de entrega"
                              />
                              {editData?.deliveryPoints.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    const newPoints =
                                      editData?.deliveryPoints.filter(
                                        (_: any, i: number) => i !== index,
                                      ) || [];
                                    setEditData((prev: any) =>
                                      prev
                                        ? { ...prev, deliveryPoints: newPoints }
                                        : null,
                                    );
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          ),
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditData((prev: any) =>
                              prev
                                ? {
                                    ...prev,
                                    deliveryPoints: [
                                      ...prev.deliveryPoints,
                                      "",
                                    ],
                                  }
                                : null,
                            );
                          }}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar Ponto
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {selectedMarket.deliveryPoints.map(
                          (point: string, index: number) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2 p-3 bg-muted/30 rounded-lg"
                            >
                              <MapPin className="w-4 h-4 text-accent" />
                              <span className="text-sm">{point}</span>
                            </div>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="hidden lg:block">
                  <Separator />
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <Card className="text-center bg-muted/30">
                      <CardContent className="p-4">
                        <div className="text-lg font-bold text-foreground">
                          {selectedMarket.deliveryPoints.length}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Pontos de Entrega
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="text-center bg-muted/30">
                      <CardContent className="p-4">
                        <div className="text-lg font-bold text-foreground">
                          100%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Disponibilidade
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 lg:p-16 text-center">
                <Store className="w-16 h-16 lg:w-24 lg:h-24 mx-auto text-muted-foreground mb-6" />
                <h3 className="text-lg lg:text-xl font-medium text-foreground mb-2">
                  Selecione um Mercado
                </h3>
                <p className="text-muted-foreground lg:text-base">
                  Escolha um mercado na lista ao lado para ver os detalhes e
                  fazer edições.
                </p>
                <div className="mt-6 lg:hidden">
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Criar Primeiro Mercado
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[min(1280px,95vw)] max-h-[85vh] flex flex-col p-0">
          <DialogHeader className="flex-shrink-0 px-6 pt-6 pb-4 border-b">
            <DialogTitle className="text-xl font-semibold">
              Novo Mercado
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-full">
              <div className="space-y-4 min-w-0">
                <h4 className="font-semibold text-foreground border-b pb-2 mb-4">
                  Informações Básicas
                </h4>
                <div className="space-y-2">
                  <Label
                    htmlFor="newMarketName"
                    className="text-sm font-medium"
                  >
                    Nome do Mercado *
                  </Label>
                  <Input
                    id="newMarketName"
                    value={newMarket.name}
                    onChange={(e) =>
                      setNewMarket((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Ex: Mercado Central"
                    className="h-11"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Tipo de Mercado *
                  </Label>
                  <RadioGroup
                    value={newMarket.type}
                    onValueChange={(value: string) =>
                      setNewMarket((prev) => ({ ...prev, type: value }))
                    }
                  >
                    {marketTypeOptions.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={`market-type-${option.value}`}
                        />
                        <Label
                          htmlFor={`market-type-${option.value}`}
                          className="cursor-pointer font-normal"
                        >
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                {newMarket.type === "cesta" && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="valorMaximoCesta"
                      className="text-sm font-medium"
                    >
                      Valor Máximo por Cesta *
                    </Label>
                    <Input
                      id="valorMaximoCesta"
                      type="text"
                      value={
                        newMarket.valorMaximoCesta !== null
                          ? String(newMarket.valorMaximoCesta).replace(".", ",")
                          : ""
                      }
                      onChange={(e) => {
                        const value = e.target.value.replace(/,/g, ".");
                        const numValue =
                          value === "" ? null : parseFloat(value);
                        setNewMarket((prev) => ({
                          ...prev,
                          valorMaximoCesta: numValue,
                        }));
                      }}
                      placeholder="Ex: 150,00"
                      className="h-11"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Administrador(a) Responsável *
                  </Label>
                  <div className="p-3 bg-muted/30 rounded-lg border">
                    <span className="text-sm font-medium">
                      {CURRENT_ADMIN_NAME}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">
                      Você será automaticamente definido como administrador
                      responsável
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="administrativeFee"
                    className="text-sm font-medium"
                  >
                    Taxa Administrativa (%)
                  </Label>
                  <Input
                    id="administrativeFee"
                    type="text"
                    value={
                      newMarket.administrativeFee !== null
                        ? String(newMarket.administrativeFee).replace(".", ",")
                        : ""
                    }
                    onChange={(e) => {
                      const value = e.target.value.replace(",", ".");
                      setNewMarket((prev) => ({
                        ...prev,
                        administrativeFee: value ? parseFloat(value) : null,
                      }));
                    }}
                    placeholder="Ex: 5,0"
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Status *</Label>
                  <RadioGroup
                    value={newMarket.status}
                    onValueChange={(value: "ativo" | "inativo") =>
                      setNewMarket((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ativo" id="status-ativo" />
                      <Label htmlFor="status-ativo" className="cursor-pointer">
                        Ativo
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="inativo" id="status-inativo" />
                      <Label
                        htmlFor="status-inativo"
                        className="cursor-pointer"
                      >
                        Inativo
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <div className="space-y-4 min-w-0">
                <h4 className="font-semibold text-foreground border-b pb-2 mb-4">
                  Pontos de Entrega *
                </h4>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Select
                      value={selectedPontoId}
                      onValueChange={setSelectedPontoId}
                    >
                      <SelectTrigger className="h-11">
                        <SelectValue placeholder="Selecione um ponto de entrega" />
                      </SelectTrigger>
                      <SelectContent>
                        {availablePontos
                          .filter(
                            (p: any) =>
                              !newMarket.pontoEntregaIds.includes(p.id),
                          )
                          .map((ponto: any) => (
                            <SelectItem key={ponto.id} value={ponto.id}>
                              {ponto.nome} - {ponto.cidade}/{ponto.estado}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={addDeliveryPoint}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {newMarket.pontoEntregaIds.length > 0 && (
                    <div className="space-y-2">
                      {newMarket.pontoEntregaIds.map((pontoId: string) => {
                        const ponto = availablePontos.find(
                          (p: any) => p.id === pontoId,
                        );
                        return (
                          <Badge
                            key={pontoId}
                            variant="secondary"
                            className="mr-2 py-2 px-3"
                          >
                            {ponto?.nome || pontoId}
                            <button
                              onClick={() => removeDeliveryPoint(pontoId)}
                              className="ml-2 hover:text-destructive"
                            >
                              ×
                            </button>
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex-shrink-0 flex justify-end space-x-3 px-6 py-4 border-t bg-muted/30">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={saveMarket}
              disabled={criarMercadoMutation.isPending}
            >
              {criarMercadoMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Salvar Mercado
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este mercado? Esta ação não pode
              ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteMarket}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <FiltersPanel
        open={isOpen}
        onOpenChange={setIsOpen}
        onApply={() => {}}
        onClear={clearFilters}
      >
        <div className="space-y-4">
          <Label>Status</Label>
          <div className="space-y-2">
            {["ativo", "inativo"].map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${status}`}
                  checked={filters.status.includes(status)}
                  onCheckedChange={() => toggleArrayValue("status", status)}
                />
                <label
                  htmlFor={`status-${status}`}
                  className="text-sm font-medium cursor-pointer capitalize"
                >
                  {status === "ativo" ? "Ativo" : "Inativo"}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Label>Tipo de Mercado</Label>
          <div className="space-y-2">
            {marketTypeOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`tipo-${option.value}`}
                  checked={filters.tipo.includes(option.value)}
                  onCheckedChange={() => toggleArrayValue("tipo", option.value)}
                />
                <label
                  htmlFor={`tipo-${option.value}`}
                  className="text-sm font-medium cursor-pointer"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      </FiltersPanel>
    </ResponsiveLayout>
  );
};

export default AdminMercadoMercados;
