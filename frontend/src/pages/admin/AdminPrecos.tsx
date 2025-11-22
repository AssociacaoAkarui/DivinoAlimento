import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { ResponsiveLayout } from "@/components/layout/ResponsiveLayout";
import { UserMenuLarge } from "@/components/layout/UserMenuLarge";
import { toast } from "@/hooks/use-toast";
import { formatBRL, formatBRLInput, parseBRLToNumber } from "@/utils/currency";
import { RoleTitle } from "@/components/layout/RoleTitle";
import {
  useBuscarMercado,
  useListarProdutos,
  useListarPrecosMercado,
  useCriarPrecoMercado,
  useAtualizarPrecoMercado,
} from "@/hooks/graphql";
import {
  formatPreco,
  formatPrecoSimple,
  parsePrecoFromBRL,
  formatCreateSuccessMessage,
  formatUpdateSuccessMessage,
  formatCreateError,
  formatUpdateError,
} from "@/lib/precomercado-formatters";
import {
  preparePrecoMercadoForBackend,
  filterPrecosBySearch,
  validatePreco,
} from "@/lib/precomercado-helpers";

interface ProdutoPreco {
  id: string;
  produtoId: number;
  nome: string;
  medida: string;
  valorReferencia: number;
  precoMercado: string;
  precoId?: string;
  modified: boolean;
}

export default function AdminPrecos() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const mercadoId = id ? parseInt(id) : 0;

  const { data: mercadoData, isLoading: mercadoLoading } = useBuscarMercado(
    String(mercadoId),
  );
  const mercado = mercadoData?.buscarMercado;
  const { data: produtosData, isLoading: produtosLoading } =
    useListarProdutos();
  const {
    data: precosData,
    isLoading: precosLoading,
    refetch: refetchPrecos,
  } = useListarPrecosMercado(mercadoId);

  const criarPrecoMutation = useCriarPrecoMercado();
  const atualizarPrecoMutation = useAtualizarPrecoMercado();

  const [searchTerm, setSearchTerm] = useState("");
  const [produtos, setProdutos] = useState<ProdutoPreco[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Initialize produtos when data is loaded
  useEffect(() => {
    if (produtosData && !produtosLoading) {
      const precosMap = new Map(
        (precosData || []).map((preco: any) => [preco.produtoId, preco]),
      );

      const produtosComPreco = produtosData.map((p: any) => {
        const precoExistente = precosMap.get(parseInt(p.id));
        return {
          id: p.id,
          produtoId: parseInt(p.id),
          nome: p.nome,
          medida: p.medida || "unidade",
          valorReferencia: parseFloat(p.valorReferencia) || 0,
          precoMercado: precoExistente
            ? formatPrecoSimple(parseFloat(precoExistente.preco))
            : formatPrecoSimple(parseFloat(p.valorReferencia) || 0),
          precoId: precoExistente?.id,
          modified: false,
        };
      });

      setProdutos(produtosComPreco);
    }
  }, [produtosData, precosData, produtosLoading, precosLoading]);

  const filteredProdutos = useMemo(() => {
    return produtos.filter((p) =>
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [produtos, searchTerm]);

  const hasModifications = produtos.some((p) => p.modified);

  const handlePriceChange = (id: string, value: string) => {
    const formatted = formatBRLInput(value);
    setProdutos((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, precoMercado: formatted, modified: true } : p,
      ),
    );
  };

  const handleSaveSingle = async (id: string) => {
    const produto = produtos.find((p) => p.id === id);
    if (!produto) return;

    const precoNumerico = parseBRLToNumber(produto.precoMercado);

    if (!validatePreco(precoNumerico)) {
      toast({
        title: "Erro",
        description: "Insira um valor válido para atualizar o preço",
        variant: "destructive",
      });
      return;
    }

    try {
      if (produto.precoId) {
        // Update existing price
        await atualizarPrecoMutation.mutateAsync({
          id: produto.precoId,
          input: {
            preco: precoNumerico,
            status: "ativo",
          },
        });

        toast({
          title: "Sucesso",
          description: formatUpdateSuccessMessage(produto.nome),
        });
      } else {
        // Create new price
        const input = preparePrecoMercadoForBackend({
          produtoId: produto.produtoId,
          mercadoId: mercadoId,
          preco: precoNumerico,
          status: "ativo",
        });

        const result = await criarPrecoMutation.mutateAsync({ input });

        // Update local state with the new precoId
        setProdutos((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, precoId: result.id, modified: false } : p,
          ),
        );

        toast({
          title: "Sucesso",
          description: formatCreateSuccessMessage(
            produto.nome,
            mercado?.nome || "",
          ),
        });

        // Refetch to get updated data
        await refetchPrecos();
        return;
      }

      setProdutos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, modified: false } : p)),
      );

      await refetchPrecos();
    } catch (error) {
      const errorMessage = produto.precoId
        ? formatUpdateError(error)
        : formatCreateError(error);

      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleSaveAll = () => {
    const invalidProducts = produtos.filter((p) => {
      const preco = parseBRLToNumber(p.precoMercado);
      return p.modified && !validatePreco(preco);
    });

    if (invalidProducts.length > 0) {
      toast({
        title: "Erro",
        description:
          "Alguns produtos possuem preços inválidos. Corrija antes de salvar.",
        variant: "destructive",
      });
      return;
    }

    setShowConfirmDialog(true);
  };

  const confirmSaveAll = async () => {
    const modifiedProducts = produtos.filter((p) => p.modified);

    try {
      for (const produto of modifiedProducts) {
        const precoNumerico = parseBRLToNumber(produto.precoMercado);

        if (produto.precoId) {
          await atualizarPrecoMutation.mutateAsync({
            id: produto.precoId,
            input: {
              preco: precoNumerico,
              status: "ativo",
            },
          });
        } else {
          const input = preparePrecoMercadoForBackend({
            produtoId: produto.produtoId,
            mercadoId: mercadoId,
            preco: precoNumerico,
            status: "ativo",
          });

          await criarPrecoMutation.mutateAsync({ input });
        }
      }

      setProdutos((prev) => prev.map((p) => ({ ...p, modified: false })));

      toast({
        title: "Sucesso",
        description: "Todos os preços foram atualizados com sucesso",
      });

      setShowConfirmDialog(false);
      await refetchPrecos();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar os preços. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    navigate("/admin/precos");
  };

  if (mercadoLoading || produtosLoading || precosLoading) {
    return (
      <ResponsiveLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Carregando...</p>
            </CardContent>
          </Card>
        </div>
      </ResponsiveLayout>
    );
  }

  if (!mercado) {
    return (
      <ResponsiveLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">Mercado não encontrado</p>
              <Button
                onClick={() => navigate("/admin/mercados")}
                className="mt-4"
              >
                Voltar para Mercados
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
          onClick={() => navigate("/admin/precos")}
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
              page={`Gestão de Preços – ${mercado.nome}`}
              className="text-2xl md:text-3xl"
            />
            <p className="text-muted-foreground">
              Defina preços específicos para este mercado com base nos produtos
              cadastrados
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar produto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Products Table - Desktop */}
        <Card className="hidden md:block">
          <CardHeader>
            <CardTitle>Produtos Cadastrados</CardTitle>
            <CardDescription>
              {filteredProdutos.length} produto(s) encontrado(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Alimento</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Preço Base</TableHead>
                  <TableHead>Preço do Mercado</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProdutos.map((produto) => (
                  <TableRow key={produto.id}>
                    <TableCell className="font-medium">
                      {produto.nome}
                    </TableCell>
                    <TableCell>{produto.medida}</TableCell>
                    <TableCell>{formatBRL(produto.valorReferencia)}</TableCell>
                    <TableCell>
                      <Input
                        type="text"
                        inputMode="decimal"
                        value={produto.precoMercado}
                        onChange={(e) =>
                          handlePriceChange(produto.id, e.target.value)
                        }
                        className="w-32"
                        placeholder="0,00"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        onClick={() => handleSaveSingle(produto.id)}
                        disabled={!produto.modified}
                      >
                        Salvar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Products Cards - Mobile */}
        <div className="md:hidden space-y-4">
          {filteredProdutos.map((produto) => (
            <Card key={produto.id}>
              <CardHeader>
                <CardTitle className="text-lg">{produto.nome}</CardTitle>
                <CardDescription>Unidade: {produto.medida}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Preço Base</p>
                    <p className="text-lg font-semibold">
                      {formatBRL(produto.valorReferencia)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Preço do Mercado
                    </p>
                    <Input
                      type="text"
                      inputMode="decimal"
                      value={produto.precoMercado}
                      onChange={(e) =>
                        handlePriceChange(produto.id, e.target.value)
                      }
                      placeholder="0,00"
                      className="mt-1"
                    />
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleSaveSingle(produto.id)}
                  disabled={!produto.modified}
                  className="w-full"
                >
                  Salvar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 flex gap-2 justify-end md:relative md:border-0 md:p-0">
          <Button variant="outline" onClick={handleCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button
            onClick={handleSaveAll}
            disabled={!hasModifications}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="mr-2 h-4 w-4" />
            Salvar todas alterações
          </Button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar atualização</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja confirmar atualização dos preços? Esta ação irá salvar
              todos os preços modificados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSaveAll}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ResponsiveLayout>
  );
}
