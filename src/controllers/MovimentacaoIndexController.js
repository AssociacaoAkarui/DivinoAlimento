const Movimentacao = require('../model/Movimentacao')

module.exports = {
    async index(req, res) {
        const movimentacoes = await Movimentacao.get();

        console.log('movimentacoes',movimentacoes)

        return res.render("movimentacao-index", { movimentacoes: movimentacoes})

    }
}
