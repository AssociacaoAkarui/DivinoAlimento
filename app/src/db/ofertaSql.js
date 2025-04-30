const db = require('../../models/index.js');

const { Op } = require("sequelize");



module.exports = {

    //import { Op } from "sequelize";

    /*async getOfertas() {

        let  ofertas = []    
                
        ofertas = await db.Oferta.findAll({
            raw: true,
        })
                
        return ofertas

    },*/

    async getProdutosPorOferta(ofertaId) {
                
        produtosOferta = await db.OfertaProdutos.findAll({
            raw: true,
            where: {
                ofertaId: ofertaId.ofertaId
            },
            order: ['id']

        })
                
        return produtosOferta

    },

    async getOfertasPorCiclo(cicloId) {

        let  ofertas = [] 
                
        ofertas = await db.Oferta.findAll({
            raw: true,
            where: {
                cicloId: cicloId.cicloId
            },
            order: ['id']

        })
               
        return ofertas

    },

    async getOfertasPorCicloPorUsuarios(cicloIdarrayUsuarios) {

        let  ofertas = [] 
                
        ofertas = await db.Oferta.findAll({
            raw: true,
            where: {
                cicloId: cicloIdarrayUsuarios.cicloId,
                usuarioId: cicloIdarrayUsuarios.arrayUsuarios
            },
            order: ['id']

        })
               
        return ofertas

    },

    async findOrCreateOferta (ofertaCicloIdUsuarioId) {

        let ofertaResult = []

        try {
            const results = await db.Oferta.findOrCreate({
                raw: true,
                where: {
                    cicloId: ofertaCicloIdUsuarioId.cicloId,
                    usuarioId: ofertaCicloIdUsuarioId.usuarioId
                } 
             })
            .then(result => (ofertaResult = result))
        } catch (error) {
            console.log("ERRO_SISTEMA: erro na criacao ou localizacao da oferta")
        }
      
        let oferta = []
        if (ofertaResult[0]) {
            oferta = ofertaResult[0]
        }
        
          return oferta
    },

    async findOrCreateProduto (ofertaProduto) {

        try {
            await db.OfertaProdutos.findOrCreate({
                where: {
                    ofertaId: ofertaProduto.ofertaId,
                    produtoId: ofertaProduto.produtoId,
                    quantidade: ofertaProduto.quantidade
                } 
            })
        } catch (error) {
            console.log("ERRO_SISTEMA: erro na criacao da ofertaProduto")
        }
        
        
    },

    async findOrCreateOfertaProduto (ofertaProduto) {

        ofertaResult = []
        try {
            const results = await db.OfertaProdutos.findOrCreate({
                raw: true,
                where: {
                    ofertaId: ofertaProduto.ofertaId,
                    produtoId: ofertaProduto.produtoId
                } 
                })
                .then(result => (ofertaResult = result))    
        } catch (error) {
           console.log("ERRO_SISTEMA ERRO_SISTEMA ERRO_SISTEMA ERRO_SISTEMA ERRO SISTEMA "+
                       "ERRO_SISTEMA ERRO_SISTEMA ERRO_SISTEMA ERRO_SISTEMA ERRO SISTEMA "+
                       "ERRO_SISTEMA ERRO_SISTEMA ERRO_SISTEMA ERRO_SISTEMA ERRO SISTEMA: "+
                        "erro na criação ou localização da ofertaProduto") 
        }

        ofertaProdutoId = 0
        if (ofertaResult[0]) {
            ofertaProdutoId = ofertaResult[0].id
        }
    
        return ofertaProdutoId

    },


    async updateOferta (oferta) {
        await db.Oferta.update({
            usuarioId: oferta.usuarioId
            //nome: oferta.nome,
            //valormaximo: oferta.valormaximo,
            //status: oferta.status
          }, {
            where: {
                cicloId: oferta.cicloId,
                usuarioId: oferta.usuarioId
            } 
          });
    },

    async updateOfertaProduto (ofertaProduto) {
        await db.OfertaProdutos.update({
            quantidade: ofertaProduto.quantidade
          }, {
            where: {
                id: ofertaProduto.ofertaId
            } 
          });
    },

    async deleteOfertasZero (oferta) {
        await db.OfertaProdutos.destroy({
            where: {
                ofertaId: ofertaId,
                quantidade: 0
            }
          });
    },

    async getProdutosMaisOfertadosPorFornecedor(usuarioId) {

        let ultimosProdutosOfertadosUsuario = []
        let ultimosProdutosOfertadosUsuarioDados = []
        let produtosNaoOfertados = []
        let ofertas = []

        try {
            ofertas = await db.Oferta.findAll({
                raw: true,
                attributes: [
                    [db.sequelize.fn('sum', db.sequelize.col('ofertaProdutos.quantidade')), 'SumQuantidade'],
                ],
                where: {
                    usuarioId: usuarioId,
                    cicloId: {
                        [Op.not]: null
                    }
                },  
                include: [{
                    model: db.OfertaProdutos,
                    as: 'ofertaProdutos',
                    where: {
                        produtoId: {
                            [Op.not]: null
                        }
                    },
                }],
                group: ['ofertaProdutos.produtoId'],
                order: [['SumQuantidade','DESC']]
            })
        } catch (error) {   
            console.log('msgSistema: nenhuma oferta encontrada')
        }

        try {
            ofertas = await db.Oferta.findAll({
                where: {
                    usuarioId: usuarioId,
                    cicloId: {
                        [Op.not]: null
                    }
                },
                include: [{
                    model: db.OfertaProdutos,
                    as: 'ofertaProdutos',
                    where: {
                        produtoId: {
                            [Op.not]: null
                        },
                        quantidade: {
                            [Op.not]: 0
                        },
                    },
                }],
                raw: true,
                order: [['cicloId','DESC']]
            })
        } catch (error) {   
            console.log('msgSistema2: nenhuma oferta encontrada')
        }

        let quantCiclosPesquisados = 5
        let cicloContador = 0
        let cicloAtual = 0
        
        if (ofertas[0]) {
            cicloAtual = ofertas[0].cicloId
        }

        if (ofertas[0]) {
            for (let index = 0; index < ofertas.length; index++) {
                const oferta = ofertas[index];

                if (oferta.cicloId != cicloAtual) {
                    cicloContador += 1
                    cicloAtual = oferta.cicloId
                }

                if (cicloContador < quantCiclosPesquisados)

                ultimosProdutosOfertadosUsuario.push ({
                    cicloId: oferta.cicloId,
                    produtoId: oferta['ofertaProdutos.produtoId'],
                    quantidade: oferta['ofertaProdutos.quantidade'],
                    valorReferencia: oferta['ofertaProdutos.valorReferencia'],
                })
                
            }
        }
                
        produtos = await db.Produto.findAll({
            raw: true,
            where: {
                status: 'ativo'
            },
            order: ['nome']
        })

        if (ultimosProdutosOfertadosUsuario[0]) {

                for (let index = 0; index < produtos.length; index++) {
                    const produto = produtos[index];
                    
                    produtoMaisOfertado = ultimosProdutosOfertadosUsuario.find(produtoOfertado => Number(produtoOfertado.produtoId) === Number(produto.id))
                    

                    if (produtoMaisOfertado) {
                        ultimosProdutosOfertadosUsuarioDados.push ({
                            ...produto,
                            origemProduto: "maisOfertados"
                        })
                    } else {
                        produtosNaoOfertados.push ({
                            ...produto,
                            origemProduto: "restantes"
                        })
                    }

                }

                produtos = [...ultimosProdutosOfertadosUsuarioDados, ...produtosNaoOfertados];

        }
        
        return produtos

    }

    /*async deleteOferta (ofertaId) {
        await db.Oferta.destroy({
            where: {
                id: ofertaId
            }
          });
    }*/
    

}


