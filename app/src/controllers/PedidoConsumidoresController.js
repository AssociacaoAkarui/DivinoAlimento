const Composicao = require('../model/Composicao')
const Ciclo = require('../model/Ciclo')
const Produto = require('../model/Produto')
const Usuario = require('../model/Usuario')
const Oferta = require('../model/Oferta')
const PedidoConsumidores = require('../model/PedidoConsumidores')
const Movimentacao = require('../model/Movimentacao')
const Profile = require('../model/Profile')


module.exports = {

    async showCreateEdit(req, res) {
        const cicloId = req.params.id

        // USUARIO V010921
        usuarioAtivo = []
        loginStatus = ""
        user = req.oidc.user
        if (user) {
            
            // Já é usuário cadastrado na base do sistema

            usuarioCadastrado = await Usuario.retornaUsuarioCadastrado(user.email)

            if (usuarioCadastrado != 0) {

                console.log('LOG: usuario cadastrado encontrado:', usuarioCadastrado)

                usuarioAtivo.push({
                    email: user.email,
                    picture: user.picture,
                    name: user.name,
                    email_verified: user.email_verified,
                    id: usuarioCadastrado.id,
                    perfil: usuarioCadastrado.perfil       
                })

                loginStatus = 'usuarioAtivo'

            }
            else {

                usuarioAtivo.push({
                    email: user.email,
                    picture: user.picture,
                    name: user.name,
                    email_verified: user.email_verified
                })
                
                return res.render('usuarionovo',{usuarioAtivo: usuarioAtivo[0]})
     
            }  

        }
        // USUARIO FIM


        
        // quando não informado mostra tela de pedidos do usuário corrente
        let usuarioId = usuarioCadastrado.id
        console.log("usuarioId",usuarioId)

        if (req.query.usr) {
            usuarioId = req.query.usr
        }

        let usuarios = []
        try {
            // to-do: trazer apensas usuários que podem ser geridos por usuário corrente
            usuarios = await Usuario.get()
        } catch (error) {
            //console.log('OfertaController error - falha Usuario.get')
        }

        usuarios.sort((a,b) => (a.nome.toLowerCase() > b.nome.toLowerCase()) ? 1 : ((b.nome.toLowerCase() > a.nome.toLowerCase()) ? -1 : 0))
        

        const usuarioConsumidor = usuarios.find(usuario => Number(usuario.id) === Number(usuarioId)) 
        

        pedidoConsumidorId = await PedidoConsumidores.findOrCreatePedidoConsumidor({
            cicloId: cicloId,
            usuarioId: usuarioId
        })

        if (pedidoConsumidorId == 'error') {

            return res.send('Ciclo e/ou Usuário não existem!')

        }  

       const produtos = await Produto.get();


        const dadosCiclo = await Ciclo.getCicloId(cicloId)
        ciclo = dadosCiclo.ciclo[0]

        const cicloComposicoes = dadosCiclo.cicloComposicoes
        console.log('cicloComposicoes',cicloComposicoes)

       // erro quando cesta GrupoCompras não existe, código me parece desnecessário
        /*composicaoGrupoCompras = cicloComposicoes.find(cicloComposicao => Number(cicloComposicao.cestaId) == 3)
        
        if (!composicaoGrupoCompras) {
            composicaoGrupoCompras = cicloComposicoes.find(cicloComposicao => Number(cicloComposicao.cestaId) == 7) 
        }
        console.log('composicaoGrupoCompras',composicaoGrupoCompras)

        composicaoIdGrupoCompras = composicaoGrupoCompras.id

        produtosComposicao = await Composicao.getProdutosPorComposicao({
            composicaoId: composicaoIdGrupoCompras
        })

        produtosComposicao.sort((a,b) => (a['ofertaProduto.produtoId'] > b['ofertaProduto.produtoId']) ? 1 : ((b['ofertaProduto.produtoId'] > a['ofertaProduto.produtoId']) ? -1 : 0))

        
        let produtosComposicaoDados = []
        let prodCompCorrente = 0

        if (Number(produtosComposicao[0]['ofertaProduto.produtoId']) > 0) {
            prodCompCorrente = produtosComposicao[0]['ofertaProduto.produtoId']
            let produtoDadosComp = produtos.find(produto => Number(produto.id) === Number(produtosComposicao[0]['ofertaProduto.produtoId']))
            nomeProdutoComposicaoDados = produtoDadosComp.nome
        }
        let quantidadeProdutoComposicaoDados = 0
        produtosComposicao.forEach(produtoComposicao => {
            
            if (Number(produtoComposicao['ofertaProduto.produtoId']) > 0) {

                if (prodCompCorrente == (produtoComposicao['ofertaProduto.produtoId'])) {
           
                    quantidadeProdutoComposicaoDados = quantidadeProdutoComposicaoDados + Number(produtoComposicao.quantidade)

                }
                else
                {
                    if (quantidadeProdutoComposicaoDados > 0) {
                        produtosComposicaoDados.push({
                            nome: nomeProdutoComposicaoDados,
                            quantidade: quantidadeProdutoComposicaoDados
                        })
                    }

                    prodCompCorrente = produtoComposicao['ofertaProduto.produtoId']
                    produtoDadosComp = produtos.find(produto => Number(produto.id) === Number(produtoComposicao['ofertaProduto.produtoId']))
                    nomeProdutoComposicaoDados = produtoDadosComp.nome
                    quantidadeProdutoComposicaoDados  = Number(produtoComposicao.quantidade)

                }
            }

        })
        if (quantidadeProdutoComposicaoDados > 0) {
            produtosComposicaoDados.push({
                nome: nomeProdutoComposicaoDados,
                quantidade: quantidadeProdutoComposicaoDados
            })
        }

        console.log('produtosComposicaoDados',produtosComposicaoDados)*/

        
        // array para busca da quantidade por produto para calculo de itens pedidos
        /*let arrayComposicoes = []
        cicloComposicoes.forEach(cicloComposicao => {
            arrayComposicoes.push(cicloComposicao.id)
        });*/
        
        /*produtosComposicao = await Composicao.getProdutosPorCicloComposicao({
                                composicaoId: composicao.id
                        })*/
        
    
        // Busca produtosOfertaDados
        
        const ofertas = await Oferta.getOfertasPorCiclo({
            cicloId: cicloId
        })

        let cicloProdutosOfertados = []

        for (let index = 0; index < ofertas.length; index++) {
            const oferta = ofertas[index];
            produtosOferta = await Oferta.getProdutosPorOferta({
                ofertaId: oferta.id
            })
            produtosOferta.forEach(produtoOferta => {
              cicloProdutosOfertados.push({
                  id: produtoOferta.id,
                  quantidade:produtoOferta.quantidade,
                  produtoId: produtoOferta.produtoId,
                  usuarioId: oferta.usuarioId
              })

            });
        } 
        
        cicloProdutosOfertados.sort((a,b) => (a.produtoId > b.produtoId) ? 1 : ((b.produtoId > a.produtoId) ? -1 : 0))

        let cicloOfertaProdutosDados = []
        let produtosPedidos = []

        let produtoCorrente = {
            id: 0,
            nome: "",
            medida: "",
            quantidadeDisponivel: 0,
            quantidadePedido: 0,
            fornecedores: "vazio"
        }

        let quantidadeDisp = 0
        let quantPedidoConsumidor = 0
        let statusPedido = ''

        for (let index = 0; index < cicloProdutosOfertados.length; index++) {
            const cicloOfertaProduto = cicloProdutosOfertados[index]
            
            produtoDados = produtos.find(produto => Number(produto.id) === Number(cicloOfertaProduto.produtoId))
            usuarioDados = usuarios.find(usuario => Number(usuario.id) === Number(cicloOfertaProduto.usuarioId))

            pedidoConsumidor = await PedidoConsumidores.getPedidoConsumidor({
                cicloId: cicloId,
                usuarioId: usuarioId,
                produtoId: cicloOfertaProduto.produtoId
            })

            quantPedidoConsumidor = pedidoConsumidor.quantPedido
            statusPedido = pedidoConsumidor.status

            if ((produtoCorrente.id == 0) || (produtoDados.id == produtoCorrente.id)) {
                produtoCorrente.id = produtoDados.id
                produtoCorrente.nome = produtoDados.nome
                produtoCorrente.medida = produtoDados.medida
                produtoCorrente.valorReferencia = produtoDados.valorReferencia
                produtoCorrente.quantidadeDisponivel = produtoCorrente.quantidadeDisponivel + cicloOfertaProduto.quantidade
                produtoCorrente.quantidadePedido = quantPedidoConsumidor

                if (cicloOfertaProduto.quantidade) {
                    if (produtoCorrente.fornecedores == "vazio") {
                        produtoCorrente.fornecedores = usuarioDados.nome + ':' + cicloOfertaProduto.quantidade.toString()
                    } else {
                        produtoCorrente.fornecedores = produtoCorrente.fornecedores + ' | ' + usuarioDados.nome
                    }  
                }
            }
            else {

                quantidadeProdutoComposicao = await Composicao.getTotalProdutosPedidosComposicaoItensAdicionais({
                    usuarioId: usuarioId,
                    cicloId: cicloId,
                    produtoId: produtoCorrente.id
                })

                if (quantidadeProdutoComposicao > 0) {
                    quantidadeDisp = quantidadeProdutoComposicao
                } else {
                    quantidadeDisp = 0
                } 

                quantidadeProdutoPedidoConsumidores = await PedidoConsumidores.getQuantidadeProdutoPedidoPorConsumidores({
                    cicloId: cicloId,
                    produtoId: produtoCorrente.id
                })

                quantidadeDisp = quantidadeDisp - quantidadeProdutoPedidoConsumidores + produtoCorrente.quantidadePedido


                if (produtoCorrente.quantidadePedido > 0) {
                    produtosPedidos.push ({
                        id: produtoCorrente.id,
                        nome: produtoCorrente.nome,
                        medida: produtoCorrente.medida,
                        //TO-DO: alterar para valor real quando ok na base
                        valorReferencia: produtoCorrente.valorReferencia,
                        quantidadeDisponivel: quantidadeDisp,
                        quantidade: produtoCorrente.quantidadePedido,
                        fornecedores: produtoCorrente.fornecedores
                    })
                }

                if (quantidadeDisp > 0) {
                    cicloOfertaProdutosDados.push ({
                        id: produtoCorrente.id,
                        nome: produtoCorrente.nome,
                        medida: produtoCorrente.medida,
                        //TO-DO: alterar para valor real quando ok na base
                        valorReferencia: produtoCorrente.valorReferencia,
                        quantidadeDisponivel: quantidadeDisp,
                        quantidade: produtoCorrente.quantidadePedido,
                        fornecedores: produtoCorrente.fornecedores
                    })
                }

                produtoCorrente.id = produtoDados.id
                produtoCorrente.nome = produtoDados.nome
                produtoCorrente.medida = produtoDados.medida
                produtoCorrente.valorReferencia = produtoDados.valorReferencia
                produtoCorrente.quantidadeDisponivel = cicloOfertaProduto.quantidade
                produtoCorrente.quantidadePedido = quantPedidoConsumidor
                produtoCorrente.fornecedores = usuarioDados.nome
            }
        };

        quantidadeProdutoComposicao = await Composicao.getTotalProdutosPedidosComposicaoItensAdicionais({
            usuarioId: usuarioId,
            cicloId: cicloId,
            produtoId: produtoCorrente.id
        })

        if (quantidadeProdutoComposicao > 0) {
            quantidadeDisp = quantidadeProdutoComposicao
        } else {
            quantidadeDisp = 0
        }  

        quantidadeProdutoPedidoConsumidores = await PedidoConsumidores.getQuantidadeProdutoPedidoPorConsumidores({
            cicloId: cicloId,
            produtoId: produtoCorrente.id
        })

        quantidadeDisp = quantidadeDisp - quantidadeProdutoPedidoConsumidores + produtoCorrente.quantidadePedido


        if (produtoCorrente.quantidadePedido > 0) {
            produtosPedidos.push ({
                id: produtoCorrente.id,
                nome: produtoCorrente.nome,
                medida: produtoCorrente.medida,
                //TO-DO: alterar para valor real quando ok na base
                valorReferencia: produtoCorrente.valorReferencia,
                quantidadeDisponivel: quantidadeDisp,
                quantidade: produtoCorrente.quantidadePedido,
                fornecedores: produtoCorrente.fornecedores
            })
        }
        
        if (quantidadeDisp > 0) {
            cicloOfertaProdutosDados.push ({
                id: produtoCorrente.id,
                nome: produtoCorrente.nome,
                medida: produtoCorrente.medida,
                //TO-DO: alterar para valor real quando ok na base
                valorReferencia: produtoCorrente.valorReferencia,
                quantidadeDisponivel: quantidadeDisp,
                quantidade: produtoCorrente.quantidadePedido,
                fornecedores: produtoCorrente.fornecedores
            })
        }


        //cicloOfertaProdutosDados.sort()
        cicloOfertaProdutosDados.sort((a,b) => (a.nome.toLowerCase() > b.nome.toLowerCase()) ? 1 : ((b.nome.toLowerCase() > a.nome.toLowerCase()) ? -1 : 0))
        // FIM Busca produtosOfertaDados

        produtosPedidos.sort((a,b) => (a.nome > b.nome) ? 1 : ((b.nome > a.nome) ? -1 : 0))
        
        //produtosComposicaoDados.sort((a,b) => (a.nome > b.nome) ? 1 : ((b.nome > a.nome) ? -1 : 0))
        

        produtosPedidosConsumidorDados = cicloOfertaProdutosDados

        //const { _raw, _json, ...userProfile } = req.user;
        //userDados = req.user;
        //userProfile = JSON.stringify(userProfile, null, 2)
        //console.log("userDados:",userDados)


        if (loginStatus == 'usuarioAtivo') {
            if ((usuarioAtivo[0].perfil.indexOf('admin') >= 0 ) || (usuarioAtivo[0].perfil.indexOf('consumidor') >= 0 ) ) {
                //return res.render('pedidoConsumidores',{ usuarioAtivo: usuarioAtivo[0], produtosComposicaoDados: produtosComposicaoDados,statusPedido: statusPedido, produtosPedidos:produtosPedidos, produtosPedidosConsumidorDados: produtosPedidosConsumidorDados, usuarioConsumidor: usuarioConsumidor, pedidoConsumidorId: pedidoConsumidorId, ciclo: ciclo, usuarios: usuarios})
                return res.render('pedidoConsumidores',{ usuarioAtivo: usuarioAtivo[0], statusPedido: statusPedido, produtosPedidos:produtosPedidos, produtosPedidosConsumidorDados: produtosPedidosConsumidorDados, usuarioConsumidor: usuarioConsumidor, pedidoConsumidorId: pedidoConsumidorId, ciclo: ciclo, usuarios: usuarios})
            
            }
            else {
                return res.redirect('/')
            }
        }

    },


    async showConfirmacao(req, res) {
        const cicloId = req.params.id

        // USUARIO V010921
        usuarioAtivo = []
        loginStatus = ""
        user = req.oidc.user
        if (user) {
            
            // Já é usuário cadastrado na base do sistema

            usuarioCadastrado = await Usuario.retornaUsuarioCadastrado(user.email)

            if (usuarioCadastrado != 0) {

                console.log('LOG: usuario cadastrado encontrado:', usuarioCadastrado)

                usuarioAtivo.push({
                    email: user.email,
                    picture: user.picture,
                    name: user.name,
                    email_verified: user.email_verified,
                    id: usuarioCadastrado.id,
                    perfil: usuarioCadastrado.perfil       
                })

                loginStatus = 'usuarioAtivo'

            }
            else {

                usuarioAtivo.push({
                    email: user.email,
                    picture: user.picture,
                    name: user.name,
                    email_verified: user.email_verified
                })
                
                return res.render('usuarionovo',{usuarioAtivo: usuarioAtivo[0]})
     
            }  

        }
        // USUARIO FIM

        
        // quando não informado mostra tela de pedidos do usuário corrente
        let usuarioId = usuarioCadastrado.id
        console.log("usuarioId",usuarioId)

        if (req.query.usr) {
            usuarioId = req.query.usr
        }

        let usuarios = []
        try {
            // to-do: trazer apenas usuários que podem ser geridos por usuário corrente
            usuarios = await Usuario.get()
        } catch (error) {
            //console.log('OfertaController error - falha Usuario.get')
        }

        usuarios.sort((a,b) => (a.nome.toLowerCase() > b.nome.toLowerCase()) ? 1 : ((b.nome.toLowerCase() > a.nome.toLowerCase()) ? -1 : 0))
        

        const usuarioConsumidor = usuarios.find(usuario => Number(usuario.id) === Number(usuarioId)) 
        

        pedidoConsumidorId = await PedidoConsumidores.findOrCreatePedidoConsumidor({
            cicloId: cicloId,
            usuarioId: usuarioId
       })

       const produtos = await Produto.get();


        const dadosCiclo = await Ciclo.getCicloId(cicloId)

        if (dadosCiclo == 'error') {

            return res.send('Ciclo não existe!')

        } 

        ciclo = dadosCiclo.ciclo[0]

        const cicloComposicoes = dadosCiclo.cicloComposicoes
        
        // erro quando cesta GrupoCompras não existe, código me parece desnecessário
        /*composicaoGrupoCompras = cicloComposicoes.find(cicloComposicao => Number(cicloComposicao.cestaId) == 3)
        
        if (!composicaoGrupoCompras) {
            composicaoGrupoCompras = cicloComposicoes.find(cicloComposicao => Number(cicloComposicao.cestaId) == 7)
        }
        
        composicaoIdGrupoCompras = composicaoGrupoCompras.id

        produtosComposicao = await Composicao.getProdutosPorComposicao({
            composicaoId: composicaoIdGrupoCompras
        })

        produtosComposicao.sort((a,b) => (a['ofertaProduto.produtoId'] > b['ofertaProduto.produtoId']) ? 1 : ((b['ofertaProduto.produtoId'] > a['ofertaProduto.produtoId']) ? -1 : 0))

        
        let produtosComposicaoDados = []
        let prodCompCorrente = 0

        if (Number(produtosComposicao[0]['ofertaProduto.produtoId']) > 0) {
            prodCompCorrente = produtosComposicao[0]['ofertaProduto.produtoId']
            let produtoDadosComp = produtos.find(produto => Number(produto.id) === Number(produtosComposicao[0]['ofertaProduto.produtoId']))
            nomeProdutoComposicaoDados = produtoDadosComp.nome
        }
        let quantidadeProdutoComposicaoDados = 0
        produtosComposicao.forEach(produtoComposicao => {
            
            if (Number(produtoComposicao['ofertaProduto.produtoId']) > 0) {

                if (prodCompCorrente == (produtoComposicao['ofertaProduto.produtoId'])) {
           
                    quantidadeProdutoComposicaoDados = quantidadeProdutoComposicaoDados + Number(produtoComposicao.quantidade)

                }
                else
                {
                    if (quantidadeProdutoComposicaoDados > 0) {
                        produtosComposicaoDados.push({
                            nome: nomeProdutoComposicaoDados,
                            quantidade: quantidadeProdutoComposicaoDados
                        })
                    }

                    prodCompCorrente = produtoComposicao['ofertaProduto.produtoId']
                    produtoDadosComp = produtos.find(produto => Number(produto.id) === Number(produtoComposicao['ofertaProduto.produtoId']))
                    nomeProdutoComposicaoDados = produtoDadosComp.nome
                    quantidadeProdutoComposicaoDados  = Number(produtoComposicao.quantidade)

                }
            }

        })
        if (quantidadeProdutoComposicaoDados > 0) {
            produtosComposicaoDados.push({
                nome: nomeProdutoComposicaoDados,
                quantidade: quantidadeProdutoComposicaoDados
            })
        }*/

    
        // array para busca da quantidade por produto para calculo de itens pedidos
        /*let arrayComposicoes = []
        cicloComposicoes.forEach(cicloComposicao => {
            arrayComposicoes.push(cicloComposicao.id)
        });*/
        
        /*produtosComposicao = await Composicao.getProdutosPorCicloComposicao({
                                composicaoId: composicao.id
                        })*/
        
    
        // Busca produtosOfertaDados
        
        const ofertas = await Oferta.getOfertasPorCiclo({
            cicloId: cicloId
        })

        let cicloProdutosOfertados = []

        for (let index = 0; index < ofertas.length; index++) {
            const oferta = ofertas[index];
            produtosOferta = await Oferta.getProdutosPorOferta({
                ofertaId: oferta.id
            })
            produtosOferta.forEach(produtoOferta => {
              cicloProdutosOfertados.push({
                  id: produtoOferta.id,
                  quantidade:produtoOferta.quantidade,
                  produtoId: produtoOferta.produtoId,
                  usuarioId: oferta.usuarioId
              })

            });
        } 
        
        cicloProdutosOfertados.sort((a,b) => (a.produtoId > b.produtoId) ? 1 : ((b.produtoId > a.produtoId) ? -1 : 0))

        let cicloOfertaProdutosDados = []
        let produtosPedidos = []

        let produtoCorrente = {
            id: 0,
            nome: "",
            medida: "",
            quantidadeDisponivel: 0,
            quantidadePedido: 0,
            fornecedores: "vazio"
        }

        let quantidadeDisp = 0
        let quantPedidoConsumidor = 0
        let statusPedido = ''

        for (let index = 0; index < cicloProdutosOfertados.length; index++) {
            const cicloOfertaProduto = cicloProdutosOfertados[index]
            
            produtoDados = produtos.find(produto => Number(produto.id) === Number(cicloOfertaProduto.produtoId))
            usuarioDados = usuarios.find(usuario => Number(usuario.id) === Number(cicloOfertaProduto.usuarioId))

            pedidoConsumidor = await PedidoConsumidores.getPedidoConsumidor({
                cicloId: cicloId,
                usuarioId: usuarioId,
                produtoId: cicloOfertaProduto.produtoId
            })

            if (pedidoConsumidor === 'error') {

                return res.send('Pedido não existe!')

            } 

            quantPedidoConsumidor = pedidoConsumidor.quantPedido
            statusPedido = pedidoConsumidor.status

            if ((produtoCorrente.id == 0) || (produtoDados.id == produtoCorrente.id)) {
                produtoCorrente.id = produtoDados.id
                produtoCorrente.nome = produtoDados.nome
                produtoCorrente.medida = produtoDados.medida
                produtoCorrente.valorReferencia = produtoDados.valorReferencia
                produtoCorrente.quantidadeDisponivel = produtoCorrente.quantidadeDisponivel + cicloOfertaProduto.quantidade
                produtoCorrente.quantidadePedido = quantPedidoConsumidor

                if (cicloOfertaProduto.quantidade) {
                    if (produtoCorrente.fornecedores == "vazio") {
                        produtoCorrente.fornecedores = usuarioDados.nome + ':' + cicloOfertaProduto.quantidade.toString()
                    } else {
                        produtoCorrente.fornecedores = produtoCorrente.fornecedores + ' | ' + usuarioDados.nome
                    }  
                }
            }
            else {

                quantidadeProdutoComposicao = await Composicao.getTotalProdutosPedidosComposicaoItensAdicionais({
                    usuarioId: usuarioId,
                    cicloId: cicloId,
                    produtoId: produtoCorrente.id
                })

                if (quantidadeProdutoComposicao > 0) {
                    quantidadeDisp = quantidadeProdutoComposicao
                } else {
                    quantidadeDisp = 0
                } 

                quantidadeProdutoPedidoConsumidores = await PedidoConsumidores.getQuantidadeProdutoPedidoPorConsumidores({
                    cicloId: cicloId,
                    produtoId: produtoCorrente.id
                })

                quantidadeDisp = quantidadeDisp - quantidadeProdutoPedidoConsumidores + produtoCorrente.quantidadePedido


                if (produtoCorrente.quantidadePedido > 0) {
                    produtosPedidos.push ({
                        id: produtoCorrente.id,
                        nome: produtoCorrente.nome,
                        medida: produtoCorrente.medida,
                        //TO-DO: alterar para valor real quando ok na base
                        valorReferencia: produtoCorrente.valorReferencia,
                        quantidadeDisponivel: quantidadeDisp,
                        quantidade: produtoCorrente.quantidadePedido,
                        fornecedores: produtoCorrente.fornecedores
                    })
                }

                if (quantidadeDisp > 0) {
                    cicloOfertaProdutosDados.push ({
                        id: produtoCorrente.id,
                        nome: produtoCorrente.nome,
                        medida: produtoCorrente.medida,
                        //TO-DO: alterar para valor real quando ok na base
                        valorReferencia: produtoCorrente.valorReferencia,
                        quantidadeDisponivel: quantidadeDisp,
                        quantidade: produtoCorrente.quantidadePedido,
                        fornecedores: produtoCorrente.fornecedores
                    })
                }

                produtoCorrente.id = produtoDados.id
                produtoCorrente.nome = produtoDados.nome
                produtoCorrente.medida = produtoDados.medida
                produtoCorrente.valorReferencia = produtoDados.valorReferencia
                produtoCorrente.quantidadeDisponivel = cicloOfertaProduto.quantidade
                produtoCorrente.quantidadePedido = quantPedidoConsumidor
                produtoCorrente.fornecedores = usuarioDados.nome
            }
        };

        quantidadeProdutoComposicao = await Composicao.getTotalProdutosPedidosComposicaoItensAdicionais({
            usuarioId: usuarioId,
            cicloId: cicloId,
            produtoId: produtoCorrente.id
        })

        if (quantidadeProdutoComposicao > 0) {
            quantidadeDisp = quantidadeProdutoComposicao
        } else {
            quantidadeDisp = 0
        }  

        quantidadeProdutoPedidoConsumidores = await PedidoConsumidores.getQuantidadeProdutoPedidoPorConsumidores({
            cicloId: cicloId,
            produtoId: produtoCorrente.id
        })

        quantidadeDisp = quantidadeDisp - quantidadeProdutoPedidoConsumidores + produtoCorrente.quantidadePedido


        if (produtoCorrente.quantidadePedido > 0) {
            produtosPedidos.push ({
                id: produtoCorrente.id,
                nome: produtoCorrente.nome,
                medida: produtoCorrente.medida,
                //TO-DO: alterar para valor real quando ok na base
                valorReferencia: produtoCorrente.valorReferencia,
                quantidadeDisponivel: quantidadeDisp,
                quantidade: produtoCorrente.quantidadePedido,
                fornecedores: produtoCorrente.fornecedores
            })
        }
        
        if (quantidadeDisp > 0) {
            cicloOfertaProdutosDados.push ({
                id: produtoCorrente.id,
                nome: produtoCorrente.nome,
                medida: produtoCorrente.medida,
                //TO-DO: alterar para valor real quando ok na base
                valorReferencia: produtoCorrente.valorReferencia,
                quantidadeDisponivel: quantidadeDisp,
                quantidade: produtoCorrente.quantidadePedido,
                fornecedores: produtoCorrente.fornecedores
            })
        }


        //cicloOfertaProdutosDados.sort()
        cicloOfertaProdutosDados.sort((a,b) => (a.nome.toLowerCase() > b.nome.toLowerCase()) ? 1 : ((b.nome.toLowerCase() > a.nome.toLowerCase()) ? -1 : 0))
        // FIM Busca produtosOfertaDados

        produtosPedidos.sort((a,b) => (a.nome > b.nome) ? 1 : ((b.nome > a.nome) ? -1 : 0))
        
        //produtosComposicaoDados.sort((a,b) => (a.nome > b.nome) ? 1 : ((b.nome > a.nome) ? -1 : 0))
        

        produtosPedidosConsumidorDados = cicloOfertaProdutosDados

        //const { _raw, _json, ...userProfile } = req.user;
        //userDados = req.user;
        //userProfile = JSON.stringify(userProfile, null, 2)
        //console.log("userDados:",userDados)

        if (loginStatus == 'usuarioAtivo') {
            if ((usuarioAtivo[0].perfil.indexOf('admin') >= 0 ) || (usuarioAtivo[0].perfil.indexOf('consumidor') >= 0 ) ) {
                //return res.render('pedidoConsumidoresConfirmacao',{ usuarioAtivo: usuarioAtivo[0], produtosComposicaoDados: produtosComposicaoDados,statusPedido: statusPedido, produtosPedidos:produtosPedidos, produtosPedidosConsumidorDados: produtosPedidosConsumidorDados, usuarioConsumidor: usuarioConsumidor, pedidoConsumidorId: pedidoConsumidorId, ciclo: ciclo, usuarios: usuarios})
                return res.render('pedidoConsumidoresConfirmacao',{ usuarioAtivo: usuarioAtivo[0], statusPedido: statusPedido, produtosPedidos:produtosPedidos, produtosPedidosConsumidorDados: produtosPedidosConsumidorDados, usuarioConsumidor: usuarioConsumidor, pedidoConsumidorId: pedidoConsumidorId, ciclo: ciclo, usuarios: usuarios})
            }
            else {
                return res.redirect('/')
            }
        }

    },














    async showTodosPedidosConsumidores(req, res) {
        const cicloId = req.params.id

        // USUARIO V010921
        usuarioAtivo = []
        loginStatus = ""
        user = req.oidc.user
        if (user) {
            
            // Já é usuário cadastrado na base do sistema

            usuarioCadastrado = await Usuario.retornaUsuarioCadastrado(user.email)

            if (usuarioCadastrado != 0) {

                usuarioAtivo.push({
                    email: user.email,
                    picture: user.picture,
                    name: user.name,
                    email_verified: user.email_verified,
                    id: usuarioCadastrado.id,
                    perfil: usuarioCadastrado.perfil       
                })

                loginStatus = 'usuarioAtivo'

            }
            else {

                usuarioAtivo.push({
                    email: user.email,
                    picture: user.picture,
                    name: user.name,
                    email_verified: user.email_verified
                })
                
                return res.render('usuarionovo',{usuarioAtivo: usuarioAtivo[0]})
     
            }  

        }
        // USUARIO FIM

        
        if (req.query.usr) {
            usuarioId = req.query.usr
        } 
        else {
            usuarioId = usuarioAtivo[0].id
        }

        if (req.query.view) {
            view = req.query.view
        } else {
            view = "not_all"
        }


        usuarios = await Usuario.get()

        const dadosCiclo = await Ciclo.getCicloId(cicloId)

        if (dadosCiclo == 'error') {
            return res.send('Ciclo não existe!')
        } 
        
        ciclo = dadosCiclo.ciclo[0]

        const produtos = await Produto.get();

        // Busca produtosOfertaDados

        pedidosConsumidores = await PedidoConsumidores.getProdutosPedidosConsumidores(cicloId,usuarioId,view)
        
        produtosPedidosConsumidorDados = []

        if (pedidosConsumidores[0]) {
            pedidosConsumidores.sort((a,b) => (a.usuarioId > b.usuarioId) ? 1 : ((b.usuarioId > a.usuarioId) ? -1 : 0))
        
            
            let usuarioCorrente = 0
            if ((pedidosConsumidores[0].usuarioId) > 0) {
                usuarioCorrente =  pedidosConsumidores[0].usuarioId
            }
            for (let index = 0; index < pedidosConsumidores.length; index++) {
                const pedidoConsumidor = pedidosConsumidores[index]
            
                produtoDados = produtos.find(produto => Number(produto.id) === Number(pedidoConsumidor.produtoId))
                usuarioDados = usuarios.find(usuario => Number(usuario.id) === Number(pedidoConsumidor.usuarioId))

                if (pedidoConsumidor.quantidade > 0) {

                    if (usuarioCorrente != usuarioDados.id) {
                        usuarioCorrente = usuarioDados.id
                    }

                    produtosPedidosConsumidorDados.push ({
                        id: produtoDados.id,
                        nome: produtoDados.nome,
                        medida: produtoDados.medida,
                        //TO-DO: alterar para valor real quando ok na base
                        valorReferencia: produtoDados.valorReferencia,
                        quantidade: pedidoConsumidor.quantidade,
                        consumidorId: usuarioDados.id,
                        consumidor: usuarioDados.nome,
                        valorAcumuladoPedido: 0
                    })

                }
            
                
            }

            //cicloOfertaProdutosDados.sort()
            produtosPedidosConsumidorDados.sort((a,b) => (a.consumidor > b.consumidor) ? 1 : ((b.consumidor > a.consumidor) ? -1 : 0))
            // FIM Busca produtosOfertaDados


            usuarioCorrente = 0
            if ((produtosPedidosConsumidorDados[0].consumidorId) > 0) {
                usuarioCorrente =  produtosPedidosConsumidorDados[0].consumidorId
            }

            valorAcumuladoPedido = 0
            ultimaPosicao = 0

            for (let index = 0; index < produtosPedidosConsumidorDados.length; index++) {
                const produtoPedidosConsumidorDados = produtosPedidosConsumidorDados[index]
            
                if (usuarioCorrente != produtoPedidosConsumidorDados.consumidorId) {
                    produtosPedidosConsumidorDados[index-1].valorAcumuladoPedido = valorAcumuladoPedido
                    valorAcumuladoPedido = 0
                    usuarioCorrente = produtoPedidosConsumidorDados.consumidorId
                }

                valorAcumuladoPedido = valorAcumuladoPedido + (Number(produtoPedidosConsumidorDados.quantidade) * Number(produtoPedidosConsumidorDados.valorReferencia))     
            
                ultimaPosicao = index
            }
            produtosPedidosConsumidorDados[ultimaPosicao].valorAcumuladoPedido = valorAcumuladoPedido
                
            //cicloOfertaProdutosDados.sort()
            produtosPedidosConsumidorDados.sort((a,b) => (a.consumidor > b.consumidor) ? 1 : ((b.consumidor > a.consumidor) ? -1 : 0))
            // FIM Busca produtosOfertaDados

        
            let consumidorAnterior = 0
            let valorAcumulado = 0
            let taxaAdministrativa = 0

            /*if (req.query.mov) {

                if (req.query.mov == 'yes') {
                    for (let index = 0; index < produtosPedidosConsumidorDados.length; index++) {
                        const produtoPedidosConsumidorDados = produtosPedidosConsumidorDados[index]

                        if ((produtoPedidosConsumidorDados.consumidorId != consumidorAnterior) && (consumidorAnterior != 0)) {

                            await Movimentacao.criarRegistro({
                                usuarioId: consumidorAnterior,
                                tipoMovimentacaoId: 3,
                                data: ciclo.retiradaConsumidorFim,
                                valor: valorAcumulado,
                                status: 'ativo',
                                observacao: 'Compra extra - '+ ciclo.nome
                            })

                            await Movimentacao.criarRegistro({
                                usuarioId: consumidorAnterior,
                                tipoMovimentacaoId: 5,
                                data: ciclo.retiradaConsumidorFim,
                                valor: taxaAdministrativa,
                                status: 'ativo',
                                observacao: 'Taxa Administrativa - '+ ciclo.nome
                            })

                            valorAcumulado = 0
                            taxaAdministrativa = 0

                        }

                        valorAcumulado = valorAcumulado + (produtoPedidosConsumidorDados.valorReferencia * produtoPedidosConsumidorDados.quantidade)
                        taxaAdministrativa = taxaAdministrativa + 0.5*produtoPedidosConsumidorDados.quantidade

                        consumidorAnterior = produtoPedidosConsumidorDados.consumidorId
        
                    }

                    await Movimentacao.criarRegistro({
                        usuarioId: consumidorAnterior,
                        tipoMovimentacaoId: 3,
                        data: ciclo.retiradaConsumidorFim,
                        valor: valorAcumulado,
                        status: 'ativo',
                        observacao: 'Compra Extra - '+ ciclo.nome
                    
                    })
                    await Movimentacao.criarRegistro({
                        usuarioId: consumidorAnterior,
                        tipoMovimentacaoId: 5,
                        data: ciclo.retiradaConsumidorFim,
                        valor: taxaAdministrativa,
                        status: 'ativo',
                        observacao: 'Taxa Administrativa - '+ ciclo.nome
                    })
            
            }}*/
        
        }
        
        /* só toma esse caminho para usuários ativos */
        return res.render('pedidosConsumidoresTodos',{ usuarioAtivo: usuarioAtivo[0], produtosPedidosConsumidorDados: produtosPedidosConsumidorDados, ciclo: ciclo})
    
        

        //return res.render('pedidosConsumidoresTodos',{ produtosPedidosConsumidorDados: produtosPedidosConsumidorDados, ciclo: ciclo})
    },


    
    async save(req, res) {

        //const produtos = await Produto.get();

        cicloId = req.body.cicloId

        usuarioAtivo = req.body.usuarioAtivo

        usuarioConsumidorId = req.body.usuarioConsumidorId

        pedidoConsumidorId = req.body.pedidoConsumidorId

        const ofertas = await Oferta.getOfertasPorCiclo({
            cicloId: cicloId
        })

        let statusPedido
        if (req.body.hasOwnProperty("salvarPedido")){
            statusPedido = 'ativo'
         } else {
            statusPedido = 'finalizado'
         }

        let nomeInput = ''

        for (let index = 0; index < ofertas.length; index++) {
            const oferta = ofertas[index];
            
            produtosOferta = await Oferta.getProdutosPorOferta({
                ofertaId: oferta.id
            })

            for (let index = 0; index < produtosOferta.length; index++) {
                const produtoOferta = produtosOferta[index];

                nomeInput = 'quantidade'+ produtoOferta.produtoId.toString()
                
                let valueInput = 0

                if (req.body[nomeInput]) {
                  valueInput = req.body[nomeInput]

                  pedidoConsumidorProdutoId = await PedidoConsumidores.findOrCreatePedidoConsumidorProduto ({
                            pedidoConsumidorId: pedidoConsumidorId,
                            produtoId: produtoOferta.produtoId
                            })
                
                  await PedidoConsumidores.updatePedidoConsumidoresProduto ({
                        id: pedidoConsumidorProdutoId,
                        quantidade: valueInput
                    })
                }
    
            }

        }

        /*await Composicao.deleteComposicoesZero ({
            composicaoId: composicaoId
        })*/

        

        


        return res.redirect('/pedidoConsumidoresConfirmacao/' + cicloId+ '?usr=' + usuarioConsumidorId)
        

    },


    async finalizar(req, res) {

        //const produtos = await Produto.get();

        let statusPedido
        if (req.body.hasOwnProperty("retornarPedido")){
            statusPedido = 'retornar'
        } else {
            if (req.body.hasOwnProperty("alterarPedido")){
                statusPedido = 'ativo'
            }  else {
                statusPedido = 'finalizado'
            }
        }

        cicloId = req.body.cicloId

        usuarioAtivo = req.body.usuarioAtivo

        usuarioConsumidorId = req.body.usuarioConsumidorId

        pedidoConsumidorId = req.body.pedidoConsumidorId

        if (statusPedido == 'retornar') {

                return res.redirect('/pedidoConsumidores/' + cicloId+ '?usr=' + usuarioConsumidorId)
        

                /*const ofertas = await Oferta.getOfertasPorCiclo({
                    cicloId: cicloId
                })*/

                /*let nomeInput = ''*/

                /*for (let index = 0; index < ofertas.length; index++) {
                    const oferta = ofertas[index];
                    
                    produtosOferta = await Oferta.getProdutosPorOferta({
                        ofertaId: oferta.id
                    })

                    for (let index = 0; index < produtosOferta.length; index++) {
                        const produtoOferta = produtosOferta[index];

                        nomeInput = 'quantidade'+ produtoOferta.produtoId.toString()
                        
                        let valueInput = 0

                        if (req.body[nomeInput]) {
                        valueInput = req.body[nomeInput]

                        pedidoConsumidorProdutoId = await PedidoConsumidores.findOrCreatePedidoConsumidorProduto ({
                                    pedidoConsumidorId: pedidoConsumidorId,
                                    produtoId: produtoOferta.produtoId
                                    })
                        
                        await PedidoConsumidores.updatePedidoConsumidoresProduto ({
                                id: pedidoConsumidorProdutoId,
                                quantidade: valueInput,
                                pedidoConsumidorId: pedidoConsumidorId,
                                status: statusPedido
                            })
                        }
            
                    }

                }*/
        
        } else {

            await PedidoConsumidores.finalizaPedidoConsumidor ({
                pedidoConsumidorId: pedidoConsumidorId,
                status: statusPedido
            })

            if (statusPedido == 'ativo') {

                return res.redirect('/pedidoConsumidores/' + cicloId+ '?usr=' + usuarioConsumidorId)
            
            } else {

                return res.redirect('/pedidoConsumidoresConfirmacao/' + cicloId+ '?usr=' + usuarioConsumidorId)
            }
        
            

        }

        /*await Composicao.deleteComposicoesZero ({
            composicaoId: composicaoId
        })*/

        

        


        

    }

    

    
    /*delete(req, res) {
        const composicaoId = req.params.id

        Composicao.delete(composicaoId)

        return res.redirect('/composicao-index')
    }*/
}