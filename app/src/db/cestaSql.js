const db = require('../../models/index.js');
const { Op } = require('sequelize');

module.exports = {

    async getCestas() {

        let cestas = []    
                
        cestas = await db.Cesta.findAll({
            raw: true,

        })
                
        return cestas

    },

    async getCestasAtivas() {

        let cestas = []    
                
        cestas = await db.Cesta.findAll({
            raw: true,
            where: {
                status: 'ativo',
                id: {
                    [Op.not]: [1, 5]
                }
            }
        })
                
        return cestas

    },

    async insertNewCesta (newCesta) {
        await db.Cesta.create({
            nome: newCesta.nome,
            valormaximo: newCesta.valormaximo,
            status: newCesta.status
          });
    },

    async verificaCriaCestasInternas () {
        try {
            const registro = await db.Cesta.findOne({
                where: {
                    id: 1 
                }
            });
    
            if (registro) {
                console.log('Registro encontrado:', registro);
            } else {
                // criar registro 1
                await db.Cesta.create({
                    id: 1,
                    nome: 'Itens Adicionais Oferta',
                    valormaximo: 1,
                    status: 'ativo'
                  });
            }
        } catch (error) {
            console.error('Erro ao consultar o banco de dados:', error);
            //throw error; // Lidar com o erro conforme necessário
        }

        try {
            const registro = await db.Cesta.findOne({
                where: {
                    id: 5 
                }
            });
    
            if (registro) {
                console.log('Registro encontrado:', registro);
            } else {
                // criar registro 5
                await db.Cesta.create({
                    id: 5,
                    nome: 'Pedidos Adicionais',
                    valormaximo: 1,
                    status: 'ativo'
                  });
            }
        } catch (error) {
            console.error('Erro ao consultar o banco de dados:', error);
            //throw error; // Lidar com o erro conforme necessário
        }
    },

    async updateCesta (cesta) {
        await db.Cesta.update({
            nome: cesta.nome,
            valormaximo: cesta.valormaximo,
            status: cesta.status
          }, {
            where: {
                id: cesta.id
            } 
          });
    },

    async deleteCesta (cestaId) {
        await db.Cesta.destroy({
            where: {
                id: cestaId
            }
          });
    }
    

}


