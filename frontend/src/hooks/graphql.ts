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
  BUSCAR_OFERTA_QUERY,
  LISTAR_OFERTAS_POR_CICLO_QUERY,
  LISTAR_OFERTAS_POR_USUARIO_QUERY,
  CRIAR_OFERTA_MUTATION,
  ADICIONAR_PRODUTO_OFERTA_MUTATION,
  ATUALIZAR_QUANTIDADE_PRODUTO_OFERTA_MUTATION,
  REMOVER_PRODUTO_OFERTA_MUTATION,
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listar_usuarios"] });
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
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["buscar_oferta"],
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
    { ofertaProdutoId: string }
  >({
    mutationFn: async (variables) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return await graphqlClientSecure(
        token,
      ).request<RemoverProdutoOfertaMutation>(
        REMOVER_PRODUTO_OFERTA_MUTATION,
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
