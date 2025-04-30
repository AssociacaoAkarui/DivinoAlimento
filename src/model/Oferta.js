const ofertaSql = require('../db/ofertaSql')

module.exports ={
    async findOrCreate(oferta) {
        data = await ofertaSql.findOrCreateOferta(oferta)
        return data
    },
    async findOrCreateProduto(ofertaProduto) {
        await ofertaSql.findOrCreateProduto(ofertaProduto)
    },
    async findOrCreateOfertaProduto (ofertaProduto) {
        data = ofertaSql.findOrCreateOfertaProduto (ofertaProduto)
        return data
    },
    async getProdutosPorOferta(ofertaId){
        data = await ofertaSql.getProdutosPorOferta(ofertaId)
        return data
    },
    async getProdutosMaisOfertadosPorFornecedor(usuarioId){
        data = await ofertaSql.getProdutosMaisOfertadosPorFornecedor(usuarioId)
        return data
    },
    async getOfertasPorCiclo(cicloId){
        data = await ofertaSql.getOfertasPorCiclo(cicloId)
        return data
    },
    async getOfertasPorCicloPorUsuarios(cicloIdarrayUsuarios){
        data = await ofertaSql.getOfertasPorCicloPorUsuarios(cicloIdarrayUsuarios)
        return data
    },
    async updateOfertaProduto(ofertaProduto) {
        await ofertaSql.updateOfertaProduto(ofertaProduto)
    },
    async deleteOfertasZero(oferta) {
        await ofertaSql.deleteOfertasZero(oferta)
    }
}