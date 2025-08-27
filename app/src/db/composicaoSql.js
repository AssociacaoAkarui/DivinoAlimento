const db = require('../../models/index.js');

module.exports = {


    async getQuantidadeComposicaoSobra(usuarioIdcicloIdprodutoId) {
        
        composicaoSobra = await db.CicloCestas.findAll ({
            raw: true,
            where: {
                cicloId: usuarioIdcicloIdprodutoId.cicloId,
                cestaId: 1
            },  
            include: [{
                model: db.Composicoes,
                as: 'cicloCesta',
            }]
        })

        const composicaoItensAdicionais = composicaoSobra[0]
        const composicaoSobraId = composicaoItensAdicionais['cicloCesta.id']

        ofertaUsuario = await db.Oferta.findAll({
            raw: true,
            where: {
                usuarioId: usuarioIdcicloIdprodutoId.usuarioId,
                cicloId: usuarioIdcicloIdprodutoId.cicloId
            },  
            include: [{
                model: db.OfertaProdutos,
                as: 'ofertaProdutos',
                where: {
                    produtoId: usuarioIdcicloIdprodutoId.produtoId
                },
            }]
        })

        const ofertaUsuarioPorProduto = ofertaUsuario[0]
        const ofertaProdutoId = ofertaUsuarioPorProduto['ofertaProdutos.id']
        console.log('ofertaUsuarioPorProduto',ofertaUsuarioPorProduto)

        /*pedidos = await db.ComposicaoOfertaProdutos.findAll({
            raw: true,
            where: {
                composicaoId: composicaoSobraId,
                ofertaProdutoId: ofertaProdutoId
            },  
            include: [{
                model: db.OfertaProdutos,
                as: 'ofertaProduto',
                where: {
                    ofertaProdutoId: ofertaProdutoId
                },
            }]
        })*/


        pedidos = await db.ComposicaoOfertaProdutos.findAll({
            raw: true,
            where: {
                composicaoId: composicaoSobraId,
                ofertaProdutoId: ofertaProdutoId
            }
        })

        let totalPorProduto = 0
        for (let index = 0; index < pedidos.length; index++) {
            const pedido = pedidos[index];

            totalPorProduto = totalPorProduto + Number(pedido.quantidade)
            
        }
        
        return totalPorProduto

    },



    async getProdutosPorComposicao(composicaoId) {
        
                
        produtosComposicao = await db.ComposicaoOfertaProdutos.findAll({
            raw: true,
            where: {
                composicaoId: composicaoId.composicaoId
            },
            order: ['id'],  
            include: [{
                model: db.OfertaProdutos,
                as: 'ofertaProduto',
            }]
        })

        return produtosComposicao

    },

    async getProdutosTodasComposicoes(cicloId) {


        composicoes = await db.CicloCestas.findAll ({
            raw: true,
            where: {
                cicloId: cicloId,
                cestaId: {
                    [db.Sequelize.Op.ne]: 1 // desconsidera a cesta 1, da lista de produtos que foram ofertados no extra
                }
            },  
            include: [{
                model: db.Composicoes,
                as: 'cicloCesta',
            }]
        })

        produtosTodasComposicoes = []
        
        for (let index = 0; index < composicoes.length; index++) {
            const composicaoId = composicoes[index].id;

            produtosComposicao = await db.ComposicaoOfertaProdutos.findAll({
                raw: true,
                where: {
                    composicaoId: composicaoId
                },
                order: ['id'],  
                include: [{
                    model: db.OfertaProdutos,
                    as: 'ofertaProduto',
                }]
            })

            produtosTodasComposicoes.push ({
                produtosComposicao
            })
        }

        produtosTransacionados = []
        produtosComposicao = []


        //console.log("_______________________________", produtosTodasComposicoes)

        for (let index = 0; index < produtosTodasComposicoes.length; index++) {
            const { produtosComposicao } = produtosTodasComposicoes[index];

            if (Array.isArray(produtosComposicao)) {
                    for (let index2 = 0; index2 < produtosComposicao.length; index2++) {
                        const produtoComposicao = produtosComposicao[index2];
                        
                            produtosTransacionados.push ({
                                nome: "produto_nome",
                                id: produtoComposicao['ofertaProduto.id'],
                                cicloId: 'ciclo',
                                consumidor: 'consumidor',
                                produtoId: produtoComposicao.id,
                                valorAcumuladoPedido: 0,
                                medida: 'medida',
                                valorReferencia: 0,
                                quantidade: produtoComposicao['ofertaProduto.quantidade']
                            })
                    }
            
            } else {
                console.log("produtosComposicao não é um array:", produtosComposicao);
            }
        }


        
        // busca produtos comprados diretamente pelos consumidores
        
        /*try {
            pedidosConsumidores = await db.PedidoConsumidores.findAll({
                raw: true,
                where: {
                    cicloId: cicloId
                } 
            })
        } catch (error) {
            console.log("nenhum pedido encontrado")
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


        }*/

        

        //return ProdutosPedidosConsumidores










            
        //produtosTransacionados = produtosTodasComposicoes

        return produtosTransacionados

    },

    async getQuantidadeProdutosComposicaoOld(composicoesProdutoId) {
                
        quantidadeProdutosComposicao = await db.ComposicaoOfertaProdutos.findAll({
            attributes: [
                [db.sequelize.fn('sum', db.sequelize.col('quantidade')), 'SumQuantidade'],
              ],
            where: {
                composicaoId: composicoesProdutoId.arrayComposicoes,
                produtoId: composicoesProdutoId.produtoId

            },
            //attributes: [[sequelize.fn('max', sequelize.col('quantidade')), 'sumQuantidade']],
            raw: true,
            group: ['produtoId'],
        })

        return quantidadeProdutosComposicao

    },

    async getPedidoPorOfertaComposicao(oferta) {

        PedidoPorOferta = await db.ComposicaoOfertaProdutos.findAll({
            where: {
                ofertaProdutoId: oferta.ofertaProdutoId,
                composicaoId:oferta.composicaoId
            },
            raw: true,
        })

        quantidadePedidoPorOferta = 0
        if (PedidoPorOferta[0]) {
            quantidadePedidoPorOferta = PedidoPorOferta[0].quantidade
        }
        
        return quantidadePedidoPorOferta

    },

    async getPedidosPorOferta(ofertacicloCestas) {

        cicloCestaTodas = ofertacicloCestas.cicloCestas

        arraycicloCestaSoValidas = []
        for (let index = 0; index < cicloCestaTodas.length; index++) {
            const cicloCesta = cicloCestaTodas[index];
            
            /* desconsiderar cesta auxiliar de oferta de itens adicionais*/
            if (Number(cicloCesta.cestaId) != 1) {
                arraycicloCestaSoValidas.push(cicloCesta.id)
            }
        }

        pedidosPorOferta = await db.ComposicaoOfertaProdutos.findAll({
            raw: true,
            where: {
                ofertaProdutoId: ofertacicloCestas.ofertaProdutoId
            },  
            include: [{
                model: db.Composicoes,
                as: 'composicaoOfertaProdutos',
                where: {
                    cicloCestaId: arraycicloCestaSoValidas
                },
            }]
        })

        /*quantidadePedidoPorOferta = 0
        if (pedidoPorOferta[0]) {
            for (let index = 0; index < pedidoPorOferta.length; index++) {
                const pedido = pedidoPorOferta[index];
                quantidadePedidoPorOferta = quantidadePedidoPorOferta + pedido.quantidade
            }
        }*/
        
        return pedidosPorOferta

    },

    async findOrCreateComposicao (composicaoCicloCestaId) {

        let composicaoResult = []


        try {
                const results = await db.Composicoes.findOrCreate({
                                    raw: true,
                                    where: {
                                        cicloCestaId: composicaoCicloCestaId.cicloCestaId
                                    } 
                                })
                .then(result => (composicaoResult = result))
        } catch (error) {
            console.log("ERRO_SISTEMA: erro na criacao ou localizacao da composicao")
            return 'error'
        }

        const composicao = composicaoResult[0]

        return composicao
    },

    async findOrCreateComposicaoProduto (composicaoProduto) {

        let pedidoResult = []

        const results = await db.ComposicaoOfertaProdutos.findOrCreate({
                raw: true,
                where: {
                    composicaoId: composicaoProduto.composicaoId,
                    ofertaProdutoId: composicaoProduto.ofertaProdutoId
                } 
            })
            .then(result => (pedidoResult = result))

        composicaoOfertaProdutoId = pedidoResult[0].id
      
        return composicaoOfertaProdutoId
    },

    async updateComposicao (composicao) {
        await db.Composicoes.update({
            cestaId: composicao.cestaId
            //nome: composicao.nome,
            //valormaximo: composicao.valormaximo,
            //status: composicao.status
          }, {
            where: {
                cicloId: composicao.cicloId,
                cicloCestaId: composicao.cestaId
            } 
          });
    },

    async updateComposicaoProduto (composicaoProduto) {
        await db.ComposicaoOfertaProdutos.update({
            quantidade: composicaoProduto.quantidade
          }, {
            where: {
                id: composicaoProduto.id
            } 
          });
    },

    async deleteComposicoesZero (composicao) {
        await db.ComposicaoOfertaProdutos.destroy({
            where: {
                composicaoId: composicaoId,
                quantidade: 0
            }
          });
    },

    /*async deleteComposicao (composicaoId) {
        await db.Composicoes.destroy({
            where: {
                id: composicaoId
            }
          });
    }*/

    async getQuantidadeComposicaoOfertaProdutoPorFornecedor(ofertaProdutoId) {
                
        quantidadeComposicaoOfertaProdutoPorFornecedor = await db.ComposicaoOfertaProdutos.findAll({
            attributes: [
                [db.sequelize.fn('sum', db.sequelize.col('quantidade')), 'SumQuantidade'],
              ],
              where: {
                ofertaProdutoId: ofertaProdutoId.arrayProdutosOfertas

            },
            //attributes: [[sequelize.fn('max', sequelize.col('quantidade')), 'sumQuantidade']],
            raw: true,
        })

        quantidadeComposicaoOfertaProdutoPorFornecedor = quantidadeComposicaoOfertaProdutoPorFornecedor[0].SumQuantidade
    
        return quantidadeComposicaoOfertaProdutoPorFornecedor

    },

    async getValorTotalPedidoAcumulado(usuarioIdCicloIdcicloCestas) {
        
        oferta = await db.Oferta.findAll ({
            raw: true,
            where: {
                cicloId: usuarioIdCicloIdcicloCestas.cicloId,
                usuarioId: usuarioIdCicloIdcicloCestas.usuarioId
            },
        })

        ofertas = await db.OfertaProdutos.findAll ({
            //attributes: ['id'],
            raw: true,
            where: {
                ofertaId: oferta[0].id
            },
        })

        arrayOfertasProdutos = []
        for (let index = 0; index < ofertas.length; index++) {
            const oferta = ofertas[index];
            arrayOfertasProdutos.push(oferta.id)
        }

        cicloCestaTodas = usuarioIdCicloIdcicloCestas.cicloCestas

        arraycicloCestaSoValidas = []
        for (let index = 0; index < cicloCestaTodas.length; index++) {
            const cicloCesta = cicloCestaTodas[index];
            
            /* desconsiderar cesta auxiliar de oferta de itens adicionais*/
            if (Number(cicloCesta.cestaId) != 1) {
                arraycicloCestaSoValidas.push(cicloCesta.id)
            }
        }
        
        
        pedidos = await db.ComposicaoOfertaProdutos.findAll({
            raw: true,
            where: {
                ofertaProdutoId: arrayOfertasProdutos
            },  
            include: [{
                model: db.Composicoes,
                as: 'composicaoOfertaProdutos',
                where: {
                    cicloCestaId: arraycicloCestaSoValidas
                },
            }]
        })


        produtos = await db.Produto.findAll({
            raw: true,
        })

        let valorTotal = 0
        for (let index = 0; index < pedidos.length; index++) {
            const pedido = pedidos[index];

            ofertaProduto = ofertas.find(oferta => Number(oferta.id) === Number(pedido.ofertaProdutoId))

            produtoDados = produtos.find(produto => Number(produto.id) === Number(ofertaProduto.produtoId))

            valorTotal = valorTotal + Number(pedido.quantidade) * Number(produtoDados.valorReferencia)
            
        }

        
        return valorTotal

    },

    async getTotalProdutosPedidoAcumulado(usuarioIdCicloIdProdutoIdcicloCestas) {
        
        oferta = await db.Oferta.findAll ({
            raw: true,
            where: {
                cicloId: usuarioIdCicloIdProdutoIdcicloCestas.cicloId,
                usuarioId: usuarioIdCicloIdProdutoIdcicloCestas.usuarioId
            },
        })

        ofertas = await db.OfertaProdutos.findAll ({
            //attributes: ['id'],
            raw: true,
            where: {
                ofertaId: oferta[0].id,
                produtoId: usuarioIdCicloIdProdutoIdcicloCestas.produtoId
            },
        })

        arrayOfertasProdutos = []
        for (let index = 0; index < ofertas.length; index++) {
            const oferta = ofertas[index];
            arrayOfertasProdutos.push(oferta.id)
        }

        cicloCestaTodas = usuarioIdCicloIdProdutoIdcicloCestas.cicloCestas

        arraycicloCestaSoValidas = []
        for (let index = 0; index < cicloCestaTodas.length; index++) {
            const cicloCesta = cicloCestaTodas[index];
            
            /* desconsiderar cesta auxiliar de oferta de itens adicionais*/
            if (Number(cicloCesta.cestaId) != 1) {
                arraycicloCestaSoValidas.push(cicloCesta.id)
            }
        }


        pedidos = await db.ComposicaoOfertaProdutos.findAll({
            raw: true,
            where: {
                ofertaProdutoId: arrayOfertasProdutos
            },  
            include: [{
                model: db.Composicoes,
                as: 'composicaoOfertaProdutos',
                where: {
                    cicloCestaId: arraycicloCestaSoValidas
                },
            }]
        })

        /*produtos = await db.Produto.findAll({
            raw: true,
        })*/

        let Total = 0
        for (let index = 0; index < pedidos.length; index++) {
            const pedido = pedidos[index];

            Total = Total + Number(pedido.quantidade)
            
        }

        
        return Total

    },

  
    async getTotalProdutosPedidosComposicaoItensAdicionais(usuarioIdCicloIdProdutoId) {
        
        composicao = await db.CicloCestas.findAll ({
            raw: true,
            where: {
                cicloId: usuarioIdCicloIdProdutoId.cicloId,
                cestaId: 1
            },  
            include: [{
                model: db.Composicoes,
                as: 'cicloCesta',
            }]
        })

        const composicaoItensAdicionais = composicao[0]
        const composicaoId = composicaoItensAdicionais['cicloCesta.id']

        pedidos = await db.ComposicaoOfertaProdutos.findAll({
            raw: true,
            where: {
                composicaoId: composicaoId
            },  
            include: [{
                model: db.OfertaProdutos,
                as: 'ofertaProduto',
                where: {
                    produtoId: usuarioIdCicloIdProdutoId.produtoId
                },
            }]
        })

        let totalPorProduto = 0
        for (let index = 0; index < pedidos.length; index++) {
            const pedido = pedidos[index];

            totalPorProduto = totalPorProduto + Number(pedido.quantidade)
            
        }
        
        return totalPorProduto

    },



    async getQuantidadeProdutoPedidoFornecedores(ofertaProdutoId) {
                
        quantidadeProdutosPedidosFornecedores = await db.PedidosFornecedores.findAll({
            attributes: [
                [db.sequelize.fn('sum', db.sequelize.col('quantidade')), 'SumQuantidade'],
              ],
              where: {
                ofertaProdutoId: ofertaProdutoId.arrayProdutosOfertas

            },
            //attributes: [[sequelize.fn('max', sequelize.col('quantidade')), 'sumQuantidade']],
            raw: true,
        })

        quantidadeProdutosPedidosFornecedores = quantidadeProdutosPedidosFornecedores[0].SumQuantidade
    
        return quantidadeProdutosPedidosFornecedores

    },

    async getPedidoFornecedores(ofertaProdutoId) {


        pedidosFornecedores = await db.PedidosFornecedores.findAll({
                raw: true,
                where: {
                    ofertaProdutoId: ofertaProdutoId.id
                } 
            })
        
        let quantPedido = 0
        pedidosFornecedores.forEach(pedidoFornecedores => {
            quantPedido = pedidoFornecedores.quantidade 
        });

        console.log("quantPedido:",quantPedido)
        
  
        return quantPedido
    },

    async findOrCreatePedidosFornecedores(pedidoFornecedores) {

        let pedidoResult = []

        const results = await db.PedidosFornecedores.findOrCreate({
                raw: true,
                where: {
                    ofertaProdutoId: pedidoFornecedores.ofertaProdutoId
                } 
            })
            .then(result => (pedidoResult = result))
    
            pedidoFornecedores = pedidoResult[0].id
  
            return pedidoFornecedores
    },

    async updatePedidosFornecedores(pedidoFornecedores) {
        await db.PedidosFornecedores.update({
            quantidade: pedidoFornecedores.quantidade
          }, {
            where: {
                id: pedidoFornecedores.id
            } 
          });
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


