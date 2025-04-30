const db = require('../../models/index.js');
//const PontoEntrega = require('../model/PontoEntrega.js');

module.exports = {

    async getPontosEntrega() {

        let pontosEntrega = []    
                
        pontosEntrega = await db.PontoEntrega.findAll({
            raw: true,
        })
                
        return pontosEntrega

    },

    async insertNewPontoEntrega (newPontoEntrega) {
        await db.PontoEntrega.create({
            nome: newPontoEntrega.nome,
            endereco: newPontoEntrega.endereco,
            status: newPontoEntrega.status
          });
    },

    async updatePontoEntrega (pontoEntrega) {
        await db.PontoEntrega.update({
            nome: pontoEntrega.nome,
            endereco: pontoEntrega.endereco,
            status: pontoEntrega.status
          }, {
            where: {
                id: pontoEntrega.id
            } 
          });
    },

    async deletePontoEntrega (pontoEntregaId) {
        await db.PontoEntrega.destroy({
            where: {
                id: pontoEntregaId
            }
          });
    }
    

}


