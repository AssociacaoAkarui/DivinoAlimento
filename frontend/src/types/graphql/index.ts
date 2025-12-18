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

export type AdicionarProdutoPedidoInput = {
  produtoId: Scalars['Int']['input'];
  quantidade: Scalars['Float']['input'];
  valorCompra?: InputMaybe<Scalars['Float']['input']>;
  valorOferta?: InputMaybe<Scalars['Float']['input']>;
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

export type AtualizarCicloMercadosInput = {
  ordemAtendimento?: InputMaybe<Scalars['Int']['input']>;
  periodoComprasFim?: InputMaybe<Scalars['String']['input']>;
  periodoComprasInicio?: InputMaybe<Scalars['String']['input']>;
  periodoEntregaFornecedorFim?: InputMaybe<Scalars['String']['input']>;
  periodoEntregaFornecedorInicio?: InputMaybe<Scalars['String']['input']>;
  periodoRetiradaFim?: InputMaybe<Scalars['String']['input']>;
  periodoRetiradaInicio?: InputMaybe<Scalars['String']['input']>;
  pontoEntregaId?: InputMaybe<Scalars['Int']['input']>;
  quantidadeCestas?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  tipoVenda?: InputMaybe<Scalars['String']['input']>;
  valorAlvoCesta?: InputMaybe<Scalars['Float']['input']>;
  valorAlvoLote?: InputMaybe<Scalars['Float']['input']>;
};

export type AtualizarMercadoInput = {
  nome?: InputMaybe<Scalars['String']['input']>;
  pontoEntregaIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  responsavelId?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  taxaAdministrativa?: InputMaybe<Scalars['Float']['input']>;
  tipo?: InputMaybe<Scalars['String']['input']>;
  valorMaximoCesta?: InputMaybe<Scalars['Float']['input']>;
};

export type AtualizarPagamentoInput = {
  cicloId?: InputMaybe<Scalars['Int']['input']>;
  dataPagamento?: InputMaybe<Scalars['String']['input']>;
  mercadoId?: InputMaybe<Scalars['Int']['input']>;
  observacao?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  tipo?: InputMaybe<Scalars['String']['input']>;
  usuarioId?: InputMaybe<Scalars['Int']['input']>;
  valorTotal?: InputMaybe<Scalars['Float']['input']>;
};

export type AtualizarPontoEntregaInput = {
  bairro?: InputMaybe<Scalars['String']['input']>;
  cep?: InputMaybe<Scalars['String']['input']>;
  cidade?: InputMaybe<Scalars['String']['input']>;
  endereco?: InputMaybe<Scalars['String']['input']>;
  estado?: InputMaybe<Scalars['String']['input']>;
  nome?: InputMaybe<Scalars['String']['input']>;
  pontoReferencia?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type AtualizarPrecoMercadoInput = {
  preco?: InputMaybe<Scalars['Float']['input']>;
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

export type AtualizarQuantidadeProdutoPedidoInput = {
  quantidade: Scalars['Float']['input'];
};

export type AtualizarStatusPedidoInput = {
  status: Scalars['String']['input'];
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

export type Cesta = {
  __typename?: 'Cesta';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  nome: Scalars['String']['output'];
  status: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  valormaximo?: Maybe<Scalars['Float']['output']>;
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

export type CicloCestas = {
  __typename?: 'CicloCestas';
  cesta?: Maybe<Cesta>;
  cestaId: Scalars['Int']['output'];
  ciclo?: Maybe<Ciclo>;
  cicloId: Scalars['Int']['output'];
  composicoes?: Maybe<Array<Composicao>>;
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  quantidadeCestas: Scalars['Int']['output'];
  updatedAt: Scalars['String']['output'];
};

export type CicloMercados = {
  __typename?: 'CicloMercados';
  ciclo?: Maybe<Ciclo>;
  cicloId: Scalars['Int']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  mercado?: Maybe<Mercado>;
  mercadoId: Scalars['Int']['output'];
  ordemAtendimento: Scalars['Int']['output'];
  periodoComprasFim?: Maybe<Scalars['String']['output']>;
  periodoComprasInicio?: Maybe<Scalars['String']['output']>;
  periodoEntregaFornecedorFim?: Maybe<Scalars['String']['output']>;
  periodoEntregaFornecedorInicio?: Maybe<Scalars['String']['output']>;
  periodoRetiradaFim?: Maybe<Scalars['String']['output']>;
  periodoRetiradaInicio?: Maybe<Scalars['String']['output']>;
  pontoEntrega?: Maybe<PontoEntrega>;
  pontoEntregaId?: Maybe<Scalars['Int']['output']>;
  quantidadeCestas?: Maybe<Scalars['Int']['output']>;
  status: Scalars['String']['output'];
  tipoVenda: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  valorAlvoCesta?: Maybe<Scalars['Float']['output']>;
  valorAlvoLote?: Maybe<Scalars['Float']['output']>;
};

export type Composicao = {
  __typename?: 'Composicao';
  cicloCesta?: Maybe<CicloCestas>;
  cicloCestaId: Scalars['Int']['output'];
  composicaoOfertaProdutos?: Maybe<Array<ComposicaoOfertaProduto>>;
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  observacao?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
};

export type ComposicaoOfertaProduto = {
  __typename?: 'ComposicaoOfertaProduto';
  composicaoId: Scalars['Int']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  ofertaProdutoId?: Maybe<Scalars['Int']['output']>;
  produto?: Maybe<Produto>;
  produtoId: Scalars['Int']['output'];
  quantidade: Scalars['Float']['output'];
  updatedAt: Scalars['String']['output'];
  valor?: Maybe<Scalars['Float']['output']>;
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

export type CriarCicloMercadosInput = {
  cicloId: Scalars['Int']['input'];
  mercadoId: Scalars['Int']['input'];
  ordemAtendimento?: InputMaybe<Scalars['Int']['input']>;
  periodoComprasFim?: InputMaybe<Scalars['String']['input']>;
  periodoComprasInicio?: InputMaybe<Scalars['String']['input']>;
  periodoEntregaFornecedorFim?: InputMaybe<Scalars['String']['input']>;
  periodoEntregaFornecedorInicio?: InputMaybe<Scalars['String']['input']>;
  periodoRetiradaFim?: InputMaybe<Scalars['String']['input']>;
  periodoRetiradaInicio?: InputMaybe<Scalars['String']['input']>;
  pontoEntregaId?: InputMaybe<Scalars['Int']['input']>;
  quantidadeCestas?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  tipoVenda: Scalars['String']['input'];
  valorAlvoCesta?: InputMaybe<Scalars['Float']['input']>;
  valorAlvoLote?: InputMaybe<Scalars['Float']['input']>;
};

export type CriarComposicaoInput = {
  cestaId: Scalars['Int']['input'];
  cicloId: Scalars['Int']['input'];
  quantidadeCestas?: InputMaybe<Scalars['Int']['input']>;
};

export type CriarMercadoInput = {
  nome: Scalars['String']['input'];
  pontoEntregaIds?: InputMaybe<Array<Scalars['ID']['input']>>;
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

export type CriarPagamentoInput = {
  cicloId: Scalars['Int']['input'];
  dataPagamento?: InputMaybe<Scalars['String']['input']>;
  mercadoId: Scalars['Int']['input'];
  observacao?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  tipo: Scalars['String']['input'];
  usuarioId: Scalars['Int']['input'];
  valorTotal: Scalars['Float']['input'];
};

export type CriarPedidoConsumidoresInput = {
  cicloId: Scalars['Int']['input'];
  observacao?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  usuarioId: Scalars['Int']['input'];
};

export type CriarPontoEntregaInput = {
  bairro: Scalars['String']['input'];
  cep: Scalars['String']['input'];
  cidade: Scalars['String']['input'];
  endereco: Scalars['String']['input'];
  estado: Scalars['String']['input'];
  nome: Scalars['String']['input'];
  pontoReferencia?: InputMaybe<Scalars['String']['input']>;
  status: Scalars['String']['input'];
};

export type CriarPrecoMercadoInput = {
  mercadoId: Scalars['Int']['input'];
  preco: Scalars['Float']['input'];
  produtoId: Scalars['Int']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
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
  agencia?: InputMaybe<Scalars['String']['input']>;
  banco?: InputMaybe<Scalars['String']['input']>;
  celular?: InputMaybe<Scalars['String']['input']>;
  chavePix?: InputMaybe<Scalars['String']['input']>;
  cientepolitica?: InputMaybe<Scalars['String']['input']>;
  conta?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  nome: Scalars['String']['input'];
  nomeoficial?: InputMaybe<Scalars['String']['input']>;
  perfis: Array<Scalars['String']['input']>;
  senha: Scalars['String']['input'];
  status?: InputMaybe<Scalars['String']['input']>;
};

export type DeletarCategoriaResponse = {
  __typename?: 'DeletarCategoriaResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type DeletarUsuarioResponse = {
  __typename?: 'DeletarUsuarioResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type EntregaFornecedor = {
  __typename?: 'EntregaFornecedor';
  agriculturaFamiliar?: Maybe<Scalars['Boolean']['output']>;
  certificacao?: Maybe<Scalars['String']['output']>;
  fornecedor: Scalars['String']['output'];
  fornecedorId: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  produto: Scalars['String']['output'];
  produtoId: Scalars['Int']['output'];
  quantidadeEntregue: Scalars['Float']['output'];
  quantidadeOfertada: Scalars['Float']['output'];
  unidadeMedida: Scalars['String']['output'];
  valorTotal: Scalars['Float']['output'];
  valorUnitario: Scalars['Float']['output'];
};

export type FiltrosPagamentoInput = {
  cicloId?: InputMaybe<Scalars['Int']['input']>;
  mercadoId?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  tipo?: InputMaybe<Scalars['String']['input']>;
  usuarioId?: InputMaybe<Scalars['Int']['input']>;
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

export type MigrarOfertasInput = {
  cicloDestinoId: Scalars['Int']['input'];
  ciclosOrigemIds: Array<Scalars['Int']['input']>;
  produtos: Array<ProdutoMigrarInput>;
};

export type Mutation = {
  __typename?: 'Mutation';
  adicionarMercadoCiclo: CicloMercados;
  adicionarProdutoOferta: OfertaProduto;
  adicionarProdutoPedido: PedidoConsumidoresProduto;
  aprovarSubmissaoProduto: SubmissaoProduto;
  atualizarCategoria: CategoriaProdutos;
  atualizarCiclo: Ciclo;
  atualizarMercado: Mercado;
  atualizarMercadoCiclo: CicloMercados;
  atualizarPagamento: Pagamento;
  atualizarPontoEntrega: PontoEntrega;
  atualizarPrecoMercado: PrecoMercado;
  atualizarProduto: Produto;
  atualizarProdutoComercializavel: ProdutoComercializavel;
  atualizarQuantidadeProdutoOferta: OfertaProduto;
  atualizarQuantidadeProdutoPedido?: Maybe<PedidoConsumidoresProduto>;
  atualizarStatusPedido: PedidoConsumidores;
  atualizarUsuario: Usuario;
  cancelarPagamento: Pagamento;
  criarCategoria: CategoriaProdutos;
  criarCiclo: Ciclo;
  criarComposicao: Composicao;
  criarMercado: Mercado;
  criarOferta: Oferta;
  criarPagamento: Pagamento;
  criarPedidoConsumidores: PedidoConsumidores;
  criarPontoEntrega: PontoEntrega;
  criarPrecoMercado: PrecoMercado;
  criarProduto: Produto;
  criarProdutoComercializavel: ProdutoComercializavel;
  criarSubmissaoProduto: SubmissaoProduto;
  criarUsuario: Usuario;
  deletarCategoria: DeletarCategoriaResponse;
  deletarCiclo: Scalars['Boolean']['output'];
  deletarMercado: Scalars['Boolean']['output'];
  deletarPagamento: Scalars['Boolean']['output'];
  deletarPontoEntrega: Scalars['Boolean']['output'];
  deletarPrecoMercado: Scalars['Boolean']['output'];
  deletarProduto: Scalars['Boolean']['output'];
  deletarProdutoComercializavel: Scalars['Boolean']['output'];
  deletarSubmissaoProduto: Scalars['Boolean']['output'];
  deletarUsuario: DeletarUsuarioResponse;
  gerarPagamentosPorCiclo: Array<Pagamento>;
  marcarPagamentoComoPago: Pagamento;
  migrarOfertas: Array<Oferta>;
  removerMercadoCiclo: Scalars['Boolean']['output'];
  removerProdutoOferta: Scalars['Boolean']['output'];
  removerProdutoPedido: Scalars['Boolean']['output'];
  reprovarSubmissaoProduto: SubmissaoProduto;
  sessionLogin: ActiveSession;
  sessionLogout: LogoutResponse;
  sincronizarProdutosComposicao: Scalars['Boolean']['output'];
};


export type MutationAdicionarMercadoCicloArgs = {
  input: CriarCicloMercadosInput;
};


export type MutationAdicionarProdutoOfertaArgs = {
  input: AdicionarProdutoOfertaInput;
  ofertaId: Scalars['ID']['input'];
};


export type MutationAdicionarProdutoPedidoArgs = {
  input: AdicionarProdutoPedidoInput;
  pedidoId: Scalars['ID']['input'];
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


export type MutationAtualizarMercadoCicloArgs = {
  id: Scalars['ID']['input'];
  input: AtualizarCicloMercadosInput;
};


export type MutationAtualizarPagamentoArgs = {
  id: Scalars['ID']['input'];
  input: AtualizarPagamentoInput;
};


export type MutationAtualizarPontoEntregaArgs = {
  id: Scalars['ID']['input'];
  input: AtualizarPontoEntregaInput;
};


export type MutationAtualizarPrecoMercadoArgs = {
  id: Scalars['ID']['input'];
  input: AtualizarPrecoMercadoInput;
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


export type MutationAtualizarQuantidadeProdutoPedidoArgs = {
  input: AtualizarQuantidadeProdutoPedidoInput;
  pedidoProdutoId: Scalars['ID']['input'];
};


export type MutationAtualizarStatusPedidoArgs = {
  input: AtualizarStatusPedidoInput;
  pedidoId: Scalars['ID']['input'];
};


export type MutationAtualizarUsuarioArgs = {
  id: Scalars['ID']['input'];
  input: AtualizarUsuarioInput;
};


export type MutationCancelarPagamentoArgs = {
  id: Scalars['ID']['input'];
  observacao?: InputMaybe<Scalars['String']['input']>;
};


export type MutationCriarCategoriaArgs = {
  input: CriarCategoriaProdutosInput;
};


export type MutationCriarCicloArgs = {
  input: CriarCicloInput;
};


export type MutationCriarComposicaoArgs = {
  input: CriarComposicaoInput;
};


export type MutationCriarMercadoArgs = {
  input: CriarMercadoInput;
};


export type MutationCriarOfertaArgs = {
  input: CriarOfertaInput;
};


export type MutationCriarPagamentoArgs = {
  input: CriarPagamentoInput;
};


export type MutationCriarPedidoConsumidoresArgs = {
  input: CriarPedidoConsumidoresInput;
};


export type MutationCriarPontoEntregaArgs = {
  input: CriarPontoEntregaInput;
};


export type MutationCriarPrecoMercadoArgs = {
  input: CriarPrecoMercadoInput;
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


export type MutationDeletarPagamentoArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletarPontoEntregaArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletarPrecoMercadoArgs = {
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


export type MutationDeletarUsuarioArgs = {
  id: Scalars['ID']['input'];
};


export type MutationGerarPagamentosPorCicloArgs = {
  cicloId: Scalars['Int']['input'];
};


export type MutationMarcarPagamentoComoPagoArgs = {
  dataPagamento?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  observacao?: InputMaybe<Scalars['String']['input']>;
};


export type MutationMigrarOfertasArgs = {
  input: MigrarOfertasInput;
};


export type MutationRemoverMercadoCicloArgs = {
  id: Scalars['ID']['input'];
};


export type MutationRemoverProdutoOfertaArgs = {
  ofertaProdutoId: Scalars['ID']['input'];
};


export type MutationRemoverProdutoPedidoArgs = {
  pedidoProdutoId: Scalars['ID']['input'];
};


export type MutationReprovarSubmissaoProdutoArgs = {
  id: Scalars['ID']['input'];
  motivoReprovacao: Scalars['String']['input'];
};


export type MutationSessionLoginArgs = {
  input: LoginInput;
};


export type MutationSincronizarProdutosComposicaoArgs = {
  composicaoId: Scalars['ID']['input'];
  produtos: Array<SincronizarProdutosComposicaoInput>;
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

export type Pagamento = {
  __typename?: 'Pagamento';
  ciclo?: Maybe<Ciclo>;
  cicloId: Scalars['Int']['output'];
  createdAt: Scalars['String']['output'];
  dataPagamento?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  mercado?: Maybe<Mercado>;
  mercadoId: Scalars['Int']['output'];
  observacao?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  tipo: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  usuario?: Maybe<Usuario>;
  usuarioId: Scalars['Int']['output'];
  valorTotal: Scalars['Float']['output'];
};

export type PedidoConsumidores = {
  __typename?: 'PedidoConsumidores';
  ciclo?: Maybe<Ciclo>;
  cicloId: Scalars['Int']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  observacao?: Maybe<Scalars['String']['output']>;
  pedidoConsumidoresProdutos?: Maybe<Array<PedidoConsumidoresProduto>>;
  status: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  usuario?: Maybe<Usuario>;
  usuarioId: Scalars['Int']['output'];
};

export type PedidoConsumidoresProduto = {
  __typename?: 'PedidoConsumidoresProduto';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  pedidoConsumidorId: Scalars['Int']['output'];
  produto?: Maybe<Produto>;
  produtoId: Scalars['Int']['output'];
  quantidade: Scalars['Float']['output'];
  updatedAt: Scalars['String']['output'];
  valorCompra?: Maybe<Scalars['Float']['output']>;
  valorOferta?: Maybe<Scalars['Float']['output']>;
};

export type PontoEntrega = {
  __typename?: 'PontoEntrega';
  bairro: Scalars['String']['output'];
  cep: Scalars['String']['output'];
  cidade: Scalars['String']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  endereco: Scalars['String']['output'];
  estado: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  nome: Scalars['String']['output'];
  pontoReferencia?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type PontoEntregaInput = {
  bairro: Scalars['String']['input'];
  cep: Scalars['String']['input'];
  cidade: Scalars['String']['input'];
  endereco: Scalars['String']['input'];
  estado: Scalars['String']['input'];
  nome: Scalars['String']['input'];
  pontoReferencia: Scalars['String']['input'];
  status: Scalars['String']['input'];
};

export type PrecoMercado = {
  __typename?: 'PrecoMercado';
  createdAt: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  mercado?: Maybe<Mercado>;
  mercadoId: Scalars['Int']['output'];
  preco: Scalars['Float']['output'];
  produto?: Maybe<Produto>;
  produtoId: Scalars['Int']['output'];
  status: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
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

export type ProdutoMigrarInput = {
  fornecedorId?: InputMaybe<Scalars['Int']['input']>;
  produtoId: Scalars['Int']['input'];
  quantidade: Scalars['Float']['input'];
  valorOferta?: InputMaybe<Scalars['Float']['input']>;
};

export type Query = {
  __typename?: 'Query';
  buscarCategoria: CategoriaProdutos;
  buscarCiclo: Ciclo;
  buscarCicloMercado: CicloMercados;
  buscarComposicao: Composicao;
  buscarMercado: Mercado;
  buscarOferta: Oferta;
  buscarPagamento: Pagamento;
  buscarPedidoConsumidores: PedidoConsumidores;
  buscarPontoEntrega: PontoEntrega;
  buscarPrecoMercado?: Maybe<PrecoMercado>;
  buscarPrecoProdutoMercado?: Maybe<PrecoMercado>;
  buscarProduto: Produto;
  buscarProdutoComercializavel: ProdutoComercializavel;
  buscarSubmissaoProduto: SubmissaoProduto;
  buscarUsuario: Usuario;
  calcularTotalPorCiclo: TotalPorCiclo;
  healthcheck: HealthCheck;
  listarCategorias: Array<CategoriaProdutos>;
  listarCestas: Array<Cesta>;
  listarCiclos: ListarCiclosResponse;
  listarComposicoesPorCiclo: Array<CicloCestas>;
  listarEntregasFornecedoresPorCiclo: Array<EntregaFornecedor>;
  listarMercados: Array<Mercado>;
  listarMercadosAtivos: Array<Mercado>;
  listarMercadosPorCiclo: Array<CicloMercados>;
  listarMercadosPorResponsavel: Array<Mercado>;
  listarOfertasPorCiclo: Array<Oferta>;
  listarOfertasPorUsuario: Array<Oferta>;
  listarPagamentos: Array<Pagamento>;
  listarPedidosPorCiclo: Array<PedidoConsumidores>;
  listarPedidosPorUsuario: Array<PedidoConsumidores>;
  listarPontosEntrega: Array<PontoEntrega>;
  listarPontosEntregaAtivos: Array<PontoEntrega>;
  listarPrecosMercado: Array<PrecoMercado>;
  listarPrecosProduto: Array<PrecoMercado>;
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


export type QueryBuscarCicloMercadoArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBuscarComposicaoArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBuscarMercadoArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBuscarOfertaArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBuscarPagamentoArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBuscarPedidoConsumidoresArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBuscarPontoEntregaArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBuscarPrecoMercadoArgs = {
  id: Scalars['ID']['input'];
};


export type QueryBuscarPrecoProdutoMercadoArgs = {
  mercadoId: Scalars['Int']['input'];
  produtoId: Scalars['Int']['input'];
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


export type QueryCalcularTotalPorCicloArgs = {
  cicloId: Scalars['Int']['input'];
};


export type QueryListarCiclosArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  limite?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryListarComposicoesPorCicloArgs = {
  cicloId: Scalars['Int']['input'];
};


export type QueryListarEntregasFornecedoresPorCicloArgs = {
  cicloId: Scalars['Int']['input'];
  fornecedorId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryListarMercadosPorCicloArgs = {
  cicloId: Scalars['Int']['input'];
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


export type QueryListarPagamentosArgs = {
  filtros?: InputMaybe<FiltrosPagamentoInput>;
};


export type QueryListarPedidosPorCicloArgs = {
  cicloId: Scalars['Int']['input'];
};


export type QueryListarPedidosPorUsuarioArgs = {
  usuarioId: Scalars['Int']['input'];
};


export type QueryListarPrecosMercadoArgs = {
  mercadoId: Scalars['Int']['input'];
};


export type QueryListarPrecosProdutoArgs = {
  produtoId: Scalars['Int']['input'];
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

export type SincronizarProdutosComposicaoInput = {
  ofertaProdutoId?: InputMaybe<Scalars['Int']['input']>;
  produtoId: Scalars['Int']['input'];
  quantidade: Scalars['Float']['input'];
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

export type TotalPorCiclo = {
  __typename?: 'TotalPorCiclo';
  saldo: Scalars['Float']['output'];
  totalPagar: Scalars['Float']['output'];
  totalReceber: Scalars['Float']['output'];
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

export type DeletarUsuarioMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeletarUsuarioMutation = { __typename?: 'Mutation', deletarUsuario: { __typename?: 'DeletarUsuarioResponse', success: boolean, message: string } };

export type HealthcheckQueryVariables = Exact<{ [key: string]: never; }>;


export type HealthcheckQuery = { __typename?: 'Query', healthcheck: { __typename?: 'HealthCheck', status: string } };

export type BuscarUsuarioQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type BuscarUsuarioQuery = { __typename?: 'Query', buscarUsuario: { __typename?: 'Usuario', id: string, nome: string, nomeoficial?: string | null, email: string, celular?: string | null, banco?: string | null, agencia?: string | null, conta?: string | null, chavePix?: string | null, cientepolitica?: string | null, status: string, perfis: Array<string> } };

export type ListarCategoriasQueryVariables = Exact<{ [key: string]: never; }>;


export type ListarCategoriasQuery = { __typename?: 'Query', listarCategorias: Array<{ __typename?: 'CategoriaProdutos', id: string, nome: string, status: string, observacao?: string | null }> };

export type ListarPagamentosQueryVariables = Exact<{
  filtros?: InputMaybe<FiltrosPagamentoInput>;
}>;


export type ListarPagamentosQuery = { __typename?: 'Query', listarPagamentos: Array<{ __typename?: 'Pagamento', id: string, tipo: string, valorTotal: number, status: string, dataPagamento?: string | null, observacao?: string | null, cicloId: number, mercadoId: number, usuarioId: number, createdAt: string, updatedAt: string, ciclo?: { __typename?: 'Ciclo', id: string, nome: string } | null, mercado?: { __typename?: 'Mercado', id: string, nome: string } | null, usuario?: { __typename?: 'Usuario', id: string, nome: string, email: string } | null }> };

export type BuscarPagamentoQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type BuscarPagamentoQuery = { __typename?: 'Query', buscarPagamento: { __typename?: 'Pagamento', id: string, tipo: string, valorTotal: number, status: string, dataPagamento?: string | null, observacao?: string | null, cicloId: number, mercadoId: number, usuarioId: number, createdAt: string, updatedAt: string, ciclo?: { __typename?: 'Ciclo', id: string, nome: string } | null, mercado?: { __typename?: 'Mercado', id: string, nome: string } | null, usuario?: { __typename?: 'Usuario', id: string, nome: string, email: string } | null } };

export type CriarPagamentoMutationVariables = Exact<{
  input: CriarPagamentoInput;
}>;


export type CriarPagamentoMutation = { __typename?: 'Mutation', criarPagamento: { __typename?: 'Pagamento', id: string, tipo: string, valorTotal: number, status: string, dataPagamento?: string | null, observacao?: string | null, cicloId: number, mercadoId: number, usuarioId: number, createdAt: string, updatedAt: string } };

export type AtualizarPagamentoMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: AtualizarPagamentoInput;
}>;


export type AtualizarPagamentoMutation = { __typename?: 'Mutation', atualizarPagamento: { __typename?: 'Pagamento', id: string, tipo: string, valorTotal: number, status: string, dataPagamento?: string | null, observacao?: string | null, cicloId: number, mercadoId: number, usuarioId: number, createdAt: string, updatedAt: string } };

export type MarcarPagamentoComoPagoMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  dataPagamento?: InputMaybe<Scalars['String']['input']>;
  observacao?: InputMaybe<Scalars['String']['input']>;
}>;


export type MarcarPagamentoComoPagoMutation = { __typename?: 'Mutation', marcarPagamentoComoPago: { __typename?: 'Pagamento', id: string, tipo: string, valorTotal: number, status: string, dataPagamento?: string | null, observacao?: string | null, createdAt: string, updatedAt: string } };

export type CancelarPagamentoMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  observacao?: InputMaybe<Scalars['String']['input']>;
}>;


export type CancelarPagamentoMutation = { __typename?: 'Mutation', cancelarPagamento: { __typename?: 'Pagamento', id: string, tipo: string, valorTotal: number, status: string, observacao?: string | null, createdAt: string, updatedAt: string } };

export type DeletarPagamentoMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeletarPagamentoMutation = { __typename?: 'Mutation', deletarPagamento: boolean };

export type GerarPagamentosPorCicloMutationVariables = Exact<{
  cicloId: Scalars['Int']['input'];
}>;


export type GerarPagamentosPorCicloMutation = { __typename?: 'Mutation', gerarPagamentosPorCiclo: Array<{ __typename?: 'Pagamento', id: string, tipo: string, valorTotal: number, status: string, cicloId: number, mercadoId: number, usuarioId: number, createdAt: string }> };

export type CalcularTotalPorCicloQueryVariables = Exact<{
  cicloId: Scalars['Int']['input'];
}>;


export type CalcularTotalPorCicloQuery = { __typename?: 'Query', calcularTotalPorCiclo: { __typename?: 'TotalPorCiclo', totalReceber: number, totalPagar: number, saldo: number } };

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

export type ListarMercadosPorCicloQueryVariables = Exact<{
  cicloId: Scalars['Int']['input'];
}>;


export type ListarMercadosPorCicloQuery = { __typename?: 'Query', listarMercadosPorCiclo: Array<{ __typename?: 'CicloMercados', id: string, cicloId: number, mercadoId: number, tipoVenda: string, ordemAtendimento: number, quantidadeCestas?: number | null, valorAlvoCesta?: number | null, valorAlvoLote?: number | null, pontoEntregaId?: number | null, periodoEntregaFornecedorInicio?: string | null, periodoEntregaFornecedorFim?: string | null, periodoRetiradaInicio?: string | null, periodoRetiradaFim?: string | null, periodoComprasInicio?: string | null, periodoComprasFim?: string | null, status: string, createdAt: string, updatedAt: string, mercado?: { __typename?: 'Mercado', id: string, nome: string, tipo: string } | null, pontoEntrega?: { __typename?: 'PontoEntrega', id: string, nome: string } | null }> };

export type BuscarCicloMercadoQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type BuscarCicloMercadoQuery = { __typename?: 'Query', buscarCicloMercado: { __typename?: 'CicloMercados', id: string, cicloId: number, mercadoId: number, tipoVenda: string, ordemAtendimento: number, quantidadeCestas?: number | null, valorAlvoCesta?: number | null, valorAlvoLote?: number | null, pontoEntregaId?: number | null, periodoEntregaFornecedorInicio?: string | null, periodoEntregaFornecedorFim?: string | null, periodoRetiradaInicio?: string | null, periodoRetiradaFim?: string | null, periodoComprasInicio?: string | null, periodoComprasFim?: string | null, status: string, createdAt: string, updatedAt: string, mercado?: { __typename?: 'Mercado', id: string, nome: string, tipo: string } | null, pontoEntrega?: { __typename?: 'PontoEntrega', id: string, nome: string } | null } };

export type AdicionarMercadoCicloMutationVariables = Exact<{
  input: CriarCicloMercadosInput;
}>;


export type AdicionarMercadoCicloMutation = { __typename?: 'Mutation', adicionarMercadoCiclo: { __typename?: 'CicloMercados', id: string, cicloId: number, mercadoId: number, tipoVenda: string, ordemAtendimento: number, quantidadeCestas?: number | null, valorAlvoCesta?: number | null, valorAlvoLote?: number | null, pontoEntregaId?: number | null, status: string } };

export type AtualizarMercadoCicloMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: AtualizarCicloMercadosInput;
}>;


export type AtualizarMercadoCicloMutation = { __typename?: 'Mutation', atualizarMercadoCiclo: { __typename?: 'CicloMercados', id: string, cicloId: number, mercadoId: number, tipoVenda: string, ordemAtendimento: number, quantidadeCestas?: number | null, valorAlvoCesta?: number | null, valorAlvoLote?: number | null, pontoEntregaId?: number | null, status: string } };

export type RemoverMercadoCicloMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type RemoverMercadoCicloMutation = { __typename?: 'Mutation', removerMercadoCiclo: boolean };

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

export type MigrarOfertasMutationVariables = Exact<{
  input: MigrarOfertasInput;
}>;


export type MigrarOfertasMutation = { __typename?: 'Mutation', migrarOfertas: Array<{ __typename?: 'Oferta', id: string, cicloId: number, usuarioId: number, status: string, observacao?: string | null, createdAt?: string | null, updatedAt?: string | null }> };

export type ListarPontosEntregaQueryVariables = Exact<{ [key: string]: never; }>;


export type ListarPontosEntregaQuery = { __typename?: 'Query', listarPontosEntrega: Array<{ __typename?: 'PontoEntrega', id: string, nome: string, endereco: string, bairro: string, cidade: string, estado: string, cep: string, status: string, createdAt?: string | null, updatedAt?: string | null }> };

export type ListarPontosEntregaAtivosQueryVariables = Exact<{ [key: string]: never; }>;


export type ListarPontosEntregaAtivosQuery = { __typename?: 'Query', listarPontosEntregaAtivos: Array<{ __typename?: 'PontoEntrega', id: string, nome: string, endereco: string, bairro: string, cidade: string, estado: string, cep: string, status: string }> };

export type BuscarPontoEntregaQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type BuscarPontoEntregaQuery = { __typename?: 'Query', buscarPontoEntrega: { __typename?: 'PontoEntrega', id: string, nome: string, endereco: string, bairro: string, cidade: string, estado: string, cep: string, status: string, createdAt?: string | null, updatedAt?: string | null } };

export type CriarPontoEntregaMutationVariables = Exact<{
  input: CriarPontoEntregaInput;
}>;


export type CriarPontoEntregaMutation = { __typename?: 'Mutation', criarPontoEntrega: { __typename?: 'PontoEntrega', id: string, nome: string, endereco: string, bairro: string, cidade: string, estado: string, cep: string, status: string } };

export type AtualizarPontoEntregaMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: AtualizarPontoEntregaInput;
}>;


export type AtualizarPontoEntregaMutation = { __typename?: 'Mutation', atualizarPontoEntrega: { __typename?: 'PontoEntrega', id: string, nome: string, endereco: string, bairro: string, cidade: string, estado: string, cep: string, status: string } };

export type DeletarPontoEntregaMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeletarPontoEntregaMutation = { __typename?: 'Mutation', deletarPontoEntrega: boolean };

export type ListarMercadosQueryVariables = Exact<{ [key: string]: never; }>;


export type ListarMercadosQuery = { __typename?: 'Query', listarMercados: Array<{ __typename?: 'Mercado', id: string, nome: string, tipo: string, responsavelId: number, taxaAdministrativa?: number | null, valorMaximoCesta?: number | null, status: string, createdAt: string, updatedAt: string, responsavel?: { __typename?: 'Usuario', id: string, nome: string, email: string } | null, pontosEntrega?: Array<{ __typename?: 'PontoEntrega', id: string, nome: string, endereco: string, bairro: string, cidade: string, estado: string, cep: string, status: string }> | null }> };

export type BuscarMercadoQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type BuscarMercadoQuery = { __typename?: 'Query', buscarMercado: { __typename?: 'Mercado', id: string, nome: string, tipo: string, responsavelId: number, taxaAdministrativa?: number | null, valorMaximoCesta?: number | null, status: string, createdAt: string, updatedAt: string, responsavel?: { __typename?: 'Usuario', id: string, nome: string, email: string } | null, pontosEntrega?: Array<{ __typename?: 'PontoEntrega', id: string, nome: string, endereco: string, bairro: string, cidade: string, estado: string, cep: string, status: string }> | null } };

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

export type ListarPrecosMercadoQueryVariables = Exact<{
  mercadoId: Scalars['Int']['input'];
}>;


export type ListarPrecosMercadoQuery = { __typename?: 'Query', listarPrecosMercado: Array<{ __typename?: 'PrecoMercado', id: string, produtoId: number, mercadoId: number, preco: number, status: string, createdAt: string, updatedAt: string, produto?: { __typename?: 'Produto', id: string, nome: string, medida?: string | null } | null }> };

export type ListarPrecosProdutoQueryVariables = Exact<{
  produtoId: Scalars['Int']['input'];
}>;


export type ListarPrecosProdutoQuery = { __typename?: 'Query', listarPrecosProduto: Array<{ __typename?: 'PrecoMercado', id: string, produtoId: number, mercadoId: number, preco: number, status: string, createdAt: string, updatedAt: string, mercado?: { __typename?: 'Mercado', id: string, nome: string, tipo: string } | null }> };

export type BuscarPrecoMercadoQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type BuscarPrecoMercadoQuery = { __typename?: 'Query', buscarPrecoMercado?: { __typename?: 'PrecoMercado', id: string, produtoId: number, mercadoId: number, preco: number, status: string, createdAt: string, updatedAt: string, produto?: { __typename?: 'Produto', id: string, nome: string, medida?: string | null } | null, mercado?: { __typename?: 'Mercado', id: string, nome: string, tipo: string } | null } | null };

export type BuscarPrecoProdutoMercadoQueryVariables = Exact<{
  produtoId: Scalars['Int']['input'];
  mercadoId: Scalars['Int']['input'];
}>;


export type BuscarPrecoProdutoMercadoQuery = { __typename?: 'Query', buscarPrecoProdutoMercado?: { __typename?: 'PrecoMercado', id: string, produtoId: number, mercadoId: number, preco: number, status: string } | null };

export type CriarPrecoMercadoMutationVariables = Exact<{
  input: CriarPrecoMercadoInput;
}>;


export type CriarPrecoMercadoMutation = { __typename?: 'Mutation', criarPrecoMercado: { __typename?: 'PrecoMercado', id: string, produtoId: number, mercadoId: number, preco: number, status: string } };

export type AtualizarPrecoMercadoMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  input: AtualizarPrecoMercadoInput;
}>;


export type AtualizarPrecoMercadoMutation = { __typename?: 'Mutation', atualizarPrecoMercado: { __typename?: 'PrecoMercado', id: string, produtoId: number, mercadoId: number, preco: number, status: string } };

export type DeletarPrecoMercadoMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeletarPrecoMercadoMutation = { __typename?: 'Mutation', deletarPrecoMercado: boolean };

export type ListarComposicoesPorCicloQueryVariables = Exact<{
  cicloId: Scalars['Int']['input'];
}>;


export type ListarComposicoesPorCicloQuery = { __typename?: 'Query', listarComposicoesPorCiclo: Array<{ __typename?: 'CicloCestas', id: string, cicloId: number, cestaId: number, quantidadeCestas: number, cesta?: { __typename?: 'Cesta', id: string, nome: string, valormaximo?: number | null, status: string } | null, ciclo?: { __typename?: 'Ciclo', id: string, nome: string } | null, composicoes?: Array<{ __typename?: 'Composicao', id: string, cicloCestaId: number, status?: string | null, observacao?: string | null, composicaoOfertaProdutos?: Array<{ __typename?: 'ComposicaoOfertaProduto', id: string, composicaoId: number, produtoId: number, quantidade: number, valor?: number | null, ofertaProdutoId?: number | null, produto?: { __typename?: 'Produto', id: string, nome: string, medida?: string | null, valorReferencia?: number | null } | null }> | null }> | null }> };

export type BuscarComposicaoQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type BuscarComposicaoQuery = { __typename?: 'Query', buscarComposicao: { __typename?: 'Composicao', id: string, cicloCestaId: number, status?: string | null, observacao?: string | null, cicloCesta?: { __typename?: 'CicloCestas', id: string, cicloId: number, cestaId: number, quantidadeCestas: number, cesta?: { __typename?: 'Cesta', id: string, nome: string, valormaximo?: number | null } | null, ciclo?: { __typename?: 'Ciclo', id: string, nome: string } | null } | null, composicaoOfertaProdutos?: Array<{ __typename?: 'ComposicaoOfertaProduto', id: string, composicaoId: number, produtoId: number, quantidade: number, valor?: number | null, ofertaProdutoId?: number | null, produto?: { __typename?: 'Produto', id: string, nome: string, medida?: string | null, valorReferencia?: number | null } | null }> | null } };

export type ListarCestasQueryVariables = Exact<{ [key: string]: never; }>;


export type ListarCestasQuery = { __typename?: 'Query', listarCestas: Array<{ __typename?: 'Cesta', id: string, nome: string, valormaximo?: number | null, status: string }> };

export type CriarComposicaoMutationVariables = Exact<{
  input: CriarComposicaoInput;
}>;


export type CriarComposicaoMutation = { __typename?: 'Mutation', criarComposicao: { __typename?: 'Composicao', id: string, cicloCestaId: number, status?: string | null, observacao?: string | null } };

export type SincronizarProdutosComposicaoMutationVariables = Exact<{
  composicaoId: Scalars['ID']['input'];
  produtos: Array<SincronizarProdutosComposicaoInput> | SincronizarProdutosComposicaoInput;
}>;


export type SincronizarProdutosComposicaoMutation = { __typename?: 'Mutation', sincronizarProdutosComposicao: boolean };

export type BuscarPedidoConsumidoresQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type BuscarPedidoConsumidoresQuery = { __typename?: 'Query', buscarPedidoConsumidores: { __typename?: 'PedidoConsumidores', id: string, cicloId: number, usuarioId: number, status: string, observacao?: string | null, createdAt: string, updatedAt: string, ciclo?: { __typename?: 'Ciclo', id: string, nome: string } | null, usuario?: { __typename?: 'Usuario', id: string, nome: string, email: string } | null, pedidoConsumidoresProdutos?: Array<{ __typename?: 'PedidoConsumidoresProduto', id: string, pedidoConsumidorId: number, produtoId: number, quantidade: number, valorOferta?: number | null, valorCompra?: number | null, produto?: { __typename?: 'Produto', id: string, nome: string, medida?: string | null, valorReferencia?: number | null } | null }> | null } };

export type ListarPedidosPorCicloQueryVariables = Exact<{
  cicloId: Scalars['Int']['input'];
}>;


export type ListarPedidosPorCicloQuery = { __typename?: 'Query', listarPedidosPorCiclo: Array<{ __typename?: 'PedidoConsumidores', id: string, cicloId: number, usuarioId: number, status: string, observacao?: string | null, createdAt: string, updatedAt: string, usuario?: { __typename?: 'Usuario', id: string, nome: string, email: string } | null, pedidoConsumidoresProdutos?: Array<{ __typename?: 'PedidoConsumidoresProduto', id: string, pedidoConsumidorId: number, produtoId: number, quantidade: number, valorOferta?: number | null, valorCompra?: number | null, produto?: { __typename?: 'Produto', id: string, nome: string, medida?: string | null } | null }> | null }> };

export type ListarPedidosPorUsuarioQueryVariables = Exact<{
  usuarioId: Scalars['Int']['input'];
}>;


export type ListarPedidosPorUsuarioQuery = { __typename?: 'Query', listarPedidosPorUsuario: Array<{ __typename?: 'PedidoConsumidores', id: string, cicloId: number, usuarioId: number, status: string, observacao?: string | null, createdAt: string, updatedAt: string, ciclo?: { __typename?: 'Ciclo', id: string, nome: string } | null, pedidoConsumidoresProdutos?: Array<{ __typename?: 'PedidoConsumidoresProduto', id: string, produtoId: number, quantidade: number, valorOferta?: number | null, valorCompra?: number | null, produto?: { __typename?: 'Produto', id: string, nome: string, medida?: string | null } | null }> | null }> };

export type CriarPedidoConsumidoresMutationVariables = Exact<{
  input: CriarPedidoConsumidoresInput;
}>;


export type CriarPedidoConsumidoresMutation = { __typename?: 'Mutation', criarPedidoConsumidores: { __typename?: 'PedidoConsumidores', id: string, cicloId: number, usuarioId: number, status: string, observacao?: string | null, createdAt: string, updatedAt: string } };

export type AdicionarProdutoPedidoMutationVariables = Exact<{
  pedidoId: Scalars['ID']['input'];
  input: AdicionarProdutoPedidoInput;
}>;


export type AdicionarProdutoPedidoMutation = { __typename?: 'Mutation', adicionarProdutoPedido: { __typename?: 'PedidoConsumidoresProduto', id: string, pedidoConsumidorId: number, produtoId: number, quantidade: number, valorOferta?: number | null, valorCompra?: number | null } };

export type AtualizarQuantidadeProdutoPedidoMutationVariables = Exact<{
  pedidoProdutoId: Scalars['ID']['input'];
  input: AtualizarQuantidadeProdutoPedidoInput;
}>;


export type AtualizarQuantidadeProdutoPedidoMutation = { __typename?: 'Mutation', atualizarQuantidadeProdutoPedido?: { __typename?: 'PedidoConsumidoresProduto', id: string, pedidoConsumidorId: number, produtoId: number, quantidade: number, valorOferta?: number | null, valorCompra?: number | null } | null };

export type RemoverProdutoPedidoMutationVariables = Exact<{
  pedidoProdutoId: Scalars['ID']['input'];
}>;


export type RemoverProdutoPedidoMutation = { __typename?: 'Mutation', removerProdutoPedido: boolean };

export type AtualizarStatusPedidoMutationVariables = Exact<{
  pedidoId: Scalars['ID']['input'];
  input: AtualizarStatusPedidoInput;
}>;


export type AtualizarStatusPedidoMutation = { __typename?: 'Mutation', atualizarStatusPedido: { __typename?: 'PedidoConsumidores', id: string, status: string, observacao?: string | null } };

export type ListarEntregasFornecedoresPorCicloQueryVariables = Exact<{
  cicloId: Scalars['Int']['input'];
  fornecedorId?: InputMaybe<Scalars['Int']['input']>;
}>;


export type ListarEntregasFornecedoresPorCicloQuery = { __typename?: 'Query', listarEntregasFornecedoresPorCiclo: Array<{ __typename?: 'EntregaFornecedor', id: string, fornecedor: string, fornecedorId: number, produto: string, produtoId: number, unidadeMedida: string, valorUnitario: number, quantidadeOfertada: number, quantidadeEntregue: number, valorTotal: number, agriculturaFamiliar?: boolean | null, certificacao?: string | null }> };


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
export const DeletarUsuarioDocument = gql`
    mutation DeletarUsuario($id: ID!) {
  deletarUsuario(id: $id) {
    success
    message
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
export const ListarPagamentosDocument = gql`
    query ListarPagamentos($filtros: FiltrosPagamentoInput) {
  listarPagamentos(filtros: $filtros) {
    id
    tipo
    valorTotal
    status
    dataPagamento
    observacao
    cicloId
    mercadoId
    usuarioId
    ciclo {
      id
      nome
    }
    mercado {
      id
      nome
    }
    usuario {
      id
      nome
      email
    }
    createdAt
    updatedAt
  }
}
    `;
export const BuscarPagamentoDocument = gql`
    query BuscarPagamento($id: ID!) {
  buscarPagamento(id: $id) {
    id
    tipo
    valorTotal
    status
    dataPagamento
    observacao
    cicloId
    mercadoId
    usuarioId
    ciclo {
      id
      nome
    }
    mercado {
      id
      nome
    }
    usuario {
      id
      nome
      email
    }
    createdAt
    updatedAt
  }
}
    `;
export const CriarPagamentoDocument = gql`
    mutation CriarPagamento($input: CriarPagamentoInput!) {
  criarPagamento(input: $input) {
    id
    tipo
    valorTotal
    status
    dataPagamento
    observacao
    cicloId
    mercadoId
    usuarioId
    createdAt
    updatedAt
  }
}
    `;
export const AtualizarPagamentoDocument = gql`
    mutation AtualizarPagamento($id: ID!, $input: AtualizarPagamentoInput!) {
  atualizarPagamento(id: $id, input: $input) {
    id
    tipo
    valorTotal
    status
    dataPagamento
    observacao
    cicloId
    mercadoId
    usuarioId
    createdAt
    updatedAt
  }
}
    `;
export const MarcarPagamentoComoPagoDocument = gql`
    mutation MarcarPagamentoComoPago($id: ID!, $dataPagamento: String, $observacao: String) {
  marcarPagamentoComoPago(
    id: $id
    dataPagamento: $dataPagamento
    observacao: $observacao
  ) {
    id
    tipo
    valorTotal
    status
    dataPagamento
    observacao
    createdAt
    updatedAt
  }
}
    `;
export const CancelarPagamentoDocument = gql`
    mutation CancelarPagamento($id: ID!, $observacao: String) {
  cancelarPagamento(id: $id, observacao: $observacao) {
    id
    tipo
    valorTotal
    status
    observacao
    createdAt
    updatedAt
  }
}
    `;
export const DeletarPagamentoDocument = gql`
    mutation DeletarPagamento($id: ID!) {
  deletarPagamento(id: $id)
}
    `;
export const GerarPagamentosPorCicloDocument = gql`
    mutation GerarPagamentosPorCiclo($cicloId: Int!) {
  gerarPagamentosPorCiclo(cicloId: $cicloId) {
    id
    tipo
    valorTotal
    status
    cicloId
    mercadoId
    usuarioId
    createdAt
  }
}
    `;
export const CalcularTotalPorCicloDocument = gql`
    query CalcularTotalPorCiclo($cicloId: Int!) {
  calcularTotalPorCiclo(cicloId: $cicloId) {
    totalReceber
    totalPagar
    saldo
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
export const ListarMercadosPorCicloDocument = gql`
    query ListarMercadosPorCiclo($cicloId: Int!) {
  listarMercadosPorCiclo(cicloId: $cicloId) {
    id
    cicloId
    mercadoId
    mercado {
      id
      nome
      tipo
    }
    tipoVenda
    ordemAtendimento
    quantidadeCestas
    valorAlvoCesta
    valorAlvoLote
    pontoEntregaId
    pontoEntrega {
      id
      nome
    }
    periodoEntregaFornecedorInicio
    periodoEntregaFornecedorFim
    periodoRetiradaInicio
    periodoRetiradaFim
    periodoComprasInicio
    periodoComprasFim
    status
    createdAt
    updatedAt
  }
}
    `;
export const BuscarCicloMercadoDocument = gql`
    query BuscarCicloMercado($id: ID!) {
  buscarCicloMercado(id: $id) {
    id
    cicloId
    mercadoId
    mercado {
      id
      nome
      tipo
    }
    tipoVenda
    ordemAtendimento
    quantidadeCestas
    valorAlvoCesta
    valorAlvoLote
    pontoEntregaId
    pontoEntrega {
      id
      nome
    }
    periodoEntregaFornecedorInicio
    periodoEntregaFornecedorFim
    periodoRetiradaInicio
    periodoRetiradaFim
    periodoComprasInicio
    periodoComprasFim
    status
    createdAt
    updatedAt
  }
}
    `;
export const AdicionarMercadoCicloDocument = gql`
    mutation AdicionarMercadoCiclo($input: CriarCicloMercadosInput!) {
  adicionarMercadoCiclo(input: $input) {
    id
    cicloId
    mercadoId
    tipoVenda
    ordemAtendimento
    quantidadeCestas
    valorAlvoCesta
    valorAlvoLote
    pontoEntregaId
    status
  }
}
    `;
export const AtualizarMercadoCicloDocument = gql`
    mutation AtualizarMercadoCiclo($id: ID!, $input: AtualizarCicloMercadosInput!) {
  atualizarMercadoCiclo(id: $id, input: $input) {
    id
    cicloId
    mercadoId
    tipoVenda
    ordemAtendimento
    quantidadeCestas
    valorAlvoCesta
    valorAlvoLote
    pontoEntregaId
    status
  }
}
    `;
export const RemoverMercadoCicloDocument = gql`
    mutation RemoverMercadoCiclo($id: ID!) {
  removerMercadoCiclo(id: $id)
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
export const MigrarOfertasDocument = gql`
    mutation MigrarOfertas($input: MigrarOfertasInput!) {
  migrarOfertas(input: $input) {
    id
    cicloId
    usuarioId
    status
    observacao
    createdAt
    updatedAt
  }
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
export const ListarPrecosMercadoDocument = gql`
    query ListarPrecosMercado($mercadoId: Int!) {
  listarPrecosMercado(mercadoId: $mercadoId) {
    id
    produtoId
    produto {
      id
      nome
      medida
    }
    mercadoId
    preco
    status
    createdAt
    updatedAt
  }
}
    `;
export const ListarPrecosProdutoDocument = gql`
    query ListarPrecosProduto($produtoId: Int!) {
  listarPrecosProduto(produtoId: $produtoId) {
    id
    produtoId
    mercadoId
    mercado {
      id
      nome
      tipo
    }
    preco
    status
    createdAt
    updatedAt
  }
}
    `;
export const BuscarPrecoMercadoDocument = gql`
    query BuscarPrecoMercado($id: ID!) {
  buscarPrecoMercado(id: $id) {
    id
    produtoId
    produto {
      id
      nome
      medida
    }
    mercadoId
    mercado {
      id
      nome
      tipo
    }
    preco
    status
    createdAt
    updatedAt
  }
}
    `;
export const BuscarPrecoProdutoMercadoDocument = gql`
    query BuscarPrecoProdutoMercado($produtoId: Int!, $mercadoId: Int!) {
  buscarPrecoProdutoMercado(produtoId: $produtoId, mercadoId: $mercadoId) {
    id
    produtoId
    mercadoId
    preco
    status
  }
}
    `;
export const CriarPrecoMercadoDocument = gql`
    mutation CriarPrecoMercado($input: CriarPrecoMercadoInput!) {
  criarPrecoMercado(input: $input) {
    id
    produtoId
    mercadoId
    preco
    status
  }
}
    `;
export const AtualizarPrecoMercadoDocument = gql`
    mutation AtualizarPrecoMercado($id: ID!, $input: AtualizarPrecoMercadoInput!) {
  atualizarPrecoMercado(id: $id, input: $input) {
    id
    produtoId
    mercadoId
    preco
    status
  }
}
    `;
export const DeletarPrecoMercadoDocument = gql`
    mutation DeletarPrecoMercado($id: ID!) {
  deletarPrecoMercado(id: $id)
}
    `;
export const ListarComposicoesPorCicloDocument = gql`
    query ListarComposicoesPorCiclo($cicloId: Int!) {
  listarComposicoesPorCiclo(cicloId: $cicloId) {
    id
    cicloId
    cestaId
    quantidadeCestas
    cesta {
      id
      nome
      valormaximo
      status
    }
    ciclo {
      id
      nome
    }
    composicoes {
      id
      cicloCestaId
      status
      observacao
      composicaoOfertaProdutos {
        id
        composicaoId
        produtoId
        quantidade
        valor
        ofertaProdutoId
        produto {
          id
          nome
          medida
          valorReferencia
        }
      }
    }
  }
}
    `;
export const BuscarComposicaoDocument = gql`
    query BuscarComposicao($id: ID!) {
  buscarComposicao(id: $id) {
    id
    cicloCestaId
    status
    observacao
    cicloCesta {
      id
      cicloId
      cestaId
      quantidadeCestas
      cesta {
        id
        nome
        valormaximo
      }
      ciclo {
        id
        nome
      }
    }
    composicaoOfertaProdutos {
      id
      composicaoId
      produtoId
      quantidade
      valor
      ofertaProdutoId
      produto {
        id
        nome
        medida
        valorReferencia
      }
    }
  }
}
    `;
export const ListarCestasDocument = gql`
    query ListarCestas {
  listarCestas {
    id
    nome
    valormaximo
    status
  }
}
    `;
export const CriarComposicaoDocument = gql`
    mutation CriarComposicao($input: CriarComposicaoInput!) {
  criarComposicao(input: $input) {
    id
    cicloCestaId
    status
    observacao
  }
}
    `;
export const SincronizarProdutosComposicaoDocument = gql`
    mutation SincronizarProdutosComposicao($composicaoId: ID!, $produtos: [SincronizarProdutosComposicaoInput!]!) {
  sincronizarProdutosComposicao(composicaoId: $composicaoId, produtos: $produtos)
}
    `;
export const BuscarPedidoConsumidoresDocument = gql`
    query BuscarPedidoConsumidores($id: ID!) {
  buscarPedidoConsumidores(id: $id) {
    id
    cicloId
    usuarioId
    status
    observacao
    createdAt
    updatedAt
    ciclo {
      id
      nome
    }
    usuario {
      id
      nome
      email
    }
    pedidoConsumidoresProdutos {
      id
      pedidoConsumidorId
      produtoId
      quantidade
      valorOferta
      valorCompra
      produto {
        id
        nome
        medida
        valorReferencia
      }
    }
  }
}
    `;
export const ListarPedidosPorCicloDocument = gql`
    query ListarPedidosPorCiclo($cicloId: Int!) {
  listarPedidosPorCiclo(cicloId: $cicloId) {
    id
    cicloId
    usuarioId
    status
    observacao
    createdAt
    updatedAt
    usuario {
      id
      nome
      email
    }
    pedidoConsumidoresProdutos {
      id
      pedidoConsumidorId
      produtoId
      quantidade
      valorOferta
      valorCompra
      produto {
        id
        nome
        medida
      }
    }
  }
}
    `;
export const ListarPedidosPorUsuarioDocument = gql`
    query ListarPedidosPorUsuario($usuarioId: Int!) {
  listarPedidosPorUsuario(usuarioId: $usuarioId) {
    id
    cicloId
    usuarioId
    status
    observacao
    createdAt
    updatedAt
    ciclo {
      id
      nome
    }
    pedidoConsumidoresProdutos {
      id
      produtoId
      quantidade
      valorOferta
      valorCompra
      produto {
        id
        nome
        medida
      }
    }
  }
}
    `;
export const CriarPedidoConsumidoresDocument = gql`
    mutation CriarPedidoConsumidores($input: CriarPedidoConsumidoresInput!) {
  criarPedidoConsumidores(input: $input) {
    id
    cicloId
    usuarioId
    status
    observacao
    createdAt
    updatedAt
  }
}
    `;
export const AdicionarProdutoPedidoDocument = gql`
    mutation AdicionarProdutoPedido($pedidoId: ID!, $input: AdicionarProdutoPedidoInput!) {
  adicionarProdutoPedido(pedidoId: $pedidoId, input: $input) {
    id
    pedidoConsumidorId
    produtoId
    quantidade
    valorOferta
    valorCompra
  }
}
    `;
export const AtualizarQuantidadeProdutoPedidoDocument = gql`
    mutation AtualizarQuantidadeProdutoPedido($pedidoProdutoId: ID!, $input: AtualizarQuantidadeProdutoPedidoInput!) {
  atualizarQuantidadeProdutoPedido(
    pedidoProdutoId: $pedidoProdutoId
    input: $input
  ) {
    id
    pedidoConsumidorId
    produtoId
    quantidade
    valorOferta
    valorCompra
  }
}
    `;
export const RemoverProdutoPedidoDocument = gql`
    mutation RemoverProdutoPedido($pedidoProdutoId: ID!) {
  removerProdutoPedido(pedidoProdutoId: $pedidoProdutoId)
}
    `;
export const AtualizarStatusPedidoDocument = gql`
    mutation AtualizarStatusPedido($pedidoId: ID!, $input: AtualizarStatusPedidoInput!) {
  atualizarStatusPedido(pedidoId: $pedidoId, input: $input) {
    id
    status
    observacao
  }
}
    `;
export const ListarEntregasFornecedoresPorCicloDocument = gql`
    query ListarEntregasFornecedoresPorCiclo($cicloId: Int!, $fornecedorId: Int) {
  listarEntregasFornecedoresPorCiclo(
    cicloId: $cicloId
    fornecedorId: $fornecedorId
  ) {
    id
    fornecedor
    fornecedorId
    produto
    produtoId
    unidadeMedida
    valorUnitario
    quantidadeOfertada
    quantidadeEntregue
    valorTotal
    agriculturaFamiliar
    certificacao
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
    DeletarUsuario(variables: DeletarUsuarioMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeletarUsuarioMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeletarUsuarioMutation>({ document: DeletarUsuarioDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeletarUsuario', 'mutation', variables);
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
    ListarPagamentos(variables?: ListarPagamentosQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ListarPagamentosQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ListarPagamentosQuery>({ document: ListarPagamentosDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ListarPagamentos', 'query', variables);
    },
    BuscarPagamento(variables: BuscarPagamentoQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<BuscarPagamentoQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<BuscarPagamentoQuery>({ document: BuscarPagamentoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'BuscarPagamento', 'query', variables);
    },
    CriarPagamento(variables: CriarPagamentoMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CriarPagamentoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CriarPagamentoMutation>({ document: CriarPagamentoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CriarPagamento', 'mutation', variables);
    },
    AtualizarPagamento(variables: AtualizarPagamentoMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AtualizarPagamentoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AtualizarPagamentoMutation>({ document: AtualizarPagamentoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'AtualizarPagamento', 'mutation', variables);
    },
    MarcarPagamentoComoPago(variables: MarcarPagamentoComoPagoMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<MarcarPagamentoComoPagoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<MarcarPagamentoComoPagoMutation>({ document: MarcarPagamentoComoPagoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'MarcarPagamentoComoPago', 'mutation', variables);
    },
    CancelarPagamento(variables: CancelarPagamentoMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CancelarPagamentoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CancelarPagamentoMutation>({ document: CancelarPagamentoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CancelarPagamento', 'mutation', variables);
    },
    DeletarPagamento(variables: DeletarPagamentoMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeletarPagamentoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeletarPagamentoMutation>({ document: DeletarPagamentoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeletarPagamento', 'mutation', variables);
    },
    GerarPagamentosPorCiclo(variables: GerarPagamentosPorCicloMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<GerarPagamentosPorCicloMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<GerarPagamentosPorCicloMutation>({ document: GerarPagamentosPorCicloDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'GerarPagamentosPorCiclo', 'mutation', variables);
    },
    CalcularTotalPorCiclo(variables: CalcularTotalPorCicloQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CalcularTotalPorCicloQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CalcularTotalPorCicloQuery>({ document: CalcularTotalPorCicloDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CalcularTotalPorCiclo', 'query', variables);
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
    ListarMercadosPorCiclo(variables: ListarMercadosPorCicloQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ListarMercadosPorCicloQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ListarMercadosPorCicloQuery>({ document: ListarMercadosPorCicloDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ListarMercadosPorCiclo', 'query', variables);
    },
    BuscarCicloMercado(variables: BuscarCicloMercadoQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<BuscarCicloMercadoQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<BuscarCicloMercadoQuery>({ document: BuscarCicloMercadoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'BuscarCicloMercado', 'query', variables);
    },
    AdicionarMercadoCiclo(variables: AdicionarMercadoCicloMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AdicionarMercadoCicloMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AdicionarMercadoCicloMutation>({ document: AdicionarMercadoCicloDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'AdicionarMercadoCiclo', 'mutation', variables);
    },
    AtualizarMercadoCiclo(variables: AtualizarMercadoCicloMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AtualizarMercadoCicloMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AtualizarMercadoCicloMutation>({ document: AtualizarMercadoCicloDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'AtualizarMercadoCiclo', 'mutation', variables);
    },
    RemoverMercadoCiclo(variables: RemoverMercadoCicloMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<RemoverMercadoCicloMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RemoverMercadoCicloMutation>({ document: RemoverMercadoCicloDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'RemoverMercadoCiclo', 'mutation', variables);
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
    MigrarOfertas(variables: MigrarOfertasMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<MigrarOfertasMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<MigrarOfertasMutation>({ document: MigrarOfertasDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'MigrarOfertas', 'mutation', variables);
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
    },
    ListarPrecosMercado(variables: ListarPrecosMercadoQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ListarPrecosMercadoQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ListarPrecosMercadoQuery>({ document: ListarPrecosMercadoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ListarPrecosMercado', 'query', variables);
    },
    ListarPrecosProduto(variables: ListarPrecosProdutoQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ListarPrecosProdutoQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ListarPrecosProdutoQuery>({ document: ListarPrecosProdutoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ListarPrecosProduto', 'query', variables);
    },
    BuscarPrecoMercado(variables: BuscarPrecoMercadoQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<BuscarPrecoMercadoQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<BuscarPrecoMercadoQuery>({ document: BuscarPrecoMercadoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'BuscarPrecoMercado', 'query', variables);
    },
    BuscarPrecoProdutoMercado(variables: BuscarPrecoProdutoMercadoQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<BuscarPrecoProdutoMercadoQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<BuscarPrecoProdutoMercadoQuery>({ document: BuscarPrecoProdutoMercadoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'BuscarPrecoProdutoMercado', 'query', variables);
    },
    CriarPrecoMercado(variables: CriarPrecoMercadoMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CriarPrecoMercadoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CriarPrecoMercadoMutation>({ document: CriarPrecoMercadoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CriarPrecoMercado', 'mutation', variables);
    },
    AtualizarPrecoMercado(variables: AtualizarPrecoMercadoMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AtualizarPrecoMercadoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AtualizarPrecoMercadoMutation>({ document: AtualizarPrecoMercadoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'AtualizarPrecoMercado', 'mutation', variables);
    },
    DeletarPrecoMercado(variables: DeletarPrecoMercadoMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<DeletarPrecoMercadoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeletarPrecoMercadoMutation>({ document: DeletarPrecoMercadoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'DeletarPrecoMercado', 'mutation', variables);
    },
    ListarComposicoesPorCiclo(variables: ListarComposicoesPorCicloQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ListarComposicoesPorCicloQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ListarComposicoesPorCicloQuery>({ document: ListarComposicoesPorCicloDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ListarComposicoesPorCiclo', 'query', variables);
    },
    BuscarComposicao(variables: BuscarComposicaoQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<BuscarComposicaoQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<BuscarComposicaoQuery>({ document: BuscarComposicaoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'BuscarComposicao', 'query', variables);
    },
    ListarCestas(variables?: ListarCestasQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ListarCestasQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ListarCestasQuery>({ document: ListarCestasDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ListarCestas', 'query', variables);
    },
    CriarComposicao(variables: CriarComposicaoMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CriarComposicaoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CriarComposicaoMutation>({ document: CriarComposicaoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CriarComposicao', 'mutation', variables);
    },
    SincronizarProdutosComposicao(variables: SincronizarProdutosComposicaoMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<SincronizarProdutosComposicaoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SincronizarProdutosComposicaoMutation>({ document: SincronizarProdutosComposicaoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'SincronizarProdutosComposicao', 'mutation', variables);
    },
    BuscarPedidoConsumidores(variables: BuscarPedidoConsumidoresQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<BuscarPedidoConsumidoresQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<BuscarPedidoConsumidoresQuery>({ document: BuscarPedidoConsumidoresDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'BuscarPedidoConsumidores', 'query', variables);
    },
    ListarPedidosPorCiclo(variables: ListarPedidosPorCicloQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ListarPedidosPorCicloQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ListarPedidosPorCicloQuery>({ document: ListarPedidosPorCicloDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ListarPedidosPorCiclo', 'query', variables);
    },
    ListarPedidosPorUsuario(variables: ListarPedidosPorUsuarioQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ListarPedidosPorUsuarioQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ListarPedidosPorUsuarioQuery>({ document: ListarPedidosPorUsuarioDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ListarPedidosPorUsuario', 'query', variables);
    },
    CriarPedidoConsumidores(variables: CriarPedidoConsumidoresMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<CriarPedidoConsumidoresMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CriarPedidoConsumidoresMutation>({ document: CriarPedidoConsumidoresDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'CriarPedidoConsumidores', 'mutation', variables);
    },
    AdicionarProdutoPedido(variables: AdicionarProdutoPedidoMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AdicionarProdutoPedidoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AdicionarProdutoPedidoMutation>({ document: AdicionarProdutoPedidoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'AdicionarProdutoPedido', 'mutation', variables);
    },
    AtualizarQuantidadeProdutoPedido(variables: AtualizarQuantidadeProdutoPedidoMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AtualizarQuantidadeProdutoPedidoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AtualizarQuantidadeProdutoPedidoMutation>({ document: AtualizarQuantidadeProdutoPedidoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'AtualizarQuantidadeProdutoPedido', 'mutation', variables);
    },
    RemoverProdutoPedido(variables: RemoverProdutoPedidoMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<RemoverProdutoPedidoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RemoverProdutoPedidoMutation>({ document: RemoverProdutoPedidoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'RemoverProdutoPedido', 'mutation', variables);
    },
    AtualizarStatusPedido(variables: AtualizarStatusPedidoMutationVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AtualizarStatusPedidoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AtualizarStatusPedidoMutation>({ document: AtualizarStatusPedidoDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'AtualizarStatusPedido', 'mutation', variables);
    },
    ListarEntregasFornecedoresPorCiclo(variables: ListarEntregasFornecedoresPorCicloQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<ListarEntregasFornecedoresPorCicloQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ListarEntregasFornecedoresPorCicloQuery>({ document: ListarEntregasFornecedoresPorCicloDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'ListarEntregasFornecedoresPorCiclo', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;