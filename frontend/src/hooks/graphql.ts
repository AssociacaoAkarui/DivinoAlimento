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
} from "../graphql/operations";

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
