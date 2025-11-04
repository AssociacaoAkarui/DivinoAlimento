import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import { graphqlClient, graphqlClientSecure } from "../lib/graphql-client";
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

export function loginUsuario(input: LoginInput): Promise<SessionLogin> {
  return graphqlClient.request<SessionLogin>(
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
  );
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
      graphqlClient.request<SessionLogin>(
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
  });
}

export function useSystemInformation() {
  const queryClient = useQueryClient();

  return useQuery<SystemInformation, Error>({
    queryKey: ["system_information"],
    queryFn: () => {
      const usuario = queryClient.getQueryData<SessionLogin>(["usuario"]);
      console.log(usuario);
      return graphqlClientSecure(usuario.token).request<SystemInformation>(gql`
        query SystemInformation {
          systemInformation {
            version
          }
        }
      `);
    },
  });
}
