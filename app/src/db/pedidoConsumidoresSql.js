const db = require('../../models/index.js');

module.exports = {

    async getProdutosPedidosConsumidores(cicloId,usuarioId,view) {
        
        if ((view == "all") || (view == "all_t")) {
            try {
                pedidosConsumidores = await db.PedidoConsumidores.findAll({
                    raw: true,
                    where: {
                        cicloId: cicloId
                    } 
                })
            } catch (error) {
                console.log("nenhum pedido encontrado")
            }
            
        } else {
            try {
                pedidosConsumidores = await db.PedidoConsumidores.findAll({
                    raw: true,
                    where: {
                        cicloId: cicloId,
                        usuarioId: usuarioId
                    } 
                })
            } catch (error) {
                console.log("nenhum pedido encontrado para este usuario")
            }
            
        }

        ProdutosPedidosConsumidores = []
        for (let index = 0; index < pedidosConsumidores.length; index++) {
            const pedidoConsumidores = pedidosConsumidores[index];

            try {
                produtosPedidosConsumidores = await db.PedidoConsumidoresProdutos.findAll({
                    raw: true,
                    where: {
                        pedidoConsumidorId: pedidoConsumidores.id
                    } 
                })
            } catch (error) {
                console.log("nenhum produto encontrado")
            }
            

            for (let index = 0; index < produtosPedidosConsumidores.length; index++) {
                const produtoPedidoConsumidor = produtosPedidosConsumidores[index];
    

                    ProdutosPedidosConsumidores.push({
                        usuarioId: pedidoConsumidores.usuarioId,
                        cicloId: pedidoConsumidores.cicloId,
                        produtoId: produtoPedidoConsumidor.produtoId,
                        quantidade: produtoPedidoConsumidor.quantidade
                    })
            }


        }

        

        return ProdutosPedidosConsumidores

    },

    async getQuantidadeProdutoPedidoConsumidores(cicloIdProdutoId) {
        
        pedidosConsumidores = await db.PedidoConsumidores.findAll({
            raw: true,
            where: {
                cicloId: cicloIdProdutoId.cicloId
            } 
        })

        arrayProdutosPedidosConsumidores = []
        pedidosConsumidores.forEach(pedidoConsumidor => {
            arrayProdutosPedidosConsumidores.push(pedidoConsumidor.id)
        });

        console.log("arrayProdutosPedidosConsumidores: ", arrayProdutosPedidosConsumidores)

        quantidadeProdutosPedidosConsumidores = await db.PedidoConsumidoresProdutos.findAll({
            attributes: [
                [db.sequelize.fn('sum', db.sequelize.col('quantidade')), 'SumQuantidade'],
              ],
              where: {
                pedidoConsumidorId: arrayProdutosPedidosConsumidores,
                produtoId: cicloIdProdutoId.produtoId

            },
            //attributes: [[sequelize.fn('max', sequelize.col('quantidade')), 'sumQuantidade']],
            raw: true,
            group: ['produtoId'],
        })
        
        if (quantidadeProdutosPedidosConsumidores[0]) {
            quantidadeProdutosPedidosConsumidores = quantidadeProdutosPedidosConsumidores[0].SumQuantidade
        } else {
            quantidadeProdutosPedidosConsumidores = 0
        }
    
        return quantidadeProdutosPedidosConsumidores

    },


    async getPedidoConsumidor(cicloIdUsuarioIdProdutoId) {

        try {
            pedidoConsumidor = await db.PedidoConsumidores.findAll({
                raw: true,
                where: {
                    cicloId: cicloIdUsuarioIdProdutoId.cicloId,
                    usuarioId: cicloIdUsuarioIdProdutoId.usuarioId
                } 
            })
        } catch (error) {
            console.log("Nenhum pedido extra encontrado")
        }
        
        
        let quantPedido = 0

        if (pedidoConsumidor[0]) {
            pedidoConsumidorId = pedidoConsumidor[0].id
        
            try {
                pedidoConsumidorProduto = await db.PedidoConsumidoresProdutos.findAll({
                    raw: true,
                    where: {
                        pedidoConsumidorId: pedidoConsumidorId,
                        produtoId: cicloIdUsuarioIdProdutoId.produtoId
                    } 
                })
            } catch (error) {
                console.log("Nenhum produto encontrado")
            }
            

            if (pedidoConsumidorProduto[0]) {
                quantPedido = pedidoConsumidorProduto[0].quantidade
            }
        }

        pedidoConsumidorDados = []

        if (pedidoConsumidor[0]) {
            pedidoConsumidorDados.push({
                quantPedido: quantPedido,
                status: pedidoConsumidor[0].status
            })
        } 

        return pedidoConsumidorDados[0]
    },

    async findOrCreatePedidoConsumidor(cicloIdUsuarioId) {

        let pedidoResult = []

        const results = await db.PedidoConsumidores.findOrCreate({
                raw: true,
                where: {
                    cicloId: cicloIdUsuarioId.cicloId,
                    usuarioId: cicloIdUsuarioId.usuarioId
                } 
            })
            .then(result => (pedidoResult = result))

            pedidoConsumidorId = pedidoResult[0].id
  
            return pedidoConsumidorId
    },

    async findOrCreatePedidoConsumidorProduto(pedidoConsumidorIdProdutoId) {

        const results = await db.PedidoConsumidoresProdutos.findOrCreate({
            raw: true,
            where: {
                pedidoConsumidorId: pedidoConsumidorIdProdutoId.pedidoConsumidorId,
                produtoId: pedidoConsumidorIdProdutoId.produtoId
            } 
        })
         .then(result => (pedidoResult = result))

        pedidoConsumidorProdutoId = pedidoResult[0].id

        return pedidoConsumidorProdutoId
    },

    async updatePedidoConsumidoresProduto(pedidoConsumidorProduto) {
        await db.PedidoConsumidoresProdutos.update({
            quantidade: pedidoConsumidorProduto.quantidade
          }, {
            where: {
                id: pedidoConsumidorProduto.id
            } 
          });

          /*if (pedidoConsumidorProduto.status == 'finalizado')
          {
                await db.PedidoConsumidores.update({
                    status: pedidoConsumidorProduto.status
                }, {
                    where: {
                        id: pedidoConsumidorProduto.pedidoConsumidorId
                    } 
                });
          }*/
    },

    async finalizaPedidoConsumidor(pedidoConsumidor) {
          
        await db.PedidoConsumidores.update({
            status: pedidoConsumidor.status
        }, {
            where: {
                id: pedidoConsumidor.pedidoConsumidorId
            } 
        });
          
    },

    async pedidoConsumidorFinalizado(cicloId, usuarioId) {
        pedidoConsumidor = await db.PedidoConsumidores.findAll({
            raw: true,
            where: {
                cicloId: cicloId,
                usuarioId: usuarioId
            } 
          })

          usuarioPedidoFinalizado = false
          if (pedidoConsumidor[0]) {
            if (pedidoConsumidor[0].status == 'finalizado') {
                usuarioPedidoFinalizado = true
            }
          }

          return usuarioPedidoFinalizado
    },


    


    /*async deleteComposicoesZero (composicao) {
        await db.ComposicaoOfertaProdutos.destroy({
            where: {
                composicaoId: composicaoId,
                quantidade: 0
            }
          });
    }*/

    /*async deleteComposicao (composicaoId) {
        await db.Composicoes.destroy({
            where: {
                id: composicaoId
            }
          });
    }*/
    

}


