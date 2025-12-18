import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { RoleTitle } from "@/components/layout/RoleTitle";
import { ArrowLeft, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { UserMenuLarge } from "@/components/layout/UserMenuLarge";
import { FiltersBar } from "@/components/admin/FiltersBar";
import { FiltersPanel } from "@/components/admin/FiltersPanel";
import { useFilters } from "@/hooks/useFilters";
import { useListarMercados } from "@/hooks/graphql";
import {
  formatTipoMercado,
  formatStatusMercado,
  formatResponsavelDisplay,
  getStatusMercadoBadgeColor,
} from "@/lib/mercado-formatters";
import {
  filterMercadosBySearch,
  filterMercadosByStatus,
  filterMercadosByTipo,
} from "@/lib/mercado-helpers";

export default function AdminPrecosLista() {
  const navigate = useNavigate();
  const { data: mercadosData, isLoading, error } = useListarMercados();

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
  } = useFilters("/admin/precos");

  const filteredMercados = useMemo(() => {
    if (!mercadosData?.listarMercados) return [];

    let result = [...mercadosData.listarMercados];

    // Aplicar busca com debounce
    if (debouncedSearch) {
      result = filterMercadosBySearch(result, debouncedSearch);
    }

    // Aplicar filtro de status
    if (filters.status.length > 0) {
      result = result.filter((m: any) => filters.status.includes(m.status));
    }

    // Aplicar filtro de tipo
    if (filters.tipo.length > 0) {
      // Mapear os valores do filtro para os tipos do backend
      const tipoMap: Record<string, string> = {
        Cestas: "cesta",
        Lote: "lote",
        "Venda Direta": "venda_direta",
      };
      const tiposBackend = filters.tipo.map((t: string) => tipoMap[t] || t);
      result = result.filter((m: any) => tiposBackend.includes(m.tipo));
    }

    return result;
  }, [mercadosData, filters, debouncedSearch]);

  if (isLoading) {
    return (
      <ResponsiveLayout
        leftHeaderContent={
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate("/admin/dashboard")}
            className="text-primary-foreground hover:bg-primary-hover"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        }
        headerContent={<UserMenuLarge />}
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Carregando mercados...</p>
            </CardContent>
          </Card>
        </div>
      </ResponsiveLayout>
    );
  }

  if (error) {
    return (
      <ResponsiveLayout
        leftHeaderContent={
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate("/admin/dashboard")}
            className="text-primary-foreground hover:bg-primary-hover"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        }
        headerContent={<UserMenuLarge />}
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <p className="text-muted-foreground">Erro ao carregar mercados</p>
              <Button onClick={() => window.location.reload()}>
                Tentar novamente
              </Button>
            </CardContent>
          </Card>
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
          onClick={() => navigate("/admin/dashboard")}
          className="text-primary-foreground hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
      headerContent={<UserMenuLarge />}
    >
      <div className="space-y-6 pb-20">
        {/* Header */}
        <div className="flex flex-col">
          <div>
            <RoleTitle
              page="Lista de Mercados – Gestão de Preços"
              className="text-2xl md:text-3xl"
            />
            <p className="text-muted-foreground">
              Selecione um mercado para definir preços específicos
            </p>
          </div>
        </div>

        {/* Search and Filters */}
        <FiltersBar
          searchValue={filters.search}
          onSearchChange={(value) => updateFilter("search", value)}
          onFiltersClick={() => setIsOpen(true)}
          activeChips={getActiveChips()}
          onRemoveChip={clearFilterGroup}
          resultCount={filteredMercados.length}
          hasActiveFilters={hasActiveFilters()}
          filtersOpen={isOpen}
        />

        {/* Desktop Table */}
        <Card className="hidden md:block">
          <CardHeader>
            <CardTitle>Mercados Cadastrados</CardTitle>
            <CardDescription>
              {filteredMercados.length} mercado(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Mercado</TableHead>
                  <TableHead>Tipo de Mercado</TableHead>
                  <TableHead>Administrador(a) Responsável</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMercados.map((mercado: any) => (
                  <TableRow key={mercado.id}>
                    <TableCell className="font-medium">
                      {mercado.nome}
                    </TableCell>
                    <TableCell>{formatTipoMercado(mercado.tipo)}</TableCell>
                    <TableCell>
                      {formatResponsavelDisplay(mercado.responsavel)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          mercado.status === "ativo" ? "default" : "secondary"
                        }
                      >
                        {formatStatusMercado(mercado.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        className="bg-success hover:bg-success/90"
                        onClick={() => navigate(`/admin/precos/${mercado.id}`)}
                      >
                        <DollarSign className="w-4 h-4 mr-2" />
                        Gerenciar Preços
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {filteredMercados.map((mercado: any) => (
            <Card key={mercado.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{mercado.nome}</CardTitle>
                    <CardDescription>
                      {formatTipoMercado(mercado.tipo)}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      mercado.status === "ativo" ? "default" : "secondary"
                    }
                  >
                    {formatStatusMercado(mercado.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Administrador Responsável
                  </p>
                  <p className="text-sm font-medium">
                    {formatResponsavelDisplay(mercado.responsavel)}
                  </p>
                </div>
                <Button
                  size="sm"
                  className="w-full bg-success hover:bg-success/90"
                  onClick={() => navigate(`/admin/precos/${mercado.id}`)}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Gerenciar Preços
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMercados.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center space-y-4">
              <p className="text-muted-foreground">
                {hasActiveFilters()
                  ? "Sem resultados para os filtros selecionados."
                  : "Nenhum mercado encontrado"}
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

      {/* Painel de Filtros */}
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
            {["Cestas", "Lote", "Venda Direta"].map((tipo) => (
              <div key={tipo} className="flex items-center space-x-2">
                <Checkbox
                  id={`tipo-${tipo}`}
                  checked={filters.tipo.includes(tipo)}
                  onCheckedChange={() => toggleArrayValue("tipo", tipo)}
                />
                <label
                  htmlFor={`tipo-${tipo}`}
                  className="text-sm font-medium cursor-pointer"
                >
                  {tipo}
                </label>
              </div>
            ))}
          </div>
        </div>
      </FiltersPanel>
    </ResponsiveLayout>
  );
}
