const pedidoConsumidoresSql = require('../db/pedidoConsumidoresSql')

module.exports ={
    async findOrCreatePedidoConsumidor(cicloIdUsuarioId) {
        data = await pedidoConsumidoresSql.findOrCreatePedidoConsumidor(cicloIdUsuarioId)
        return data
    },
    async findOrCreatePedidoConsumidorProduto(pedidoConsumidorIdProdutoId) {
        data = await pedidoConsumidoresSql.findOrCreatePedidoConsumidorProduto(pedidoConsumidorIdProdutoId)
        return data
    },
    async updatePedidoConsumidoresProduto(pedidoConsumidorProdutoId) {
        await pedidoConsumidoresSql.updatePedidoConsumidoresProduto(pedidoConsumidorProdutoId)
    },
    async finalizaPedidoConsumidor(pedidoConsumidor) {
        await pedidoConsumidoresSql.finalizaPedidoConsumidor(pedidoConsumidor)
    },
    async getProdutosPedidosConsumidores(cicloId,usuarioId, view){
        data = await pedidoConsumidoresSql.getProdutosPedidosConsumidores(cicloId,usuarioId, view)
        return data
    },
    async getPedidoConsumidor(cicloIdUsuarioIdProdutoId){
        data = await pedidoConsumidoresSql.getPedidoConsumidor(cicloIdUsuarioIdProdutoId)
        return data
    },
    async getQuantidadeProdutoPedidoPorConsumidores(cicloIdProdutoId){
        data = await pedidoConsumidoresSql.getQuantidadeProdutoPedidoConsumidores(cicloIdProdutoId)
        return data
    },
    async pedidoConsumidorFinalizado(cicloId, usuarioId){
        data = await pedidoConsumidoresSql.pedidoConsumidorFinalizado(cicloId, usuarioId)
        return data
    },
    /*async deleteComposicoesZero(composicao) {
        await composicaoSql.deleteComposicoesZero(composicao)
    }*/
}