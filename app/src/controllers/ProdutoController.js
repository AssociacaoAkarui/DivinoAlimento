const CategoriaProdutos = require("../model/CategoriaProdutos");
const Produto = require("../model/Produto");
const Profile = require("../model/Profile");
const { ProdutoService } = require("../services/services");

module.exports = {
  async create(req, res) {
    const categoriasProdutos = await CategoriaProdutos.get();

    return res.render("produto", { categoriasProdutos: categoriasProdutos });
  },

  async save(req, res) {
    try {
      const produtoService = new ProdutoService();
      await produtoService.criarProduto(req.body);
      return res.redirect("/produto-index");
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      return res.status(500).send(`Erro ao salvar produto: ${error.message}`);
    }
  },

  async show(req, res) {
    try {
      const produtoId = req.params.id;
      const produtoService = new ProdutoService();
      const produto = await produtoService.buscarProdutoPorId(produtoId);

      const categoriasProdutos = await CategoriaProdutos.get();

      return res.render("produto-edit", {
        produto: produto,
        categoriasProdutos: categoriasProdutos,
      });
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
      return res.status(404).send(error.message);
    }
  },

  async update(req, res) {
    try {
      const produtoId = req.params.id;
      const produtoService = new ProdutoService();
      await produtoService.atualizarProduto(produtoId, req.body);

      return res.redirect("/produto-index/#" + produtoId);
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      return res
        .status(500)
        .send(`Erro ao atualizar produto: ${error.message}`);
    }
  },

  async delete(req, res) {
    try {
      const produtoId = req.params.id;
      const produtoService = new ProdutoService();

      await produtoService.deletarProduto(produtoId);

      return res.redirect("/produto-index");
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      return res
        .status(error.message.includes("não encontrado") ? 404 : 500)
        .send(`Erro ao deletar produto: ${error.message}`);
    }
  },
};
