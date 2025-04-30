const produtoSql = require('../db/produtoSql')

module.exports ={
    async get(){
        data = await produtoSql.getProdutos()
        return data
    },
    async getProdutosAtivos(){
        data = await produtoSql.getProdutosAtivos()
        return data
    },async getProdutosAtivosComCategoria(){
        data = await produtoSql.getProdutosAtivosComCategoria()
        return data
    },
    async getProdutosAtivosPorCategoria(){
        data = await produtoSql.getProdutosAtivosPorCategoria()
        return data
    },
    async update(produto) {
        await produtoSql.updateProduto(produto)
    },
    async delete(id) {
        await produtoSql.deleteProduto(id)
    },
    async create(newProduto) {
        await produtoSql.insertNewProduto(newProduto)
    }
}