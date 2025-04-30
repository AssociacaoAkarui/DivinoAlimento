const db = require('../../models/index.js');

module.exports = {

    async getMovimentacoes() {

        let movimentacoes = []    
                
        movimentacoes = await db.Movimentacao.findAll({
            raw: true,
        })
                
        return movimentacoes

    },

    async getMovimentacoesAtivas() {

        let movimentacoes = []    
                
        movimentacoes = await db.Movimentacao.findAll({
            raw: true,  
            include: [{
                model: db.Usuario,
                as: 'usuario',
            }],
            order: ['usuarioId','data']
        })
                
        return movimentacoes

    },


    async criarRegistro(dados) {

        await db.Movimentacao.create({
            usuarioId: dados.usuarioId,
            tipoMovimentacaoId: dados.tipoMovimentacaoId,
            data: dados.data,
            valor: dados.valor,
            observacao: dados.observacao,
          });
    },

    async findOrCreateMovimentacao (movimentacaoDataUsuarioId) {

        let movimentacaoResult = []

        const results = await db.Movimentacao.findOrCreate({
                            raw: true,
                            where: {
                                data: movimentacaoDataUsuarioId.data,
                                usuarioId: movimentacaoDataUsuarioId.usuarioId
                            } 
                         })
          .then(result => (movimentacaoResult = result))

          const movimentacao = movimentacaoResult[0]

          return movimentacao
    },


    async updateMovimentacao (movimentacao) {
        await db.Movimentacao.update({
            usuario: movimentacao.usuarioId,
            tipoMovimentacao: movimentacao.tipoMovimentacaoId,
            data: movimentacao.data,
            valor: movimentacao.valor,
            status: movimentacao.status,
            observacao: movimentacao.observacao,
            linkArquivo: movimentacao.linkArquivo

          }, {
            where: {
                id: movimentacao.id
            } 
          });
    },

    async deleteMovimentacao (movimentacaoId) {
        await db.Movimentacao.destroy({
            where: {
                id: movimentacaoId
            }
          });
    }

}


