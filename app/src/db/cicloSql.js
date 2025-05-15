const db = require('../../models/index.js');
//const Ciclo = require('../model/ciclo.js');
//const CicloCestas = require('../model/ciclocestas.js');
//const CicloEntregas = require('../model/cicloentregas.js');
//const CicloProdutos = require('../model/cicloprodutos.js');

module.exports = {

    async getCiclosMin() {

        ciclos = await db.Ciclo.findAll({
            raw: true,
            order: ['retiradaConsumidorInicio']
        })

        ciclosWithEntregas = []
        for (let index = 0; index < ciclos.length; index++) {
            const ciclo = ciclos[index];
            
            cicloEntregas = await db.CicloEntregas.findAll({
                raw: true,
                where: {
                    cicloId: ciclo.id
                },
                order: ['entregaFornecedorInicio']
            })

            cicloEntregasArray = []
            for (let index = 0; index < cicloEntregas.length; index++) {
                const entrega = cicloEntregas[index];
                
                cicloEntregasArray.push ({
                    inicio: entrega.entregaFornecedorInicio,
                    fim: entrega.entregaFornecedorFim,
                })
            }

            ciclosWithEntregas.push ({
                id: ciclo.id,
                nome: ciclo.nome,
                pontoEntregaId: ciclo.pontoEntregaId,
                ofertaInicio: ciclo.ofertaInicio,
                ofertaFim: ciclo.ofertaFim,
                itensAdicionaisInicio: ciclo.itensAdicionaisInicio,
                itensAdicionaisFim: ciclo.itensAdicionaisFim,
                retiradaConsumidorInicio: ciclo.retiradaConsumidorInicio,
                retiradaConsumidorFim: ciclo.retiradaConsumidorFim,
                status:ciclo.status,
                entregaFornecedor: cicloEntregasArray
            })    

        }

        return {ciclos: ciclosWithEntregas }

    },

    async getCiclosMin_v2(dados) {

        ordenacao = ''
        ordenacao = dados.ordem
        //ordenacao = 'inversa'

        if (ordenacao == 'inversa') {
            ciclos = await db.Ciclo.findAll({
                raw: true,
                order: [['retiradaConsumidorInicio','DESC']]
            })
        } else {
            ciclos = await db.Ciclo.findAll({
                raw: true,
                order: ['retiradaConsumidorInicio']
            })
        }

        ciclosWithEntregas = []
        for (let index = 0; index < ciclos.length; index++) {
            const ciclo = ciclos[index];
            
            cicloEntregas = await db.CicloEntregas.findAll({
                raw: true,
                where: {
                    cicloId: ciclo.id
                },
                order: ['entregaFornecedorInicio']
            })

            cicloEntregasArray = []
            for (let index = 0; index < cicloEntregas.length; index++) {
                const entrega = cicloEntregas[index];
                
                cicloEntregasArray.push ({
                    inicio: entrega.entregaFornecedorInicio,
                    fim: entrega.entregaFornecedorFim,
                })
            }

            ciclosWithEntregas.push ({
                id: ciclo.id,
                nome: ciclo.nome,
                pontoEntregaId: ciclo.pontoEntregaId,
                ofertaInicio: ciclo.ofertaInicio,
                ofertaFim: ciclo.ofertaFim,
                itensAdicionaisInicio: ciclo.itensAdicionaisInicio,
                itensAdicionaisFim: ciclo.itensAdicionaisFim,
                retiradaConsumidorInicio: ciclo.retiradaConsumidorInicio,
                retiradaConsumidorFim: ciclo.retiradaConsumidorFim,
                entregaFornecedor: cicloEntregasArray
            })    

        }

        return {ciclos: ciclosWithEntregas }

    },


    async getCiclos() {

        let ciclos = []    
                
        /*ciclos = await db.Ciclo.findAll({
            raw: true,
            include: [{
                model: db.CicloCestas,
                as: 'CicloCestas',
            }]
        })*/

        ciclos = await db.Ciclo.findAll({
            raw: true,
            order: [['retiradaConsumidorInicio','DESC']]
        })

        
        cicloCestas = await db.CicloCestas.findAll({
            raw: true,
        })

        cicloEntregas = await db.CicloEntregas.findAll({
            raw: true,
        })

        cicloProdutos = await db.CicloProdutos.findAll({
            raw: true,
        })
         
        return {ciclos: ciclos, cicloCestas: cicloCestas, cicloEntregas: cicloEntregas, cicloProdutos: cicloProdutos }

    },

    async getCicloPorId(cicloId) {

        let ciclo = [] 
        
        
        ciclo = await db.Ciclo.findAll({
            raw: true,
            where: {
                id: cicloId
            } 
        });

        if (ciclo.length === 0) {
            console.log("ERRO_SISTEMA: Ciclo não existe")
            return 'error'
        }

        cicloCestas = await db.CicloCestas.findAll({
            raw: true,
            where: {
                cicloId: cicloId
            } 
          });
        
        console.log('cicloCestas',cicloCestas)

        cicloEntregas = await db.CicloEntregas.findAll({
            raw: true,
            where: {
                cicloId: cicloId
            } 
          });

        cicloOfertas = await db.Oferta.findAll({
            raw: true,
            where: {
                cicloId: cicloId
            } 
          });
        
        
        let arrayOfertas = []
        for (let index = 0; index < cicloOfertas.length; index++) {
            const oferta = cicloOfertas[index];
           arrayOfertas.push(oferta.id)
        }
        cicloOfertaProdutos = await db.OfertaProdutos.findAll({
            raw: true,
            where: {
                ofertaId: arrayOfertas
            } 
        });

        let arrayOfertaProdutos = []
        for (let index = 0; index < cicloOfertaProdutos.length; index++) {
            const ofertaProduto = cicloOfertaProdutos[index];

            arrayOfertaProdutos.push(ofertaProduto.id)
        }
        cicloPedidosFornecedores = await db.PedidosFornecedores.findAll({
            raw: true,
            where: {
                ofertaProdutoId: arrayOfertaProdutos
            } 
        });
        
        let cicloComposicoes = []
        for (let index = 0; index < cicloCestas.length; index++) {
            const cicloCesta = cicloCestas[index];

            composicaoCesta = await db.Composicoes.findAll({
                raw: true,
                where: {
                    cicloCestaId: cicloCesta.id
                } 
              });

              if (composicaoCesta[0]) {
                    cicloComposicoes.push({
                        id: composicaoCesta[0].id,
                        cicloCestaId: composicaoCesta[0].cicloCestaId,
                        cestaId: cicloCesta.cestaId,
                        quantidadeCestas: cicloCesta.quantidadeCestas
                    })
                }
        }

        cicloPedidoConsumidores = await db.PedidoConsumidores.findAll({
            raw: true,
            where: {
                cicloId: cicloId
            } 
          });
        
        
        let arrayPedidoConsumidores = []
        for (let index = 0; index < cicloPedidoConsumidores.length; index++) {
            const pedidoConsumidor = cicloPedidoConsumidores[index];
           arrayPedidoConsumidores.push(pedidoConsumidor.id)
        }
        cicloPedidoConsumidoresProdutos = await db.PedidoConsumidoresProdutos.findAll({
            raw: true,
            where: {
                pedidoConsumidorId: arrayPedidoConsumidores
            } 
        });

        //cicloProdutos = await db.CicloProdutos.findAll({
            //raw: true,
        //}
         
        return {
            ciclo: ciclo,
            cicloCestas: cicloCestas,
            cicloEntregas: cicloEntregas,
            cicloOfertas: cicloOfertas,
            cicloOfertaProdutos: cicloOfertaProdutos,
            cicloComposicoes: cicloComposicoes,
            cicloPedidosFornecedores: cicloPedidosFornecedores,
            cicloPedidoConsumidores: cicloPedidoConsumidores
        }

    },

    

    async insertNewCiclo (newCiclo) {
        
        await db.Ciclo.create({
            nome: newCiclo.nome,
            pontoEntregaId: newCiclo.pontoEntregaId,
            ofertaInicio: ((newCiclo.ofertaInicio)  ? (newCiclo.ofertaInicio) : null),
            ofertaFim: ((newCiclo.ofertaFim) ? (newCiclo.ofertaFim) : null) ,
            itensAdicionaisInicio: ((newCiclo.itensAdicionaisInicio) ? (newCiclo.itensAdicionaisInicio) : null),
            itensAdicionaisFim: ((newCiclo.itensAdicionaisFim) ? (newCiclo.itensAdicionaisFim) : null),
            retiradaConsumidorInicio: ((newCiclo.retiradaConsumidorInicio) ? (newCiclo.retiradaConsumidorInicio) : null),
            retiradaConsumidorFim: ((newCiclo.retiradaConsumidorFim) ? (newCiclo.retiradaConsumidorFim) : null),
            observacao: newCiclo.observacao,
        })
        .then(result => (cicloId = result.id))

        newCicloEntregas = newCiclo.cicloEntregas
        newCicloCestas = newCiclo.cicloCestas
        
        if (newCicloEntregas) {
            for (let index = 0; index < newCicloEntregas.length; index++) {
                const cicloEntrega = newCicloEntregas[index];

                await db.CicloEntregas.create({
                    cicloId: cicloId,
                    entregaFornecedorInicio: ((cicloEntrega.entregaFornecedorInicio) ? (cicloEntrega.entregaFornecedorInicio) : null),
                    entregaFornecedorFim: ((cicloEntrega.entregaFornecedorFim) ? (cicloEntrega.entregaFornecedorFim) : null),
                    })  
            }
        }

        if (newCicloCestas) {
                try {
                    for (let index = 0; index < newCicloCestas.length; index++) {
                        const cicloCesta = newCicloCestas[index];
                        
                        if (cicloCesta.quantidadeCestas >= 0) {

                            await db.CicloCestas.create({
                                cicloId: cicloId,
                                cestaId: cicloCesta.cestaId,
                                quantidadeCestas: cicloCesta.quantidadeCestas,
                            })
                        }

                    }

                } catch (error) {
                    console.log("Ciclo Criaçao: erro na criação das cestas")
                }

                try {
                        
                    // cestas reservadas de sistema pedidoExtra e pedidosAdicionais

                    await db.CicloCestas.create({
                                cicloId: cicloId,
                                cestaId: 1,
                                quantidadeCestas: 1,
                            })
                    
                    await db.CicloCestas.create({
                        cicloId: cicloId,
                        cestaId: 5,
                        quantidadeCestas: 1,
                    })

                } catch (error) {
                    console.log("Ciclo Criaçao: erro na criação das cestas padrões")
                }
            }
        
    },

    async updateCiclo (ciclo) {

        console.log('Comecou updateCiclo',ciclo.id)
                            
        await db.Ciclo.update({
            nome: ciclo.nome,
            pontoEntregaId: ciclo.pontoEntregaId,
            ofertaInicio: ((ciclo.ofertaInicio) ? (ciclo.ofertaInicio) : null),
            ofertaFim: ((ciclo.ofertaFim) ? (ciclo.ofertaFim) : null),
            itensAdicionaisInicio: ((ciclo.itensAdicionaisInicio) ? (ciclo.itensAdicionaisInicio) : null),
            itensAdicionaisFim: ((ciclo.itensAdicionaisFim) ? (ciclo.itensAdicionaisFim) : null),
            retiradaConsumidorInicio: ((ciclo.retiradaConsumidorInicio) ? (ciclo.retiradaConsumidorInicio) : null),
            retiradaConsumidorFim: ((ciclo.retiradaConsumidorFim) ? (ciclo.retiradaConsumidorFim) : null),
            observacao: ciclo.observacao
          }, {
            where: {
                id: ciclo.id
            } 
          });

          newCicloEntregas = ciclo.cicloEntregas
          newCicloCestas = ciclo.cicloCestas
          //newCicloProdutos = ciclo.produtos

          await db.CicloEntregas.destroy({
            where: {
                cicloId: ciclo.id
            }
          });


          if (newCicloEntregas) {
                for (let index = 0; index < newCicloEntregas.length; index++) {
                    const cicloEntrega = newCicloEntregas[index];

                    await db.CicloEntregas.create({
                        cicloId: ciclo.id,
                        entregaFornecedorInicio: ((cicloEntrega.entregaFornecedorInicio) ? (cicloEntrega.entregaFornecedorInicio) : null),
                        entregaFornecedorFim: ((cicloEntrega.entregaFornecedorFim) ? (cicloEntrega.entregaFornecedorFim)  : null),
                    }); 
                    
                }
          }

          if (newCicloCestas) {
                    for (let index = 0; index < newCicloCestas.length; index++) {
                            const cicloCesta = newCicloCestas[index]

                            let cicloCestaResult = []

                            
                            if (cicloCesta.quantidadeCestas >= 0) {

                                    const results = await db.CicloCestas.findAll({
                                        raw: true,
                                        where: {
                                            cicloId: Number(ciclo.id),
                                            cestaId: Number(cicloCesta.cestaId)
                                        }
                                    })
                                    .then(result => (cicloCestaResult = result))

                                    
                                    if (cicloCestaResult[0]) {

                                        const cicloCestaId = cicloCestaResult[0].id

                                        console.log('quantidadeCestas: Number(cicloCesta.quantidadeCestas): ',Number(cicloCesta.quantidadeCestas))
                                        console.log('cicloCestaId: ',Number(cicloCestaId))
                                        console.log('Number(ciclo.id): ',Number(ciclo.id))
                                        console.log('Number(cicloCesta.cestaId): ',Number(cicloCesta.cestaId))

                                        
                                        /*await db.CicloCestas.update({
                                            quantidadeCestas: Number(cicloCesta.quantidadeCestas)
                                        }, {
                                            where: {
                                                id: cicloCestaId
                                            } 
                                        })
                                    }  
                                    else {
                                        await db.CicloCestas.create({
                                            cicloId: Number(ciclo.id),
                                            cestaId: Number(cicloCesta.cestaId),
                                            quantidadeCestas: Number(cicloCesta.quantidadeCestas)
                                        })*/
                                        
                                    }    
                            }
                    }
            }

    },

    async updateCicloStatus (ciclo) {
        await db.Ciclo.update({
            status: ciclo.status
          }, {
            where: {
                id: ciclo.id
            } 
          });

    },


    async deleteCiclo (cicloId) {
        /*await db.CicloEntregas.destroy({
            where: {
                id: cicloId
            }
        });
        
        await db.CicloCestas.destroy({
            where: {
                id: cicloId
            }
        });*/

        /*await db.CicloProdutos.destroy({
            where: {
                id: cicloId
            }
        });*/

        await db.Ciclo.destroy({
            where: {
                id: cicloId
            }
        });
    }
    

}


