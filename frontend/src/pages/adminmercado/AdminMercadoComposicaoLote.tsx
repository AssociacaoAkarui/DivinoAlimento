import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import {
  Search,
  ChevronDown,
  ChevronUp,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { formatBRL } from "@/utils/currency";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductGroupItem } from "@/components/admin/ProductGroupItem";
import {
  groupAndSortProducts,
  filterProducts,
  Oferta,
} from "@/utils/product-grouping";
import { RoleTitle } from "@/components/layout/RoleTitle";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useBuscarCiclo,
  useListarOfertasPorCiclo,
  useListarComposicoesPorCiclo,
  useCriarComposicao,
  useSincronizarProdutosComposicao,
  useListarCestas,
  useBuscarMercado,
} from "@/hooks/graphql";
import { transformarOfertasParaUI } from "@/lib/composicao-helpers";

export default function AdminMercadoComposicaoLote() {
  const { cicloId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mercadoId = searchParams.get("mercado");

  const [busca, setBusca] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [_showConfirmModal, setShowConfirmModal] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const [selectedByGroup, setSelectedByGroup] = useState<
    Map<string, Set<string>>
  >(new Map());
  const [composicao, setComposicao] = useState<Map<string, number>>(new Map());

  // Carregar composição do localStorage
  useEffect(() => {
    const storageKey = `composicao-lote-ciclo-${cicloId}-mercado-${mercadoId}`;
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        const selectedMap = new Map<string, Set<string>>(
          parsed.selectedByGroup.map(([key, value]: [string, string[]]) => [
            key,
            new Set<string>(value),
          ]),
        );
        setSelectedByGroup(selectedMap);
        setComposicao(new Map<string, number>(parsed.composicao));
        toast({
          title: "Composição carregada",
          description: "Dados anteriores foram restaurados.",
          duration: 3000,
        });
      } catch (e) {
        console.error("Erro ao carregar composição:", e);
      }
    }
  }, [cicloId, mercadoId]);

  const { data: cicloData, isLoading: cicloLoading } = useBuscarCiclo(
    cicloId || "",
  );
  const { data: mercadoData } = useBuscarMercado(mercadoId || "");
  const { data: ofertasData, isLoading: ofertasLoading } =
    useListarOfertasPorCiclo(cicloId ? parseInt(cicloId) : 0);
  const { data: composicoesData } = useListarComposicoesPorCiclo(cicloId || "");
  const { data: cestasData } = useListarCestas();
  const criarComposicaoMutation = useCriarComposicao();
  const sincronizarProdutosMutation = useSincronizarProdutosComposicao();

  const ofertas = useMemo(() => {
    if (!ofertasData?.listarOfertasPorCiclo) return [];
    return transformarOfertasParaUI(ofertasData.listarOfertasPorCiclo);
  }, [ofertasData]);

  const cicloAPI = cicloData?.buscarCiclo;
  const mercadoAPI = mercadoData?.buscarMercado;
  const ciclo = useMemo(
    () => ({
      nome: cicloAPI?.nome || "Ciclo",
      valorMaximo: 500.0,
      tipo: "Lote",
      mercado: mercadoAPI?.nome || "Mercado",
    }),
    [cicloAPI, mercadoAPI],
  );

  const isDataLoading = cicloLoading || ofertasLoading;

  const productGroups = useMemo(() => {
    const groups = groupAndSortProducts(ofertas);
    return filterProducts(groups, busca);
  }, [ofertas, busca]);

  const selectedItems = useMemo(() => {
    const items: Array<{ id: string; valor: number; quantidade: number }> = [];
    selectedByGroup.forEach((variantIds) => {
      variantIds.forEach((variantId) => {
        const quantidade = composicao.get(variantId) || 0;
        if (quantidade > 0) {
          const oferta = ofertas.find((o) => o.id === variantId);
          if (oferta) {
            items.push({
              id: variantId,
              valor: oferta.valor,
              quantidade,
            });
          }
        }
      });
    });
    return items;
  }, [selectedByGroup, composicao, ofertas]);

  const valorAtual = selectedItems.reduce((acc, item) => {
    return acc + item.valor * item.quantidade;
  }, 0);

  const totalItens = selectedItems.reduce(
    (acc, item) => acc + item.quantidade,
    0,
  );

  const handleToggleVariant = (groupKey: string, variantId: string) => {
    setSelectedByGroup((prev) => {
      const newMap = new Map(prev);
      const currentSet = newMap.get(groupKey) || new Set();
      const newSet = new Set(currentSet);

      if (newSet.has(variantId)) {
        newSet.delete(variantId);
        setComposicao((prevComp) => {
          const newComp = new Map(prevComp);
          newComp.delete(variantId);
          return newComp;
        });
      } else {
        newSet.add(variantId);
      }

      if (newSet.size === 0) {
        newMap.delete(groupKey);
      } else {
        newMap.set(groupKey, newSet);
      }
      return newMap;
    });
  };

  const handleClearGroup = (groupKey: string) => {
    const variantIds = selectedByGroup.get(groupKey);
    if (variantIds) {
      setSelectedByGroup((prev) => {
        const newMap = new Map(prev);
        newMap.delete(groupKey);
        return newMap;
      });
      setComposicao((prev) => {
        const newMap = new Map(prev);
        variantIds.forEach((id) => newMap.delete(id));
        return newMap;
      });
    }
  };

  const handleQuantidadeChange = (variantId: string, quantidade: number) => {
    const oferta = ofertas.find((o) => o.id === variantId);
    if (!oferta) return;

    const validQuantity = Math.max(
      0,
      Math.min(quantidade, oferta.quantidadeOfertada),
    );

    setComposicao((prev) => {
      const newMap = new Map(prev);
      if (validQuantity === 0) {
        newMap.delete(variantId);
      } else {
        newMap.set(variantId, validQuantity);
      }
      return newMap;
    });
  };

  const toggleGroupExpansion = (groupKey: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupKey)) {
        newSet.delete(groupKey);
      } else {
        newSet.add(groupKey);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    setExpandedGroups(new Set(productGroups.map((g) => g.produto_base)));
  };

  const collapseAll = () => {
    setExpandedGroups(new Set());
  };

  const handlePublicarClick = () => {
    executarPublicacao();
  };

  const executarPublicacao = async () => {
    const produtos = selectedItems.map((item) => ({
      produtoId: parseInt(item.id),
      quantidade: item.quantidade,
      ofertaProdutoId: parseInt(item.id),
    }));

    setIsLoading(true);
    setShowConfirmModal(false);

    try {
      const composicaoExistente = composicoesData?.[0]?.composicoes?.[0];

      if (composicaoExistente) {
        await sincronizarProdutosMutation.mutateAsync({
          composicaoId: composicaoExistente.id,
          produtos,
        });
      } else if (cicloId && cestasData?.[0]) {
        const novaComposicao = await criarComposicaoMutation.mutateAsync({
          input: {
            cicloId: parseInt(cicloId),
            cestaId: parseInt(cestasData[0].id),
            quantidadeCestas: 1,
          },
        });
        await sincronizarProdutosMutation.mutateAsync({
          composicaoId: novaComposicao.criarComposicao.id,
          produtos,
        });
      }

      toast({
        title: "Composição lote salva com sucesso",
        description: `${selectedItems.length} produto(s), ${totalItens} itens, ${formatBRL(valorAtual)}`,
        className: "bg-green-600 text-white border-green-700",
        duration: 5000,
      });

      setTimeout(() => {
        navigate("/adminmercado/ciclo-index");
      }, 1000);
    } catch (error) {
      toast({
        title: "Erro ao salvar composição lote.",
        description: String(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const podePublicar = selectedItems.length > 0 && !isDataLoading;
  const _excedeuValor = valorAtual > ciclo.valorMaximo;

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
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <RoleTitle
            page={`Composição de Ofertas – ${ciclo.mercado}`}
            className="text-2xl md:text-3xl"
          />
          <p className="text-sm md:text-base text-muted-foreground">
            Configure os produtos, quantidades e valores que serão oferecidos
            neste ciclo
          </p>
        </div>

        {/* Resumo Card */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle className="text-2xl">{ciclo.nome}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Tipo: {ciclo.tipo} • Mercado: {ciclo.mercado}
                </p>
              </div>
              <div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">
                          Valor Atual
                        </p>
                        <p className="text-2xl font-bold">
                          {formatBRL(valorAtual)}
                        </p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Soma dos produtos × quantidades selecionadas</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardHeader>
        </Card>
        {/* Alimentos Selecionados */}
        {selectedItems.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Alimentos Selecionados</CardTitle>
                <div className="text-sm text-muted-foreground">
                  {selectedItems.length} alimento(s) · {totalItens} itens
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Alimento</TableHead>
                    <TableHead>Medida</TableHead>
                    <TableHead className="text-right">Valor Unit.</TableHead>
                    <TableHead>Fornecedor(a)</TableHead>
                    <TableHead className="text-right">Ofertados</TableHead>
                    <TableHead className="text-right">Pedidos</TableHead>
                    <TableHead className="text-right">
                      Valor Acumulado
                    </TableHead>
                    <TableHead className="text-right">Disponíveis</TableHead>
                    <TableHead className="text-center">Remover</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedItems.map((item) => {
                    const oferta = ofertas.find((o) => o.id === item.id);
                    if (!oferta) return null;

                    const valorAcumulado = item.valor * item.quantidade;
                    const disponiveis =
                      oferta.quantidadeOfertada - item.quantidade;

                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {oferta.produto_base}
                        </TableCell>
                        <TableCell>{oferta.unidade}</TableCell>
                        <TableCell className="text-right">
                          {formatBRL(oferta.valor)}
                        </TableCell>
                        <TableCell>{oferta.fornecedor}</TableCell>
                        <TableCell className="text-right">
                          {oferta.quantidadeOfertada}
                        </TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            min={0}
                            max={oferta.quantidadeOfertada}
                            value={item.quantidade}
                            onChange={(e) =>
                              handleQuantidadeChange(
                                item.id,
                                Number(e.target.value),
                              )
                            }
                            className="w-[60px] text-center mx-auto"
                          />
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatBRL(valorAcumulado)}
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={
                              disponiveis < 0 ? "text-red-600 font-bold" : ""
                            }
                          >
                            {disponiveis}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const group = productGroups.find((g) =>
                                g.variantes.some((v) => v.id === item.id),
                              );
                              if (group) {
                                handleToggleVariant(
                                  group.produto_base,
                                  item.id,
                                );
                              }
                            }}
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Busca e Filtros */}
        <Card>
          <CardHeader>
            <div className="space-y-4">
              <CardTitle>Alimentos Ofertados</CardTitle>

              {/* Action Bar */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar alimento..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={
                    expandedGroups.size === productGroups.length
                      ? collapseAll
                      : expandAll
                  }
                  className="whitespace-nowrap h-9 border-primary text-primary hover:bg-primary/10"
                >
                  {expandedGroups.size === productGroups.length ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Recolher Tudo
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Expandir Tudo
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading || isDataLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : productGroups.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>Nenhuma oferta disponível para este ciclo.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {productGroups.map((group) => (
                  <ProductGroupItem
                    key={group.produto_base}
                    group={group}
                    isExpanded={expandedGroups.has(group.produto_base)}
                    onToggleExpand={() =>
                      toggleGroupExpansion(group.produto_base)
                    }
                    selectedVariantIds={
                      selectedByGroup.get(group.produto_base) || new Set()
                    }
                    onToggleVariant={(variantId) =>
                      handleToggleVariant(group.produto_base, variantId)
                    }
                    onClear={() => handleClearGroup(group.produto_base)}
                    quantidades={composicao}
                    onQuantidadeChange={handleQuantidadeChange}
                  />
                ))}
              </div>
            )}

            {/* Botões de Ação */}
            <div className="flex justify-between gap-4 mt-6">
              <Button
                variant="outline"
                onClick={() => navigate("/adminmercado/ciclo-index")}
                className="border-primary text-primary hover:bg-primary/10"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <Button
                onClick={handlePublicarClick}
                disabled={!podePublicar || isLoading}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isLoading ? "Salvando..." : "Salvar Composição"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ResponsiveLayout>
  );
}
