import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
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
import { ArrowLeft, Search, Download, FileText, Package } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatBRL } from "@/utils/currency";
import { UserMenuLarge } from "@/components/layout/UserMenuLarge";
import { useIsMobile } from "@/hooks/use-mobile";
import { parseISO } from "date-fns";
import { RoleTitle } from "@/components/layout/RoleTitle";
import { exportFornecedoresCSV, exportFornecedoresPDF } from "@/utils/export";
import { useListarEntregasFornecedoresPorCiclo } from "@/hooks/graphql";
import {
  sortEntregasByProduto,
  calcularTotalGeralEntregas,
  generateEntregasCSV,
} from "@/lib/entregas-helpers";

export default function FornecedorEntregas() {
  const navigate = useNavigate();
  const { cicloId } = useParams();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [orderBy, setOrderBy] = useState<"produto" | "valor">("produto");

  // Fetch entregas from GraphQL API
  const {
    data: entregasData,
    isLoading,
    error,
  } = useListarEntregasFornecedoresPorCiclo(
    cicloId ? parseInt(cicloId) : 0,
    undefined, // fornecedorId - undefined means current user (authenticated)
  );

  const entregas = entregasData || [];

  const filteredEntregas = entregas
    .filter(
      (entrega) =>
        entrega.produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entrega.fornecedor.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      if (orderBy === "produto") {
        return a.produto.localeCompare(b.produto);
      } else {
        return b.valorTotal - a.valorTotal;
      }
    });

  const totalQuantidade = filteredEntregas.reduce(
    (acc, e) => acc + e.quantidadeEntregue,
    0,
  );
  const valorTotalGeral = filteredEntregas.reduce(
    (acc, e) => acc + e.valorTotal,
    0,
  );

  const handleExportCSV = () => {
    try {
      // Preparar dados para exportação com campos necessários
      const entregasParaExportar = filteredEntregas.map((e) => ({
        ciclo: `Ciclo ${cicloId}`,
        fornecedor: "Fornecedor Atual", // Em produção, viria do contexto de autenticação
        produto: e.produto,
        unidade_medida: e.unidadeMedida,
        valor_unitario: e.valorUnitario,
        quantidade_entregue: e.quantidadeEntregue,
        valor_total: e.valorTotal,
      }));

      const ciclos = [{ id: Number(cicloId), nome: `Ciclo ${cicloId}` }];

      exportFornecedoresCSV(entregasParaExportar, ciclos);

      toast({
        title: "Exportação concluída",
        description: "O relatório CSV foi gerado com sucesso!",
      });
    } catch (_error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível gerar o arquivo CSV.",
        variant: "destructive",
      });
    }
  };

  const handleExportPDF = () => {
    try {
      // Preparar dados para exportação com campos necessários
      const entregasParaExportar = filteredEntregas.map((e) => ({
        ciclo: `Ciclo ${cicloId}`,
        fornecedor: "Fornecedor Atual", // Em produção, viria do contexto de autenticação
        produto: e.produto,
        unidade_medida: e.unidadeMedida,
        valor_unitario: e.valorUnitario,
        quantidade_entregue: e.quantidadeEntregue,
        valor_total: e.valorTotal,
      }));

      const ciclos = [{ id: Number(cicloId), nome: `Ciclo ${cicloId}` }];
      const resumo = {
        totalQuantidade,
        valorTotal: valorTotalGeral,
      };

      exportFornecedoresPDF(entregasParaExportar, ciclos, resumo);

      toast({
        title: "Exportação concluída",
        description: "O relatório PDF foi gerado com sucesso!",
      });
    } catch (_error) {
      toast({
        title: "Erro na exportação",
        description: "Não foi possível gerar o arquivo PDF.",
        variant: "destructive",
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <ResponsiveLayout
        headerContent={<UserMenuLarge />}
        leftHeaderContent={
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/fornecedor/loja")}
            className="text-white hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        }
      >
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Carregando entregas...</p>
        </div>
      </ResponsiveLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <ResponsiveLayout
        headerContent={<UserMenuLarge />}
        leftHeaderContent={
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/fornecedor/loja")}
            className="text-white hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        }
      >
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <p className="text-destructive">Erro ao carregar entregas</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </ResponsiveLayout>
    );
  }

  // Empty state when no entregas
  if (entregas.length === 0) {
    return (
      <ResponsiveLayout
        headerContent={<UserMenuLarge />}
        leftHeaderContent={
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/fornecedor/loja")}
            className="text-white hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        }
      >
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <Package className="h-16 w-16 text-muted-foreground" />
          <h2 className="text-2xl font-bold text-primary">
            Nenhuma entrega encontrada
          </h2>
          <p className="text-muted-foreground text-center max-w-md">
            Não há entregas registradas para este ciclo.
          </p>
          <Button onClick={() => navigate("/fornecedor/loja")}>
            Escolher outro ciclo
          </Button>
        </div>
      </ResponsiveLayout>
    );
  }

  return (
    <ResponsiveLayout
      headerContent={<UserMenuLarge />}
      leftHeaderContent={
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/fornecedor/selecionar-ciclo-entregas")}
          className="text-white hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      }
    >
      <div className="space-y-6 pt-8">
        {/* Header */}
        <div>
          <RoleTitle page="Relatório de Entregas" />
          <p className="text-sm md:text-base text-muted-foreground">
            Visualize e exporte suas entregas no ciclo selecionado
          </p>
        </div>

        {/* Resumo Card */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg text-primary">
              Resumo das Entregas
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
                  {formatBRL(valorTotalGeral)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={orderBy}
              onValueChange={(value: "urgente" | "antiga") => setOrderBy(value)}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="produto">Por produto</SelectItem>
                <SelectItem value="valor">Por valor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
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
          {isMobile ? (
            <CardContent className="pt-6">
              {filteredEntregas.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {searchTerm
                      ? "Nenhum resultado encontrado."
                      : "Nenhuma entrega registrada."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredEntregas.map((entrega) => (
                    <div
                      key={entrega.id}
                      className="bg-white border border-border rounded-xl p-4 space-y-2"
                    >
                      <div className="font-bold text-base text-primary">
                        Produto: {entrega.produto}
                      </div>
                      <div className="text-sm text-foreground">
                        <span className="text-muted-foreground">Unidade:</span>{" "}
                        {entrega.unidade_medida}
                      </div>
                      <div className="text-sm text-foreground">
                        <span className="text-muted-foreground">
                          Valor Unitário:
                        </span>{" "}
                        {formatBRL(entrega.valor_unitario)}
                      </div>
                      <div className="text-sm text-foreground">
                        <span className="text-muted-foreground">
                          Quantidade Entregue:
                        </span>{" "}
                        {entrega.quantidade_entregue}
                      </div>
                      <div className="text-sm font-semibold text-primary">
                        <span className="text-muted-foreground font-normal">
                          Valor Total:
                        </span>{" "}
                        {formatBRL(entrega.valor_total)}
                      </div>
                      <div className="text-sm text-foreground">
                        <span className="text-muted-foreground">
                          Data/Hora de Entrega:
                        </span>{" "}
                        {entrega.data_hora_entrega}
                      </div>
                      <div className="text-sm text-foreground">
                        <span className="text-muted-foreground">Local:</span>{" "}
                        {entrega.local_nome}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="text-muted-foreground">Endereço:</span>{" "}
                        {entrega.local_endereco}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead className="text-right">Valor Unitário</TableHead>
                    <TableHead className="text-right">
                      Quantidade Entregue
                    </TableHead>
                    <TableHead className="text-right">Valor Total</TableHead>
                    <TableHead>Data/Hora de Entrega</TableHead>
                    <TableHead>Local de Entrega</TableHead>
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
                          {entrega.produto}
                        </TableCell>
                        <TableCell>{entrega.unidade_medida}</TableCell>
                        <TableCell className="text-right">
                          {formatBRL(entrega.valor_unitario)}
                        </TableCell>
                        <TableCell className="text-right">
                          {entrega.quantidade_entregue}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-success">
                          {formatBRL(entrega.valor_total)}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {entrega.data_hora_entrega}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">{entrega.local_nome}</p>
                            <p className="text-sm text-muted-foreground">
                              {entrega.local_endereco}
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>
      </div>
    </ResponsiveLayout>
  );
}
