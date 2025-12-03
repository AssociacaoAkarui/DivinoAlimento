import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { UserMenuLarge } from "@/components/layout/UserMenuLarge";
import { RoleTitle } from "@/components/layout/RoleTitle";
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
import {
  useListarEntregasFornecedoresPorCiclo,
  useBuscarCiclo,
} from "@/hooks/graphql";
import {
  sortEntregasByFornecedor,
  generateEntregasCSV,
} from "@/lib/entregas-helpers";

export default function AdminEntregasFornecedores() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"fornecedor" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filtroAgriculturaFamiliar, setFiltroAgriculturaFamiliar] =
    useState<string>("todos");
  const [filtroCertificacao, setFiltroCertificacao] = useState<string>("todos");

  // Fetch entregas from GraphQL API
  const {
    data: entregasData,
    isLoading,
    error,
  } = useListarEntregasFornecedoresPorCiclo(id ? parseInt(id) : 0);

  // Fetch ciclo data for export
  const { data: cicloData } = useBuscarCiclo(id || "");

  const entregas = entregasData || [];

  const filteredEntregas = entregas
    .filter((entrega) => {
      const matchSearch =
        entrega.fornecedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entrega.produto.toLowerCase().includes(searchTerm.toLowerCase());

      const matchAgriculturaFamiliar =
        filtroAgriculturaFamiliar === "todos" ||
        (filtroAgriculturaFamiliar === "sim" && entrega.agriculturaFamiliar) ||
        (filtroAgriculturaFamiliar === "nao" && !entrega.agriculturaFamiliar);

      const matchCertificacao =
        filtroCertificacao === "todos" ||
        entrega.certificacao === filtroCertificacao;

      return matchSearch && matchAgriculturaFamiliar && matchCertificacao;
    })
    .sort((a, b) => {
      if (sortBy === "fornecedor") {
        const compareResult = a.fornecedor.localeCompare(b.fornecedor);
        return sortOrder === "asc" ? compareResult : -compareResult;
      }
      return 0;
    });

  const totalQuantidade = filteredEntregas.reduce(
    (acc, e) => acc + e.quantidadeEntregue,
    0,
  );
  const valorTotalGeral = filteredEntregas.reduce(
    (acc, e) => acc + e.valorTotal,
    0,
  );

  const handleExportCSV = async () => {
    try {
      const ciclosData = cicloData
        ? [{ id: cicloData.id, nome: cicloData.nome }]
        : [{ id: parseInt(id || "1"), nome: `Ciclo ${id}` }];
      const { exportFornecedoresCSV } = await import("@/utils/export");
      exportFornecedoresCSV(filteredEntregas, ciclosData);
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
      const ciclosData = cicloData
        ? [{ id: cicloData.id, nome: cicloData.nome }]
        : [{ id: parseInt(id || "1"), nome: `Ciclo ${id}` }];
      const resumo = { totalQuantidade, valorTotal: valorTotalGeral };
      const { exportFornecedoresPDF } = await import("@/utils/export");
      exportFornecedoresPDF(filteredEntregas, ciclosData, resumo);
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

  // Loading state
  if (isLoading) {
    return (
      <ResponsiveLayout headerContent={<UserMenuLarge />}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Carregando entregas...</p>
        </div>
      </ResponsiveLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <ResponsiveLayout headerContent={<UserMenuLarge />}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <p className="text-destructive">Erro ao carregar entregas</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout
      leftHeaderContent={
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/admin/ciclo-index")}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      }
      headerContent={<UserMenuLarge />}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <RoleTitle
            page="Relatório de Entregas dos Fornecedores"
            className="text-2xl md:text-3xl"
          />
          <p className="text-sm md:text-base text-muted-foreground">
            Visualize e exporte as entregas realizadas no ciclo selecionado
          </p>
        </div>

        {/* Resumo Card */}
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
                  Quantidade de Registros
                </p>
                <p className="text-2xl font-bold text-primary">
                  {filteredEntregas.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Quantidade Total Entregue
                </p>
                <p className="text-2xl font-bold text-primary">
                  {totalQuantidade}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Valor Total Consolidado
                </p>
                <p className="text-2xl font-bold text-success">
                  R$ {valorTotalGeral.toFixed(2).replace(".", ",")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar fornecedor ou alimento"
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

        {/* Table */}
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
                <TableHead>Alimento</TableHead>
                <TableHead>Unidade de Medida</TableHead>
                <TableHead className="text-right">Valor Unitário</TableHead>
                <TableHead className="text-right">
                  Quantidade Entregue
                </TableHead>
                <TableHead className="text-right">Valor Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntregas.length === 0 ? (
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
                filteredEntregas.map((entrega) => (
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
                    <TableCell>{entrega.unidade_medida}</TableCell>
                    <TableCell className="text-right">
                      R${" "}
                      {(entrega.valor_unitario || 0)
                        .toFixed(2)
                        .replace(".", ",")}
                    </TableCell>
                    <TableCell className="text-right">
                      {entrega.quantidade_entregue}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-success">
                      R${" "}
                      {(entrega.valor_total || 0).toFixed(2).replace(".", ",")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Footer Button */}
        <div className="flex justify-start">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/ciclo-index")}
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
