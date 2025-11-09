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
import { gql } from "graphql-request";

interface LoginInput {
  email: string;
  senha: string;
}

interface SessionLogin {
  usuarioId: string;
  token: string;
  perfis: string[];
}

interface SystemInformation {
  version: string;
}

interface Usuario {
  id: string;
  nome: string;
  email: string;
  status: string;
  perfis: string[];
}

export function useLoginUsuario(
  options?: UseMutationOptions<
    { sessionLogin: SessionLogin },
    Error,
    LoginInput
  >,
) {
  const queryClient = useQueryClient();
  return useMutation<{ sessionLogin: SessionLogin }, Error, LoginInput>({
    mutationFn: (input: LoginInput) =>
      graphqlClient.request<{ sessionLogin: SessionLogin }>(
        gql`
          mutation Login($input: LoginInput!) {
            sessionLogin(input: $input) {
              usuarioId
              token
              perfis
            }
          }
        `,
        { input },
      ),
    onSuccess: (data) => {
      const sessionLogin = data.sessionLogin;
      queryClient.setQueryData<SessionLogin>(["usuario"], sessionLogin);
    },
    ...options,
  });
}

export function useSystemInformation() {
  return useQuery<{ systemInformation: SystemInformation }, Error>({
    queryKey: ["system_information"],
    queryFn: () => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      return graphqlClientSecure(token).request<{
        systemInformation: SystemInformation;
      }>(gql`
        query SystemInformation {
          systemInformation {
            version
          }
        }
      `);
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
      const response = await graphqlClientSecure(token).request<{
        listarUsuarios: Usuario[];
      }>(gql`
        query ListarUsuarios {
          listarUsuarios {
            id
            nome
            email
            status
            perfis
          }
        }
      `);
      return response.listarUsuarios;
    },
  });
}

export function useAtualizarUsuario() {
  const queryClient = useQueryClient();

  return useMutation<Usuario, Error, { id: string; input: Partial<Usuario> }>({
    mutationFn: async ({ id, input }) => {
      const token = getSessionToken();
      if (!token) {
        throw new Error("No authentication token found");
      }
      const response = await graphqlClientSecure(token).request<{
        atualizarUsuario: Usuario;
      }>(
        gql`
          mutation AtualizarUsuario($id: ID!, $input: AtualizarUsuarioInput!) {
            atualizarUsuario(id: $id, input: $input) {
              id
              nome
              email
              status
              perfis
            }
          }
        `,
        { id, input },
      );
      return response.atualizarUsuario;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listar_usuarios"] });
    },
  });
}
