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

export type AdicionarProdutoOfertaInput = {
  produtoId: Scalars['Int']['input'];
  quantidade: Scalars['Float']['input'];
  valorOferta?: InputMaybe<Scalars['Float']['input']>;
  valorReferencia?: InputMaybe<Scalars['Float']['input']>;
};

export type AprovarSubmissaoInput = {
  descricao?: InputMaybe<Scalars['String']['input']>;
  precoUnidade?: InputMaybe<Scalars['Float']['input']>;
};

export type AtualizarCategoriaProdutosInput = {
  nome?: InputMaybe<Scalars['String']['input']>;
  observacao?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type AtualizarCicloInput = {
  itensAdicionaisFim?: InputMaybe<Scalars['String']['input']>;
  itensAdicionaisInicio?: InputMaybe<Scalars['String']['input']>;
  nome?: InputMaybe<Scalars['String']['input']>;
  observacao?: InputMaybe<Scalars['String']['input']>;
  ofertaFim?: InputMaybe<Scalars['String']['input']>;
  ofertaInicio?: InputMaybe<Scalars['String']['input']>;
  pontoEntregaId?: InputMaybe<Scalars['Int']['input']>;
  retiradaConsumidorFim?: InputMaybe<Scalars['String']['input']>;
  retiradaConsumidorInicio?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type AtualizarMercadoInput = {
  nome?: InputMaybe<Scalars['String']['input']>;
  responsavelId?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  taxaAdministrativa?: InputMaybe<Scalars['Float']['input']>;
  tipo?: InputMaybe<Scalars['String']['input']>;
  valorMaximoCesta?: InputMaybe<Scalars['Float']['input']>;
};

export type AtualizarPontoEntregaInput = {
  bairro?: InputMaybe<Scalars['String']['input']>;
  cep?: InputMaybe<Scalars['String']['input']>;
  cidade?: InputMaybe<Scalars['String']['input']>;
  endereco?: InputMaybe<Scalars['String']['input']>;
  estado?: InputMaybe<Scalars['String']['input']>;
  nome?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type AtualizarProdutoComercializavelInput = {
  medida?: InputMaybe<Scalars['String']['input']>;
  pesoKg?: InputMaybe<Scalars['Float']['input']>;
  precoBase?: InputMaybe<Scalars['Float']['input']>;
  produtoId?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type AtualizarProdutoInput = {
  categoriaId?: InputMaybe<Scalars['Int']['input']>;
  descritivo?: InputMaybe<Scalars['String']['input']>;
  medida?: InputMaybe<Scalars['String']['input']>;
  nome?: InputMaybe<Scalars['String']['input']>;
  pesoGrama?: InputMaybe<Scalars['Float']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  valorReferencia?: InputMaybe<Scalars['Float']['input']>;
};

export type AtualizarQuantidadeProdutoInput = {
  quantidade: Scalars['Float']['input'];
  valorOferta?: InputMaybe<Scalars['Float']['input']>;
};

export type AtualizarUsuarioInput = {
  agencia?: InputMaybe<Scalars['String']['input']>;
  banco?: InputMaybe<Scalars['String']['input']>;
  celular?: InputMaybe<Scalars['String']['input']>;
  chavePix?: InputMaybe<Scalars['String']['input']>;
  cientepolitica?: InputMaybe<Scalars['String']['input']>;
  conta?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  nome?: InputMaybe<Scalars['String']['input']>;
  nomeoficial?: InputMaybe<Scalars['String']['input']>;
  perfis?: InputMaybe<Array<Scalars['String']['input']>>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type CategoriaProdutos = {
  __typename?: 'CategoriaProdutos';
  id: Scalars['ID']['output'];
  nome: Scalars['String']['output'];
  observacao?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
};

export type Ciclo = {
  __typename?: 'Ciclo';
  createdAt?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  itensAdicionaisFim?: Maybe<Scalars['String']['output']>;
  itensAdicionaisInicio?: Maybe<Scalars['String']['output']>;
  nome: Scalars['String']['output'];
  observacao?: Maybe<Scalars['String']['output']>;
  ofertaFim: Scalars['String']['output'];
  ofertaInicio: Scalars['String']['output'];
  pontoEntrega?: Maybe<PontoEntrega>;
  pontoEntregaId: Scalars['Int']['output'];
  retiradaConsumidorFim?: Maybe<Scalars['String']['output']>;
  retiradaConsumidorInicio?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type CriarCategoriaProdutosInput = {
  nome: Scalars['String']['input'];
  observacao?: InputMaybe<Scalars['String']['input']>;
  status: Scalars['String']['input'];
};

export type CriarCicloInput = {
  itensAdicionaisFim?: InputMaybe<Scalars['String']['input']>;
  itensAdicionaisInicio?: InputMaybe<Scalars['String']['input']>;
  nome: Scalars['String']['input'];
  observacao?: InputMaybe<Scalars['String']['input']>;
  ofertaFim: Scalars['String']['input'];
  ofertaInicio: Scalars['String']['input'];
  pontoEntregaId: Scalars['Int']['input'];
  retiradaConsumidorFim?: InputMaybe<Scalars['String']['input']>;
  retiradaConsumidorInicio?: InputMaybe<Scalars['String']['input']>;
};

export type CriarMercadoInput = {
  nome: Scalars['String']['input'];
  pontosEntrega?: InputMaybe<Array<PontoEntregaInput>>;
  responsavelId: Scalars['Int']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
  taxaAdministrativa?: InputMaybe<Scalars['Float']['input']>;
  tipo: Scalars['String']['input'];
  valorMaximoCesta?: InputMaybe<Scalars['Float']['input']>;
};

export type CriarOfertaInput = {
  cicloId: Scalars['Int']['input'];
  observacao?: InputMaybe<Scalars['String']['input']>;
  usuarioId: Scalars['Int']['input'];
};

export type CriarPontoEntregaInput = {
  bairro?: InputMaybe<Scalars['String']['input']>;
  cep?: InputMaybe<Scalars['String']['input']>;
  cidade?: InputMaybe<Scalars['String']['input']>;
  endereco?: InputMaybe<Scalars['String']['input']>;
  estado?: InputMaybe<Scalars['String']['input']>;
  nome: Scalars['String']['input'];
  status: Scalars['String']['input'];
};

export type CriarProdutoComercializavelInput = {
  medida: Scalars['String']['input'];
  pesoKg: Scalars['Float']['input'];
  precoBase: Scalars['Float']['input'];
  produtoId: Scalars['Int']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
};

export type CriarProdutoInput = {
  categoriaId?: InputMaybe<Scalars['Int']['input']>;
  descritivo?: InputMaybe<Scalars['String']['input']>;
  medida?: InputMaybe<Scalars['String']['input']>;
  nome: Scalars['String']['input'];
  pesoGrama?: InputMaybe<Scalars['Float']['input']>;
  status: Scalars['String']['input'];
  valorReferencia?: InputMaybe<Scalars['Float']['input']>;
};

export type CriarSubmissaoProdutoInput = {
  descricao?: InputMaybe<Scalars['String']['input']>;
  fornecedorId: Scalars['Int']['input'];
  imagemUrl?: InputMaybe<Scalars['String']['input']>;
  medida: Scalars['String']['input'];
  nomeProduto: Scalars['String']['input'];
  precoUnidade: Scalars['Float']['input'];
};

export type CriarUsuarioInput = {
  celular?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  nome: Scalars['String']['input'];
  perfis: Array<Scalars['String']['input']>;
  senha: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
};

export type DeletarCategoriaResponse = {
  __typename?: 'DeletarCategoriaResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type HealthCheck = {
  __typename?: 'HealthCheck';
  status: Scalars['String']['output'];
};

export type ListarCiclosResponse = {
  __typename?: 'ListarCiclosResponse';
  ciclos: Array<Ciclo>;
  limite: Scalars['Int']['output'];
  nextCursor?: Maybe<Scalars['String']['output']>;
  total: Scalars['Int']['output'];
};

export type LoginInput = {
  email: Scalars['String']['input'];
  senha: Scalars['String']['input'];
};

export type LogoutResponse = {
  __typename?: 'LogoutResponse';
  success: Scalars['Boolean']['output'];
};

export type Mercado = {
  __typename?: 'Mercado';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  nome: Scalars['String']['output'];
  pontosEntrega?: Maybe<Array<PontoEntrega>>;
  responsavel?: Maybe<Usuario>;
  responsavelId: Scalars['Int']['output'];
  status: Scalars['String']['output'];
  taxaAdministrativa?: Maybe<Scalars['Float']['output']>;
  tipo: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  valorMaximoCesta?: Maybe<Scalars['Float']['output']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  adicionarProdutoOferta: OfertaProduto;
  aprovarSubmissaoProduto: SubmissaoProduto;
  atualizarCategoria: CategoriaProdutos;
  atualizarCiclo: Ciclo;
  atualizarMercado: Mercado;
  atualizarPontoEntrega: PontoEntrega;
  atualizarProduto: Produto;
  atualizarProdutoComercializavel: ProdutoComercializavel;
  atualizarQuantidadeProdutoOferta: OfertaProduto;
  atualizarUsuario: Usuario;
  criarCategoria: CategoriaProdutos;
  criarCiclo: Ciclo;
  criarMercado: Mercado;
  criarOferta: Oferta;
  criarPontoEntrega: PontoEntrega;
  criarProduto: Produto;
  criarProdutoComercializavel: ProdutoComercializavel;
  criarSubmissaoProduto: SubmissaoProduto;
  criarUsuario: Usuario;
  deletarCategoria: DeletarCategoriaResponse;
  deletarCiclo: Scalars['Boolean']['output'];
  deletarMercado: Scalars['Boolean']['output'];
  deletarPontoEntrega: Scalars['Boolean']['output'];
  deletarProduto: Scalars['Boolean']['output'];
  deletarProdutoComercializavel: Scalars['Boolean']['output'];
  deletarSubmissaoProduto: Scalars['Boolean']['output'];
  removerProdutoOferta: Scalars['Boolean']['output'];
  reprovarSubmissaoProduto: SubmissaoProduto;
  sessionLogin: ActiveSession;
  sessionLogout: LogoutResponse;
};


export type MutationAdicionarProdutoOfertaArgs = {
  input: AdicionarProdutoOfertaInput;
  ofertaId: Scalars['ID']['input'];
};


export type MutationAprovarSubmissaoProdutoArgs = {
  id: Scalars['ID']['input'];
  input?: InputMaybe<AprovarSubmissaoInput>;
};


export type MutationAtualizarCategoriaArgs = {
  id: Scalars['ID']['input'];
  input: AtualizarCategoriaProdutosInput;
};


export type MutationAtualizarCicloArgs = {
  id: Scalars['ID']['input'];
  input: AtualizarCicloInput;
};


export type MutationAtualizarMercadoArgs = {
  id: Scalars['ID']['input'];
  input: AtualizarMercadoInput;
};


export type MutationAtualizarPontoEntregaArgs = {
  id: Scalars['ID']['input'];
  input: AtualizarPontoEntregaInput;
};


export type MutationAtualizarProdutoArgs = {
  id: Scalars['ID']['input'];
  input: AtualizarProdutoInput;
};


export type MutationAtualizarProdutoComercializavelArgs = {
  id: Scalars['ID']['input'];
  input: AtualizarProdutoComercializavelInput;
};


export type MutationAtualizarQuantidadeProdutoOfertaArgs = {
  input: AtualizarQuantidadeProdutoInput;
  ofertaProdutoId: Scalars['ID']['input'];
};


export type MutationAtualizarUsuarioArgs = {
  id: Scalars['ID']['input'];
  input: AtualizarUsuarioInput;
};


export type MutationCriarCategoriaArgs = {
  input: CriarCategoriaProdutosInput;
};


export type MutationCriarCicloArgs = {
  input: CriarCicloInput;
};


export type MutationCriarMercadoArgs = {
  input: CriarMercadoInput;
};


export type MutationCriarOfertaArgs = {
  input: CriarOfertaInput;
};


export type MutationCriarPontoEntregaArgs = {
  input: CriarPontoEntregaInput;
};


export type MutationCriarProdutoArgs = {
  input: CriarProdutoInput;
};


export type MutationCriarProdutoComercializavelArgs = {
  input: CriarProdutoComercializavelInput;
};


export type MutationCriarSubmissaoProdutoArgs = {
  input: CriarSubmissaoProdutoInput;
};


export type MutationCriarUsuarioArgs = {
  input: CriarUsuarioInput;
};


export type MutationDeletarCategoriaArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletarCicloArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletarMercadoArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletarPontoEntregaArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletarProdutoArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletarProdutoComercializavelArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletarSubmissaoProdutoArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoverProdutoOfertaArgs = {
  ofertaProdutoId: Scalars['ID']['input'];
};


export type MutationReprovarSubmissaoProdutoArgs = {
  id: Scalars['ID']['input'];
  motivoReprovacao: Scalars['String']['input'];
};


export type MutationSessionLoginArgs = {
  input: LoginInput;
};

export type Oferta = {
  __typename?: 'Oferta';
  ciclo?: Maybe<Ciclo>;
  cicloId: Scalars['Int']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  observacao?: Maybe<Scalars['String']['output']>;
  ofertaProdutos?: Maybe<Array<OfertaProduto>>;
  status: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
  usuario?: Maybe<Usuario>;
  usuarioId: Scalars['Int']['output'];
};

export type OfertaProduto = {
  __typename?: 'OfertaProduto';
  id: Scalars['ID']['output'];
  ofertaId: Scalars['Int']['output'];
  produto?: Maybe<Produto>;
  produtoId: Scalars['Int']['output'];
  quantidade: Scalars['Float']['output'];
  valorOferta?: Maybe<Scalars['Float']['output']>;
  valorReferencia?: Maybe<Scalars['Float']['output']>;
};

export type PontoEntrega = {
  __typename?: 'PontoEntrega';
  bairro?: Maybe<Scalars['String']['output']>;
  cep?: Maybe<Scalars['String']['output']>;
  cidade?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  endereco?: Maybe<Scalars['String']['output']>;
  estado?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  nome: Scalars['String']['output'];
  status: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type PontoEntregaInput = {
  bairro?: InputMaybe<Scalars['String']['input']>;
  cep?: InputMaybe<Scalars['String']['input']>;
  cidade?: InputMaybe<Scalars['String']['input']>;
  endereco?: InputMaybe<Scalars['String']['input']>;
  estado?: InputMaybe<Scalars['String']['input']>;
  nome: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
};

export type Produto = {
  __typename?: 'Produto';
  categoria?: Maybe<CategoriaProdutos>;
  categoriaId?: Maybe<Scalars['Int']['output']>;
  descritivo?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  medida?: Maybe<Scalars['String']['output']>;
  nome: Scalars['String']['output'];
  pesoGrama?: Maybe<Scalars['Float']['output']>;
  status: Scalars['String']['output'];
  valorReferencia?: Maybe<Scalars['Float']['output']>;
};

export type ProdutoComercializavel = {
  __typename?: 'ProdutoComercializavel';
  createdAt?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  medida: Scalars['String']['output'];
  pesoKg: Scalars['Float']['output'];
  precoBase: Scalars['Float']['output'];
  produto?: Maybe<Produto>;
  produtoId: Scalars['Int']['output'];
  status: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  buscarCategoria: CategoriaProdutos;
  buscarCiclo: Ciclo;
  buscarMercado: Mercado;
  buscarOferta: Oferta;
  buscarPontoEntrega: PontoEntrega;
  buscarProduto: Produto;
  buscarProdutoComercializavel: ProdutoComercializavel;
  buscarSubmissaoProduto: SubmissaoProduto;
  buscarUsuario: Usuario;
  healthcheck: HealthCheck;
  listarCategorias: Array<CategoriaProdutos>;
  listarCiclos: ListarCiclosResponse;
  listarMercados: Array<Mercado>;
  listarMercadosAtivos: Array<Mercado>;
  listarMercadosPorResponsavel: Array<Mercado>;
  listarOfertasPorCiclo: Array<Oferta>;
  listarOfertasPorUsuario: Array<Oferta>;
  listarPontosEntrega: Array<PontoEntrega>;
  listarPontosEntregaAtivos: Array<PontoEntrega>;
  listarProdutos: Array<Produto>;
  listarProdutosComercializaveis: Array<ProdutoComercializavel>;
  listarProdutosComercializaveisPorProduto: Array<ProdutoComercializavel>;
  listarSubmissoesPorFornecedor: Array<SubmissaoProduto>;
  listarSubmissoesPorStatus: Array<SubmissaoProduto>;
  listarSubmissoesProdutos: Array<SubmissaoProduto>;
  listarUsuarios: Array<Usuario>;
  systemInformation: SystemInformation;
};


export type QueryBuscarCategoriaArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBuscarCicloArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBuscarMercadoArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBuscarOfertaArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBuscarPontoEntregaArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBuscarProdutoArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBuscarProdutoComercializavelArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBuscarSubmissaoProdutoArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBuscarUsuarioArgs = {
  id: Scalars['ID']['input'];
};


export type QueryListarCiclosArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  limite?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryListarMercadosPorResponsavelArgs = {
  responsavelId: Scalars['Int']['input'];
};


export type QueryListarOfertasPorCicloArgs = {
  cicloId: Scalars['Int']['input'];
};


export type QueryListarOfertasPorUsuarioArgs = {
  usuarioId: Scalars['Int']['input'];
};


export type QueryListarProdutosComercializaveisPorProdutoArgs = {
  produtoId: Scalars['Int']['input'];
};


export type QueryListarSubmissoesPorFornecedorArgs = {
  fornecedorId: Scalars['Int']['input'];
};


export type QueryListarSubmissoesPorStatusArgs = {
  status: Scalars['String']['input'];
};

export type SubmissaoProduto = {
  __typename?: 'SubmissaoProduto';
  createdAt?: Maybe<Scalars['String']['output']>;
  descricao?: Maybe<Scalars['String']['output']>;
  fornecedor?: Maybe<Usuario>;
  fornecedorId: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  imagemUrl?: Maybe<Scalars['String']['output']>;
  medida: Scalars['String']['output'];
  motivoReprovacao?: Maybe<Scalars['String']['output']>;
  nomeProduto: Scalars['String']['output'];
  precoUnidade: Scalars['Float']['output'];
  status: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type SystemInformation = {
  __typename?: 'SystemInformation';
  version: Scalars['String']['output'];
};

export type Usuario = {
  __typename?: 'Usuario';
  agencia?: Maybe<Scalars['String']['output']>;
  banco?: Maybe<Scalars['String']['output']>;
  celular?: Maybe<Scalars['String']['output']>;
  chavePix?: Maybe<Scalars['String']['output']>;
  cientepolitica?: Maybe<Scalars['String']['output']>;
  conta?: Maybe<Scalars['String']['output']>;
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


export type BuscarUsuarioQuery = { __typename?: 'Query', buscarUsuario: { __typename?: 'Usuario', id: string, nome: string, nomeoficial?: string | null, email: string, celular?: string | null, banco?: string | null, agencia?: string | null, conta?: string | null, chavePix?: string | null, cientepolitica?: string | null, status: string, perfis: Array<string> } };

export type ListarCategoriasQueryVariables = Exact<{ [key: string]: never; }>;


export type ListarCategoriasQuery = { __typename?: 'Query', listarCategorias: Array<{ __typename?: 'CategoriaProdutos', id: string, nome: string, status: string, observacao?: string | null }> };

export type BuscarCategoriaQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type BuscarCategoriaQuery = { __typename?: 'Query', buscarCategoria: { __typename?: 'CategoriaProdutos', id: string, nome: string, status: string, observacao?: string | null } };

export type CriarCategoriaMutationVariables = Exact<{
  input: CriarCategoriaProdutosInput;
}>;


export type CriarCategoriaMutation = { __typename?: 'Mutation', criarCategoria: { __typename?: 'CategoriaProdutos', id: string, nome: string, status: string, observacao?: string | null } };

export type AtualizarCategoriaMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: AtualizarCategoriaProdutosInput;
}>;


export type AtualizarCategoriaMutation = { __typename?: 'Mutation', atualizarCategoria: { __typename?: 'CategoriaProdutos', id: string, nome: string, status: string, observacao?: string | null } };

export type DeletarCategoriaMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeletarCategoriaMutation = { __typename?: 'Mutation', deletarCategoria: { __typename?: 'DeletarCategoriaResponse', success: boolean, message: string } };

export type ListarProdutosQueryVariables = Exact<{ [key: string]: never; }>;


export type ListarProdutosQuery = { __typename?: 'Query', listarProdutos: Array<{ __typename?: 'Produto', id: string, nome: string, medida?: string | null, pesoGrama?: number | null, valorReferencia?: number | null, status: string, descritivo?: string | null, categoriaId?: number | null, categoria?: { __typename?: 'CategoriaProdutos', id: string, nome: string } | null }> };

export type BuscarProdutoQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type BuscarProdutoQuery = { __typename?: 'Query', buscarProduto: { __typename?: 'Produto', id: string, nome: string, medida?: string | null, pesoGrama?: number | null, valorReferencia?: number | null, status: string, descritivo?: string | null, categoriaId?: number | null, categoria?: { __typename?: 'CategoriaProdutos', id: string, nome: string } | null } };

export type CriarProdutoMutationVariables = Exact<{
  input: CriarProdutoInput;
}>;


export type CriarProdutoMutation = { __typename?: 'Mutation', criarProduto: { __typename?: 'Produto', id: string, nome: string, medida?: string | null, pesoGrama?: number | null, valorReferencia?: number | null, status: string, descritivo?: string | null, categoriaId?: number | null, categoria?: { __typename?: 'CategoriaProdutos', id: string, nome: string } | null } };

export type AtualizarProdutoMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: AtualizarProdutoInput;
}>;


export type AtualizarProdutoMutation = { __typename?: 'Mutation', atualizarProduto: { __typename?: 'Produto', id: string, nome: string, medida?: string | null, pesoGrama?: number | null, valorReferencia?: number | null, status: string, descritivo?: string | null, categoriaId?: number | null, categoria?: { __typename?: 'CategoriaProdutos', id: string, nome: string } | null } };

export type DeletarProdutoMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeletarProdutoMutation = { __typename?: 'Mutation', deletarProduto: boolean };

export type ListarProdutosComercializaveisQueryVariables = Exact<{ [key: string]: never; }>;


export type ListarProdutosComercializaveisQuery = { __typename?: 'Query', listarProdutosComercializaveis: Array<{ __typename?: 'ProdutoComercializavel', id: string, produtoId: number, medida: string, pesoKg: number, precoBase: number, status: string, createdAt?: string | null, updatedAt?: string | null, produto?: { __typename?: 'Produto', id: string, nome: string } | null }> };

export type BuscarProdutoComercializavelQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type BuscarProdutoComercializavelQuery = { __typename?: 'Query', buscarProdutoComercializavel: { __typename?: 'ProdutoComercializavel', id: string, produtoId: number, medida: string, pesoKg: number, precoBase: number, status: string, createdAt?: string | null, updatedAt?: string | null, produto?: { __typename?: 'Produto', id: string, nome: string } | null } };

export type ListarProdutosComercializaveisPorProdutoQueryVariables = Exact<{
  produtoId: Scalars['Int']['input'];
}>;


export type ListarProdutosComercializaveisPorProdutoQuery = { __typename?: 'Query', listarProdutosComercializaveisPorProduto: Array<{ __typename?: 'ProdutoComercializavel', id: string, produtoId: number, medida: string, pesoKg: number, precoBase: number, status: string }> };

export type CriarProdutoComercializavelMutationVariables = Exact<{
  input: CriarProdutoComercializavelInput;
}>;


export type CriarProdutoComercializavelMutation = { __typename?: 'Mutation', criarProdutoComercializavel: { __typename?: 'ProdutoComercializavel', id: string, produtoId: number, medida: string, pesoKg: number, precoBase: number, status: string, produto?: { __typename?: 'Produto', id: string, nome: string } | null } };

export type AtualizarProdutoComercializavelMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: AtualizarProdutoComercializavelInput;
}>;


export type AtualizarProdutoComercializavelMutation = { __typename?: 'Mutation', atualizarProdutoComercializavel: { __typename?: 'ProdutoComercializavel', id: string, produtoId: number, medida: string, pesoKg: number, precoBase: number, status: string, produto?: { __typename?: 'Produto', id: string, nome: string } | null } };

export type DeletarProdutoComercializavelMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeletarProdutoComercializavelMutation = { __typename?: 'Mutation', deletarProdutoComercializavel: boolean };

export type ListarSubmissoesProdutosQueryVariables = Exact<{ [key: string]: never; }>;


export type ListarSubmissoesProdutosQuery = { __typename?: 'Query', listarSubmissoesProdutos: Array<{ __typename?: 'SubmissaoProduto', id: string, fornecedorId: number, nomeProduto: string, descricao?: string | null, imagemUrl?: string | null, precoUnidade: number, medida: string, status: string, motivoReprovacao?: string | null, createdAt?: string | null, updatedAt?: string | null, fornecedor?: { __typename?: 'Usuario', id: string, nome: string } | null }> };

export type BuscarSubmissaoProdutoQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type BuscarSubmissaoProdutoQuery = { __typename?: 'Query', buscarSubmissaoProduto: { __typename?: 'SubmissaoProduto', id: string, fornecedorId: number, nomeProduto: string, descricao?: string | null, imagemUrl?: string | null, precoUnidade: number, medida: string, status: string, motivoReprovacao?: string | null, createdAt?: string | null, updatedAt?: string | null, fornecedor?: { __typename?: 'Usuario', id: string, nome: string } | null } };

export type ListarSubmissoesPorStatusQueryVariables = Exact<{
  status: Scalars['String']['input'];
}>;


export type ListarSubmissoesPorStatusQuery = { __typename?: 'Query', listarSubmissoesPorStatus: Array<{ __typename?: 'SubmissaoProduto', id: string, fornecedorId: number, nomeProduto: string, descricao?: string | null, imagemUrl?: string | null, precoUnidade: number, medida: string, status: string, motivoReprovacao?: string | null, createdAt?: string | null, updatedAt?: string | null, fornecedor?: { __typename?: 'Usuario', id: string, nome: string } | null }> };

export type CriarSubmissaoProdutoMutationVariables = Exact<{
  input: CriarSubmissaoProdutoInput;
}>;


export type CriarSubmissaoProdutoMutation = { __typename?: 'Mutation', criarSubmissaoProduto: { __typename?: 'SubmissaoProduto', id: string, nomeProduto: string, precoUnidade: number, medida: string, status: string } };

export type AprovarSubmissaoProdutoMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input?: InputMaybe<AprovarSubmissaoInput>;
}>;


export type AprovarSubmissaoProdutoMutation = { __typename?: 'Mutation', aprovarSubmissaoProduto: { __typename?: 'SubmissaoProduto', id: string, status: string } };

export type ReprovarSubmissaoProdutoMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  motivoReprovacao: Scalars['String']['input'];
}>;


export type ReprovarSubmissaoProdutoMutation = { __typename?: 'Mutation', reprovarSubmissaoProduto: { __typename?: 'SubmissaoProduto', id: string, status: string, motivoReprovacao?: string | null } };

export type DeletarSubmissaoProdutoMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeletarSubmissaoProdutoMutation = { __typename?: 'Mutation', deletarSubmissaoProduto: boolean };

export type ListarCiclosQueryVariables = Exact<{
  limite?: InputMaybe<Scalars['Int']['input']>;
  cursor?: InputMaybe<Scalars['String']['input']>;
}>;


export type ListarCiclosQuery = { __typename?: 'Query', listarCiclos: { __typename?: 'ListarCiclosResponse', total: number, limite: number, nextCursor?: string | null, ciclos: Array<{ __typename?: 'Ciclo', id: string, nome: string, ofertaInicio: string, ofertaFim: string, itensAdicionaisInicio?: string | null, itensAdicionaisFim?: string | null, retiradaConsumidorInicio?: string | null, retiradaConsumidorFim?: string | null, observacao?: string | null, status: string, pontoEntregaId: number, createdAt?: string | null, updatedAt?: string | null, pontoEntrega?: { __typename?: 'PontoEntrega', id: string, nome: string } | null }> } };

export type BuscarCicloQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type BuscarCicloQuery = { __typename?: 'Query', buscarCiclo: { __typename?: 'Ciclo', id: string, nome: string, ofertaInicio: string, ofertaFim: string, itensAdicionaisInicio?: string | null, itensAdicionaisFim?: string | null, retiradaConsumidorInicio?: string | null, retiradaConsumidorFim?: string | null, observacao?: string | null, status: string, pontoEntregaId: number, createdAt?: string | null, updatedAt?: string | null, pontoEntrega?: { __typename?: 'PontoEntrega', id: string, nome: string } | null } };

export type CriarCicloMutationVariables = Exact<{
  input: CriarCicloInput;
}>;


export type CriarCicloMutation = { __typename?: 'Mutation', criarCiclo: { __typename?: 'Ciclo', id: string, nome: string, status: string } };

export type AtualizarCicloMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: AtualizarCicloInput;
}>;


export type AtualizarCicloMutation = { __typename?: 'Mutation', atualizarCiclo: { __typename?: 'Ciclo', id: string, nome: string, status: string } };

export type DeletarCicloMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeletarCicloMutation = { __typename?: 'Mutation', deletarCiclo: boolean };

export type BuscarOfertaQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type BuscarOfertaQuery = { __typename?: 'Query', buscarOferta: { __typename?: 'Oferta', id: string, cicloId: number, usuarioId: number, status: string, observacao?: string | null, createdAt?: string | null, updatedAt?: string | null, ciclo?: { __typename?: 'Ciclo', id: string, nome: string, ofertaInicio: string, ofertaFim: string, status: string } | null, usuario?: { __typename?: 'Usuario', id: string, nome: string } | null, ofertaProdutos?: Array<{ __typename?: 'OfertaProduto', id: string, ofertaId: number, produtoId: number, quantidade: number, valorReferencia?: number | null, valorOferta?: number | null, produto?: { __typename?: 'Produto', id: string, nome: string, medida?: string | null, valorReferencia?: number | null } | null }> | null } };

export type ListarOfertasPorCicloQueryVariables = Exact<{
  cicloId: Scalars['Int']['input'];
}>;


export type ListarOfertasPorCicloQuery = { __typename?: 'Query', listarOfertasPorCiclo: Array<{ __typename?: 'Oferta', id: string, cicloId: number, usuarioId: number, status: string, observacao?: string | null, createdAt?: string | null, usuario?: { __typename?: 'Usuario', id: string, nome: string } | null, ofertaProdutos?: Array<{ __typename?: 'OfertaProduto', id: string, produtoId: number, quantidade: number, valorOferta?: number | null, produto?: { __typename?: 'Produto', id: string, nome: string } | null }> | null }> };

export type ListarOfertasPorUsuarioQueryVariables = Exact<{
  usuarioId: Scalars['Int']['input'];
}>;


export type ListarOfertasPorUsuarioQuery = { __typename?: 'Query', listarOfertasPorUsuario: Array<{ __typename?: 'Oferta', id: string, cicloId: number, usuarioId: number, status: string, observacao?: string | null, createdAt?: string | null, ciclo?: { __typename?: 'Ciclo', id: string, nome: string, ofertaInicio: string, ofertaFim: string, status: string } | null, ofertaProdutos?: Array<{ __typename?: 'OfertaProduto', id: string, produtoId: number, quantidade: number, valorOferta?: number | null, produto?: { __typename?: 'Produto', id: string, nome: string } | null }> | null }> };

export type CriarOfertaMutationVariables = Exact<{
  input: CriarOfertaInput;
}>;


export type CriarOfertaMutation = { __typename?: 'Mutation', criarOferta: { __typename?: 'Oferta', id: string, cicloId: number, usuarioId: number, status: string, observacao?: string | null } };

export type AdicionarProdutoOfertaMutationVariables = Exact<{
  ofertaId: Scalars['ID']['input'];
  input: AdicionarProdutoOfertaInput;
}>;


export type AdicionarProdutoOfertaMutation = { __typename?: 'Mutation', adicionarProdutoOferta: { __typename?: 'OfertaProduto', id: string, ofertaId: number, produtoId: number, quantidade: number, valorReferencia?: number | null, valorOferta?: number | null, produto?: { __typename?: 'Produto', id: string, nome: string, medida?: string | null, valorReferencia?: number | null } | null } };

export type AtualizarQuantidadeProdutoOfertaMutationVariables = Exact<{
  ofertaProdutoId: Scalars['ID']['input'];
  input: AtualizarQuantidadeProdutoInput;
}>;


export type AtualizarQuantidadeProdutoOfertaMutation = { __typename?: 'Mutation', atualizarQuantidadeProdutoOferta: { __typename?: 'OfertaProduto', id: string, quantidade: number, valorOferta?: number | null } };

export type RemoverProdutoOfertaMutationVariables = Exact<{
  ofertaProdutoId: Scalars['ID']['input'];
}>;


export type RemoverProdutoOfertaMutation = { __typename?: 'Mutation', removerProdutoOferta: boolean };

export type ListarPontosEntregaQueryVariables = Exact<{ [key: string]: never; }>;


export type ListarPontosEntregaQuery = { __typename?: 'Query', listarPontosEntrega: Array<{ __typename?: 'PontoEntrega', id: string, nome: string, endereco?: string | null, bairro?: string | null, cidade?: string | null, estado?: string | null, cep?: string | null, status: string, createdAt?: string | null, updatedAt?: string | null }> };

export type ListarPontosEntregaAtivosQueryVariables = Exact<{ [key: string]: never; }>;


export type ListarPontosEntregaAtivosQuery = { __typename?: 'Query', listarPontosEntregaAtivos: Array<{ __typename?: 'PontoEntrega', id: string, nome: string, endereco?: string | null, bairro?: string | null, cidade?: string | null, estado?: string | null, cep?: string | null, status: string }> };

export type BuscarPontoEntregaQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type BuscarPontoEntregaQuery = { __typename?: 'Query', buscarPontoEntrega: { __typename?: 'PontoEntrega', id: string, nome: string, endereco?: string | null, bairro?: string | null, cidade?: string | null, estado?: string | null, cep?: string | null, status: string, createdAt?: string | null, updatedAt?: string | null } };

export type CriarPontoEntregaMutationVariables = Exact<{
  input: CriarPontoEntregaInput;
}>;


export type CriarPontoEntregaMutation = { __typename?: 'Mutation', criarPontoEntrega: { __typename?: 'PontoEntrega', id: string, nome: string, endereco?: string | null, bairro?: string | null, cidade?: string | null, estado?: string | null, cep?: string | null, status: string } };

export type AtualizarPontoEntregaMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: AtualizarPontoEntregaInput;
}>;


export type AtualizarPontoEntregaMutation = { __typename?: 'Mutation', atualizarPontoEntrega: { __typename?: 'PontoEntrega', id: string, nome: string, endereco?: string | null, bairro?: string | null, cidade?: string | null, estado?: string | null, cep?: string | null, status: string } };

export type DeletarPontoEntregaMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeletarPontoEntregaMutation = { __typename?: 'Mutation', deletarPontoEntrega: boolean };

export type ListarMercadosQueryVariables = Exact<{ [key: string]: never; }>;


export type ListarMercadosQuery = { __typename?: 'Query', listarMercados: Array<{ __typename?: 'Mercado', id: string, nome: string, tipo: string, responsavelId: number, taxaAdministrativa?: number | null, valorMaximoCesta?: number | null, status: string, createdAt: string, updatedAt: string, responsavel?: { __typename?: 'Usuario', id: string, nome: string, email: string } | null, pontosEntrega?: Array<{ __typename?: 'PontoEntrega', id: string, nome: string, endereco?: string | null, bairro?: string | null, cidade?: string | null, estado?: string | null, cep?: string | null, status: string }> | null }> };

export type BuscarMercadoQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type BuscarMercadoQuery = { __typename?: 'Query', buscarMercado: { __typename?: 'Mercado', id: string, nome: string, tipo: string, responsavelId: number, taxaAdministrativa?: number | null, valorMaximoCesta?: number | null, status: string, createdAt: string, updatedAt: string, responsavel?: { __typename?: 'Usuario', id: string, nome: string, email: string } | null, pontosEntrega?: Array<{ __typename?: 'PontoEntrega', id: string, nome: string, endereco?: string | null, bairro?: string | null, cidade?: string | null, estado?: string | null, cep?: string | null, status: string }> | null } };

export type ListarMercadosAtivosQueryVariables = Exact<{ [key: string]: never; }>;


export type ListarMercadosAtivosQuery = { __typename?: 'Query', listarMercadosAtivos: Array<{ __typename?: 'Mercado', id: string, nome: string, tipo: string, responsavelId: number, taxaAdministrativa?: number | null, valorMaximoCesta?: number | null, status: string, responsavel?: { __typename?: 'Usuario', id: string, nome: string, email: string } | null, pontosEntrega?: Array<{ __typename?: 'PontoEntrega', id: string, nome: string }> | null }> };

export type ListarMercadosPorResponsavelQueryVariables = Exact<{
  responsavelId: Scalars['Int']['input'];
}>;


export type ListarMercadosPorResponsavelQuery = { __typename?: 'Query', listarMercadosPorResponsavel: Array<{ __typename?: 'Mercado', id: string, nome: string, tipo: string, responsavelId: number, taxaAdministrativa?: number | null, valorMaximoCesta?: number | null, status: string, responsavel?: { __typename?: 'Usuario', id: string, nome: string, email: string } | null, pontosEntrega?: Array<{ __typename?: 'PontoEntrega', id: string, nome: string }> | null }> };

export type CriarMercadoMutationVariables = Exact<{
  input: CriarMercadoInput;
}>;


export type CriarMercadoMutation = { __typename?: 'Mutation', criarMercado: { __typename?: 'Mercado', id: string, nome: string, tipo: string, responsavelId: number, taxaAdministrativa?: number | null, valorMaximoCesta?: number | null, status: string, pontosEntrega?: Array<{ __typename?: 'PontoEntrega', id: string, nome: string, status: string }> | null } };

export type AtualizarMercadoMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: AtualizarMercadoInput;
}>;


export type AtualizarMercadoMutation = { __typename?: 'Mutation', atualizarMercado: { __typename?: 'Mercado', id: string, nome: string, tipo: string, responsavelId: number, taxaAdministrativa?: number | null, valorMaximoCesta?: number | null, status: string } };

export type DeletarMercadoMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeletarMercadoMutation = { __typename?: 'Mutation', deletarMercado: boolean };


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
    banco
    agencia
    conta
    chavePix
    cientepolitica
    status
    perfis
  }
}
    `;
export const ListarCategoriasDocument = gql`
    query ListarCategorias {
  listarCategorias {
    id
    nome
    status
    observacao
  }
}
    `;
export const BuscarCategoriaDocument = gql`
    query BuscarCategoria($id: ID!) {
  buscarCategoria(id: $id) {
    id
    nome
    status
    observacao
  }
}
    `;
export const CriarCategoriaDocument = gql`
    mutation CriarCategoria($input: CriarCategoriaProdutosInput!) {
  criarCategoria(input: $input) {
    id
    nome
    status
    observacao
  }
}
    `;
export const AtualizarCategoriaDocument = gql`
    mutation AtualizarCategoria($id: ID!, $input: AtualizarCategoriaProdutosInput!) {
  atualizarCategoria(id: $id, input: $input) {
    id
    nome
    status
    observacao
  }
}
    `;
export const DeletarCategoriaDocument = gql`
    mutation DeletarCategoria($id: ID!) {
  deletarCategoria(id: $id) {
    success
    message
  }
}
    `;
export const ListarProdutosDocument = gql`
    query ListarProdutos {
  listarProdutos {
    id
    nome
    medida
    pesoGrama
    valorReferencia
    status
    descritivo
    categoriaId
    categoria {
      id
      nome
    }
  }
}
    `;
export const BuscarProdutoDocument = gql`
    query BuscarProduto($id: ID!) {
  buscarProduto(id: $id) {
    id
    nome
    medida
    pesoGrama
    valorReferencia
    status
    descritivo
    categoriaId
    categoria {
      id
      nome
    }
  }
}
    `;
export const CriarProdutoDocument = gql`
    mutation CriarProduto($input: CriarProdutoInput!) {
  criarProduto(input: $input) {
    id
    nome
    medida
    pesoGrama
    valorReferencia
    status
    descritivo
    categoriaId
    categoria {
      id
      nome
    }
  }
}
    `;
export const AtualizarProdutoDocument = gql`
    mutation AtualizarProduto($id: ID!, $input: AtualizarProdutoInput!) {
  atualizarProduto(id: $id, input: $input) {
    id
    nome
    medida
    pesoGrama
    valorReferencia
    status
    descritivo
    categoriaId
    categoria {
      id
      nome
    }
  }
}
    `;
export const DeletarProdutoDocument = gql`
    mutation DeletarProduto($id: ID!) {
  deletarProduto(id: $id)
}
    `;
export const ListarProdutosComercializaveisDocument = gql`
    query ListarProdutosComercializaveis {
  listarProdutosComercializaveis {
    id
    produtoId
    produto {
      id
      nome
    }
    medida
    pesoKg
    precoBase
    status
    createdAt
    updatedAt
  }
}
    `;
export const BuscarProdutoComercializavelDocument = gql`
    query BuscarProdutoComercializavel($id: ID!) {
  buscarProdutoComercializavel(id: $id) {
    id
    produtoId
    produto {
      id
      nome
    }
    medida
    pesoKg
    precoBase
    status
    createdAt
    updatedAt
  }
}
    `;
export const ListarProdutosComercializaveisPorProdutoDocument = gql`
    query ListarProdutosComercializaveisPorProduto($produtoId: Int!) {
  listarProdutosComercializaveisPorProduto(produtoId: $produtoId) {
    id
    produtoId
    medida
    pesoKg
    precoBase
    status
  }
}
    `;
export const CriarProdutoComercializavelDocument = gql`
    mutation CriarProdutoComercializavel($input: CriarProdutoComercializavelInput!) {
  criarProdutoComercializavel(input: $input) {
    id
    produtoId
    produto {
      id
      nome
    }
    medida
    pesoKg
    precoBase
    status
  }
}
    `;
export const AtualizarProdutoComercializavelDocument = gql`
    mutation AtualizarProdutoComercializavel($id: ID!, $input: AtualizarProdutoComercializavelInput!) {
  atualizarProdutoComercializavel(id: $id, input: $input) {
    id
    produtoId
    produto {
      id
      nome
    }
    medida
    pesoKg
    precoBase
    status
  }
}
    `;
export const DeletarProdutoComercializavelDocument = gql`
    mutation DeletarProdutoComercializavel($id: ID!) {
  deletarProdutoComercializavel(id: $id)
}
    `;
export const ListarSubmissoesProdutosDocument = gql`
    query ListarSubmissoesProdutos {
  listarSubmissoesProdutos {
    id
    fornecedorId
    fornecedor {
      id
      nome
    }
    nomeProduto
    descricao
    imagemUrl
    precoUnidade
    medida
    status
    motivoReprovacao
    createdAt
    updatedAt
  }
}
    `;
export const BuscarSubmissaoProdutoDocument = gql`
    query BuscarSubmissaoProduto($id: ID!) {
  buscarSubmissaoProduto(id: $id) {
    id
    fornecedorId
    fornecedor {
      id
      nome
    }
    nomeProduto
    descricao
    imagemUrl
    precoUnidade
    medida
    status
    motivoReprovacao
    createdAt
    updatedAt
  }
}
    `;
export const ListarSubmissoesPorStatusDocument = gql`
    query ListarSubmissoesPorStatus($status: String!) {
  listarSubmissoesPorStatus(status: $status) {
    id
    fornecedorId
    fornecedor {
      id
      nome
    }
    nomeProduto
    descricao
    imagemUrl
    precoUnidade
    medida
    status
    motivoReprovacao
    createdAt
    updatedAt
  }
}
    `;
export const CriarSubmissaoProdutoDocument = gql`
    mutation CriarSubmissaoProduto($input: CriarSubmissaoProdutoInput!) {
  criarSubmissaoProduto(input: $input) {
    id
    nomeProduto
    precoUnidade
    medida
    status
  }
}
    `;
export const AprovarSubmissaoProdutoDocument = gql`
    mutation AprovarSubmissaoProduto($id: ID!, $input: AprovarSubmissaoInput) {
  aprovarSubmissaoProduto(id: $id, input: $input) {
    id
    status
  }
}
    `;
export const ReprovarSubmissaoProdutoDocument = gql`
    mutation ReprovarSubmissaoProduto($id: ID!, $motivoReprovacao: String!) {
  reprovarSubmissaoProduto(id: $id, motivoReprovacao: $motivoReprovacao) {
    id
    status
    motivoReprovacao
  }
}
    `;
export const DeletarSubmissaoProdutoDocument = gql`
    mutation DeletarSubmissaoProduto($id: ID!) {
  deletarSubmissaoProduto(id: $id)
}
    `;
export const ListarCiclosDocument = gql`
    query ListarCiclos($limite: Int, $cursor: String) {
  listarCiclos(limite: $limite, cursor: $cursor) {
    total
    ciclos {
      id
      nome
      ofertaInicio
      ofertaFim
      itensAdicionaisInicio
      itensAdicionaisFim
      retiradaConsumidorInicio
      retiradaConsumidorFim
      observacao
      status
      pontoEntregaId
      pontoEntrega {
        id
        nome
      }
      createdAt
      updatedAt
    }
    limite
    nextCursor
  }
}
    `;
export const BuscarCicloDocument = gql`
    query BuscarCiclo($id: ID!) {
  buscarCiclo(id: $id) {
    id
    nome
    ofertaInicio
    ofertaFim
    itensAdicionaisInicio
    itensAdicionaisFim
    retiradaConsumidorInicio
    retiradaConsumidorFim
    observacao
    status
    pontoEntregaId
    pontoEntrega {
      id
      nome
    }
    createdAt
    updatedAt
  }
}
    `;
export const CriarCicloDocument = gql`
    mutation CriarCiclo($input: CriarCicloInput!) {
  criarCiclo(input: $input) {
    id
    nome
    status
  }
}
    `;
export const AtualizarCicloDocument = gql`
    mutation AtualizarCiclo($id: ID!, $input: AtualizarCicloInput!) {
  atualizarCiclo(id: $id, input: $input) {
    id
    nome
    status
  }
}
    `;
export const DeletarCicloDocument = gql`
    mutation DeletarCiclo($id: ID!) {
  deletarCiclo(id: $id)
}
    `;
export const BuscarOfertaDocument = gql`
    query BuscarOferta($id: ID!) {
  buscarOferta(id: $id) {
    id
    cicloId
    ciclo {
      id
      nome
      ofertaInicio
      ofertaFim
      status
    }
    usuarioId
    usuario {
      id
      nome
    }
    status
    observacao
    ofertaProdutos {
      id
      ofertaId
      produtoId
      produto {
        id
        nome
        medida
        valorReferencia
      }
      quantidade
      valorReferencia
      valorOferta
    }
    createdAt
    updatedAt
  }
}
    `;
export const ListarOfertasPorCicloDocument = gql`
    query ListarOfertasPorCiclo($cicloId: Int!) {
  listarOfertasPorCiclo(cicloId: $cicloId) {
    id
    cicloId
    usuarioId
    usuario {
      id
      nome
    }
    status
    observacao
    ofertaProdutos {
      id
      produtoId
      produto {
        id
        nome
      }
      quantidade
      valorOferta
    }
    createdAt
  }
}
    `;
export const ListarOfertasPorUsuarioDocument = gql`
    query ListarOfertasPorUsuario($usuarioId: Int!) {
  listarOfertasPorUsuario(usuarioId: $usuarioId) {
    id
    cicloId
    ciclo {
      id
      nome
      ofertaInicio
      ofertaFim
      status
    }
    usuarioId
    status
    observacao
    ofertaProdutos {
      id
      produtoId
      produto {
        id
        nome
      }
      quantidade
      valorOferta
    }
    createdAt
  }
}
    `;
export const CriarOfertaDocument = gql`
    mutation CriarOferta($input: CriarOfertaInput!) {
  criarOferta(input: $input) {
    id
    cicloId
    usuarioId
    status
    observacao
  }
}
    `;
export const AdicionarProdutoOfertaDocument = gql`
    mutation AdicionarProdutoOferta($ofertaId: ID!, $input: AdicionarProdutoOfertaInput!) {
  adicionarProdutoOferta(ofertaId: $ofertaId, input: $input) {
    id
    ofertaId
    produtoId
    produto {
      id
      nome
      medida
      valorReferencia
    }
    quantidade
    valorReferencia
    valorOferta
  }
}
    `;
export const AtualizarQuantidadeProdutoOfertaDocument = gql`
    mutation AtualizarQuantidadeProdutoOferta($ofertaProdutoId: ID!, $input: AtualizarQuantidadeProdutoInput!) {
  atualizarQuantidadeProdutoOferta(
    ofertaProdutoId: $ofertaProdutoId
    input: $input
  ) {
    id
    quantidade
    valorOferta
  }
}
    `;
export const RemoverProdutoOfertaDocument = gql`
    mutation RemoverProdutoOferta($ofertaProdutoId: ID!) {
  removerProdutoOferta(ofertaProdutoId: $ofertaProdutoId)
}
    `;
export const ListarPontosEntregaDocument = gql`
    query ListarPontosEntrega {
  listarPontosEntrega {
    id
    nome
    endereco
    bairro
    cidade
    estado
    cep
    status
    createdAt
    updatedAt
  }
}
    `;
export const ListarPontosEntregaAtivosDocument = gql`
    query ListarPontosEntregaAtivos {
  listarPontosEntregaAtivos {
    id
    nome
    endereco
    bairro
    cidade
    estado
    cep
    status
  }
}
    `;
export const BuscarPontoEntregaDocument = gql`
    query BuscarPontoEntrega($id: ID!) {
  buscarPontoEntrega(id: $id) {
    id
    nome
    endereco
    bairro
    cidade
    estado
    cep
    status
    createdAt
    updatedAt
  }
}
    `;
export const CriarPontoEntregaDocument = gql`
    mutation CriarPontoEntrega($input: CriarPontoEntregaInput!) {
  criarPontoEntrega(input: $input) {
    id
    nome
    endereco
    bairro
    cidade
    estado
    cep
    status
  }
}
    `;
export const AtualizarPontoEntregaDocument = gql`
    mutation AtualizarPontoEntrega($id: ID!, $input: AtualizarPontoEntregaInput!) {
  atualizarPontoEntrega(id: $id, input: $input) {
    id
    nome
    endereco
    bairro
    cidade
    estado
    cep
    status
  }
}
    `;
export const DeletarPontoEntregaDocument = gql`
    mutation DeletarPontoEntrega($id: ID!) {
  deletarPontoEntrega(id: $id)
}
    `;
export const ListarMercadosDocument = gql`
    query ListarMercados {
  listarMercados {
    id
    nome
    tipo
    responsavelId
    responsavel {
      id
      nome
      email
    }
    taxaAdministrativa
    valorMaximoCesta
    status
    pontosEntrega {
      id
      nome
      endereco
      bairro
      cidade
      estado
      cep
      status
    }
    createdAt
    updatedAt
  }
}
    `;
export const BuscarMercadoDocument = gql`
    query BuscarMercado($id: ID!) {
  buscarMercado(id: $id) {
    id
    nome
    tipo
    responsavelId
    responsavel {
      id
      nome
      email
    }
    taxaAdministrativa
    valorMaximoCesta
    status
    pontosEntrega {
      id
      nome
      endereco
      bairro
      cidade
      estado
      cep
      status
    }
    createdAt
    updatedAt
  }
}
    `;
export const ListarMercadosAtivosDocument = gql`
    query ListarMercadosAtivos {
  listarMercadosAtivos {
    id
    nome
    tipo
    responsavelId
    responsavel {
      id
      nome
      email
    }
    taxaAdministrativa
    valorMaximoCesta
    status
    pontosEntrega {
      id
      nome
    }
  }
}
    `;
export const ListarMercadosPorResponsavelDocument = gql`
    query ListarMercadosPorResponsavel($responsavelId: Int!) {
  listarMercadosPorResponsavel(responsavelId: $responsavelId) {
    id
    nome
    tipo
    responsavelId
    responsavel {
      id
      nome
      email
    }
    taxaAdministrativa
    valorMaximoCesta
    status
    pontosEntrega {
      id
      nome
    }
  }
}
    `;
export const CriarMercadoDocument = gql`
    mutation CriarMercado($input: CriarMercadoInput!) {
  criarMercado(input: $input) {
    id
    nome
    tipo
    responsavelId
    taxaAdministrativa
    valorMaximoCesta
    status
    pontosEntrega {
      id
      nome
      status
    }
  }
}
    `;
export const AtualizarMercadoDocument = gql`
    mutation AtualizarMercado($id: ID!, $input: AtualizarMercadoInput!) {
  atualizarMercado(id: $id, input: $input) {
    id
    nome
    tipo
    responsavelId
    taxaAdministrativa
    valorMaximoCesta
    status
  }
}
    `;
export const DeletarMercadoDocument = gql`
    mutation DeletarMercado($id: ID!) {
  deletarMercado(id: $id)
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
    },
    ListarCategorias(variables?: ListarCategoriasQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ListarCategoriasQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ListarCategoriasQuery>({ document: ListarCategoriasDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ListarCategorias', 'query', variables);
    },
    BuscarCategoria(variables: BuscarCategoriaQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<BuscarCategoriaQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<BuscarCategoriaQuery>({ document: BuscarCategoriaDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'BuscarCategoria', 'query', variables);
    },
    CriarCategoria(variables: CriarCategoriaMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CriarCategoriaMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CriarCategoriaMutation>({ document: CriarCategoriaDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CriarCategoria', 'mutation', variables);
    },
    AtualizarCategoria(variables: AtualizarCategoriaMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AtualizarCategoriaMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AtualizarCategoriaMutation>({ document: AtualizarCategoriaDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'AtualizarCategoria', 'mutation', variables);
    },
    DeletarCategoria(variables: DeletarCategoriaMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeletarCategoriaMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeletarCategoriaMutation>({ document: DeletarCategoriaDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeletarCategoria', 'mutation', variables);
    },
    ListarProdutos(variables?: ListarProdutosQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ListarProdutosQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ListarProdutosQuery>({ document: ListarProdutosDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ListarProdutos', 'query', variables);
    },
    BuscarProduto(variables: BuscarProdutoQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<BuscarProdutoQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<BuscarProdutoQuery>({ document: BuscarProdutoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'BuscarProduto', 'query', variables);
    },
    CriarProduto(variables: CriarProdutoMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CriarProdutoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CriarProdutoMutation>({ document: CriarProdutoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CriarProduto', 'mutation', variables);
    },
    AtualizarProduto(variables: AtualizarProdutoMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AtualizarProdutoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AtualizarProdutoMutation>({ document: AtualizarProdutoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'AtualizarProduto', 'mutation', variables);
    },
    DeletarProduto(variables: DeletarProdutoMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeletarProdutoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeletarProdutoMutation>({ document: DeletarProdutoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeletarProduto', 'mutation', variables);
    },
    ListarProdutosComercializaveis(variables?: ListarProdutosComercializaveisQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ListarProdutosComercializaveisQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ListarProdutosComercializaveisQuery>({ document: ListarProdutosComercializaveisDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ListarProdutosComercializaveis', 'query', variables);
    },
    BuscarProdutoComercializavel(variables: BuscarProdutoComercializavelQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<BuscarProdutoComercializavelQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<BuscarProdutoComercializavelQuery>({ document: BuscarProdutoComercializavelDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'BuscarProdutoComercializavel', 'query', variables);
    },
    ListarProdutosComercializaveisPorProduto(variables: ListarProdutosComercializaveisPorProdutoQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ListarProdutosComercializaveisPorProdutoQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ListarProdutosComercializaveisPorProdutoQuery>({ document: ListarProdutosComercializaveisPorProdutoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ListarProdutosComercializaveisPorProduto', 'query', variables);
    },
    CriarProdutoComercializavel(variables: CriarProdutoComercializavelMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CriarProdutoComercializavelMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CriarProdutoComercializavelMutation>({ document: CriarProdutoComercializavelDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CriarProdutoComercializavel', 'mutation', variables);
    },
    AtualizarProdutoComercializavel(variables: AtualizarProdutoComercializavelMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AtualizarProdutoComercializavelMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AtualizarProdutoComercializavelMutation>({ document: AtualizarProdutoComercializavelDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'AtualizarProdutoComercializavel', 'mutation', variables);
    },
    DeletarProdutoComercializavel(variables: DeletarProdutoComercializavelMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeletarProdutoComercializavelMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeletarProdutoComercializavelMutation>({ document: DeletarProdutoComercializavelDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeletarProdutoComercializavel', 'mutation', variables);
    },
    ListarSubmissoesProdutos(variables?: ListarSubmissoesProdutosQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ListarSubmissoesProdutosQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ListarSubmissoesProdutosQuery>({ document: ListarSubmissoesProdutosDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ListarSubmissoesProdutos', 'query', variables);
    },
    BuscarSubmissaoProduto(variables: BuscarSubmissaoProdutoQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<BuscarSubmissaoProdutoQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<BuscarSubmissaoProdutoQuery>({ document: BuscarSubmissaoProdutoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'BuscarSubmissaoProduto', 'query', variables);
    },
    ListarSubmissoesPorStatus(variables: ListarSubmissoesPorStatusQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ListarSubmissoesPorStatusQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ListarSubmissoesPorStatusQuery>({ document: ListarSubmissoesPorStatusDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ListarSubmissoesPorStatus', 'query', variables);
    },
    CriarSubmissaoProduto(variables: CriarSubmissaoProdutoMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CriarSubmissaoProdutoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CriarSubmissaoProdutoMutation>({ document: CriarSubmissaoProdutoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CriarSubmissaoProduto', 'mutation', variables);
    },
    AprovarSubmissaoProduto(variables: AprovarSubmissaoProdutoMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AprovarSubmissaoProdutoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AprovarSubmissaoProdutoMutation>({ document: AprovarSubmissaoProdutoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'AprovarSubmissaoProduto', 'mutation', variables);
    },
    ReprovarSubmissaoProduto(variables: ReprovarSubmissaoProdutoMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ReprovarSubmissaoProdutoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ReprovarSubmissaoProdutoMutation>({ document: ReprovarSubmissaoProdutoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ReprovarSubmissaoProduto', 'mutation', variables);
    },
    DeletarSubmissaoProduto(variables: DeletarSubmissaoProdutoMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeletarSubmissaoProdutoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeletarSubmissaoProdutoMutation>({ document: DeletarSubmissaoProdutoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeletarSubmissaoProduto', 'mutation', variables);
    },
    ListarCiclos(variables?: ListarCiclosQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ListarCiclosQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ListarCiclosQuery>({ document: ListarCiclosDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ListarCiclos', 'query', variables);
    },
    BuscarCiclo(variables: BuscarCicloQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<BuscarCicloQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<BuscarCicloQuery>({ document: BuscarCicloDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'BuscarCiclo', 'query', variables);
    },
    CriarCiclo(variables: CriarCicloMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CriarCicloMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CriarCicloMutation>({ document: CriarCicloDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CriarCiclo', 'mutation', variables);
    },
    AtualizarCiclo(variables: AtualizarCicloMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AtualizarCicloMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AtualizarCicloMutation>({ document: AtualizarCicloDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'AtualizarCiclo', 'mutation', variables);
    },
    DeletarCiclo(variables: DeletarCicloMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeletarCicloMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeletarCicloMutation>({ document: DeletarCicloDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeletarCiclo', 'mutation', variables);
    },
    BuscarOferta(variables: BuscarOfertaQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<BuscarOfertaQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<BuscarOfertaQuery>({ document: BuscarOfertaDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'BuscarOferta', 'query', variables);
    },
    ListarOfertasPorCiclo(variables: ListarOfertasPorCicloQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ListarOfertasPorCicloQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ListarOfertasPorCicloQuery>({ document: ListarOfertasPorCicloDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ListarOfertasPorCiclo', 'query', variables);
    },
    ListarOfertasPorUsuario(variables: ListarOfertasPorUsuarioQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ListarOfertasPorUsuarioQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ListarOfertasPorUsuarioQuery>({ document: ListarOfertasPorUsuarioDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ListarOfertasPorUsuario', 'query', variables);
    },
    CriarOferta(variables: CriarOfertaMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CriarOfertaMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CriarOfertaMutation>({ document: CriarOfertaDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CriarOferta', 'mutation', variables);
    },
    AdicionarProdutoOferta(variables: AdicionarProdutoOfertaMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AdicionarProdutoOfertaMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AdicionarProdutoOfertaMutation>({ document: AdicionarProdutoOfertaDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'AdicionarProdutoOferta', 'mutation', variables);
    },
    AtualizarQuantidadeProdutoOferta(variables: AtualizarQuantidadeProdutoOfertaMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AtualizarQuantidadeProdutoOfertaMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AtualizarQuantidadeProdutoOfertaMutation>({ document: AtualizarQuantidadeProdutoOfertaDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'AtualizarQuantidadeProdutoOferta', 'mutation', variables);
    },
    RemoverProdutoOferta(variables: RemoverProdutoOfertaMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<RemoverProdutoOfertaMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RemoverProdutoOfertaMutation>({ document: RemoverProdutoOfertaDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'RemoverProdutoOferta', 'mutation', variables);
    },
    ListarPontosEntrega(variables?: ListarPontosEntregaQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ListarPontosEntregaQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ListarPontosEntregaQuery>({ document: ListarPontosEntregaDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ListarPontosEntrega', 'query', variables);
    },
    ListarPontosEntregaAtivos(variables?: ListarPontosEntregaAtivosQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ListarPontosEntregaAtivosQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ListarPontosEntregaAtivosQuery>({ document: ListarPontosEntregaAtivosDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ListarPontosEntregaAtivos', 'query', variables);
    },
    BuscarPontoEntrega(variables: BuscarPontoEntregaQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<BuscarPontoEntregaQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<BuscarPontoEntregaQuery>({ document: BuscarPontoEntregaDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'BuscarPontoEntrega', 'query', variables);
    },
    CriarPontoEntrega(variables: CriarPontoEntregaMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CriarPontoEntregaMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CriarPontoEntregaMutation>({ document: CriarPontoEntregaDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CriarPontoEntrega', 'mutation', variables);
    },
    AtualizarPontoEntrega(variables: AtualizarPontoEntregaMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AtualizarPontoEntregaMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AtualizarPontoEntregaMutation>({ document: AtualizarPontoEntregaDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'AtualizarPontoEntrega', 'mutation', variables);
    },
    DeletarPontoEntrega(variables: DeletarPontoEntregaMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeletarPontoEntregaMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeletarPontoEntregaMutation>({ document: DeletarPontoEntregaDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeletarPontoEntrega', 'mutation', variables);
    },
    ListarMercados(variables?: ListarMercadosQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ListarMercadosQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ListarMercadosQuery>({ document: ListarMercadosDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ListarMercados', 'query', variables);
    },
    BuscarMercado(variables: BuscarMercadoQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<BuscarMercadoQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<BuscarMercadoQuery>({ document: BuscarMercadoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'BuscarMercado', 'query', variables);
    },
    ListarMercadosAtivos(variables?: ListarMercadosAtivosQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ListarMercadosAtivosQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ListarMercadosAtivosQuery>({ document: ListarMercadosAtivosDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ListarMercadosAtivos', 'query', variables);
    },
    ListarMercadosPorResponsavel(variables: ListarMercadosPorResponsavelQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ListarMercadosPorResponsavelQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ListarMercadosPorResponsavelQuery>({ document: ListarMercadosPorResponsavelDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ListarMercadosPorResponsavel', 'query', variables);
    },
    CriarMercado(variables: CriarMercadoMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CriarMercadoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CriarMercadoMutation>({ document: CriarMercadoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CriarMercado', 'mutation', variables);
    },
    AtualizarMercado(variables: AtualizarMercadoMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AtualizarMercadoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AtualizarMercadoMutation>({ document: AtualizarMercadoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'AtualizarMercado', 'mutation', variables);
    },
    DeletarMercado(variables: DeletarMercadoMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeletarMercadoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeletarMercadoMutation>({ document: DeletarMercadoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeletarMercado', 'mutation', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;