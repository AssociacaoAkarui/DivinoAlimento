import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RoleTitle } from "@/components/layout/RoleTitle";
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
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useListarOfertasPorCiclo, useListarCiclos } from "@/hooks/graphql";
import {
  transformarOfertasParaRelatorio,
  calcularResumoConsolidado,
  filtrarEntregas,
  ordenarEntregas,
  type EntregaFornecedor,
} from "@/lib/relatorio-fornecedores-helpers";

export default function AdminRelatorioFornecedoresResultado() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();
  const ciclosIds =
    searchParams
      .get("ciclos")
      ?.split(",")
      .map((id) => parseInt(id)) || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"fornecedor" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filtroAgriculturaFamiliar, setFiltroAgriculturaFamiliar] =
    useState<string>("todos");
  const [filtroCertificacao, setFiltroCertificacao] = useState<string>("todos");

  const { data: ciclosData } = useListarCiclos();

  const ofertasQueries = ciclosIds.map((cicloId) =>
    useListarOfertasPorCiclo(cicloId),
  );

  const isLoading = ofertasQueries.some((q) => q.isLoading);

  const todasEntregas = useMemo(() => {
    const entregas: EntregaFornecedor[] = [];

    ofertasQueries.forEach((query) => {
      if (query.data?.listarOfertasPorCiclo) {
        const entregasDoCiclo = transformarOfertasParaRelatorio(
          query.data.listarOfertasPorCiclo,
        );
        entregas.push(...entregasDoCiclo);
      }
    });

    return entregas;
  }, [ofertasQueries]);

  const filteredEntregas = useMemo(() => {
    const filtradas = filtrarEntregas(todasEntregas, {
      searchTerm,
      agriculturaFamiliar: filtroAgriculturaFamiliar,
      certificacao: filtroCertificacao,
    });
    return ordenarEntregas(filtradas, sortBy, sortOrder);
  }, [
    todasEntregas,
    searchTerm,
    filtroAgriculturaFamiliar,
    filtroCertificacao,
    sortBy,
    sortOrder,
  ]);

  const resumo = useMemo(() => {
    return calcularResumoConsolidado(filteredEntregas);
  }, [filteredEntregas]);

  const ciclosSelecionados = useMemo(() => {
    if (!ciclosData?.listarCiclos?.ciclos) return [];
    return ciclosData.listarCiclos.ciclos.filter((c) =>
      ciclosIds.includes(parseInt(c.id)),
    );
  }, [ciclosData, ciclosIds]);

  const handleExportCSV = async () => {
    try {
      const ciclosDataExport = ciclosSelecionados.map((c) => ({
        id: parseInt(c.id),
        nome: c.nome,
      }));

      const { exportFornecedoresCSV } = await import("@/utils/export");
      exportFornecedoresCSV(filteredEntregas, ciclosDataExport);
      toast.success("Download do CSV concluído");
    } catch (_error) {
      toast.error("Erro ao exportar CSV");
    }
  };

  const handleExportPDF = async () => {
    try {
      const ciclosDataExport = ciclosSelecionados.map((c) => ({
        id: parseInt(c.id),
        nome: c.nome,
      }));

      const resumoExport = {
        totalQuantidade: resumo.totalQuantidade,
        valorTotal: resumo.valorTotal,
      };

      const { exportFornecedoresPDF } = await import("@/utils/export");
      exportFornecedoresPDF(filteredEntregas, ciclosDataExport, resumoExport);
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
        <button
          onClick={() => navigate("/admin/relatorio-fornecedores")}
          className="flex items-center text-primary-foreground hover:opacity-80 transition-opacity focus-ring p-2 -ml-2"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      }
      headerContent={<UserMenuLarge />}
    >
      <div className="space-y-6">
        <div>
          <RoleTitle
            page="Relatório de Entregas dos Fornecedores"
            className="text-3xl"
          />
          <p className="text-muted-foreground mt-2">
            Visualize e exporte as entregas realizadas nos ciclos selecionados
          </p>
        </div>

        {isLoading ? (
          <>
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-96 w-full" />
          </>
        ) : (
          <>
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Resumo Consolidado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Quantidade de Registros
                    </p>
                    <p className="text-2xl font-bold">
                      {resumo.quantidadeRegistros}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Quantidade Total Entregue
                    </p>
                    <p className="text-2xl font-bold">
                      {resumo.totalQuantidade}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Valor Total Consolidado
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      R$ {resumo.valorTotal.toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar fornecedor, produto ou ciclo"
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

            {!isMobile ? (
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ciclo</TableHead>
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
                      <TableHead>Unidade</TableHead>
                      <TableHead className="text-right">Valor Unit.</TableHead>
                      <TableHead className="text-right">
                        Qtd. Entregue
                      </TableHead>
                      <TableHead className="text-right">Valor Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntregas.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <p className="text-muted-foreground">
                            {searchTerm
                              ? "Nenhum resultado encontrado."
                              : "Nenhuma entrega registrada."}
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredEntregas.map((entrega) => (
                        <TableRow key={entrega.id}>
                          <TableCell className="font-medium">
                            {entrega.ciclo}
                          </TableCell>
                          <TableCell>{entrega.fornecedor}</TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <span>{entrega.produto}</span>
                              <div className="flex gap-1">
                                {entrega.agricultura_familiar && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
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
                          <TableCell>{entrega.unidade_medida}</TableCell>
                          <TableCell className="text-right">
                            R${" "}
                            {entrega.valor_unitario
                              .toFixed(2)
                              .replace(".", ",")}
                          </TableCell>
                          <TableCell className="text-right">
                            {entrega.quantidade_entregue}
                          </TableCell>
                          <TableCell className="text-right font-semibold text-green-600">
                            R${" "}
                            {entrega.valor_total.toFixed(2).replace(".", ",")}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Card>
            ) : (
              <div className="space-y-3">
                {filteredEntregas.length === 0 ? (
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
                  filteredEntregas.map((entrega) => (
                    <Card key={entrega.id}>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-start gap-2">
                          <div className="space-y-1 flex-1">
                            <p className="font-semibold text-sm text-muted-foreground">
                              {entrega.ciclo}
                            </p>
                            <p className="font-bold text-lg">
                              {entrega.fornecedor}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              Valor Total
                            </p>
                            <p className="text-lg font-bold text-green-600">
                              R${" "}
                              {entrega.valor_total.toFixed(2).replace(".", ",")}
                            </p>
                          </div>
                        </div>
                        <div className="border-t pt-3 space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <p className="font-medium">{entrega.produto}</p>
                              <div className="flex flex-wrap gap-1">
                                {entrega.agricultura_familiar && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
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
                              <p className="font-medium">
                                {entrega.unidade_medida}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">
                                Valor Unit.
                              </p>
                              <p className="font-medium">
                                R${" "}
                                {entrega.valor_unitario
                                  .toFixed(2)
                                  .replace(".", ",")}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">
                                Qtd. Entregue
                              </p>
                              <p className="font-medium">
                                {entrega.quantidade_entregue}
                              </p>
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
                onClick={() => navigate("/admin/relatorio-fornecedores")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </div>
          </>
        )}
      </div>
    </ResponsiveLayout>
  );
}
