import { gql } from "graphql-request";

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    sessionLogin(input: $input) {
      usuarioId
      token
      perfis
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    sessionLogout {
      success
    }
  }
`;

export const SYSTEM_INFORMATION_QUERY = gql`
  query SystemInformation {
    systemInformation {
      version
    }
  }
`;

export const LISTAR_USUARIOS_QUERY = gql`
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

export const CRIAR_USUARIO_MUTATION = gql`
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

export const ATUALIZAR_USUARIO_MUTATION = gql`
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

export const HEALTHCHECK_QUERY = gql`
  query Healthcheck {
    healthcheck {
      status
    }
  }
`;

export const BUSCAR_USUARIO_QUERY = gql`
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

export const LISTAR_CATEGORIAS_QUERY = gql`
  query ListarCategorias {
    listarCategorias {
      id
      nome
      status
      observacao
    }
  }
`;

export const LISTAR_PAGAMENTOS_QUERY = gql`
  query ListarPagamentos($tipo: String, $status: String, $cicloId: Int) {
    listarPagamentos(tipo: $tipo, status: $status, cicloId: $cicloId) {
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

export const BUSCAR_PAGAMENTO_QUERY = gql`
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

export const CRIAR_PAGAMENTO_MUTATION = gql`
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

export const ATUALIZAR_PAGAMENTO_MUTATION = gql`
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

export const MARCAR_PAGAMENTO_COMO_PAGO_MUTATION = gql`
  mutation MarcarPagamentoComoPago(
    $id: ID!
    $dataPagamento: String
    $observacao: String
  ) {
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

export const CANCELAR_PAGAMENTO_MUTATION = gql`
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

export const DELETAR_PAGAMENTO_MUTATION = gql`
  mutation DeletarPagamento($id: ID!) {
    deletarPagamento(id: $id)
  }
`;

export const GERAR_PAGAMENTOS_POR_CICLO_MUTATION = gql`
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

export const CALCULAR_TOTAL_POR_CICLO_QUERY = gql`
  query CalcularTotalPorCiclo($cicloId: Int!) {
    calcularTotalPorCiclo(cicloId: $cicloId) {
      totalReceber
      totalPagar
      saldo
    }
  }
`;

export const BUSCAR_CATEGORIA_QUERY = gql`
  query BuscarCategoria($id: ID!) {
    buscarCategoria(id: $id) {
      id
      nome
      status
      observacao
    }
  }
`;

export const CRIAR_CATEGORIA_MUTATION = gql`
  mutation CriarCategoria($input: CriarCategoriaProdutosInput!) {
    criarCategoria(input: $input) {
      id
      nome
      status
      observacao
    }
  }
`;

export const ATUALIZAR_CATEGORIA_MUTATION = gql`
  mutation AtualizarCategoria(
    $id: ID!
    $input: AtualizarCategoriaProdutosInput!
  ) {
    atualizarCategoria(id: $id, input: $input) {
      id
      nome
      status
      observacao
    }
  }
`;

export const DELETAR_CATEGORIA_MUTATION = gql`
  mutation DeletarCategoria($id: ID!) {
    deletarCategoria(id: $id) {
      success
      message
    }
  }
`;

export const LISTAR_PRODUTOS_QUERY = gql`
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

export const BUSCAR_PRODUTO_QUERY = gql`
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

export const CRIAR_PRODUTO_MUTATION = gql`
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

export const ATUALIZAR_PRODUTO_MUTATION = gql`
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

export const DELETAR_PRODUTO_MUTATION = gql`
  mutation DeletarProduto($id: ID!) {
    deletarProduto(id: $id)
  }
`;

// ProdutoComercializavel operations
export const LISTAR_PRODUTOS_COMERCIALIZAVEIS_QUERY = gql`
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

export const BUSCAR_PRODUTO_COMERCIALIZAVEL_QUERY = gql`
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

export const LISTAR_PRODUTOS_COMERCIALIZAVEIS_POR_PRODUTO_QUERY = gql`
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

export const CRIAR_PRODUTO_COMERCIALIZAVEL_MUTATION = gql`
  mutation CriarProdutoComercializavel(
    $input: CriarProdutoComercializavelInput!
  ) {
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

export const ATUALIZAR_PRODUTO_COMERCIALIZAVEL_MUTATION = gql`
  mutation AtualizarProdutoComercializavel(
    $id: ID!
    $input: AtualizarProdutoComercializavelInput!
  ) {
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

export const DELETAR_PRODUTO_COMERCIALIZAVEL_MUTATION = gql`
  mutation DeletarProdutoComercializavel($id: ID!) {
    deletarProdutoComercializavel(id: $id)
  }
`;

// SubmissaoProduto operations
export const LISTAR_SUBMISSOES_PRODUTOS_QUERY = gql`
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

export const BUSCAR_SUBMISSAO_PRODUTO_QUERY = gql`
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

export const LISTAR_SUBMISSOES_POR_STATUS_QUERY = gql`
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

export const CRIAR_SUBMISSAO_PRODUTO_MUTATION = gql`
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

export const APROVAR_SUBMISSAO_PRODUTO_MUTATION = gql`
  mutation AprovarSubmissaoProduto($id: ID!, $input: AprovarSubmissaoInput) {
    aprovarSubmissaoProduto(id: $id, input: $input) {
      id
      status
    }
  }
`;

export const REPROVAR_SUBMISSAO_PRODUTO_MUTATION = gql`
  mutation ReprovarSubmissaoProduto($id: ID!, $motivoReprovacao: String!) {
    reprovarSubmissaoProduto(id: $id, motivoReprovacao: $motivoReprovacao) {
      id
      status
      motivoReprovacao
    }
  }
`;

export const DELETAR_SUBMISSAO_PRODUTO_MUTATION = gql`
  mutation DeletarSubmissaoProduto($id: ID!) {
    deletarSubmissaoProduto(id: $id)
  }
`;

// Ciclo operations
export const LISTAR_CICLOS_QUERY = gql`
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

export const BUSCAR_CICLO_QUERY = gql`
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

export const CRIAR_CICLO_MUTATION = gql`
  mutation CriarCiclo($input: CriarCicloInput!) {
    criarCiclo(input: $input) {
      id
      nome
      status
    }
  }
`;

export const ATUALIZAR_CICLO_MUTATION = gql`
  mutation AtualizarCiclo($id: ID!, $input: AtualizarCicloInput!) {
    atualizarCiclo(id: $id, input: $input) {
      id
      nome
      status
    }
  }
`;

export const DELETAR_CICLO_MUTATION = gql`
  mutation DeletarCiclo($id: ID!) {
    deletarCiclo(id: $id)
  }
`;

// CicloMercados operations
export const LISTAR_MERCADOS_POR_CICLO_QUERY = gql`
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

export const BUSCAR_CICLO_MERCADO_QUERY = gql`
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

export const ADICIONAR_MERCADO_CICLO_MUTATION = gql`
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

export const ATUALIZAR_MERCADO_CICLO_MUTATION = gql`
  mutation AtualizarMercadoCiclo(
    $id: ID!
    $input: AtualizarCicloMercadosInput!
  ) {
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

export const REMOVER_MERCADO_CICLO_MUTATION = gql`
  mutation RemoverMercadoCiclo($id: ID!) {
    removerMercadoCiclo(id: $id)
  }
`;

// Oferta operations
export const BUSCAR_OFERTA_QUERY = gql`
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

export const LISTAR_OFERTAS_POR_CICLO_QUERY = gql`
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

export const LISTAR_OFERTAS_POR_USUARIO_QUERY = gql`
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

export const CRIAR_OFERTA_MUTATION = gql`
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

export const ADICIONAR_PRODUTO_OFERTA_MUTATION = gql`
  mutation AdicionarProdutoOferta(
    $ofertaId: ID!
    $input: AdicionarProdutoOfertaInput!
  ) {
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

export const ATUALIZAR_QUANTIDADE_PRODUTO_OFERTA_MUTATION = gql`
  mutation AtualizarQuantidadeProdutoOferta(
    $ofertaProdutoId: ID!
    $input: AtualizarQuantidadeProdutoInput!
  ) {
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

export const REMOVER_PRODUTO_OFERTA_MUTATION = gql`
  mutation RemoverProdutoOferta($ofertaProdutoId: ID!) {
    removerProdutoOferta(ofertaProdutoId: $ofertaProdutoId)
  }
`;

export const MIGRAR_OFERTAS_MUTATION = gql`
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

// PontoEntrega operations
export const LISTAR_PONTOS_ENTREGA_QUERY = gql`
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

export const LISTAR_PONTOS_ENTREGA_ATIVOS_QUERY = gql`
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

export const BUSCAR_PONTO_ENTREGA_QUERY = gql`
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

export const CRIAR_PONTO_ENTREGA_MUTATION = gql`
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

export const ATUALIZAR_PONTO_ENTREGA_MUTATION = gql`
  mutation AtualizarPontoEntrega(
    $id: ID!
    $input: AtualizarPontoEntregaInput!
  ) {
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

export const DELETAR_PONTO_ENTREGA_MUTATION = gql`
  mutation DeletarPontoEntrega($id: ID!) {
    deletarPontoEntrega(id: $id)
  }
`;

export const LISTAR_MERCADOS_QUERY = gql`
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

export const BUSCAR_MERCADO_QUERY = gql`
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

export const LISTAR_MERCADOS_ATIVOS_QUERY = gql`
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

export const LISTAR_MERCADOS_POR_RESPONSAVEL_QUERY = gql`
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

export const CRIAR_MERCADO_MUTATION = gql`
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

export const ATUALIZAR_MERCADO_MUTATION = gql`
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

export const DELETAR_MERCADO_MUTATION = gql`
  mutation DeletarMercado($id: ID!) {
    deletarMercado(id: $id)
  }
`;

export const LISTAR_PRECOS_MERCADO_QUERY = gql`
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

export const LISTAR_PRECOS_PRODUTO_QUERY = gql`
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

export const BUSCAR_PRECO_MERCADO_QUERY = gql`
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

export const BUSCAR_PRECO_PRODUTO_MERCADO_QUERY = gql`
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

export const CRIAR_PRECO_MERCADO_MUTATION = gql`
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

export const ATUALIZAR_PRECO_MERCADO_MUTATION = gql`
  mutation AtualizarPrecoMercado(
    $id: ID!
    $input: AtualizarPrecoMercadoInput!
  ) {
    atualizarPrecoMercado(id: $id, input: $input) {
      id
      produtoId
      mercadoId
      preco
      status
    }
  }
`;

export const DELETAR_PRECO_MERCADO_MUTATION = gql`
  mutation DeletarPrecoMercado($id: ID!) {
    deletarPrecoMercado(id: $id)
  }
`;

export const LISTAR_COMPOSICOES_POR_CICLO_QUERY = gql`
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

export const BUSCAR_COMPOSICAO_QUERY = gql`
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

export const LISTAR_CESTAS_QUERY = gql`
  query ListarCestas {
    listarCestas {
      id
      nome
      valormaximo
      status
    }
  }
`;

export const CRIAR_COMPOSICAO_MUTATION = gql`
  mutation CriarComposicao($input: CriarComposicaoInput!) {
    criarComposicao(input: $input) {
      id
      cicloCestaId
      status
      observacao
    }
  }
`;

export const SINCRONIZAR_PRODUTOS_COMPOSICAO_MUTATION = gql`
  mutation SincronizarProdutosComposicao(
    $composicaoId: ID!
    $produtos: [SincronizarProdutosComposicaoInput!]!
  ) {
    sincronizarProdutosComposicao(
      composicaoId: $composicaoId
      produtos: $produtos
    )
  }
`;

export const BUSCAR_PEDIDO_CONSUMIDORES_QUERY = gql`
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

export const LISTAR_PEDIDOS_POR_CICLO_QUERY = gql`
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

export const LISTAR_PEDIDOS_POR_USUARIO_QUERY = gql`
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

export const CRIAR_PEDIDO_CONSUMIDORES_MUTATION = gql`
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

export const ADICIONAR_PRODUTO_PEDIDO_MUTATION = gql`
  mutation AdicionarProdutoPedido(
    $pedidoId: ID!
    $input: AdicionarProdutoPedidoInput!
  ) {
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

export const ATUALIZAR_QUANTIDADE_PRODUTO_PEDIDO_MUTATION = gql`
  mutation AtualizarQuantidadeProdutoPedido(
    $pedidoProdutoId: ID!
    $input: AtualizarQuantidadeProdutoPedidoInput!
  ) {
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

export const REMOVER_PRODUTO_PEDIDO_MUTATION = gql`
  mutation RemoverProdutoPedido($pedidoProdutoId: ID!) {
    removerProdutoPedido(pedidoProdutoId: $pedidoProdutoId)
  }
`;

export const ATUALIZAR_STATUS_PEDIDO_MUTATION = gql`
  mutation AtualizarStatusPedido(
    $pedidoId: ID!
    $input: AtualizarStatusPedidoInput!
  ) {
    atualizarStatusPedido(pedidoId: $pedidoId, input: $input) {
      id
      status
      observacao
    }
  }
`;
