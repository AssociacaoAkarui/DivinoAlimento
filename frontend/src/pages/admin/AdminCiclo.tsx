import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import { UserMenuLarge } from "@/components/layout/UserMenuLarge";
import { RoleTitle } from "@/components/layout/RoleTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  useBuscarCiclo,
  useCriarCiclo,
  useAtualizarCiclo,
  CriarCicloInput,
  AtualizarCicloInput,
} from "@/hooks/graphql";
import {
  formatStatus,
  getStatusColor,
  toDateTimeInputValue,
  getCicloStatusOptions,
} from "@/lib/ciclo-helpers";

const AdminCiclo = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [nome, setNome] = useState("");
  const [ofertaInicio, setOfertaInicio] = useState("");
  const [ofertaFim, setOfertaFim] = useState("");
  const [itensAdicionaisInicio, setItensAdicionaisInicio] = useState("");
  const [itensAdicionaisFim, setItensAdicionaisFim] = useState("");
  const [retiradaConsumidorInicio, setRetiradaConsumidorInicio] = useState("");
  const [retiradaConsumidorFim, setRetiradaConsumidorFim] = useState("");
  const [observacao, setObservacao] = useState("");
  const [status, setStatus] = useState("oferta");
  const [pontoEntregaId, setPontoEntregaId] = useState("");

  // GraphQL hooks
  const { data: cicloData, isLoading: isLoadingCiclo } = useBuscarCiclo(
    id || "",
  );
  const criarCicloMutation = useCriarCiclo();
  const atualizarCicloMutation = useAtualizarCiclo();

  const pontosEntrega = cicloData?.buscarCiclo?.pontosEntrega || [];

  // Load ciclo data when editing
  useEffect(() => {
    if (isEdit && cicloData?.buscarCiclo) {
      const ciclo = cicloData.buscarCiclo;
      setNome(ciclo.nome);
      setOfertaInicio(toDateTimeInputValue(ciclo.ofertaInicio));
      setOfertaFim(toDateTimeInputValue(ciclo.ofertaFim));
      setItensAdicionaisInicio(
        toDateTimeInputValue(ciclo.itensAdicionaisInicio),
      );
      setItensAdicionaisFim(toDateTimeInputValue(ciclo.itensAdicionaisFim));
      setRetiradaConsumidorInicio(
        toDateTimeInputValue(ciclo.retiradaConsumidorInicio),
      );
      setRetiradaConsumidorFim(
        toDateTimeInputValue(ciclo.retiradaConsumidorFim),
      );
      setObservacao(ciclo.observacao || "");
      setStatus(ciclo.status);
      setPontoEntregaId(ciclo.pontoEntregaId);
    }
  }, [isEdit, cicloData]);

  const handleSubmit = async () => {
    // Validations
    if (!nome || nome.length < 3) {
      toast({
        title: "Erro de validacao",
        description: "Nome do ciclo e obrigatorio (min. 3 caracteres).",
        variant: "destructive",
      });
      return;
    }

    if (!pontoEntregaId) {
      toast({
        title: "Erro de validacao",
        description: "Selecione o ponto de entrega.",
        variant: "destructive",
      });
      return;
    }

    if (!ofertaInicio || !ofertaFim) {
      toast({
        title: "Erro de validacao",
        description: "Defina o periodo de ofertas.",
        variant: "destructive",
      });
      return;
    }

    if (new Date(ofertaInicio) >= new Date(ofertaFim)) {
      toast({
        title: "Erro de validacao",
        description: "A data de inicio deve ser anterior a data de fim.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isEdit) {
        const input: AtualizarCicloInput = {
          nome,
          ofertaInicio: new Date(ofertaInicio).toISOString(),
          ofertaFim: new Date(ofertaFim).toISOString(),
          pontoEntregaId: parseInt(pontoEntregaId),
          observacao: observacao || undefined,
          status,
        };

        if (itensAdicionaisInicio) {
          input.itensAdicionaisInicio = new Date(
            itensAdicionaisInicio,
          ).toISOString();
        }
        if (itensAdicionaisFim) {
          input.itensAdicionaisFim = new Date(itensAdicionaisFim).toISOString();
        }
        if (retiradaConsumidorInicio) {
          input.retiradaConsumidorInicio = new Date(
            retiradaConsumidorInicio,
          ).toISOString();
        }
        if (retiradaConsumidorFim) {
          input.retiradaConsumidorFim = new Date(
            retiradaConsumidorFim,
          ).toISOString();
        }

        await atualizarCicloMutation.mutateAsync({ id: id!, input });
        toast({
          title: "Sucesso",
          description: "Ciclo atualizado com sucesso!",
        });
      } else {
        const input: CriarCicloInput = {
          nome,
          ofertaInicio: new Date(ofertaInicio).toISOString(),
          ofertaFim: new Date(ofertaFim).toISOString(),
          pontoEntregaId: parseInt(pontoEntregaId),
          observacao: observacao || undefined,
        };

        if (itensAdicionaisInicio) {
          input.itensAdicionaisInicio = new Date(
            itensAdicionaisInicio,
          ).toISOString();
        }
        if (itensAdicionaisFim) {
          input.itensAdicionaisFim = new Date(itensAdicionaisFim).toISOString();
        }
        if (retiradaConsumidorInicio) {
          input.retiradaConsumidorInicio = new Date(
            retiradaConsumidorInicio,
          ).toISOString();
        }
        if (retiradaConsumidorFim) {
          input.retiradaConsumidorFim = new Date(
            retiradaConsumidorFim,
          ).toISOString();
        }

        await criarCicloMutation.mutateAsync({ input });
        toast({
          title: "Sucesso",
          description: "Ciclo criado com sucesso!",
        });
      }
      navigate("/admin/ciclo-index");
    } catch (error) {
      toast({
        title: "Erro",
        description: `Nao foi possivel ${isEdit ? "atualizar" : "criar"} o ciclo.`,
        variant: "destructive",
      });
    }
  };

  if (isEdit && isLoadingCiclo) {
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
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </ResponsiveLayout>
    );
  }

  const isPending =
    criarCicloMutation.isPending || atualizarCicloMutation.isPending;

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
      <div className="space-y-6 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <RoleTitle
              page={isEdit ? "Editar Ciclo" : "Novo Ciclo"}
              className="text-2xl md:text-3xl"
            />
          </div>
          {isEdit && (
            <Badge className={getStatusColor(status)}>
              {formatStatus(status)}
            </Badge>
          )}
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section 1: Ciclo Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Informacoes do Ciclo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="nome">Nome do Ciclo *</Label>
                  <Input
                    id="nome"
                    placeholder="Ex: 1o Ciclo de Outubro 2025"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="pontoEntrega">Ponto de Entrega *</Label>
                  <Select
                    value={pontoEntregaId}
                    onValueChange={setPontoEntregaId}
                  >
                    <SelectTrigger id="pontoEntrega">
                      <SelectValue placeholder="Selecione o ponto de entrega" />
                    </SelectTrigger>
                    <SelectContent>
                      {pontosEntrega.map((ponto) => (
                        <SelectItem key={ponto.id} value={ponto.id}>
                          {ponto.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {isEdit && (
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger id="status">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getCicloStatusOptions().map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Section 2: Period */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Periodo de Ofertas *
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ofertaInicio">Inicio das ofertas *</Label>
                    <Input
                      id="ofertaInicio"
                      type="datetime-local"
                      value={ofertaInicio}
                      onChange={(e) => setOfertaInicio(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="ofertaFim">Fim das ofertas *</Label>
                    <Input
                      id="ofertaFim"
                      type="datetime-local"
                      value={ofertaFim}
                      onChange={(e) => setOfertaFim(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 3: Additional Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Itens Adicionais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="itensAdicionaisInicio">Inicio</Label>
                    <Input
                      id="itensAdicionaisInicio"
                      type="datetime-local"
                      value={itensAdicionaisInicio}
                      onChange={(e) => setItensAdicionaisInicio(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="itensAdicionaisFim">Fim</Label>
                    <Input
                      id="itensAdicionaisFim"
                      type="datetime-local"
                      value={itensAdicionaisFim}
                      onChange={(e) => setItensAdicionaisFim(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 4: Consumer Pickup */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Retirada dos Consumidores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="retiradaConsumidorInicio">Inicio</Label>
                    <Input
                      id="retiradaConsumidorInicio"
                      type="datetime-local"
                      value={retiradaConsumidorInicio}
                      onChange={(e) =>
                        setRetiradaConsumidorInicio(e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="retiradaConsumidorFim">Fim</Label>
                    <Input
                      id="retiradaConsumidorFim"
                      type="datetime-local"
                      value={retiradaConsumidorFim}
                      onChange={(e) => setRetiradaConsumidorFim(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Section 5: Observations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Observacoes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Textarea
                    id="observacao"
                    placeholder="Informacoes adicionais sobre o ciclo..."
                    value={observacao}
                    onChange={(e) => setObservacao(e.target.value)}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-4 h-fit">
            <Card className="bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Calendar className="h-12 w-12 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Gestao de Ciclos</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure periodos de oferta e entrega para organizar as
                    vendas
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Fixed Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg p-4 z-10">
          <div className="max-w-7xl mx-auto flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/admin/ciclo-index")}
              className="border-primary text-primary"
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-primary hover:bg-primary/90"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEdit ? "Salvando..." : "Criando..."}
                </>
              ) : isEdit ? (
                "Salvar Alteracoes"
              ) : (
                "Salvar Ciclo"
              )}
            </Button>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminCiclo;
