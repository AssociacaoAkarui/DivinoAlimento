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
} from "../types/graphql";

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
