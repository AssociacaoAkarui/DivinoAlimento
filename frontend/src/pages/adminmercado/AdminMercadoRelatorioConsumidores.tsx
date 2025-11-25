import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import { UserMenuLarge } from "@/components/layout/UserMenuLarge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Search,
  Download,
  FileText,
  Eye,
  ArrowUpDown,
} from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { RoleTitle } from "@/components/layout/RoleTitle";
import { Skeleton } from "@/components/ui/skeleton";
import { useBuscarCiclo, useListarPedidosPorCiclo } from "@/hooks/graphql";
import {
  transformarPedidosParaRelatorio,
  filtrarPedidos,
  ordenarPedidos,
  calcularResumoConsolidadoPedidos,
  type PedidoConsumidor,
} from "@/lib/relatorio-consumidores-helpers";

interface PedidoDetalhado extends PedidoConsumidor {
  endereco: string;
  telefone: string;
  dataPedido: string;
}

export default function AdminMercadoRelatorioConsumidores() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { cicloId } = useParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPedido, setSelectedPedido] = useState<PedidoDetalhado | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"fornecedor" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filtroAgriculturaFamiliar, setFiltroAgriculturaFamiliar] =
    useState<string>("todos");
  const [filtroCertificacao, setFiltroCertificacao] = useState<string>("todos");

  const { data: cicloData, isLoading: isLoadingCiclo } = useBuscarCiclo(
    parseInt(cicloId || "0"),
  );
  const { data: pedidosData, isLoading: isLoadingPedidos } =
    useListarPedidosPorCiclo(parseInt(cicloId || "0"));

  const isDataLoading = isLoadingCiclo || isLoadingPedidos;

  const pedidos = useMemo(() => {
    if (!pedidosData?.listarPedidosPorCiclo) return [];
    return transformarPedidosParaRelatorio(pedidosData.listarPedidosPorCiclo);
  }, [pedidosData]);

  const pedidosFiltrados = useMemo(() => {
    const filtros = {
      searchTerm,
      agriculturaFamiliar: filtroAgriculturaFamiliar,
      certificacao: filtroCertificacao,
    };
    const filtrados = filtrarPedidos(pedidos, filtros);
    return ordenarPedidos(filtrados, sortBy, sortOrder);
  }, [
    pedidos,
    searchTerm,
    filtroAgriculturaFamiliar,
    filtroCertificacao,
    sortBy,
    sortOrder,
  ]);

  const resumo = useMemo(() => {
    return calcularResumoConsolidadoPedidos(pedidosFiltrados);
  }, [pedidosFiltrados]);

  const handleVerPedido = (pedido: PedidoConsumidor) => {
    const pedidoDetalhado: PedidoDetalhado = {
      ...pedido,
      endereco: "Rua Exemplo, 123 - Centro",
      telefone: "(11) 98765-4321",
      dataPedido: new Date().toLocaleDateString("pt-BR"),
    };
    setSelectedPedido(pedidoDetalhado);
    setModalOpen(true);
  };

  const handleExportCSV = async () => {
    try {
      const ciclosData = [
        {
          id: parseInt(cicloId || "0"),
          nome: cicloData?.buscarCiclo?.nome || `Ciclo ${cicloId}`,
        },
      ];
      const { exportConsumidoresCSV } = await import("@/utils/export");
      exportConsumidoresCSV(pedidosFiltrados, ciclosData);
      toast.success("Download do CSV concluído");
    } catch (_error) {
      toast.error("Erro ao exportar CSV");
    }
  };

  const handleExportPDF = async () => {
    try {
      const ciclosData = [
        {
          id: parseInt(cicloId || "0"),
          nome: cicloData?.buscarCiclo?.nome || `Ciclo ${cicloId}`,
        },
      ];
      const { exportConsumidoresPDF } = await import("@/utils/export");
      exportConsumidoresPDF(pedidosFiltrados, ciclosData, resumo);
      toast.success("Download do PDF concluído");
    } catch (_error) {
      toast.error("Erro ao exportar PDF");
    }
  };

  const handleSortByFornecedor = () => {
    if (sortBy === "fornecedor") {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy("fornecedor");
      setSortOrder("asc");
    }
  };

  return (
    <ResponsiveLayout
      leftHeaderContent={
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/adminmercado/ciclo-index")}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      }
      headerContent={<UserMenuLarge />}
    >
      <div className="space-y-6">
        <div>
          <RoleTitle
            page="Relatório de Pedidos dos Consumidores"
            className="text-2xl md:text-3xl"
          />
          <p className="text-sm md:text-base text-muted-foreground">
            Consulte e exporte os pedidos consolidados do seu mercado neste
            ciclo
          </p>
        </div>

        {isDataLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : (
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg text-primary">
                Resumo do Ciclo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total de Consumidores
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {resumo.totalConsumidores}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total de Kg de Alimento
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {resumo.totalKg.toFixed(2).replace(".", ",")} kg
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Valor Total Comercializado
                  </p>
                  <p className="text-2xl font-bold text-success">
                    R$ {resumo.valorTotal.toFixed(2).replace(".", ",")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filtrar por consumidor, produto ou fornecedor"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">
                Agricultura Familiar
              </label>
              <Select
                value={filtroAgriculturaFamiliar}
                onValueChange={setFiltroAgriculturaFamiliar}
              >
                <SelectTrigger className="w-[180px] bg-background">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="sim">Sim</SelectItem>
                  <SelectItem value="nao">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-muted-foreground">
                Certificação
              </label>
              <Select
                value={filtroCertificacao}
                onValueChange={setFiltroCertificacao}
              >
                <SelectTrigger className="w-[180px] bg-background">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="organico">Orgânico</SelectItem>
                  <SelectItem value="transicao">Transição</SelectItem>
                  <SelectItem value="convencional">Convencional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
            <Button variant="outline" onClick={handleExportPDF}>
              <FileText className="h-4 w-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </div>

        {isDataLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : !isMobile ? (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Consumidor(a)</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={handleSortByFornecedor}
                  >
                    <div className="flex items-center gap-2">
                      Fornecedor(a)
                      <ArrowUpDown className="h-4 w-4" />
                      {sortBy === "fornecedor" && (
                        <span className="text-xs text-muted-foreground">
                          ({sortOrder === "asc" ? "A-Z" : "Z-A"})
                        </span>
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Medida</TableHead>
                  <TableHead className="text-right">Valor Unitário</TableHead>
                  <TableHead className="text-right">Quantidade</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidosFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <p className="text-muted-foreground">
                        {searchTerm
                          ? "Nenhum resultado encontrado."
                          : "Nenhum pedido registrado."}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  pedidosFiltrados.map((pedido) => (
                    <TableRow key={pedido.id}>
                      <TableCell className="font-medium">
                        {pedido.consumidor}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span>{pedido.produto}</span>
                          <div className="flex gap-1">
                            {pedido.agriculturaFamiliar && (
                              <Badge variant="secondary" className="text-xs">
                                Agricultura Familiar
                              </Badge>
                            )}
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                pedido.certificacao === "organico"
                                  ? "border-green-600 text-green-600"
                                  : pedido.certificacao === "transicao"
                                    ? "border-yellow-600 text-yellow-600"
                                    : "border-gray-400 text-gray-600"
                              }`}
                            >
                              {pedido.certificacao === "organico"
                                ? "Orgânico"
                                : pedido.certificacao === "transicao"
                                  ? "Transição"
                                  : "Convencional"}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{pedido.fornecedor}</TableCell>
                      <TableCell>{pedido.medida}</TableCell>
                      <TableCell className="text-right">
                        R$ {pedido.valorUnitario.toFixed(2).replace(".", ",")}
                      </TableCell>
                      <TableCell className="text-right">
                        {pedido.quantidade}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-success">
                        R$ {pedido.valorTotal.toFixed(2).replace(".", ",")}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVerPedido(pedido)}
                          className="border-primary text-primary hover:bg-primary/10"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Pedido
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        ) : (
          <div className="space-y-3">
            {pedidosFiltrados.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? "Nenhum resultado encontrado."
                      : "Nenhum pedido registrado."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              pedidosFiltrados.map((pedido) => (
                <Card key={pedido.id}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-1 flex-1">
                        <p className="font-bold text-lg">{pedido.consumidor}</p>
                        <p className="text-sm text-muted-foreground">
                          Fornecedor: {pedido.fornecedor}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="text-lg font-bold text-green-600">
                          R$ {pedido.valorTotal.toFixed(2).replace(".", ",")}
                        </p>
                      </div>
                    </div>
                    <div className="border-t pt-3 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="font-medium">{pedido.produto}</p>
                          <div className="flex flex-wrap gap-1">
                            {pedido.agriculturaFamiliar && (
                              <Badge variant="secondary" className="text-xs">
                                Agricultura Familiar
                              </Badge>
                            )}
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                pedido.certificacao === "organico"
                                  ? "border-green-600 text-green-600"
                                  : pedido.certificacao === "transicao"
                                    ? "border-yellow-600 text-yellow-600"
                                    : "border-gray-400 text-gray-600"
                              }`}
                            >
                              {pedido.certificacao === "organico"
                                ? "Orgânico"
                                : pedido.certificacao === "transicao"
                                  ? "Transição"
                                  : "Convencional"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">
                            Medida
                          </p>
                          <p className="font-medium">{pedido.medida}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">
                            Valor Unit.
                          </p>
                          <p className="font-medium">
                            R${" "}
                            {pedido.valorUnitario.toFixed(2).replace(".", ",")}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">
                            Quantidade
                          </p>
                          <p className="font-medium">{pedido.quantidade}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerPedido(pedido)}
                        className="w-full border-primary text-primary hover:bg-primary/10"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalhes do Pedido
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        <div className="flex justify-start">
          <Button
            variant="outline"
            onClick={() => navigate("/adminmercado/ciclo-index")}
            className="border-primary text-primary hover:bg-primary/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-primary">
              Detalhes do Pedido Individual
            </DialogTitle>
            <DialogDescription>
              Informações completas do pedido selecionado
            </DialogDescription>
          </DialogHeader>
          {selectedPedido && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Consumidor
                  </p>
                  <p className="text-base font-semibold">
                    {selectedPedido.consumidor}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Data do Pedido
                  </p>
                  <p className="text-base font-semibold">
                    {selectedPedido.dataPedido}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Telefone
                  </p>
                  <p className="text-base font-semibold">
                    {selectedPedido.telefone}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Endereço
                  </p>
                  <p className="text-base font-semibold">
                    {selectedPedido.endereco}
                  </p>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Itens do Pedido</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-muted rounded">
                    <span className="font-medium">
                      {selectedPedido.produto}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {selectedPedido.quantidade} {selectedPedido.medida}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-semibold">Total</span>
                    <span className="text-lg font-bold text-success">
                      R${" "}
                      {selectedPedido.valorTotal.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </ResponsiveLayout>
  );
}
