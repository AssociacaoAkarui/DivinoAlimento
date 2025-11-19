import { GraphQLClient, RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type ActiveSession = {
  __typename?: 'ActiveSession';
  perfis: Array<Scalars['String']['output']>;
  token: Scalars['String']['output'];
  usuarioId: Scalars['ID']['output'];
};

export type AtualizarUsuarioInput = {
  celular?: InputMaybe<Scalars['String']['input']>;
  cientepolitica?: InputMaybe<Scalars['String']['input']>;
  descritivo?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  nome?: InputMaybe<Scalars['String']['input']>;
  nomeoficial?: InputMaybe<Scalars['String']['input']>;
  perfis?: InputMaybe<Array<Scalars['String']['input']>>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type CriarUsuarioInput = {
  celular?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  nome: Scalars['String']['input'];
  perfis: Array<Scalars['String']['input']>;
  senha: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
};

export type HealthCheck = {
  __typename?: 'HealthCheck';
  status: Scalars['String']['output'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  senha: Scalars['String']['input'];
};

export type LogoutResponse = {
  __typename?: 'LogoutResponse';
  success: Scalars['Boolean']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  atualizarUsuario: Usuario;
  criarUsuario: Usuario;
  sessionLogin: ActiveSession;
  sessionLogout: LogoutResponse;
};


export type MutationAtualizarUsuarioArgs = {
  id: Scalars['ID']['input'];
  input: AtualizarUsuarioInput;
};


export type MutationCriarUsuarioArgs = {
  input: CriarUsuarioInput;
};


export type MutationSessionLoginArgs = {
  input: LoginInput;
};

export type Query = {
  __typename?: 'Query';
  buscarUsuario: Usuario;
  healthcheck: HealthCheck;
  listarUsuarios: Array<Usuario>;
  systemInformation: SystemInformation;
};


export type QueryBuscarUsuarioArgs = {
  id: Scalars['ID']['input'];
};

export type SystemInformation = {
  __typename?: 'SystemInformation';
  version: Scalars['String']['output'];
};

export type Usuario = {
  __typename?: 'Usuario';
  celular?: Maybe<Scalars['String']['output']>;
  cientepolitica?: Maybe<Scalars['String']['output']>;
  descritivo?: Maybe<Scalars['String']['output']>;
  email: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  nome: Scalars['String']['output'];
  nomeoficial?: Maybe<Scalars['String']['output']>;
  perfis: Array<Scalars['String']['output']>;
  status: Scalars['String']['output'];
};

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', sessionLogin: { __typename?: 'ActiveSession', usuarioId: string, token: string, perfis: Array<string> } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', sessionLogout: { __typename?: 'LogoutResponse', success: boolean } };

export type SystemInformationQueryVariables = Exact<{ [key: string]: never; }>;


export type SystemInformationQuery = { __typename?: 'Query', systemInformation: { __typename?: 'SystemInformation', version: string } };

export type ListarUsuariosQueryVariables = Exact<{ [key: string]: never; }>;


export type ListarUsuariosQuery = { __typename?: 'Query', listarUsuarios: Array<{ __typename?: 'Usuario', id: string, nome: string, email: string, status: string, perfis: Array<string> }> };

export type CriarUsuarioMutationVariables = Exact<{
  input: CriarUsuarioInput;
}>;


export type CriarUsuarioMutation = { __typename?: 'Mutation', criarUsuario: { __typename?: 'Usuario', id: string, nome: string, email: string, status: string, perfis: Array<string> } };

export type AtualizarUsuarioMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: AtualizarUsuarioInput;
}>;


export type AtualizarUsuarioMutation = { __typename?: 'Mutation', atualizarUsuario: { __typename?: 'Usuario', id: string, nome: string, email: string, status: string, perfis: Array<string> } };

export type HealthcheckQueryVariables = Exact<{ [key: string]: never; }>;


export type HealthcheckQuery = { __typename?: 'Query', healthcheck: { __typename?: 'HealthCheck', status: string } };

export type BuscarUsuarioQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type BuscarUsuarioQuery = { __typename?: 'Query', buscarUsuario: { __typename?: 'Usuario', id: string, nome: string, nomeoficial?: string | null, email: string, celular?: string | null, descritivo?: string | null, cientepolitica?: string | null, status: string, perfis: Array<string> } };


export const LoginDocument = gql`
    mutation Login($input: LoginInput!) {
  sessionLogin(input: $input) {
    usuarioId
    token
    perfis
  }
}
    `;
export const LogoutDocument = gql`
    mutation Logout {
  sessionLogout {
    success
  }
}
    `;
export const SystemInformationDocument = gql`
    query SystemInformation {
  systemInformation {
    version
  }
}
    `;
export const ListarUsuariosDocument = gql`
    query ListarUsuarios {
  listarUsuarios {
    id
    nome
    email
    status
    perfis
  }
}
    `;
export const CriarUsuarioDocument = gql`
    mutation CriarUsuario($input: CriarUsuarioInput!) {
  criarUsuario(input: $input) {
    id
    nome
    email
    status
    perfis
  }
}
    `;
export const AtualizarUsuarioDocument = gql`
    mutation AtualizarUsuario($id: ID!, $input: AtualizarUsuarioInput!) {
  atualizarUsuario(id: $id, input: $input) {
    id
    nome
    email
    status
    perfis
  }
}
    `;
export const HealthcheckDocument = gql`
    query Healthcheck {
  healthcheck {
    status
  }
}
    `;
export const BuscarUsuarioDocument = gql`
    query BuscarUsuario($id: ID!) {
  buscarUsuario(id: $id) {
    id
    nome
    nomeoficial
    email
    celular
    descritivo
    cientepolitica
    status
    perfis
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    Login(variables: LoginMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<LoginMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<LoginMutation>({ document: LoginDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Login', 'mutation', variables);
    },
    Logout(variables?: LogoutMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<LogoutMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<LogoutMutation>({ document: LogoutDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Logout', 'mutation', variables);
    },
    SystemInformation(variables?: SystemInformationQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<SystemInformationQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SystemInformationQuery>({ document: SystemInformationDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'SystemInformation', 'query', variables);
    },
    ListarUsuarios(variables?: ListarUsuariosQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ListarUsuariosQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ListarUsuariosQuery>({ document: ListarUsuariosDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ListarUsuarios', 'query', variables);
    },
    CriarUsuario(variables: CriarUsuarioMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CriarUsuarioMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CriarUsuarioMutation>({ document: CriarUsuarioDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CriarUsuario', 'mutation', variables);
    },
    AtualizarUsuario(variables: AtualizarUsuarioMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AtualizarUsuarioMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AtualizarUsuarioMutation>({ document: AtualizarUsuarioDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'AtualizarUsuario', 'mutation', variables);
    },
    Healthcheck(variables?: HealthcheckQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<HealthcheckQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<HealthcheckQuery>({ document: HealthcheckDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'Healthcheck', 'query', variables);
    },
    BuscarUsuario(variables: BuscarUsuarioQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<BuscarUsuarioQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<BuscarUsuarioQuery>({ document: BuscarUsuarioDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'BuscarUsuario', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;