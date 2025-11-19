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
