import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RoleTitle } from "@/components/layout/RoleTitle";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  useListarProdutos,
  useCriarProdutoComercializavel,
} from "@/hooks/graphql";
import {
  formatBRLInput,
  parseBRLToNumber,
  isFormValid,
} from "@/lib/produtocomercializavel-helpers";

const AdminProdutoComercializavelNovo = () => {
  const navigate = useNavigate();
  const { data: produtos = [], isLoading: loadingProdutos } =
    useListarProdutos();
  const { mutate: criarProdutoComercializavel, isPending } =
    useCriarProdutoComercializavel();

  const [formData, setFormData] = useState({
    produtoId: undefined as number | undefined,
    medida: "",
    pesoKg: "",
    precoBase: "",
    status: "ativo" as "ativo" | "inativo",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid(formData)) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const precoNumerico = parseBRLToNumber(formData.precoBase);
    const pesoNumerico = parseFloat(formData.pesoKg);

    criarProdutoComercializavel(
      {
        input: {
          produtoId: formData.produtoId!,
          medida: formData.medida.trim(),
          pesoKg: pesoNumerico,
          precoBase: precoNumerico,
          status: formData.status,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Sucesso",
            description: "Alimento comercializável criado com sucesso!",
          });
          navigate("/admin/produtos-comercializaveis");
        },
        onError: (error: Error) => {
          toast({
            title: "Erro ao criar",
            description: error.message,
            variant: "destructive",
          });
        },
      },
    );
  };

  const handleCancel = () => {
    navigate("/admin/produtos-comercializaveis");
  };

  return (
    <ResponsiveLayout
      leftHeaderContent={
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => navigate("/admin/produtos-comercializaveis")}
          className="text-primary-foreground hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <RoleTitle
            page="Adicionar Alimento Comercializável"
            className="text-2xl md:text-3xl mb-2"
          />
          <p className="text-muted-foreground">
            Cadastre uma nova variação comercial de alimento
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Alimento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="produto_base_select">
                  Alimento Base <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.produtoId?.toString() || ""}
                  onValueChange={(value) =>
                    setFormData({ ...formData, produtoId: parseInt(value) })
                  }
                  disabled={loadingProdutos}
                >
                  <SelectTrigger id="produto_base_select">
                    <SelectValue
                      placeholder={
                        loadingProdutos
                          ? "Carregando..."
                          : "Selecione o alimento base"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {produtos
                      .filter((p) => p.status === "ativo")
                      .map((produto) => (
                        <SelectItem key={produto.id} value={produto.id}>
                          {produto.nome}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="medida">
                  Unidade de Comercialização{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="medida"
                  type="text"
                  placeholder="Ex: Unidade, Dúzia, Litro, Kg"
                  value={formData.medida}
                  onChange={(e) =>
                    setFormData({ ...formData, medida: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="peso_kg">
                  Peso em Kg (para conversão){" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="peso_kg"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Ex: 0.15"
                  value={formData.pesoKg}
                  onChange={(e) =>
                    setFormData({ ...formData, pesoKg: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="preco_base">
                  Preço Base (R$) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="preco_base"
                  type="text"
                  inputMode="decimal"
                  placeholder="Ex: 4,50"
                  value={formData.precoBase}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      precoBase: formatBRLInput(e.target.value),
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "ativo" | "inativo") =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminProdutoComercializavelNovo;
