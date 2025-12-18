import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
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
import { ArrowLeft, Download, Search } from "lucide-react";
import { formatBRL } from "@/utils/currency";
import { useIsMobile } from "@/hooks/use-mobile";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { RoleTitle } from "@/components/layout/RoleTitle";
import { useListarCiclos, useListarPedidosPorUsuario } from "@/hooks/graphql";
import { useAuth } from "@/contexts/AuthContext";

interface PedidoItem {
  id: string;
  alimento: string;
  fornecedor: string;
  medida: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  tipo: "Cesta" | "Varejo";
}

export default function ConsumidorRelatorioPedidosResultado() {
  const navigate = useNavigate();
  const { cicloId } = useParams();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof PedidoItem>("alimento");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Buscar dados via GraphQL
  const { data: ciclosData, isLoading: ciclosLoading } = useListarCiclos();
  const { data: pedidosData, isLoading: pedidosLoading } =
    useListarPedidosPorUsuario(user ? parseInt(user.id) : 0);

  const ciclo = useMemo(() => {
    if (!ciclosData?.listarCiclos?.ciclos) return null;
    return ciclosData.listarCiclos.ciclos.find((c) => c.id === cicloId);
  }, [ciclosData, cicloId]);

  // Transformar dados GraphQL para formato da UI
  const pedidos: PedidoItem[] = useMemo(() => {
    if (!pedidosData?.listarPedidosPorUsuario) return [];

    const resultado: PedidoItem[] = [];

    pedidosData.listarPedidosPorUsuario
      .filter((pedido) => pedido.cicloId === parseInt(cicloId || "0"))
      .forEach((pedido) => {
        pedido.pedidoConsumidoresProdutos?.forEach((item) => {
          resultado.push({
            id: `${pedido.id}-${item.id}`,
            alimento: item.produto?.nome || "Produto",
            fornecedor: "N/A",
            medida: item.produto?.medida || "un",
            quantidade: item.quantidade,
            valorUnitario: item.valorOferta || 0,
            valorTotal: (item.valorOferta || 0) * item.quantidade,
            tipo: "Cesta",
          });
        });
      });

    return resultado;
  }, [pedidosData, cicloId]);

  const isDataLoading = ciclosLoading || pedidosLoading;

  // Filtros e ordenação
  const pedidosFiltrados = useMemo(() => {
    const resultado = pedidos.filter(
      (pedido) =>
        pedido.alimento.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pedido.fornecedor.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    resultado.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return resultado;
  }, [pedidos, searchTerm, sortField, sortDirection]);

  // Resumo consolidado
  const resumo = useMemo(() => {
    const valorTotalCesta = pedidos
      .filter((p) => p.tipo === "Cesta")
      .reduce((sum, p) => sum + p.valorTotal, 0);

    const valorTotalVarejo = pedidos
      .filter((p) => p.tipo === "Varejo")
      .reduce((sum, p) => sum + p.valorTotal, 0);

    return {
      totalItens: pedidos.length,
      valorTotalCesta,
      valorTotalVarejo,
      valorTotal: valorTotalCesta + valorTotalVarejo,
    };
  }, [pedidos]);

  const handleSort = (field: keyof PedidoItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "Alimento",
      "Fornecedor(a)",
      "Medida",
      "Quantidade",
      "Valor Unitário",
      "Valor Total",
      "Tipo",
    ];
    const csvContent = [
      headers.join(","),
      ...pedidosFiltrados.map(
        (p) =>
          `"${p.alimento}","${p.fornecedor}","${p.medida}",${p.quantidade},${p.valorUnitario},${p.valorTotal},"${p.tipo}"`,
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `relatorio_pedidos_ciclo_${cicloId}.csv`;
    link.click();
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    // Título
    doc.setFontSize(18);
    doc.setTextColor(0, 148, 54); // Verde primary
    doc.text("Relatório de Pedidos", 14, 20);

    // Informações do ciclo
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text(ciclo?.nome || `Ciclo ${cicloId}`, 14, 28);

    // Resumo
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Resumo do Pedido", 14, 40);

    doc.setFontSize(10);
    doc.text(`Total de Itens: ${resumo.totalItens}`, 14, 48);
    doc.text(`Valor Cesta: ${formatBRL(resumo.valorTotalCesta)}`, 14, 54);
    doc.text(`Valor Varejo: ${formatBRL(resumo.valorTotalVarejo)}`, 14, 60);
    doc.setFont(undefined, "bold");
    doc.text(`Valor Total: ${formatBRL(resumo.valorTotal)}`, 14, 66);
    doc.setFont(undefined, "normal");

    // Tabela de pedidos
    autoTable(doc, {
      startY: 75,
      head: [
        [
          "Alimento",
          "Fornecedor(a)",
          "Medida",
          "Qtd",
          "Valor Unit.",
          "Valor Total",
          "Tipo",
        ],
      ],
      body: pedidosFiltrados.map((p) => [
        p.alimento,
        p.fornecedor,
        p.medida,
        p.quantidade.toString(),
        formatBRL(p.valorUnitario),
        formatBRL(p.valorTotal),
        p.tipo,
      ]),
      theme: "grid",
      headStyles: {
        fillColor: [0, 148, 54],
        textColor: 255,
        fontStyle: "bold",
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      columnStyles: {
        3: { halign: "right" },
        4: { halign: "right" },
        5: { halign: "right" },
      },
    });

    // Salvar PDF
    doc.save(`relatorio_pedidos_ciclo_${cicloId}.pdf`);
  };

  return (
    <ResponsiveLayout
      leftHeaderContent={
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/consumidor/relatorio-pedidos")}
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      }
      headerContent={<UserMenuLarge />}
    >
      <div className="space-y-6 pt-8">
        <div>
          <RoleTitle
            page="Relatório de Pedidos"
            className="text-2xl md:text-3xl"
          />
          <p className="text-sm md:text-base text-muted-foreground">
            {ciclo?.nome || `Ciclo ${cicloId}`}
          </p>
        </div>

        {/* Resumo Consolidado */}
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total de Itens</p>
                <p className="text-2xl font-bold text-primary">
                  {resumo.totalItens}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor Cesta</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatBRL(resumo.valorTotalCesta)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor Varejo</p>
                <p className="text-2xl font-bold text-secondary">
                  {formatBRL(resumo.valorTotalVarejo)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold text-primary">
                  {formatBRL(resumo.valorTotal)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filtros e Ações */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por alimento ou fornecedor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleExportCSV}
                  variant="outline"
                  className="flex-1 md:flex-initial border-primary text-primary hover:bg-primary/10"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar CSV
                </Button>
                <Button
                  onClick={handleExportPDF}
                  variant="outline"
                  className="flex-1 md:flex-initial border-primary text-primary hover:bg-primary/10"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar PDF
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabela Desktop */}
        {!isMobile && (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("alimento")}
                  >
                    Alimento{" "}
                    {sortField === "alimento" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("fornecedor")}
                  >
                    Fornecedor(a){" "}
                    {sortField === "fornecedor" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead>Medida</TableHead>
                  <TableHead
                    className="text-right cursor-pointer"
                    onClick={() => handleSort("quantidade")}
                  >
                    Quantidade{" "}
                    {sortField === "quantidade" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead className="text-right">Valor Unit.</TableHead>
                  <TableHead
                    className="text-right cursor-pointer"
                    onClick={() => handleSort("valorTotal")}
                  >
                    Valor Total{" "}
                    {sortField === "valorTotal" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("tipo")}
                  >
                    Tipo{" "}
                    {sortField === "tipo" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isDataLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <p className="text-muted-foreground">Carregando...</p>
                    </TableCell>
                  </TableRow>
                ) : pedidosFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <p className="text-muted-foreground">
                        Nenhum pedido encontrado.
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  pedidosFiltrados.map((pedido) => (
                    <TableRow key={pedido.id}>
                      <TableCell className="font-medium">
                        {pedido.alimento}
                      </TableCell>
                      <TableCell>{pedido.fornecedor}</TableCell>
                      <TableCell>{pedido.medida}</TableCell>
                      <TableCell className="text-right">
                        {pedido.quantidade}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatBRL(pedido.valorUnitario)}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatBRL(pedido.valorTotal)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            pedido.tipo === "Cesta"
                              ? "bg-green-100 text-green-800"
                              : "bg-secondary/10 text-secondary"
                          }`}
                        >
                          {pedido.tipo}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        )}

        {/* Cards Mobile */}
        {isMobile && (
          <div className="space-y-4">
            {isDataLoading ? (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">Carregando...</p>
              </Card>
            ) : pedidosFiltrados.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">
                  Nenhum pedido encontrado.
                </p>
              </Card>
            ) : (
              pedidosFiltrados.map((pedido) => (
                <Card key={pedido.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {pedido.alimento}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {pedido.fornecedor}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          pedido.tipo === "Cesta"
                            ? "bg-green-100 text-green-800"
                            : "bg-secondary/10 text-secondary"
                        }`}
                      >
                        {pedido.tipo}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Quantidade</p>
                        <p className="font-medium">
                          {pedido.quantidade} {pedido.medida}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground">Valor Unit.</p>
                        <p className="font-medium">
                          {formatBRL(pedido.valorUnitario)}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Valor Total
                        </span>
                        <span className="text-lg font-bold text-primary">
                          {formatBRL(pedido.valorTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </ResponsiveLayout>
  );
}
