import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ResponsiveLayout from "@/components/layout/ResponsiveLayout";
import { ArrowLeft, Eye, Check, X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  useListarSubmissoesProdutos,
  useAprovarSubmissaoProduto,
  useReprovarSubmissaoProduto,
} from "@/hooks/graphql";
import {
  formatPreco,
  formatDate,
  getStatusVariant,
  getStatusText,
  getPendingCount,
} from "@/lib/submissaoproduto-helpers";

interface SubmissaoProduto {
  id: string;
  fornecedorId: number;
  fornecedor?: {
    id: string;
    nome: string;
  };
  nomeProduto: string;
  descricao?: string;
  imagemUrl?: string;
  precoUnidade: number;
  medida: string;
  status: string;
  motivoReprovacao?: string;
  createdAt?: string;
  updatedAt?: string;
}

const AdminProdutosSubmissoes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: submissoes, isLoading, error } = useListarSubmissoesProdutos();
  const aprovarMutation = useAprovarSubmissaoProduto();
  const reprovarMutation = useReprovarSubmissaoProduto();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSubmission, setCurrentSubmission] =
    useState<SubmissaoProduto | null>(null);
  const [editedDescription, setEditedDescription] = useState("");
  const [editedPrice, setEditedPrice] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const openAnalysisModal = (submission: SubmissaoProduto) => {
    setCurrentSubmission(submission);
    setEditedDescription(submission.descricao || "");
    setEditedPrice(submission.precoUnidade.toString());
    setRejectionReason("");
    setIsModalOpen(true);
  };

  const handleApprove = async () => {
    if (!currentSubmission) return;

    try {
      await aprovarMutation.mutateAsync({
        id: currentSubmission.id,
        input: {
          descricao: editedDescription,
          precoUnidade: parseFloat(editedPrice),
        },
      });

      toast({
        title: "Produto aprovado",
        description: "O produto foi aprovado com sucesso.",
      });
      setIsModalOpen(false);
    } catch (err) {
      toast({
        title: "Erro ao aprovar",
        description:
          err instanceof Error ? err.message : "Erro ao aprovar produto",
        variant: "destructive",
      });
    }
  };

  const handleReject = async () => {
    if (!currentSubmission) return;

    if (!rejectionReason.trim()) {
      toast({
        title: "Motivo obrigatório",
        description: "Por favor, informe o motivo da reprovação.",
        variant: "destructive",
      });
      return;
    }

    try {
      await reprovarMutation.mutateAsync({
        id: currentSubmission.id,
        motivoReprovacao: rejectionReason,
      });

      toast({
        title: "Produto reprovado",
        description: "O produto foi reprovado.",
      });
      setIsModalOpen(false);
    } catch (err) {
      toast({
        title: "Erro ao reprovar",
        description:
          err instanceof Error ? err.message : "Erro ao reprovar produto",
        variant: "destructive",
      });
    }
  };

  const pendingCount = submissoes ? getPendingCount(submissoes) : 0;

  if (isLoading) {
    return (
      <ResponsiveLayout
        leftHeaderContent={
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate("/admin/dashboard")}
            className="text-primary-foreground hover:bg-primary-hover"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        }
      >
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </ResponsiveLayout>
    );
  }

  if (error) {
    return (
      <ResponsiveLayout
        leftHeaderContent={
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate("/admin/dashboard")}
            className="text-primary-foreground hover:bg-primary-hover"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        }
      >
        <div className="text-center text-destructive">
          Erro ao carregar submissões: {error.message}
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
          onClick={() => navigate("/admin/dashboard")}
          className="text-primary-foreground hover:bg-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
      }
    >
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gradient-primary">
            Produtos (Submissões)
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Aprovar produtos enviados por fornecedores
          </p>
          {pendingCount > 0 && (
            <Badge variant="warning" className="mt-2">
              {pendingCount}{" "}
              {pendingCount === 1 ? "produto pendente" : "produtos pendentes"}
            </Badge>
          )}
        </div>

        {/* Submissions List */}
        <div className="space-y-4">
          {submissoes && submissoes.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                Nenhuma submissão de produto encontrada.
              </CardContent>
            </Card>
          ) : (
            submissoes?.map((submission) => (
              <Card key={submission.id}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <img
                          src={submission.imagemUrl || "/placeholder.svg"}
                          alt={submission.nomeProduto}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {submission.nomeProduto}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Fornecedor:{" "}
                            {submission.fornecedor?.nome || "Desconhecido"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Enviado em:{" "}
                            {submission.createdAt
                              ? formatDate(submission.createdAt)
                              : "-"}
                          </p>
                          <p className="text-sm font-medium">
                            {formatPreco(submission.precoUnidade)} /{" "}
                            {submission.medida}
                          </p>
                          <div className="mt-2">
                            <Badge
                              variant={getStatusVariant(submission.status)}
                            >
                              {getStatusText(submission.status)}
                            </Badge>
                          </div>
                          {submission.motivoReprovacao && (
                            <p className="text-sm text-destructive mt-1">
                              Motivo: {submission.motivoReprovacao}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    {submission.status.toLowerCase() === "pendente" && (
                      <Button
                        onClick={() => openAnalysisModal(submission)}
                        className="w-full md:w-auto"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Analisar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Analysis Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Analisar Produto</DialogTitle>
              <DialogDescription>
                Revise as informações e aprove ou reprove o produto
              </DialogDescription>
            </DialogHeader>

            {currentSubmission && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Imagem do Produto</Label>
                  <img
                    src={currentSubmission.imagemUrl || "/placeholder.svg"}
                    alt={currentSubmission.nomeProduto}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Nome do Produto</Label>
                  <Input value={currentSubmission.nomeProduto} disabled />
                </div>

                <div className="space-y-2">
                  <Label>Fornecedor</Label>
                  <Input
                    value={currentSubmission.fornecedor?.nome || "Desconhecido"}
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editedPrice">
                    Valor por {currentSubmission.medida}
                  </Label>
                  <Input
                    id="editedPrice"
                    type="number"
                    step="0.01"
                    value={editedPrice}
                    onChange={(e) => setEditedPrice(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="editedDescription">Descrição</Label>
                  <Textarea
                    id="editedDescription"
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rejectionReason">
                    Motivo da Reprovação (obrigatório para reprovar)
                  </Label>
                  <Textarea
                    id="rejectionReason"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Informe o motivo caso reprove o produto..."
                    rows={2}
                  />
                </div>
              </div>
            )}

            <DialogFooter className="flex-col gap-2 sm:flex-row">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button
                variant="outline"
                onClick={handleReject}
                disabled={reprovarMutation.isPending}
                className="w-full sm:w-auto text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                {reprovarMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <X className="w-4 h-4 mr-2" />
                )}
                Reprovar
              </Button>
              <Button
                onClick={handleApprove}
                disabled={aprovarMutation.isPending}
                className="w-full sm:w-auto"
              >
                {aprovarMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Check className="w-4 h-4 mr-2" />
                )}
                Aprovar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ResponsiveLayout>
  );
};

export default AdminProdutosSubmissoes;
