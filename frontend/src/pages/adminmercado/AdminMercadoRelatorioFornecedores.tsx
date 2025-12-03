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
  ArrowLeft,
  Search,
  Download,
  FileText,
  ArrowUpDown,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { RoleTitle } from "@/components/layout/RoleTitle";
import { Skeleton } from "@/components/ui/skeleton";
import { useBuscarCiclo, useListarOfertasPorCiclo } from "@/hooks/graphql";
import {
  transformarOfertasParaRelatorio,
  filtrarEntregas,
  ordenarEntregas,
  calcularResumoConsolidado,
} from "@/lib/relatorio-fornecedores-helpers";

export default function AdminMercadoRelatorioFornecedores() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { cicloId } = useParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"fornecedor" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filtroAgriculturaFamiliar, setFiltroAgriculturaFamiliar] =
    useState<string>("todos");
  const [filtroCertificacao, setFiltroCertificacao] = useState<string>("todos");

  const { data: cicloData, isLoading: isLoadingCiclo } = useBuscarCiclo(
    parseInt(cicloId || "0"),
  );
  const { data: ofertasData, isLoading: isLoadingOfertas } =
    useListarOfertasPorCiclo(parseInt(cicloId || "0"));

  const isDataLoading = isLoadingCiclo || isLoadingOfertas;

  const entregas = useMemo(() => {
    if (!ofertasData?.listarOfertasPorCiclo) return [];
    return transformarOfertasParaRelatorio(ofertasData.listarOfertasPorCiclo);
  }, [ofertasData]);

  const entregasFiltradas = useMemo(() => {
    const filtros = {
      searchTerm,
      agriculturaFamiliar: filtroAgriculturaFamiliar,
      certificacao: filtroCertificacao,
    };
    const filtradas = filtrarEntregas(entregas, filtros);
    return ordenarEntregas(filtradas, sortBy, sortOrder);
  }, [
    entregas,
    searchTerm,
    filtroAgriculturaFamiliar,
    filtroCertificacao,
    sortBy,
    sortOrder,
  ]);

  const resumo = useMemo(() => {
    return calcularResumoConsolidado(entregasFiltradas);
  }, [entregasFiltradas]);

  const cicloInfo = useMemo(() => {
    if (!cicloData?.buscarCiclo) return null;
    const ciclo = cicloData.buscarCiclo;
    const entrega = ciclo.cicloEntregas?.[0];
    return {
      nome: ciclo.nome,
      pontoEntrega: ciclo.pontoEntrega?.nome || "Sem ponto de entrega",
      endereco: ciclo.pontoEntrega?.endereco || "",
      dataEntrega: entrega?.entregaFornecedorFim
        ? new Date(entrega.entregaFornecedorFim).toLocaleDateString("pt-BR")
        : "-",
      horaEntrega: entrega?.entregaFornecedorFim
        ? new Date(entrega.entregaFornecedorFim).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "-",
    };
  }, [cicloData]);

  const handleExportCSV = async () => {
    try {
      const ciclosData = [
        {
          id: parseInt(cicloId || "0"),
          nome: cicloInfo?.nome || `Ciclo ${cicloId}`,
        },
      ];
      const { exportFornecedoresCSV } = await import("@/utils/export");
      exportFornecedoresCSV(entregasFiltradas, ciclosData);
      toast({ title: "Sucesso", description: "Download do CSV concluído" });
    } catch (_error) {
      toast({
        title: "Erro",
        description: "Erro ao exportar CSV",
        variant: "destructive",
      });
    }
  };

  const handleExportPDF = async () => {
    try {
      const ciclosData = [
        {
          id: parseInt(cicloId || "0"),
          nome: cicloInfo?.nome || `Ciclo ${cicloId}`,
        },
      ];
      const { exportFornecedoresPDF } = await import("@/utils/export");
      exportFornecedoresPDF(entregasFiltradas, ciclosData, resumo);
      toast({ title: "Sucesso", description: "Download do PDF concluído" });
    } catch (_error) {
      toast({
        title: "Erro",
        description: "Erro ao exportar PDF",
        variant: "destructive",
      });
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
            page="Relatório de Entregas dos Fornecedores"
            className="text-2xl md:text-3xl"
          />
          <p className="text-sm md:text-base text-muted-foreground">
            Visualize e exporte as entregas realizadas para seu mercado neste
            ciclo
          </p>
        </div>

        {isDataLoading ? (
          <Skeleton className="h-48 w-full" />
        ) : (
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg text-primary">
                Resumo do Ciclo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Quantidade de Registros
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {resumo.quantidadeRegistros}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Quantidade Total Entregue
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    {resumo.totalQuantidade}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Valor Total Consolidado
                  </p>
                  <p className="text-2xl font-bold text-success">
                    R$ {resumo.valorTotal.toFixed(2).replace(".", ",")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Local / Data / Horário
                  </p>
                  <p className="text-base font-semibold">
                    {cicloInfo?.pontoEntrega}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {cicloInfo?.dataEntrega} às {cicloInfo?.horaEntrega}
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
              placeholder="Buscar fornecedor ou produto"
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
            <Button
              variant="outline"
              onClick={handleExportCSV}
              className="border-primary text-primary hover:bg-primary/10"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
            <Button
              variant="outline"
              onClick={handleExportPDF}
              className="border-primary text-primary hover:bg-primary/10"
            >
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
                  <TableHead>Produto</TableHead>
                  <TableHead>Unidade de Medida</TableHead>
                  <TableHead className="text-right">Valor Unitário</TableHead>
                  <TableHead className="text-right">
                    Quantidade Entregue
                  </TableHead>
                  <TableHead className="text-right">Valor Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entregasFiltradas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-muted-foreground">
                        {searchTerm
                          ? "Nenhum resultado encontrado."
                          : "Nenhuma entrega registrada."}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  entregasFiltradas.map((entrega) => (
                    <TableRow key={entrega.id}>
                      <TableCell className="font-medium">
                        {entrega.fornecedor}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <span>{entrega.produto}</span>
                          <div className="flex gap-1">
                            {entrega.agriculturaFamiliar && (
                              <Badge variant="secondary" className="text-xs">
                                Agricultura Familiar
                              </Badge>
                            )}
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                entrega.certificacao === "organico"
                                  ? "border-green-600 text-green-600"
                                  : entrega.certificacao === "transicao"
                                    ? "border-yellow-600 text-yellow-600"
                                    : "border-gray-400 text-gray-600"
                              }`}
                            >
                              {entrega.certificacao === "organico"
                                ? "Orgânico"
                                : entrega.certificacao === "transicao"
                                  ? "Transição"
                                  : "Convencional"}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{entrega.medida}</TableCell>
                      <TableCell className="text-right">
                        R${" "}
                        {(entrega.valorUnitario || 0)
                          .toFixed(2)
                          .replace(".", ",")}
                      </TableCell>
                      <TableCell className="text-right">
                        {entrega.quantidade}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-success">
                        R${" "}
                        {(entrega.valorTotal || 0).toFixed(2).replace(".", ",")}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        ) : (
          <div className="space-y-3">
            {entregasFiltradas.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? "Nenhum resultado encontrado."
                      : "Nenhuma entrega registrada."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              entregasFiltradas.map((entrega) => (
                <Card key={entrega.id}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="space-y-1 flex-1">
                        <p className="font-bold text-lg">
                          {entrega.fornecedor}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">
                          Valor Total
                        </p>
                        <p className="text-lg font-bold text-green-600">
                          R$ {entrega.valorTotal.toFixed(2).replace(".", ",")}
                        </p>
                      </div>
                    </div>
                    <div className="border-t pt-3 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="font-medium">{entrega.produto}</p>
                          <div className="flex flex-wrap gap-1">
                            {entrega.agriculturaFamiliar && (
                              <Badge variant="secondary" className="text-xs">
                                Agricultura Familiar
                              </Badge>
                            )}
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                entrega.certificacao === "organico"
                                  ? "border-green-600 text-green-600"
                                  : entrega.certificacao === "transicao"
                                    ? "border-yellow-600 text-yellow-600"
                                    : "border-gray-400 text-gray-600"
                              }`}
                            >
                              {entrega.certificacao === "organico"
                                ? "Orgânico"
                                : entrega.certificacao === "transicao"
                                  ? "Transição"
                                  : "Convencional"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs">
                            Unidade
                          </p>
                          <p className="font-medium">{entrega.medida}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">
                            Valor Unit.
                          </p>
                          <p className="font-medium">
                            R${" "}
                            {entrega.valorUnitario.toFixed(2).replace(".", ",")}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs">
                            Qtd. Entregue
                          </p>
                          <p className="font-medium">{entrega.quantidade}</p>
                        </div>
                      </div>
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
    </ResponsiveLayout>
  );
}
