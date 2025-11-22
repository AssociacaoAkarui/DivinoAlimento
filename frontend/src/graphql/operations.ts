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
