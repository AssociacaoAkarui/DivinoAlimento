const composicaoSql = require('../db/composicaoSql')

module.exports ={
    async findOrCreate(composicao) {
        data = await composicaoSql.findOrCreateComposicao(composicao)
        return data
    },
    async findOrCreateComposicaoProduto(composicaoProduto) {
        data = await composicaoSql.findOrCreateComposicaoProduto(composicaoProduto)
        return data
    },
    async getProdutosPorComposicao(composicaoId){
        data = await composicaoSql.getProdutosPorComposicao(composicaoId)
        return data
    },
    async getProdutosTodasComposicoes(cicloId) {
        data = await composicaoSql.getProdutosTodasComposicoes(cicloId)
        return data
    },
    async getQuantidadeComposicaoSobra(usuarioIdcicloIdprodutoId) {
        data = await composicaoSql.getQuantidadeComposicaoSobra(usuarioIdcicloIdprodutoId)
        return data
    },
    async getQuantidadeProdutosComposicaoOld(composicoesProdutoId){
        data = await composicaoSql.getQuantidadeProdutosComposicaoOld(composicoesProdutoId)
        return data
    },
    async getPedidoPorOfertaComposicao(oferta) {
        data = await composicaoSql.getPedidoPorOfertaComposicao(oferta)
        return data
    },
    async getPedidosPorOferta(ofertacicloCestas) {
        data = await composicaoSql.getPedidosPorOferta(ofertacicloCestas)
        return data
    },
    async getValorTotalPedidoAcumulado(usuarioIdCicloIdcicloCestas) {
        data = await composicaoSql.getValorTotalPedidoAcumulado(usuarioIdCicloIdcicloCestas)
        return data
    },
    async getTotalProdutosPedidoAcumulado(usuarioIdCicloIdProdutoIdcicloCestas) {
        data = await composicaoSql.getTotalProdutosPedidoAcumulado(usuarioIdCicloIdProdutoIdcicloCestas)
        return data
    },
    async getTotalProdutosPedidosComposicaoItensAdicionais(usuarioIdCicloIdProdutoId) {
        data = await composicaoSql.getTotalProdutosPedidosComposicaoItensAdicionais(usuarioIdCicloIdProdutoId)
        return data
    },
    async updateComposicaoProduto(composicaoProduto) {
        await composicaoSql.updateComposicaoProduto(composicaoProduto)
    },
    async deleteComposicoesZero(composicao) {
        await composicaoSql.deleteComposicoesZero(composicao)
    },
    async findOrCreatePedidosFornecedores(pedidosFornecedores) {
        data = await composicaoSql.findOrCreatePedidosFornecedores(pedidosFornecedores)
        return data
    },
    async updatePedidosFornecedores(pedidoFornecedores) {
        await composicaoSql.updatePedidosFornecedores(pedidoFornecedores)
    },
    async getPedidoFornecedores(ofertaProdutoId){
        data = await composicaoSql.getPedidoFornecedores(ofertaProdutoId)
        return data
    },
    async getQuantidadeProdutoPedidoFornecedores(pedidoFornecedores){
        data = await composicaoSql.getQuantidadeProdutoPedidoFornecedores(pedidoFornecedores)
        return data
    },
    async getQuantidadeComposicaoOfertaProdutoPorFornecedor(ofertaProdutoId){
        data = await composicaoSql.getQuantidadeComposicaoOfertaProdutoPorFornecedor(ofertaProdutoId)
        return data
    },
    /*async deleteComposicoesZero(composicao) {
        await composicaoSql.deleteComposicoesZero(composicao)
    }*/
}