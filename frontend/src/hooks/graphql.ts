import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import {
  graphqlClient,
  graphqlClientSecure,
  getSessionToken,
} from "../lib/graphql-client";
import {
  LoginMutation,
  LoginMutationVariables,
  LoginDocument,
  SystemInformationQuery,
  SystemInformationDocument,
  ListarUsuariosQuery,
  ListarUsuariosDocument,
  BuscarUsuarioQuery,
  BuscarUsuarioQueryVariables,
  BuscarUsuarioDocument,
  CriarUsuarioMutation,
  CriarUsuarioMutationVariables,
  CriarUsuarioDocument,
  AtualizarUsuarioMutation,
  AtualizarUsuarioMutationVariables,
  AtualizarUsuarioDocument,
  Usuario,
  ActiveSession,
  ListarCategoriasQuery,
  BuscarCategoriaQuery,
  BuscarCategoriaQueryVariables,
  CriarCategoriaMutation,
  CriarCategoriaMutationVariables,
  AtualizarCategoriaMutation,
  AtualizarCategoriaMutationVariables,
  DeletarCategoriaMutation,
  DeletarCategoriaMutationVariables,
  CategoriaProdutos,
  ListarProdutosQuery,
  BuscarProdutoQuery,
  BuscarProdutoQueryVariables,
  CriarProdutoMutation,
  CriarProdutoMutationVariables,
  AtualizarProdutoMutation,
  AtualizarProdutoMutationVariables,
  DeletarProdutoMutation,
  DeletarProdutoMutationVariables,
  Produto,
} from "../types/graphql";

import {
  LISTAR_CATEGORIAS_QUERY,
  BUSCAR_CATEGORIA_QUERY,
  CRIAR_CATEGORIA_MUTATION,
  ATUALIZAR_CATEGORIA_MUTATION,
  DELETAR_CATEGORIA_MUTATION,
  LISTAR_PRODUTOS_QUERY,
  BUSCAR_PRODUTO_QUERY,
  CRIAR_PRODUTO_MUTATION,
  ATUALIZAR_PRODUTO_MUTATION,
  DELETAR_PRODUTO_MUTATION,
  LISTAR_PRODUTOS_COMERCIALIZAVEIS_QUERY,
  BUSCAR_PRODUTO_COMERCIALIZAVEL_QUERY,
  LISTAR_PRODUTOS_COMERCIALIZAVEIS_POR_PRODUTO_QUERY,
  CRIAR_PRODUTO_COMERCIALIZAVEL_MUTATION,
  ATUALIZAR_PRODUTO_COMERCIALIZAVEL_MUTATION,
  DELETAR_PRODUTO_COMERCIALIZAVEL_MUTATION,
  LISTAR_SUBMISSOES_PRODUTOS_QUERY,
  BUSCAR_SUBMISSAO_PRODUTO_QUERY,
  LISTAR_SUBMISSOES_POR_STATUS_QUERY,
  CRIAR_SUBMISSAO_PRODUTO_MUTATION,
  APROVAR_SUBMISSAO_PRODUTO_MUTATION,
  REPROVAR_SUBMISSAO_PRODUTO_MUTATION,
  DELETAR_SUBMISSAO_PRODUTO_MUTATION,
  LISTAR_CICLOS_QUERY,
  BUSCAR_CICLO_QUERY,
  CRIAR_CICLO_MUTATION,
  ATUALIZAR_CICLO_MUTATION,
  DELETAR_CICLO_MUTATION,
  LISTAR_MERCADOS_POR_CICLO_QUERY,
  BUSCAR_CICLO_MERCADO_QUERY,
  ADICIONAR_MERCADO_CICLO_MUTATION,
  ATUALIZAR_MERCADO_CICLO_MUTATION,
  REMOVER_MERCADO_CICLO_MUTATION,
  BUSCAR_OFERTA_QUERY,
  LISTAR_OFERTAS_POR_CICLO_QUERY,
  LISTAR_OFERTAS_POR_USUARIO_QUERY,
  CRIAR_OFERTA_MUTATION,
  ADICIONAR_PRODUTO_OFERTA_MUTATION,
  ATUALIZAR_QUANTIDADE_PRODUTO_OFERTA_MUTATION,
  REMOVER_PRODUTO_OFERTA_MUTATION,
  MIGRAR_OFERTAS_MUTATION,
  LISTAR_PONTOS_ENTREGA_QUERY,
  LISTAR_PONTOS_ENTREGA_ATIVOS_QUERY,
  BUSCAR_PONTO_ENTREGA_QUERY,
  CRIAR_PONTO_ENTREGA_MUTATION,
  ATUALIZAR_PONTO_ENTREGA_MUTATION,
  DELETAR_PONTO_ENTREGA_MUTATION,
  LISTAR_MERCADOS_QUERY,
  BUSCAR_MERCADO_QUERY,
  LISTAR_MERCADOS_ATIVOS_QUERY,
  LISTAR_MERCADOS_POR_RESPONSAVEL_QUERY,
  CRIAR_MERCADO_MUTATION,
  ATUALIZAR_MERCADO_MUTATION,
  DELETAR_MERCADO_MUTATION,
  LISTAR_PRECOS_MERCADO_QUERY,
  LISTAR_PRECOS_PRODUTO_QUERY,
  BUSCAR_PRECO_MERCADO_QUERY,
  BUSCAR_PRECO_PRODUTO_MERCADO_QUERY,
  CRIAR_PRECO_MERCADO_MUTATION,
  ATUALIZAR_PRECO_MERCADO_MUTATION,
  DELETAR_PRECO_MERCADO_MUTATION,
  LISTAR_COMPOSICOES_POR_CICLO_QUERY,
  BUSCAR_COMPOSICAO_QUERY,
  LISTAR_CESTAS_QUERY,
  CRIAR_COMPOSICAO_MUTATION,
  SINCRONIZAR_PRODUTOS_COMPOSICAO_MUTATION,
  BUSCAR_PEDIDO_CONSUMIDORES_QUERY,
  LISTAR_PEDIDOS_POR_CICLO_QUERY,
  LISTAR_PEDIDOS_POR_USUARIO_QUERY,
  CRIAR_PEDIDO_CONSUMIDORES_MUTATION,
  ADICIONAR_PRODUTO_PEDIDO_MUTATION,
  ATUALIZAR_QUANTIDADE_PRODUTO_PEDIDO_MUTATION,
  REMOVER_PRODUTO_PEDIDO_MUTATION,
  ATUALIZAR_STATUS_PEDIDO_MUTATION,
  LISTAR_ENTREGAS_FORNECEDORES_POR_CICLO_QUERY,
  LISTAR_PAGAMENTOS_QUERY,
  BUSCAR_PAGAMENTO_QUERY,
  CRIAR_PAGAMENTO_MUTATION,
  ATUALIZAR_PAGAMENTO_MUTATION,
  MARCAR_PAGAMENTO_COMO_PAGO_MUTATION,
  CANCELAR_PAGAMENTO_MUTATION,
  DELETAR_PAGAMENTO_MUTATION,
  GERAR_PAGAMENTOS_POR_CICLO_MUTATION,
  CALCULAR_TOTAL_POR_CICLO_QUERY,
} from "../graphql/operations";

// Ciclo interfaces
export interface PontoEntrega {
  id: string;
  nome: string;
}

export interface TipoCesta {
  id: string;
  nome: string;
}

export interface CicloEntrega {
  id: string;
  diaSemana: number;
  horaInicio: string;
  horaFim: string;
}

export interface CicloCesta {
  id: string;
  cestaId: string;
  cesta?: {
    id: string;
    nome: string;
  };
}

export interface CicloProduto {
  id: string;
  produtoId: string;
}

export interface Ciclo {
  id: string;
  nome: string;
  ofertaInicio: string;
  ofertaFim: string;
  itensAdicionaisInicio?: string;
  itensAdicionaisFim?: string;
  retiradaConsumidorInicio?: string;
  retiradaConsumidorFim?: string;
  observacao?: string;
  status: string;
  pontoEntregaId: string;
  pontoEntrega?: PontoEntrega;
  pontosEntrega?: PontoEntrega[];
  tiposCesta?: TipoCesta[];
  cicloEntregas?: CicloEntrega[];
  CicloCestas?: CicloCesta[];
  cicloProdutos?: CicloProduto[];
  createdAt: string;
  updatedAt: string;
}

export interface ListarCiclosQuery {
  listarCiclos: {
    total: number;
    ciclos: Ciclo[];
    limite: number;
    nextCursor?: string;
  };
}

export interface BuscarCicloQuery {
  buscarCiclo: Ciclo;
}

export interface CriarCicloMutation {
  criarCiclo: {
    id: string;
    nome: string;
    status: string;
  };
}

export interface AtualizarCicloMutation {
  atualizarCiclo: {
    id: string;
    nome: string;
    status: string;
  };
}

export interface DeletarCicloMutation {
  deletarCiclo: boolean;
}

export interface CriarCicloInput {
  nome: string;
  ofertaInicio: string;
  ofertaFim: string;
  pontoEntregaId: number;
  itensAdicionaisInicio?: string;
  itensAdicionaisFim?: string;
  retiradaConsumidorInicio?: string;
  retiradaConsumidorFim?: string;
  observacao?: string;
  entregas?: {
    diaSemana: number;
    horaInicio: string;
    horaFim: string;
  }[];
  cestas?: {
    cestaId: number;
  }[];
  produtos?: {
    produtoId: number;
  }[];
}

export interface AtualizarCicloInput {
  nome?: string;
  ofertaInicio?: string;
  ofertaFim?: string;
  pontoEntregaId?: number;
  itensAdicionaisInicio?: string;
  itensAdicionaisFim?: string;
  retiradaConsumidorInicio?: string;
  retiradaConsumidorFim?: string;
  observacao?: string;
  status?: string;
  entregas?: {
    diaSemana: number;
    horaInicio: string;
    horaFim: string;
  }[];
  cestas?: {
    cestaId: number;
  }[];
  produtos?: {
    produtoId: number;
  }[];
}

export function useLoginUsuario(
  options?: UseMutationOptions<LoginMutation, Error, LoginMutationVariables>,
) {
  const queryClient = useQueryClient();

  return useMutation<LoginMutation, Error, LoginMutationVariables>({
    mutationFn: (variables: LoginMutationVariables) =>
      graphqlClient.request<LoginMutation>(LoginDocument, variables),
    onSuccess: (data) => {
      const sessionLogin = data.sessionLogin;
      queryClient.setQueryData<ActiveSession>(["usuario"], sessionLogin);
    },
    ...options,
  });
}

export function useSystemInformation() {
  return useQuery<SystemInformationQuery, Error>({
    queryKey: ["system_information"],
    queryFn: () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return graphqlClientSecure(token).request<SystemInformationQuery>(
        SystemInformationDocument,
      );
    },
  });
}

export function useListarPagamentos(filters?: {
  tipo?: string;
  status?: string;
  cicloId?: number;
}) {
  return useQuery({
    queryKey: ["listar_pagamentos", filters],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await graphqlClientSecure(token).request(
        LISTAR_PAGAMENTOS_QUERY,
        filters,
      );
      return response.listarPagamentos;
    },
  });
}

export function useBuscarPagamento(id: string) {
  return useQuery({
    queryKey: ["buscar_pagamento", id],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await graphqlClientSecure(token).request(
        BUSCAR_PAGAMENTO_QUERY,
        { id },
      );
      return response.buscarPagamento;
    },
    enabled: !!id,
  });
}

export function useCriarPagamento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: any) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request(
        CRIAR_PAGAMENTO_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listar_pagamentos"] });
    },
  });
}

export function useAtualizarPagamento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: any) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request(
        ATUALIZAR_PAGAMENTO_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listar_pagamentos"] });
    },
  });
}

export function useMarcarPagamentoPago() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: any) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request(
        MARCAR_PAGAMENTO_COMO_PAGO_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listar_pagamentos"] });
    },
  });
}

export function useCancelarPagamento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: any) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request(
        CANCELAR_PAGAMENTO_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listar_pagamentos"] });
    },
  });
}

export function useDeletarPagamento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: any) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request(
        DELETAR_PAGAMENTO_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listar_pagamentos"] });
    },
  });
}

export function useGerarPagamentosPorCiclo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: any) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request(
        GERAR_PAGAMENTOS_POR_CICLO_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listar_pagamentos"] });
    },
  });
}

export function useCalcularTotalPorCiclo(cicloId: number) {
  return useQuery({
    queryKey: ["calcular_total_ciclo", cicloId],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await graphqlClientSecure(token).request(
        CALCULAR_TOTAL_POR_CICLO_QUERY,
        { cicloId },
      );
      return response.calcularTotalPorCiclo;
    },
    enabled: !!cicloId,
  });
}

export function useListarMercados() {
  return useQuery({
    queryKey: ["listar_mercados"],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request(LISTAR_MERCADOS_QUERY);
    },
  });
}

export function useBuscarMercado(id: string) {
  return useQuery({
    queryKey: ["buscar_mercado", id],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request(BUSCAR_MERCADO_QUERY, {
        id,
      });
    },
    enabled: !!id,
  });
}

export function useListarMercadosAtivos() {
  return useQuery({
    queryKey: ["listar_mercados_ativos"],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request(
        LISTAR_MERCADOS_ATIVOS_QUERY,
      );
    },
  });
}

export function useListarMercadosPorResponsavel(responsavelId: number) {
  return useQuery({
    queryKey: ["listar_mercados_por_responsavel", responsavelId],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request(
        LISTAR_MERCADOS_POR_RESPONSAVEL_QUERY,
        { responsavelId },
      );
    },
    enabled: !!responsavelId,
  });
}

export function useCriarMercado() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: any) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request(
        CRIAR_MERCADO_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listar_mercados"] });
      queryClient.invalidateQueries({ queryKey: ["listar_mercados_ativos"] });
      queryClient.invalidateQueries({
        queryKey: ["listar_mercados_por_responsavel"],
      });
    },
  });
}

export function useAtualizarMercado() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: any) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request(
        ATUALIZAR_MERCADO_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listar_mercados"] });
      queryClient.invalidateQueries({ queryKey: ["buscar_mercado"] });
      queryClient.invalidateQueries({ queryKey: ["listar_mercados_ativos"] });
      queryClient.invalidateQueries({
        queryKey: ["listar_mercados_por_responsavel"],
      });
    },
  });
}

export function useDeletarMercado() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: any) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request(
        DELETAR_MERCADO_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listar_mercados"] });
      queryClient.invalidateQueries({ queryKey: ["listar_mercados_ativos"] });
      queryClient.invalidateQueries({
        queryKey: ["listar_mercados_por_responsavel"],
      });
    },
  });
}

export function useListarPrecosMercado(mercadoId: number) {
  return useQuery({
    queryKey: ["listar_precos_mercado", mercadoId],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await graphqlClientSecure(token).request(
        LISTAR_PRECOS_MERCADO_QUERY,
        { mercadoId },
      );
      return response.listarPrecosMercado;
    },
    enabled: !!mercadoId,
  });
}

export function useListarPrecosProduto(produtoId: number) {
  return useQuery({
    queryKey: ["listar_precos_produto", produtoId],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await graphqlClientSecure(token).request(
        LISTAR_PRECOS_PRODUTO_QUERY,
        { produtoId },
      );
      return response.listarPrecosProduto;
    },
    enabled: !!produtoId,
  });
}

export function useBuscarPrecoMercado(id: string) {
  return useQuery({
    queryKey: ["buscar_preco_mercado", id],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await graphqlClientSecure(token).request(
        BUSCAR_PRECO_MERCADO_QUERY,
        { id },
      );
      return response.buscarPrecoMercado;
    },
    enabled: !!id,
  });
}

export function useBuscarPrecoProdutoMercado(
  produtoId: number,
  mercadoId: number,
) {
  return useQuery({
    queryKey: ["buscar_preco_produto_mercado", produtoId, mercadoId],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await graphqlClientSecure(token).request(
        BUSCAR_PRECO_PRODUTO_MERCADO_QUERY,
        { produtoId, mercadoId },
      );
      return response.buscarPrecoProdutoMercado;
    },
    enabled: !!produtoId && !!mercadoId,
  });
}

export function useCriarPrecoMercado() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: any) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request(
        CRIAR_PRECO_MERCADO_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listar_precos_mercado"] });
      queryClient.invalidateQueries({ queryKey: ["listar_precos_produto"] });
    },
  });
}

export function useAtualizarPrecoMercado() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: any) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request(
        ATUALIZAR_PRECO_MERCADO_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listar_precos_mercado"] });
      queryClient.invalidateQueries({ queryKey: ["listar_precos_produto"] });
      queryClient.invalidateQueries({ queryKey: ["buscar_preco_mercado"] });
      queryClient.invalidateQueries({
        queryKey: ["buscar_preco_produto_mercado"],
      });
    },
  });
}

export function useDeletarPrecoMercado() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: any) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request(
        DELETAR_PRECO_MERCADO_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listar_precos_mercado"] });
      queryClient.invalidateQueries({ queryKey: ["listar_precos_produto"] });
    },
  });
}

export function useListarComposicoesPorCiclo(cicloId: string) {
  return useQuery({
    queryKey: ["listar_composicoes_por_ciclo", cicloId],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await graphqlClientSecure(token).request(
        LISTAR_COMPOSICOES_POR_CICLO_QUERY,
        { cicloId: parseInt(cicloId) },
      );
      return response.listarComposicoesPorCiclo;
    },
    enabled: !!cicloId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useBuscarComposicao(id: string) {
  return useQuery({
    queryKey: ["buscar_composicao", id],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await graphqlClientSecure(token).request(
        BUSCAR_COMPOSICAO_QUERY,
        { id },
      );
      return response.buscarComposicao;
    },
    enabled: !!id,
  });
}

export function useListarCestas() {
  return useQuery({
    queryKey: ["listar_cestas"],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response =
        await graphqlClientSecure(token).request(LISTAR_CESTAS_QUERY);
      return response.listarCestas;
    },
  });
}

export function useCriarComposicao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: any) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request(
        CRIAR_COMPOSICAO_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["listar_composicoes_por_ciclo"],
      });
    },
  });
}

export function useSincronizarProdutosComposicao() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: any) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request(
        SINCRONIZAR_PRODUTOS_COMPOSICAO_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["listar_composicoes_por_ciclo"],
      });
      queryClient.invalidateQueries({ queryKey: ["buscar_composicao"] });
    },
  });
}

export function useListarUsuarios() {
  return useQuery<Usuario[], Error>({
    queryKey: ["listar_usuarios"],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await graphqlClientSecure(
        token,
      ).request<ListarUsuariosQuery>(ListarUsuariosDocument);
      return response.listarUsuarios;
    },
  });
}

export function useBuscarUsuario(id: string) {
  return useQuery<Usuario, Error>({
    queryKey: ["buscar_usuario", id],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await graphqlClientSecure(token).request<
        BuscarUsuarioQuery,
        BuscarUsuarioQueryVariables
      >(BuscarUsuarioDocument, { id });
      return response.buscarUsuario;
    },
    enabled: !!id,
  });
}

export function useCriarUsuario() {
  return useMutation<
    CriarUsuarioMutation,
    Error,
    CriarUsuarioMutationVariables
  >({
    mutationFn: async (variables: CriarUsuarioMutationVariables) => {
      return await graphqlClient.request<CriarUsuarioMutation>(
        CriarUsuarioDocument,
        variables,
      );
    },
  });
}

export function useAtualizarUsuario() {
  const queryClient = useQueryClient();

  return useMutation<
    AtualizarUsuarioMutation,
    Error,
    AtualizarUsuarioMutationVariables
  >({
    mutationFn: async (variables: AtualizarUsuarioMutationVariables) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request<AtualizarUsuarioMutation>(
        AtualizarUsuarioDocument,
        variables,
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["listar_usuarios"] });
      queryClient.invalidateQueries({
        queryKey: ["buscar_usuario", variables.id],
      });
    },
  });
}

export function useDeletarUsuario() {
  const queryClient = useQueryClient();

  return useMutation<
    { deletarUsuario: { success: boolean; message: string } },
    Error,
    { id: string }
  >({
    mutationFn: async (variables: { id: string }) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const { DELETAR_USUARIO_MUTATION } = await import(
        "../graphql/operations"
      );
      return await graphqlClientSecure(token).request(
        DELETAR_USUARIO_MUTATION,
        variables,
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["listar_usuarios"] });
      queryClient.invalidateQueries({
        queryKey: ["buscar_usuario", variables.id],
      });
    },
  });
}

export function useListarCategorias() {
  return useQuery<CategoriaProdutos[], Error>({
    queryKey: ["listar_categorias"],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await graphqlClientSecure(
        token,
      ).request<ListarCategoriasQuery>(LISTAR_CATEGORIAS_QUERY);
      return response.listarCategorias;
    },
  });
}

export function useBuscarCategoria(id: string) {
  return useQuery<CategoriaProdutos, Error>({
    queryKey: ["buscar_categoria", id],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await graphqlClientSecure(token).request<
        BuscarCategoriaQuery,
        BuscarCategoriaQueryVariables
      >(BUSCAR_CATEGORIA_QUERY, { id });
      return response.buscarCategoria;
    },
    enabled: !!id,
  });
}

export function useCriarCategoria() {
  const queryClient = useQueryClient();
  return useMutation<
    CriarCategoriaMutation,
    Error,
    CriarCategoriaMutationVariables
  >({
    mutationFn: async (variables: CriarCategoriaMutationVariables) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request<CriarCategoriaMutation>(
        CRIAR_CATEGORIA_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listar_categorias"] });
    },
  });
}

export function useAtualizarCategoria() {
  const queryClient = useQueryClient();
  return useMutation<
    AtualizarCategoriaMutation,
    Error,
    AtualizarCategoriaMutationVariables
  >({
    mutationFn: async (variables: AtualizarCategoriaMutationVariables) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(
        token,
      ).request<AtualizarCategoriaMutation>(
        ATUALIZAR_CATEGORIA_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listar_categorias"] });
    },
  });
}

export function useDeletarCategoria() {
  const queryClient = useQueryClient();
  return useMutation<
    DeletarCategoriaMutation,
    Error,
    DeletarCategoriaMutationVariables
  >({
    mutationFn: async (variables: DeletarCategoriaMutationVariables) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request<DeletarCategoriaMutation>(
        DELETAR_CATEGORIA_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listar_categorias"] });
    },
  });
}

export function useListarProdutos() {
  return useQuery<Produto[], Error>({
    queryKey: ["listar_produtos"],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await graphqlClientSecure(
        token,
      ).request<ListarProdutosQuery>(LISTAR_PRODUTOS_QUERY);
      return response.listarProdutos;
    },
  });
}

export function useBuscarProduto(id: string) {
  return useQuery<Produto, Error>({
    queryKey: ["buscar_produto", id],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await graphqlClientSecure(token).request<
        BuscarProdutoQuery,
        BuscarProdutoQueryVariables
      >(BUSCAR_PRODUTO_QUERY, { id });
      return response.buscarProduto;
    },
    enabled: !!id,
  });
}

export function useCriarProduto() {
  const queryClient = useQueryClient();
  return useMutation<
    CriarProdutoMutation,
    Error,
    CriarProdutoMutationVariables
  >({
    mutationFn: async (variables: CriarProdutoMutationVariables) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request<CriarProdutoMutation>(
        CRIAR_PRODUTO_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listar_produtos"] });
    },
  });
}

export function useAtualizarProduto() {
  const queryClient = useQueryClient();
  return useMutation<
    AtualizarProdutoMutation,
    Error,
    AtualizarProdutoMutationVariables
  >({
    mutationFn: async (variables: AtualizarProdutoMutationVariables) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request<AtualizarProdutoMutation>(
        ATUALIZAR_PRODUTO_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listar_produtos"] });
    },
  });
}

export function useDeletarProduto() {
  const queryClient = useQueryClient();
  return useMutation<
    DeletarProdutoMutation,
    Error,
    DeletarProdutoMutationVariables
  >({
    mutationFn: async (variables: DeletarProdutoMutationVariables) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request<DeletarProdutoMutation>(
        DELETAR_PRODUTO_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listar_produtos"] });
    },
  });
}

// ProdutoComercializavel types (temporary until codegen runs)
interface ProdutoComercializavel {
  id: string;
  produtoId: number;
  produto?: {
    id: string;
    nome: string;
  };
  medida: string;
  pesoKg: number;
  precoBase: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ListarProdutosComercializaveisQuery {
  listarProdutosComercializaveis: ProdutoComercializavel[];
}

interface BuscarProdutoComercializavelQuery {
  buscarProdutoComercializavel: ProdutoComercializavel;
}

interface ListarProdutosComercializaveisPorProdutoQuery {
  listarProdutosComercializaveisPorProduto: ProdutoComercializavel[];
}

interface CriarProdutoComercializavelInput {
  produtoId: number;
  medida: string;
  pesoKg: number;
  precoBase: number;
  status?: string;
}

interface AtualizarProdutoComercializavelInput {
  produtoId?: number;
  medida?: string;
  pesoKg?: number;
  precoBase?: number;
  status?: string;
}

interface CriarProdutoComercializavelMutation {
  criarProdutoComercializavel: ProdutoComercializavel;
}

interface AtualizarProdutoComercializavelMutation {
  atualizarProdutoComercializavel: ProdutoComercializavel;
}

interface DeletarProdutoComercializavelMutation {
  deletarProdutoComercializavel: boolean;
}

// ProdutoComercializavel hooks
export function useListarProdutosComercializaveis() {
  return useQuery<ProdutoComercializavel[], Error>({
    queryKey: ["listar_produtos_comercializaveis"],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await graphqlClientSecure(
        token,
      ).request<ListarProdutosComercializaveisQuery>(
        LISTAR_PRODUTOS_COMERCIALIZAVEIS_QUERY,
      );
      return response.listarProdutosComercializaveis;
    },
  });
}

export function useBuscarProdutoComercializavel(id: string) {
  return useQuery<ProdutoComercializavel, Error>({
    queryKey: ["buscar_produto_comercializavel", id],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await graphqlClientSecure(
        token,
      ).request<BuscarProdutoComercializavelQuery>(
        BUSCAR_PRODUTO_COMERCIALIZAVEL_QUERY,
        { id },
      );
      return response.buscarProdutoComercializavel;
    },
    enabled: !!id,
  });
}

export function useListarProdutosComercializaveisPorProduto(produtoId: number) {
  return useQuery<ProdutoComercializavel[], Error>({
    queryKey: ["listar_produtos_comercializaveis_por_produto", produtoId],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await graphqlClientSecure(
        token,
      ).request<ListarProdutosComercializaveisPorProdutoQuery>(
        LISTAR_PRODUTOS_COMERCIALIZAVEIS_POR_PRODUTO_QUERY,
        { produtoId },
      );
      return response.listarProdutosComercializaveisPorProduto;
    },
    enabled: !!produtoId,
  });
}

export function useCriarProdutoComercializavel() {
  const queryClient = useQueryClient();
  return useMutation<
    CriarProdutoComercializavelMutation,
    Error,
    { input: CriarProdutoComercializavelInput }
  >({
    mutationFn: async (variables) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(
        token,
      ).request<CriarProdutoComercializavelMutation>(
        CRIAR_PRODUTO_COMERCIALIZAVEL_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["listar_produtos_comercializaveis"],
      });
    },
  });
}

// SubmissaoProduto temporary interfaces
interface SubmissaoProdutoFornecedor {
  id: string;
  nome: string;
}

interface SubmissaoProduto {
  id: string;
  fornecedorId: number;
  fornecedor?: SubmissaoProdutoFornecedor;
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

interface ListarSubmissoesProdutosQuery {
  listarSubmissoesProdutos: SubmissaoProduto[];
}

interface BuscarSubmissaoProdutoQuery {
  buscarSubmissaoProduto: SubmissaoProduto;
}

interface ListarSubmissoesPorStatusQuery {
  listarSubmissoesPorStatus: SubmissaoProduto[];
}

interface CriarSubmissaoProdutoMutation {
  criarSubmissaoProduto: SubmissaoProduto;
}

interface AprovarSubmissaoProdutoMutation {
  aprovarSubmissaoProduto: SubmissaoProduto;
}

interface ReprovarSubmissaoProdutoMutation {
  reprovarSubmissaoProduto: SubmissaoProduto;
}

interface DeletarSubmissaoProdutoMutation {
  deletarSubmissaoProduto: boolean;
}

// SubmissaoProduto hooks
export function useListarSubmissoesProdutos() {
  return useQuery<SubmissaoProduto[], Error>({
    queryKey: ["listar_submissoes_produtos"],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await graphqlClientSecure(
        token,
      ).request<ListarSubmissoesProdutosQuery>(
        LISTAR_SUBMISSOES_PRODUTOS_QUERY,
      );
      return response.listarSubmissoesProdutos;
    },
  });
}

export function useBuscarSubmissaoProduto(id: string) {
  return useQuery<SubmissaoProduto, Error>({
    queryKey: ["buscar_submissao_produto", id],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await graphqlClientSecure(
        token,
      ).request<BuscarSubmissaoProdutoQuery>(BUSCAR_SUBMISSAO_PRODUTO_QUERY, {
        id,
      });
      return response.buscarSubmissaoProduto;
    },
    enabled: !!id,
  });
}

export function useListarSubmissoesPorStatus(status: string) {
  return useQuery<SubmissaoProduto[], Error>({
    queryKey: ["listar_submissoes_por_status", status],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await graphqlClientSecure(
        token,
      ).request<ListarSubmissoesPorStatusQuery>(
        LISTAR_SUBMISSOES_POR_STATUS_QUERY,
        { status },
      );
      return response.listarSubmissoesPorStatus;
    },
    enabled: !!status,
  });
}

export function useCriarSubmissaoProduto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: {
      input: {
        fornecedorId: number;
        nomeProduto: string;
        descricao?: string;
        imagemUrl?: string;
        precoUnidade: number;
        medida: string;
      };
    }) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(
        token,
      ).request<CriarSubmissaoProdutoMutation>(
        CRIAR_SUBMISSAO_PRODUTO_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["listar_submissoes_produtos"],
      });
    },
  });
}

export function useAprovarSubmissaoProduto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: {
      id: string;
      input?: {
        descricao?: string;
        precoUnidade?: number;
      };
    }) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(
        token,
      ).request<AprovarSubmissaoProdutoMutation>(
        APROVAR_SUBMISSAO_PRODUTO_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["listar_submissoes_produtos"],
      });
    },
  });
}

export function useReprovarSubmissaoProduto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: { id: string; motivoReprovacao: string }) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(
        token,
      ).request<ReprovarSubmissaoProdutoMutation>(
        REPROVAR_SUBMISSAO_PRODUTO_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["listar_submissoes_produtos"],
      });
    },
  });
}

export function useDeletarSubmissaoProduto() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: { id: string }) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(
        token,
      ).request<DeletarSubmissaoProdutoMutation>(
        DELETAR_SUBMISSAO_PRODUTO_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["listar_submissoes_produtos"],
      });
    },
  });
}

export function useAtualizarProdutoComercializavel() {
  const queryClient = useQueryClient();
  return useMutation<
    AtualizarProdutoComercializavelMutation,
    Error,
    { id: string; input: AtualizarProdutoComercializavelInput }
  >({
    mutationFn: async (variables) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(
        token,
      ).request<AtualizarProdutoComercializavelMutation>(
        ATUALIZAR_PRODUTO_COMERCIALIZAVEL_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["listar_produtos_comercializaveis"],
      });
    },
  });
}

export function useDeletarProdutoComercializavel() {
  const queryClient = useQueryClient();
  return useMutation<
    DeletarProdutoComercializavelMutation,
    Error,
    { id: string }
  >({
    mutationFn: async (variables) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(
        token,
      ).request<DeletarProdutoComercializavelMutation>(
        DELETAR_PRODUTO_COMERCIALIZAVEL_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["listar_produtos_comercializaveis"],
      });
    },
  });
}

// Ciclo hooks
export function useListarCiclos(limite?: number, cursor?: string) {
  return useQuery<ListarCiclosQuery, Error>({
    queryKey: ["listar_ciclos", limite, cursor],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request<ListarCiclosQuery>(
        LISTAR_CICLOS_QUERY,
        { limite, cursor },
      );
    },
  });
}

export function useBuscarCiclo(id: string) {
  return useQuery<BuscarCicloQuery, Error>({
    queryKey: ["buscar_ciclo", id],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request<BuscarCicloQuery>(
        BUSCAR_CICLO_QUERY,
        { id },
      );
    },
    enabled: !!id,
  });
}

export function useCriarCiclo() {
  const queryClient = useQueryClient();
  return useMutation<CriarCicloMutation, Error, { input: CriarCicloInput }>({
    mutationFn: async (variables) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request<CriarCicloMutation>(
        CRIAR_CICLO_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["listar_ciclos"],
      });
    },
  });
}

export function useAtualizarCiclo() {
  const queryClient = useQueryClient();
  return useMutation<
    AtualizarCicloMutation,
    Error,
    { id: string; input: AtualizarCicloInput }
  >({
    mutationFn: async (variables) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request<AtualizarCicloMutation>(
        ATUALIZAR_CICLO_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["listar_ciclos"],
      });
      queryClient.invalidateQueries({
        queryKey: ["buscar_ciclo"],
      });
    },
  });
}

export function useDeletarCiclo() {
  const queryClient = useQueryClient();
  return useMutation<DeletarCicloMutation, Error, { id: string }>({
    mutationFn: async (variables) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request<DeletarCicloMutation>(
        DELETAR_CICLO_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["listar_ciclos"],
      });
    },
  });
}

// CicloMercados hooks
export function useListarMercadosPorCiclo(cicloId: number) {
  return useQuery({
    queryKey: ["listar_mercados_por_ciclo", cicloId],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const data = await graphqlClientSecure(token).request(
        LISTAR_MERCADOS_POR_CICLO_QUERY,
        { cicloId },
      );
      return data.listarMercadosPorCiclo;
    },
    enabled: !!cicloId,
  });
}

export function useBuscarCicloMercado(id: number) {
  return useQuery({
    queryKey: ["buscar_ciclo_mercado", id],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const data = await graphqlClientSecure(token).request(
        BUSCAR_CICLO_MERCADO_QUERY,
        { id: id.toString() },
      );
      return data.buscarCicloMercado;
    },
    enabled: !!id,
  });
}

export function useAdicionarMercadoCiclo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: { input: any }) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request(
        ADICIONAR_MERCADO_CICLO_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["listar_mercados_por_ciclo"],
      });
    },
  });
}

export function useAtualizarMercadoCiclo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: { id: string; input: any }) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request(
        ATUALIZAR_MERCADO_CICLO_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["listar_mercados_por_ciclo"],
      });
      queryClient.invalidateQueries({
        queryKey: ["buscar_ciclo_mercado"],
      });
    },
  });
}

export function useRemoverMercadoCiclo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (variables: { id: string }) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request(
        REMOVER_MERCADO_CICLO_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["listar_mercados_por_ciclo"],
      });
    },
  });
}

// Oferta interfaces
export interface OfertaProduto {
  id: string;
  ofertaId: number;
  produtoId: number;
  produto?: {
    id: string;
    nome: string;
    medida?: string;
    valorReferencia?: number;
  };
  quantidade: number;
  valorReferencia?: number;
  valorOferta?: number;
}

export interface Oferta {
  id: string;
  cicloId: number;
  ciclo?: Ciclo;
  usuarioId: number;
  usuario?: {
    id: string;
    nome: string;
  };
  status: string;
  observacao?: string;
  ofertaProdutos?: OfertaProduto[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BuscarOfertaQuery {
  buscarOferta: Oferta;
}

export interface ListarOfertasPorCicloQuery {
  listarOfertasPorCiclo: Oferta[];
}

export interface ListarOfertasPorUsuarioQuery {
  listarOfertasPorUsuario: Oferta[];
}

export interface CriarOfertaMutation {
  criarOferta: {
    id: string;
    cicloId: number;
    usuarioId: number;
    status: string;
    observacao?: string;
  };
}

export interface AdicionarProdutoOfertaMutation {
  adicionarProdutoOferta: OfertaProduto;
}

export interface AtualizarQuantidadeProdutoOfertaMutation {
  atualizarQuantidadeProdutoOferta: {
    id: string;
    quantidade: number;
    valorOferta?: number;
  };
}

export interface RemoverProdutoOfertaMutation {
  removerProdutoOferta: boolean;
}

export interface CriarOfertaInput {
  cicloId: number;
  usuarioId: number;
  observacao?: string;
}

export interface AdicionarProdutoOfertaInput {
  produtoId: number;
  quantidade: number;
  valorReferencia?: number;
  valorOferta?: number;
}

export interface AtualizarQuantidadeProdutoInput {
  quantidade: number;
  valorOferta?: number;
}

// Oferta hooks
export function useBuscarOferta(id: string) {
  return useQuery<BuscarOfertaQuery, Error>({
    queryKey: ["buscar_oferta", id],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request<BuscarOfertaQuery>(
        BUSCAR_OFERTA_QUERY,
        { id },
      );
    },
    enabled: !!id,
  });
}

export function useListarOfertasPorCiclo(cicloId: number) {
  return useQuery<ListarOfertasPorCicloQuery, Error>({
    queryKey: ["listar_ofertas_por_ciclo", cicloId],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(
        token,
      ).request<ListarOfertasPorCicloQuery>(LISTAR_OFERTAS_POR_CICLO_QUERY, {
        cicloId,
      });
    },
    enabled: !!cicloId,
  });
}

export function useListarOfertasPorUsuario(usuarioId: number) {
  return useQuery<ListarOfertasPorUsuarioQuery, Error>({
    queryKey: ["listar_ofertas_por_usuario", usuarioId],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(
        token,
      ).request<ListarOfertasPorUsuarioQuery>(
        LISTAR_OFERTAS_POR_USUARIO_QUERY,
        {
          usuarioId,
        },
      );
    },
    enabled: !!usuarioId,
  });
}

export function useCriarOferta() {
  const queryClient = useQueryClient();
  return useMutation<CriarOfertaMutation, Error, { input: CriarOfertaInput }>({
    mutationFn: async (variables) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request<CriarOfertaMutation>(
        CRIAR_OFERTA_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["listar_ofertas_por_ciclo"],
      });
      queryClient.invalidateQueries({
        queryKey: ["listar_ofertas_por_usuario"],
      });
    },
  });
}

export function useAdicionarProdutoOferta() {
  const queryClient = useQueryClient();
  return useMutation<
    AdicionarProdutoOfertaMutation,
    Error,
    { ofertaId: string; input: AdicionarProdutoOfertaInput }
  >({
    mutationFn: async (variables) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(
        token,
      ).request<AdicionarProdutoOfertaMutation>(
        ADICIONAR_PRODUTO_OFERTA_MUTATION,
        variables,
      );
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["buscar_oferta", variables.ofertaId],
      });
    },
  });
}

export function useAtualizarQuantidadeProdutoOferta() {
  const queryClient = useQueryClient();
  return useMutation<
    AtualizarQuantidadeProdutoOfertaMutation,
    Error,
    { ofertaProdutoId: string; input: AtualizarQuantidadeProdutoInput }
  >({
    mutationFn: async (variables) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(
        token,
      ).request<AtualizarQuantidadeProdutoOfertaMutation>(
        ATUALIZAR_QUANTIDADE_PRODUTO_OFERTA_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["buscar_oferta"],
      });
    },
  });
}

export function useRemoverProdutoOferta() {
  const queryClient = useQueryClient();
  return useMutation<
    RemoverProdutoOfertaMutation,
    Error,
    { ofertaProdutoId: string; ofertaId?: string }
  >({
    mutationFn: async (variables) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(
        token,
      ).request<RemoverProdutoOfertaMutation>(REMOVER_PRODUTO_OFERTA_MUTATION, {
        ofertaProdutoId: variables.ofertaProdutoId,
      });
    },
    onSuccess: (data, variables) => {
      if (variables.ofertaId) {
        queryClient.invalidateQueries({
          queryKey: ["buscar_oferta", variables.ofertaId],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["buscar_oferta"],
        });
      }
    },
  });
}

export interface ProdutoMigrarInput {
  produtoId: number;
  quantidade: number;
  valorOferta?: number;
  fornecedorId?: number;
}

export interface MigrarOfertasInput {
  ciclosOrigemIds: number[];
  cicloDestinoId: number;
  produtos: ProdutoMigrarInput[];
}

interface MigrarOfertasMutation {
  migrarOfertas: {
    id: string;
    cicloId: number;
    usuarioId: number;
    status: string;
    observacao: string;
    createdAt: string;
    updatedAt: string;
  }[];
}

export function useMigrarOfertas() {
  const queryClient = useQueryClient();
  return useMutation<MigrarOfertasMutation, Error, MigrarOfertasInput>({
    mutationFn: async (input) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request<MigrarOfertasMutation>(
        MIGRAR_OFERTAS_MUTATION,
        { input },
      );
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["listar_ofertas_por_ciclo", variables.cicloDestinoId],
      });
      queryClient.invalidateQueries({
        queryKey: ["listar_ciclos"],
      });
    },
  });
}

// PontoEntrega hooks
export interface PontoEntrega {
  id: string;
  nome: string;
  endereco?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CriarPontoEntregaInput {
  nome: string;
  endereco?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  status: string;
}

export interface AtualizarPontoEntregaInput {
  nome?: string;
  endereco?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  status?: string;
}

export function useListarPontosEntrega() {
  return useQuery<{ listarPontosEntrega: PontoEntrega[] }>({
    queryKey: ["listar_pontos_entrega"],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request(
        LISTAR_PONTOS_ENTREGA_QUERY,
      );
    },
  });
}

export function useListarPontosEntregaAtivos() {
  return useQuery<{ listarPontosEntregaAtivos: PontoEntrega[] }>({
    queryKey: ["listar_pontos_entrega_ativos"],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request(
        LISTAR_PONTOS_ENTREGA_ATIVOS_QUERY,
      );
    },
  });
}

export function useBuscarPontoEntrega(id: string | undefined) {
  return useQuery<{ buscarPontoEntrega: PontoEntrega }>({
    queryKey: ["buscar_ponto_entrega", id],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request(
        BUSCAR_PONTO_ENTREGA_QUERY,
        { id },
      );
    },
    enabled: !!id,
  });
}

export function useCriarPontoEntrega() {
  const queryClient = useQueryClient();
  return useMutation<
    { criarPontoEntrega: PontoEntrega },
    Error,
    { input: CriarPontoEntregaInput }
  >({
    mutationFn: async (variables) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request(
        CRIAR_PONTO_ENTREGA_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["listar_pontos_entrega"],
      });
      queryClient.invalidateQueries({
        queryKey: ["listar_pontos_entrega_ativos"],
      });
    },
  });
}

export function useAtualizarPontoEntrega() {
  const queryClient = useQueryClient();
  return useMutation<
    { atualizarPontoEntrega: PontoEntrega },
    Error,
    { id: string; input: AtualizarPontoEntregaInput }
  >({
    mutationFn: async (variables) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request(
        ATUALIZAR_PONTO_ENTREGA_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["listar_pontos_entrega"],
      });
      queryClient.invalidateQueries({
        queryKey: ["listar_pontos_entrega_ativos"],
      });
      queryClient.invalidateQueries({
        queryKey: ["buscar_ponto_entrega"],
      });
    },
  });
}

export function useDeletarPontoEntrega() {
  const queryClient = useQueryClient();
  return useMutation<{ deletarPontoEntrega: boolean }, Error, { id: string }>({
    mutationFn: async (variables) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(token).request(
        DELETAR_PONTO_ENTREGA_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["listar_pontos_entrega"],
      });
      queryClient.invalidateQueries({
        queryKey: ["listar_pontos_entrega_ativos"],
      });
    },
  });
}

// PedidoConsumidores interfaces
export interface PedidoConsumidoresProduto {
  id: string;
  pedidoConsumidorId: number;
  produtoId: number;
  produto?: {
    id: string;
    nome: string;
    medida?: string;
    valorReferencia?: number;
  };
  quantidade: number;
  valorOferta?: number;
  valorCompra?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PedidoConsumidores {
  id: string;
  cicloId: number;
  ciclo?: Ciclo;
  usuarioId: number;
  usuario?: {
    id: string;
    nome: string;
    email: string;
  };
  status: string;
  observacao?: string;
  pedidoConsumidoresProdutos?: PedidoConsumidoresProduto[];
  createdAt?: string;
  updatedAt?: string;
}

export interface BuscarPedidoConsumidoresQuery {
  buscarPedidoConsumidores: PedidoConsumidores;
}

export interface ListarPedidosPorCicloQuery {
  listarPedidosPorCiclo: PedidoConsumidores[];
}

export interface ListarPedidosPorUsuarioQuery {
  listarPedidosPorUsuario: PedidoConsumidores[];
}

export interface CriarPedidoConsumidoresMutation {
  criarPedidoConsumidores: PedidoConsumidores;
}

export interface AdicionarProdutoPedidoMutation {
  adicionarProdutoPedido: PedidoConsumidoresProduto;
}

export interface AtualizarQuantidadeProdutoPedidoMutation {
  atualizarQuantidadeProdutoPedido: PedidoConsumidoresProduto;
}

export interface RemoverProdutoPedidoMutation {
  removerProdutoPedido: boolean;
}

export interface AtualizarStatusPedidoMutation {
  atualizarStatusPedido: PedidoConsumidores;
}

export interface CriarPedidoConsumidoresInput {
  cicloId: number;
  usuarioId: number;
  status?: string;
  observacao?: string;
}

export interface AdicionarProdutoPedidoInput {
  produtoId: number;
  quantidade: number;
  valorOferta?: number;
  valorCompra?: number;
}

export interface AtualizarQuantidadeProdutoPedidoInput {
  quantidade: number;
}

export interface AtualizarStatusPedidoInput {
  status: string;
}

// PedidoConsumidores hooks
export function useBuscarPedidoConsumidores(id: string) {
  return useQuery<BuscarPedidoConsumidoresQuery, Error>({
    queryKey: ["buscar_pedido_consumidores", id],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(
        token,
      ).request<BuscarPedidoConsumidoresQuery>(
        BUSCAR_PEDIDO_CONSUMIDORES_QUERY,
        { id },
      );
    },
    enabled: !!id,
  });
}

export function useListarPedidosPorCiclo(cicloId: number) {
  return useQuery<ListarPedidosPorCicloQuery, Error>({
    queryKey: ["listar_pedidos_por_ciclo", cicloId],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(
        token,
      ).request<ListarPedidosPorCicloQuery>(LISTAR_PEDIDOS_POR_CICLO_QUERY, {
        cicloId,
      });
    },
    enabled: !!cicloId,
  });
}

export function useListarPedidosPorUsuario(usuarioId: number) {
  return useQuery<ListarPedidosPorUsuarioQuery, Error>({
    queryKey: ["listar_pedidos_por_usuario", usuarioId],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(
        token,
      ).request<ListarPedidosPorUsuarioQuery>(
        LISTAR_PEDIDOS_POR_USUARIO_QUERY,
        {
          usuarioId,
        },
      );
    },
    enabled: !!usuarioId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCriarPedidoConsumidores() {
  const queryClient = useQueryClient();
  return useMutation<
    CriarPedidoConsumidoresMutation,
    Error,
    { input: CriarPedidoConsumidoresInput }
  >({
    mutationFn: async (variables) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(
        token,
      ).request<CriarPedidoConsumidoresMutation>(
        CRIAR_PEDIDO_CONSUMIDORES_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["listar_pedidos_por_ciclo"],
      });
      queryClient.invalidateQueries({
        queryKey: ["listar_pedidos_por_usuario"],
      });
    },
  });
}

export function useAdicionarProdutoPedido() {
  const queryClient = useQueryClient();
  return useMutation<
    AdicionarProdutoPedidoMutation,
    Error,
    { pedidoId: string; input: AdicionarProdutoPedidoInput }
  >({
    mutationFn: async (variables) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(
        token,
      ).request<AdicionarProdutoPedidoMutation>(
        ADICIONAR_PRODUTO_PEDIDO_MUTATION,
        variables,
      );
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["buscar_pedido_consumidores", variables.pedidoId],
      });
    },
  });
}

export function useAtualizarQuantidadeProdutoPedido() {
  const queryClient = useQueryClient();
  return useMutation<
    AtualizarQuantidadeProdutoPedidoMutation,
    Error,
    { pedidoProdutoId: string; input: AtualizarQuantidadeProdutoPedidoInput }
  >({
    mutationFn: async (variables) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(
        token,
      ).request<AtualizarQuantidadeProdutoPedidoMutation>(
        ATUALIZAR_QUANTIDADE_PRODUTO_PEDIDO_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["buscar_pedido_consumidores"],
      });
    },
  });
}

export function useRemoverProdutoPedido() {
  const queryClient = useQueryClient();
  return useMutation<
    RemoverProdutoPedidoMutation,
    Error,
    { pedidoProdutoId: string; pedidoId?: string }
  >({
    mutationFn: async (variables) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(
        token,
      ).request<RemoverProdutoPedidoMutation>(REMOVER_PRODUTO_PEDIDO_MUTATION, {
        pedidoProdutoId: variables.pedidoProdutoId,
      });
    },
    onSuccess: (data, variables) => {
      if (variables.pedidoId) {
        queryClient.invalidateQueries({
          queryKey: ["buscar_pedido_consumidores", variables.pedidoId],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["buscar_pedido_consumidores"],
        });
      }
    },
  });
}

export function useAtualizarStatusPedido() {
  const queryClient = useQueryClient();
  return useMutation<
    AtualizarStatusPedidoMutation,
    Error,
    { pedidoId: string; input: AtualizarStatusPedidoInput }
  >({
    mutationFn: async (variables) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(
        token,
      ).request<AtualizarStatusPedidoMutation>(
        ATUALIZAR_STATUS_PEDIDO_MUTATION,
        variables,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["buscar_pedido_consumidores"],
      });
      queryClient.invalidateQueries({
        queryKey: ["listar_pedidos_por_ciclo"],
      });
      queryClient.invalidateQueries({
        queryKey: ["listar_pedidos_por_usuario"],
      });
    },
  });
}

// EntregaFornecedor interfaces
export interface EntregaFornecedor {
  id: string;
  fornecedor: string;
  fornecedorId: number;
  produto: string;
  produtoId: number;
  unidadeMedida: string;
  valorUnitario: number;
  quantidadeOfertada: number;
  quantidadeEntregue: number;
  valorTotal: number;
  agriculturaFamiliar: boolean;
  certificacao: string | null;
}

export interface ListarEntregasFornecedoresPorCicloQuery {
  listarEntregasFornecedoresPorCiclo: EntregaFornecedor[];
}

// EntregaFornecedor hooks
export function useListarEntregasFornecedoresPorCiclo(
  cicloId: number,
  fornecedorId?: number,
) {
  return useQuery<EntregaFornecedor[], Error>({
    queryKey: ["listar_entregas_fornecedores_por_ciclo", cicloId, fornecedorId],
    queryFn: async () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await graphqlClientSecure(
        token,
      ).request<ListarEntregasFornecedoresPorCicloQuery>(
        LISTAR_ENTREGAS_FORNECEDORES_POR_CICLO_QUERY,
        { cicloId, fornecedorId },
      );
      return response.listarEntregasFornecedoresPorCiclo;
    },
    enabled: !!cicloId,
  });
}
