import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { graphqlClient } from "../lib/graphql-client";
import { gql } from "graphql-request";
import { LOGIN } from "../lib/api-graphql";

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
      graphqlClient.request<SessionLogin>(LOGIN, { input }),
    onSuccess: (data) => {
      const sessionLogin = data.sessionLogin;
      queryClient.setQueryData<SessionLogin>(["usuario"], sessionLogin);
    },
  });
}

export function useSystemInformation(
  options?: UseMutationOptions<{ sessionLogin: SessionLogin }, Error>,
) {
  const queryClient = useQueryClient();

  return useMutation<{ sessionLogin: SessionLogin }, Error>({
    mutationFn: () => {
      systemInformation: {
        version: "1.0.0";
      }
    },
    onSuccess: (data) => {
      const systemInformation = data.systemInformation;
      queryClient.setQueryData<SystemInformation>(
        ["system"],
        systemInformation,
      );
    },
  });
}
