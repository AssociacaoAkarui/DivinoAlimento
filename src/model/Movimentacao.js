const movimentacaoSql = require('../db/movimentacaoSql')

module.exports ={
    async get(){
        data = await movimentacaoSql.getMovimentacoes()
        return data
    },
    async getMovimentacoesAtivas(){
        data = await movimentacaoSql.getMovimentacoesAtivas()
        return data
    },
    async update(movimentacao) {
        await movimentacaoSql.updateMovimentacao(movimentacao)
    },
    async delete(id) {
        await movimentacaoSql.deleteMovimentacao(id)
    },
    async criarRegistro(dados) {
        await movimentacaoSql.criarRegistro(dados)
    },
    async findOrCreateMovimentacao(movimentacaoDataUsuarioId) {
        data = await movimentacaoSql.findOrCreateMovimentacao(movimentacaoDataUsuarioId)
        return data
    }
}