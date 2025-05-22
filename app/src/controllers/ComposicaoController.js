const Ciclo = require('../model/Ciclo')
const Cesta = require('../model/Cesta')
const Produto = require('../model/Produto')
const Usuario = require('../model/Usuario')
const Oferta = require('../model/Oferta')
const Composicao = require('../model/Composicao')
const PedidoConsumidores = require('../model/PedidoConsumidores')
const Profile = require('../model/Profile')


module.exports = {

    async showCreateEdit(req, res) {

        const cicloId = req.params.id

        const dadosCiclo = await Ciclo.getCicloId(cicloId)

        if (dadosCiclo == 'error') {
            return res.send('Ciclo não existe!')
        }  

        let gerarAutomaticoSobra = 'NAO'
        if (req.body.gerarAutomaticoSobra) {
            gerarAutomaticoSobra = req.body.gerarAutomaticoSobra
        }
        
        console.log('gerarAutomaticoSobra',gerarAutomaticoSobra)

        let gerarAutomaticoAtribuicao = 'NAO'
        if (req.body.gerarAutomaticoAtribuicao) {
            gerarAutomaticoAtribuicao = req.body.gerarAutomaticoAtribuicao
        }


        if (req.body.hasOwnProperty("direcionarPedidosRealizados")) {

            return res.redirect('/pedidosconsumidorestodos/' + cicloId + '?view=all_t')
        
        }
        else
        {

                ciclo = dadosCiclo.ciclo[0]

                        const cicloCestas = dadosCiclo.cicloCestas

                        const cicloComposicoes = dadosCiclo.cicloComposicoes

                        const cestas = await Cesta.get()
                        
                        cicloCestasDados = []
                        cicloCestasVisiveis = []
                        cicloCestas.forEach(cicloCesta => {
                            cestaDados = cestas.find(cesta => Number(cesta.id) === Number(cicloCesta.cestaId))

                            cicloCestasDados.push({
                                id: cicloCesta.id,
                                nome: cestaDados.nome,
                                quantidade: cicloCesta.quantidadeCestas,
                                valormaximo: cestaDados.valormaximo,
                                cestaId: cicloCesta.cestaId
                            })

                            if ( (cicloCesta.cestaId != 1) && (cicloCesta.cestaId != 5)) {
                                    cicloCestasVisiveis.push({
                                        id: cicloCesta.id,
                                        nome: cestaDados.nome,
                                        quantidade: cicloCesta.quantidadeCestas,
                                        valormaximo: cestaDados.valormaximo,
                                        cestaId: cicloCesta.cestaId
                                    })
                            }
                        });

                        let cicloCestaSel = cicloCestasVisiveis[0]

                        if (req.body.hasOwnProperty("direcionarComposicao")) {
            
                                cicloCestaSelId = cicloCestasVisiveis[0].id

                                //cicloCestaSel = cicloCestasDados.find(cicloCestaDado => Number(cicloCestaDado.id) == Number(cicloCestaSelId))
                            
                        } else {
                            if (req.query.cst) {

                                cicloCestaSelId = req.query.cst 
            
                                cicloCestaSel = cicloCestasDados.find(cicloCestaDado => Number(cicloCestaDado.id) == Number(cicloCestaSelId))
                            
                            } else {
            
                                // se nenhuma selecionada escolhe a 1
                                //cicloCestaSel = cicloCestasDados.find(cicloCestaDado => Number(cicloCestaDado.cestaId) == 2)
                            
                                cicloCestaSelId = cicloCestasVisiveis[0].id

                                //cicloCestaSel = cicloCestasDados.find(cicloCestaDado => Number(cicloCestaDado.id) == Number(cicloCestaSelId))
                            
                        
                            }
            
                        }
                        
                        
                        //cicloCestaSel = cicloCestasDados.find(cicloCestaDado => Number(cicloCestaDado.cestaId) === Number(cicloCestaSelId))
                        

                        /*if (Number(cicloCestaSelId) == 5) {
                            pedidosConsumidores = await PedidoConsumidores.getProdutosPedidosConsumidores(cicloId,usuarioId,view)
                        
                            console.log('pedidoConsumidores', pedidoConsumidores)
                        }*/
                        

                        composicao = await Composicao.findOrCreate({
                                        cicloCestaId: cicloCestaSelId
                                })

                        if (composicao == 'error') {
                            return res.send('Tipo de cesta não existe para este ciclo!')
                        } 
                        
                        let arrayComposicoes = []
                        cicloComposicoes.forEach(cicloComposicao => {
                            if (cicloComposicao.id != composicao.id) {
                                arrayComposicoes.push(cicloComposicao.id)
                            }
                        });
                        
                        const produtos = await Produto.get();
                        const usuarios = await Usuario.get();

                        // Busca produtosOfertaDados
                        
                        const ofertas = await Oferta.getOfertasPorCiclo({
                            cicloId: cicloId
                        })

                        let cicloProdutosOfertados = []

                        let arrayOfertas = []

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

                            /*arrayOfertas.push({
                                produtoOfertaId:produtoOferta.id,
                                produtoId: produtoOferta.produtoId,
                            })*/

                            });
                        } 
                        
                        cicloProdutosOfertados.sort((a,b) => (a.produtoId > b.produtoId) ? 1 : ((b.produtoId > a.produtoId) ? -1 : 0))

                        let ofertaProdutosDados = []

                        let produtoCorrente = {
                            id: 0,
                            nome: "",
                            quantidade: 0,
                            fornecedores: "vazio"
                        }

                        let quantidadeOfertados = 0
                        let quantidadeParaPedir = 0
                        let totalValorCesta = 0
                        let totalItensCesta = 0
                        let quantItensCesta = 0
                        let indexCabecalhoProduto = 0
                        let indexArrayofertaProdutosDados = -1
                        let quantPedidosExtras = 0
                        let totalDisponiveis = 0



                        for (let index = 0; index < cicloProdutosOfertados.length; index++) {
                            const cicloOfertaProduto = cicloProdutosOfertados[index]
                            
                            produtoDados = produtos.find(produto => Number(produto.id) === Number(cicloOfertaProduto.produtoId))
                            usuarioDados = usuarios.find(usuario => Number(usuario.id) === Number(cicloOfertaProduto.usuarioId))

                            const quantPedidoFornecedor = await Composicao.getPedidoPorOfertaComposicao({
                                ofertaProdutoId: cicloOfertaProduto.id,
                                composicaoId: composicao.id
                            })
                            totalValorCesta = (totalValorCesta + quantPedidoFornecedor*produtoDados.valorReferencia)
                            totalItensCesta = (totalItensCesta + quantPedidoFornecedor)

                            // TEMP - PARA MIGRACAO - pedidos tabela fornecedores        
                            quantPedidoOld = await Composicao.getPedidoFornecedores({
                                id: cicloOfertaProduto.id
                            })
                            // fim do temporario

                            if (produtoDados.id != produtoCorrente.id) {
                                
                                // ANTIGO - SERA EXCLUIDO POS MIGRACAO BEGIN - calculo da quantidade de produtos, por produto, que precisa ser pedido aos fornecedores
                                    quantidadeProdutoComposicaoOld = await Composicao.getQuantidadeProdutosComposicaoOld({
                                        arrayComposicoes: arrayComposicoes,
                                        produtoId: produtoDados.id
                                    })

                                    quantidadeParaPedir = 0
                                    if (quantidadeProdutoComposicaoOld[0]) {
                                        quantidadeParaPedir = Number(quantidadeProdutoComposicaoOld[0].SumQuantidade)
                                    }
                                
                                produtoCorrente.id = produtoDados.id

                                
                                ofertaProdutosDados.push ({
                                    id: cicloOfertaProduto.id,
                                    nome: produtoDados.nome,
                                    medida: produtoDados.medida,
                                    valorReferencia: produtoDados.valorReferencia,
                                    quantidadeOfertados: 0,
                                    quantidadePedido: quantidadeParaPedir,
                                    quantidade: 0,
                                    fornecedor: null,
                                    totalDisponiveis: 0,
                                })

                                indexArrayofertaProdutosDados = indexArrayofertaProdutosDados + 1
                                indexCabecalho = indexArrayofertaProdutosDados
                                
                            }

                            if (cicloOfertaProduto.quantidade) {
                                quantidadeOfertados = cicloOfertaProduto.quantidade
                            }

                            // calculo do valor total de produtos parte de composições
                            const valorTotalPedidoAcumulado = await Composicao.getValorTotalPedidoAcumulado({
                                usuarioId: cicloOfertaProduto.usuarioId,
                                cicloId: cicloId,
                                cicloCestas: cicloCestas
                            })

                            // calculo do total de produtos pedidos nas composições
                            const totalProdutosPedidoAcumulado = await Composicao.getTotalProdutosPedidoAcumulado({
                                usuarioId: cicloOfertaProduto.usuarioId,
                                cicloId: cicloId,
                                produtoId: cicloOfertaProduto.produtoId,
                                cicloCestas: cicloCestas
                            })

                            if (cicloCestaSel.cestaId != 1) {
                                totalDisponiveis = Number(quantidadeOfertados) - Number(totalProdutosPedidoAcumulado) + Number(quantPedidoFornecedor)
                            } else {
                                totalDisponiveis = Number(quantidadeOfertados) - Number(totalProdutosPedidoAcumulado)
                            }


                            
                            if (cicloCestaSel.cestaId == 5) {  // cesta pedidos extras
                                    quantPedidosExtras = await PedidoConsumidores.getQuantidadeProdutoPedidoPorConsumidores({
                                        cicloId: cicloId,
                                        produtoId: cicloOfertaProduto.produtoId
                                    })

                                    quantComposicaoSobra = await Composicao.getQuantidadeComposicaoSobra({
                                        usuarioId: usuarioDados.id,
                                        cicloId: cicloId,
                                        produtoId: cicloOfertaProduto.produtoId
                                    })

                                    console.log('usuarioId',usuarioDados.id)
                                    console.log('produtoId',cicloOfertaProduto.produtoId)
                                    console.log('quantComposicaoSobra',quantComposicaoSobra)


                                    totalDisponiveis = quantComposicaoSobra
                                    //totalDisponiveis = Number(quantComposicaoSobra) - Number(totalProdutosPedidoAcumulado) + Number(quantPedidoFornecedor)
                                    //totalDisponiveis = Number(quantComposicaoSobra) + Number(quantPedidoFornecedor)
                            

                            }

                            
                            ofertaProdutosDados.push ({
                                id: cicloOfertaProduto.id,
                                nome: null,
                                medida: null,
                                valorReferencia: 0,
                                quantidadeOfertados: quantidadeOfertados,
                                quantidadePedido: quantPedidoOld,
                                quantidade: quantPedidoFornecedor,
                                fornecedor: usuarioDados.nome,
                                valorTotalPedidoAcumulado: valorTotalPedidoAcumulado,
                                totalDisponiveis: totalDisponiveis,
                                quantPedidosExtras: quantPedidosExtras,
                            })

                            indexArrayofertaProdutosDados = indexArrayofertaProdutosDados + 1

                            ofertaProdutosDados[indexCabecalho].quantidadeOfertados = ofertaProdutosDados[indexCabecalho].quantidadeOfertados + quantidadeOfertados
                            ofertaProdutosDados[indexCabecalho].totalDisponiveis = ofertaProdutosDados[indexCabecalho].totalDisponiveis + totalDisponiveis
                            ofertaProdutosDados[indexCabecalho].quantidade = ofertaProdutosDados[indexCabecalho].quantidade + quantPedidoFornecedor
                            if (quantPedidosExtras) {
                                ofertaProdutosDados[indexCabecalho].quantPedidosExtras = quantPedidosExtras
                            }
                        
                            
                                
                        }
                        //totalValorCesta = (totalValorCesta + quantPedidoFornecedor*produtoDados.valorReferencia)
                        valorCesta = totalValorCesta / cicloCestaSel.quantidade
                        valorCestaDiferenca = cicloCestaSel.valormaximo - valorCesta
                        quantItensCesta = totalItensCesta / cicloCestaSel.quantidade        
                            

                        //cicloOfertaProdutosDados.sort()
                        ofertaProdutosDados.sort((a,b) => (a.produto > b.produto) ? 1 : ((b.produto > a.produto) ? -1 : 0))
                        // FIM Busca produtosOfertaDados



                        
                        let ofertaProdutosDadosAux = []
                        for (let index = 0; index < ofertaProdutosDados.length; index++) {
                            const ofertaProdutos = ofertaProdutosDados[index];

                            ofertaProdutosDadosAux.push ({
                                ...ofertaProdutos
                            })
                        }
                        

                        let  = new Array({ofertaProdutosDados})
                    
                        ofertaProdutosDadosComposicao = []
                        let cabecalhoProduto = []
                        let jaIncluiuCabecalho = 0
                        let cabecalhoProdutoComposicao = 0
                        let indexOfertaProdutosDadosComposicao = -1
                        for (let index = 0; index < ofertaProdutosDadosAux.length; index++) {
                            const ofertaProdutosAux = ofertaProdutosDadosAux[index];

                            if (ofertaProdutosAux.fornecedor == null) {
                                cabecalhoProduto = ofertaProdutosAux
                                jaIncluiuCabecalho = 0
                                ofertaProdutosAux.quantidade = 0
                                ofertaProdutosAux.quantidadeOfertados = 0
                                ofertaProdutosAux.totalDisponiveis = 0
                            }

                            if (Number(ofertaProdutosAux.quantidade) > 0) {
                                if (jaIncluiuCabecalho == 0) {
                                    ofertaProdutosDadosComposicao.push ({
                                        ...cabecalhoProduto
                                    })
                                    jaIncluiuCabecalho = 1
                                    indexOfertaProdutosDadosComposicao = indexOfertaProdutosDadosComposicao + 1
                                    cabecalhoProdutoComposicao = indexOfertaProdutosDadosComposicao

                                    }
                                ofertaProdutosDadosComposicao.push ({
                                ...ofertaProdutosAux
                                })
                                indexOfertaProdutosDadosComposicao = indexOfertaProdutosDadosComposicao + 1
                                    
                                ofertaProdutosDadosComposicao[cabecalhoProdutoComposicao].quantidadeOfertados = ofertaProdutosDadosComposicao[cabecalhoProdutoComposicao].quantidadeOfertados + ofertaProdutosAux.quantidadeOfertados
                                ofertaProdutosDadosComposicao[cabecalhoProdutoComposicao].totalDisponiveis = ofertaProdutosDadosComposicao[cabecalhoProdutoComposicao].totalDisponiveis + ofertaProdutosAux.totalDisponiveis
                                ofertaProdutosDadosComposicao[cabecalhoProdutoComposicao].quantidade = ofertaProdutosDadosComposicao[cabecalhoProdutoComposicao].quantidade + ofertaProdutosAux.quantidade
                                if (quantPedidosExtras) {
                                    ofertaProdutosDadosComposicao[cabecalhoProdutoComposicao].quantPedidosExtras = quantPedidosExtras
                                }
                        
                            }
                            
                        }

                        
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
                        else {

                            return res.redirect('/login')

                            // DESENVOLVIMENTO
                            /*usuarioAtivo.push({
                                email: "jsfarinaci@gmail.com",
                                picture: "https://lh3.googleusercontent.com/a-/AOh14GgJtCHmUVeMyPR3OiAHnnsp4NCI3bupns-WFHIekQ=s96-c",
                                name: "Juliana Farinaci",
                                email_verified: "false",
                                id: 2,
                                perfil: ['admin','consumidor']       
                            })
                            loginStatus = 'usuarioAtivo'*/

                        }
                        // USUARIO FIM


                        if (loginStatus == 'usuarioAtivo') {
                            if (usuarioAtivo[0].perfil.indexOf('admin') >= 0 ) {
                                if (cicloCestaSel.cestaId == 5) {   // cesta pedidos extras
                                    if ((ciclo.status) && (ciclo.status != 'oferta') && (ciclo.status != 'composicao'))   {
                                        return res.render('composicaopedidosextras',{ ofertaProdutosDados: ofertaProdutosDados, ofertaProdutosDadosComposicao: ofertaProdutosDadosComposicao, ciclo: ciclo, quantItensCesta: quantItensCesta, valorCestaDiferenca: valorCestaDiferenca, valorCesta: valorCesta, cicloCestasDados: cicloCestasDados, cicloCestasVisiveis: cicloCestasVisiveis, cicloCestaSel: cicloCestaSel, composicaoId: composicao.id})
                                    } else {
                                        if ( (req.body.hasOwnProperty("gerarAtribuicoesPedidoExtra")) && (gerarAutomaticoAtribuicao == 'SIM') ) {


                                            let quantidadefornecedores = 0

                                            let auxQuantPedidosExtras = 0
                                            let auxOfertaId = 0

                                            for (let index = 0; index < ofertaProdutosDados.length; index++) {
                                                const oferta = ofertaProdutosDados[index];
                                                

                                                if (oferta.fornecedor) {

                                                    quantidadefornecedores = quantidadefornecedores + 1

                                                    if (quantidadefornecedores == 1) {
                                                        auxQuantPedidosExtras = oferta.quantPedidosExtras
                                                        auxOfertaId = oferta.id
                                                    }

                                                    
                                                    
                                                } else {
                                                    
                                                    if (quantidadefornecedores == 1) {
                                                        if (Number(auxQuantPedidosExtras) > 0) {
                                    

                                                            composicaoOfertaProdutos = await Composicao.findOrCreateComposicaoProduto ({
                                                                    composicaoId: Number(composicao.id),
                                                                    ofertaProdutoId: Number(auxOfertaId)
                                                                })
                                                    
                                                            await Composicao.updateComposicaoProduto ({
                                                                id: Number(composicaoOfertaProdutos),
                                                                quantidade: Number(auxQuantPedidosExtras)
                                                            })
                                                        }
                                                    }

                                                    quantidadefornecedores = 0


                                                }
                                                
                                                
                                            }

                                            if (quantidadefornecedores == 1) {
                                                if (Number(auxQuantPedidosExtras) > 0) {
                            

                                                    composicaoOfertaProdutos = await Composicao.findOrCreateComposicaoProduto ({
                                                            composicaoId: Number(composicao.id),
                                                            ofertaProdutoId: Number(auxOfertaId)
                                                        })
                                            
                                                    await Composicao.updateComposicaoProduto ({
                                                        id: Number(composicaoOfertaProdutos),
                                                        quantidade: Number(auxQuantPedidosExtras)
                                                    })
                                                }
                                            }

                                            await Ciclo.updateCicloStatus ( {
                                                id: Number(ciclo.id),
                                                status: 'atribuicao'
                                            })





                                            return res.render('composicaopedidosextras',{ ofertaProdutosDados: ofertaProdutosDados, ofertaProdutosDadosComposicao: ofertaProdutosDadosComposicao, ciclo: ciclo, quantItensCesta: quantItensCesta, valorCestaDiferenca: valorCestaDiferenca, valorCesta: valorCesta, cicloCestasDados: cicloCestasDados, cicloCestasVisiveis: cicloCestasVisiveis, cicloCestaSel: cicloCestaSel, composicaoId: composicao.id})
                                        
                                        
                                        } else {
                                            return res.render('composicaopedidosextrasConfirmacao',{ ciclo: ciclo, cicloCestaSel: cicloCestaSel, composicaoId: composicao.id })
                                        }
                                    }
                                } else {
                                    if (cicloCestaSel.cestaId == 1) {   // cesta ofertas sobreas extras
                                        if ((ciclo.status) && (ciclo.status != 'oferta')) {
                                                return res.render('composicaoofertassobras',{ ofertaProdutosDados: ofertaProdutosDados, ofertaProdutosDadosComposicao: ofertaProdutosDadosComposicao, ciclo: ciclo, quantItensCesta: quantItensCesta, valorCestaDiferenca: valorCestaDiferenca, valorCesta: valorCesta, cicloCestasDados: cicloCestasDados, cicloCestasVisiveis: cicloCestasVisiveis, cicloCestaSel: cicloCestaSel, composicaoId: composicao.id})
                                        } else {

                                            if ((req.body.hasOwnProperty("gerarPedidoExtra")) && (gerarAutomaticoSobra == 'SIM') ){

                                                for (let index = 0; index < ofertaProdutosDados.length; index++) {
                                                    const oferta = ofertaProdutosDados[index];

                                                    /*id: cicloOfertaProduto.id,
                                                    nome: null,
                                                    medida: null,
                                                    valorReferencia: 0,
                                                    quantidadeOfertados: quantidadeOfertados,
                                                    quantidadePedido: quantPedidoOld,
                                                    quantidade: quantPedidoFornecedor,
                                                    fornecedor: usuarioDados.nome,
                                                    valorTotalPedidoAcumulado: valorTotalPedidoAcumulado,
                                                    totalDisponiveis: totalDisponiveis,
                                                    quantPedidosExtras: quantPedidosExtras,*/

                                                    if (oferta.fornecedor) {
                                                        if (Number(oferta.totalDisponiveis) > 0) {
                                    
                                                            composicaoOfertaProdutos = await Composicao.findOrCreateComposicaoProduto ({
                                                                    composicaoId: Number(composicao.id),
                                                                    ofertaProdutoId: Number(oferta.id)
                                                                })
                                                    
                                                            await Composicao.updateComposicaoProduto ({
                                                                id: Number(composicaoOfertaProdutos),
                                                                quantidade: Number(oferta.totalDisponiveis)
                                                            })
                                                        }
                                                    }
                                                    
                                                }

                                                await Ciclo.updateCicloStatus ( {
                                                    id: Number(ciclo.id),
                                                    status: 'composicao'
                                                })

                                                return res.render('composicaoofertassobras',{ ofertaProdutosDados: ofertaProdutosDados, ofertaProdutosDadosComposicao: ofertaProdutosDadosComposicao, ciclo: ciclo, quantItensCesta: quantItensCesta, valorCestaDiferenca: valorCestaDiferenca, valorCesta: valorCesta, cicloCestasDados: cicloCestasDados, cicloCestasVisiveis: cicloCestasVisiveis, cicloCestaSel: cicloCestaSel, composicaoId: composicao.id})
                                            } else {
                                                return res.render('composicaoofertassobrasConfirmacao',{ ciclo: ciclo, cicloCestaSel: cicloCestaSel, composicaoId: composicao.id })
                                            }
                                        }
                                    } else {
                                        return res.render('composicao',{ ofertaProdutosDados: ofertaProdutosDados, ofertaProdutosDadosComposicao: ofertaProdutosDadosComposicao, ciclo: ciclo, quantItensCesta: quantItensCesta, valorCestaDiferenca: valorCestaDiferenca, valorCesta: valorCesta, cicloCestasDados: cicloCestasDados, cicloCestasVisiveis: cicloCestasVisiveis, cicloCestaSel: cicloCestaSel, composicaoId: composicao.id})
                                    }
                                }
                            }
                            else {
                                return res.redirect('/login')
                            }
                        }
                        
                        //return res.render('composicao',{ ofertaProdutosDados: ofertaProdutosDados, ofertaProdutosDadosComposicao: ofertaProdutosDadosComposicao, ciclo: ciclo, quantItensCesta: quantItensCesta, valorCestaDiferenca: valorCestaDiferenca, valorCesta: valorCesta, cicloCestasDados: cicloCestasDados, cicloCestaSel: cicloCestaSel, composicaoId: composicao.id})
        }
    },

    async showComposicaoSobraOferta(req, res) {
        const cicloId = req.params.id

        const dadosCiclo = await Ciclo.getCicloId(cicloId)

        if (dadosCiclo == 'error') {
            return res.send('Ciclo não existe!')
        }
        
        ciclo = dadosCiclo.ciclo[0]

        const cicloCestas = dadosCiclo.cicloCestas

        const cicloComposicoes = dadosCiclo.cicloComposicoes

        const cestas = await Cesta.get()
        
        cicloCestasDados = []
        cicloCestas.forEach(cicloCesta => {
            cestaDados = cestas.find(cesta => Number(cesta.id) === Number(cicloCesta.cestaId))

            cicloCestasDados.push({
                id: cicloCesta.id,
                nome: cestaDados.nome,
                quantidade: cicloCesta.quantidadeCestas,
                valormaximo: cestaDados.valormaximo,
                cestaId: cicloCesta.cestaId
            })
        });


// comentado pois parece que se trata de código antigo, sem utilidadee que está dando erro
        /*if (req.query.cst) {
            cicloCestaSelId = req.query.cst   

            cicloCestaSel = cicloCestasDados.find(cicloCestaDado => Number(cicloCestaDado.id) == Number(cicloCestaSelId))
        
        } else {

            // se nenhuma selecionada escolhe a 1
            cicloCestaSel = cicloCestasDados.find(cicloCestaDado => Number(cicloCestaDado.cestaId) == 7)
        

            cicloCestaSelId = cicloCestaSel.id
        }
        

        composicao = await Composicao.findOrCreate({
                        cicloCestaId: cicloCestaSelId
                   })
        
        let arrayComposicoes = []
        cicloComposicoes.forEach(cicloComposicao => {
            if (cicloComposicao.id != composicao.id) {
                arrayComposicoes.push(cicloComposicao.id)
            }
        });*/
          
        const produtos = await Produto.get();
        const usuarios = await Usuario.get();

        // Busca produtosOfertaDados
        
        const ofertas = await Oferta.getOfertasPorCiclo({
            cicloId: cicloId
        })

        let cicloProdutosOfertados = []

        let arrayOfertas = []

        for (let index = 0; index < ofertas.length; index++) {
            const oferta = ofertas[index];
            produtosOferta = await Oferta.getProdutosPorOferta({
                ofertaId: oferta.id
            })
            produtosOferta.forEach(produtoOferta => {

              produtoDadosOferta = produtos.find(produto => Number(produto.id) === Number(produtoOferta.produtoId))
            
                
              cicloProdutosOfertados.push({
                  id: produtoOferta.id,
                  nome: produtoDadosOferta.nome,
                  medida: produtoDadosOferta.medida,
                  valorReferencia: produtoDadosOferta.valorReferencia,
                  quantidade:produtoOferta.quantidade,
                  produtoId: produtoOferta.produtoId,
                  usuarioId: oferta.usuarioId
              })

            });
        } 
        
        cicloProdutosOfertados.sort((a,b) => (a.produtoId > b.produtoId) ? 1 : ((b.produtoId > a.produtoId) ? -1 : 0))

        let ofertaProdutosDados = []

        let produtoCorrente = {
            id: 0,
            nome: "",
            quantidade: 0,
            fornecedores: "vazio"
        }

        let quantidadeOfertados = 0
        let quantidadeParaPedir = 0
        let totalValorCesta = 0
        let totalItensCesta = 0
        let quantItensCesta = 0
        let indexCabecalhoProduto = 0
        let indexArrayofertaProdutosDados = -1


        console.log('cicloProdutosOfertados',cicloProdutosOfertados)


        for (let index = 0; index < cicloProdutosOfertados.length; index++) {
            const cicloOfertaProduto = cicloProdutosOfertados[index]
            
            produtoDados = produtos.find(produto => Number(produto.id) === Number(cicloOfertaProduto.produtoId))
            usuarioDados = usuarios.find(usuario => Number(usuario.id) === Number(cicloOfertaProduto.usuarioId))

            /*const quantPedidoFornecedor = await Composicao.getPedidoPorOfertaComposicao({
                ofertaProdutoId: cicloOfertaProduto.id,
                composicaoId: composicao.id
            })*/
            //totalValorCesta = (totalValorCesta + quantPedidoFornecedor*produtoDados.valorReferencia)
            //totalItensCesta = (totalItensCesta + quantPedidoFornecedor)

            // comentado pois parece que se trata de código antigo, sem utilidadee que está dando erro
            /*// TEMP - PARA MIGRACAO - pedidos tabela fornecedores        
              quantPedidoOld = await Composicao.getPedidoFornecedores({
                id: cicloOfertaProduto.id
              })
            // fim do temporario*/

            if (produtoDados.id != produtoCorrente.id) {
                
                // comentado pois parece que se trata de código antigo, sem utilidadee que está dando erro
                /*// ANTIGO - SERA EXCLUIDO POS MIGRACAO BEGIN - calculo da quantidade de produtos, por produto, que precisa ser pedido aos fornecedores
                    quantidadeProdutoComposicaoOld = await Composicao.getQuantidadeProdutosComposicaoOld({
                        arrayComposicoes: arrayComposicoes,
                        produtoId: produtoDados.id
                    })

                    quantidadeParaPedir = 0
                    if (quantidadeProdutoComposicaoOld[0]) {
                        quantidadeParaPedir = Number(quantidadeProdutoComposicaoOld[0].SumQuantidade)
                    }*/
                
                produtoCorrente.id = produtoDados.id

                indexArrayofertaProdutosDados = indexArrayofertaProdutosDados + 1
                indexCabecalho = indexArrayofertaProdutosDados
                
            }

            if (cicloOfertaProduto.quantidade) {
                quantidadeOfertados = cicloOfertaProduto.quantidade
            }

            // calculo do valor total de produtos parte de composições
            const valorTotalPedidoAcumulado = await Composicao.getValorTotalPedidoAcumulado({
                usuarioId: cicloOfertaProduto.usuarioId,
                cicloId: cicloId,
                cicloCestas: cicloCestas
            })

            // calculo do total de produtos pedidos nas composições
            const totalProdutosPedidoAcumulado = await Composicao.getTotalProdutosPedidoAcumulado({
                usuarioId: cicloOfertaProduto.usuarioId,
                cicloId: cicloId,
                produtoId: cicloOfertaProduto.produtoId,
                cicloCestas: cicloCestas
            })

            //const totalDisponiveis = Number(quantidadeOfertados) - Number(totalProdutosPedidoAcumulado) + Number(quantPedidoFornecedor)
            const totalDisponiveis = Number(quantidadeOfertados) - Number(totalProdutosPedidoAcumulado)

            ofertaProdutosDados.push ({
                id: cicloOfertaProduto.id,
                nome: cicloOfertaProduto.nome,
                //nome: produtoDados.nome,
                medida: cicloOfertaProduto.medida,
                valorReferencia: cicloOfertaProduto.valorReferencia,
                quantidadeOfertados: quantidadeOfertados,
                // comentado pois parece que se trata de código antigo, sem utilidadee que está dando erro
                /*quantidadePedido: quantPedidoOld,*/
                //quantidade: quantPedidoFornecedor,
                fornecedor: usuarioDados.nome,
                valorTotalPedidoAcumulado: valorTotalPedidoAcumulado,
                totalDisponiveis: totalDisponiveis
            })

            indexArrayofertaProdutosDados = indexArrayofertaProdutosDados + 1

            
            //ofertaProdutosDados[indexCabecalho].quantidadeOfertados = ofertaProdutosDados[indexCabecalho].quantidadeOfertados + quantidadeOfertados
            //ofertaProdutosDados[indexCabecalho].totalDisponiveis = ofertaProdutosDados[indexCabecalho].totalDisponiveis + totalDisponiveis
            //ofertaProdutosDados[indexCabecalho].quantidade = ofertaProdutosDados[indexCabecalho].quantidade + quantPedidoFornecedor
        
            
                
        }
        
        //valorCesta = totalValorCesta / cicloCestaSel.quantidade
        //valorCestaDiferenca = cicloCestaSel.valormaximo - valorCesta
        //quantItensCesta = totalItensCesta / cicloCestaSel.quantidade        
            

        //cicloOfertaProdutosDados.sort()
        ofertaProdutosDados.sort((a,b) => (a.produto > b.produto) ? 1 : ((b.produto > a.produto) ? -1 : 0))
        // FIM Busca produtosOfertaDados


        console.log('ofertaProdutosDados:', ofertaProdutosDados)

        
        let ofertaProdutosDadosAux = []
        for (let index = 0; index < ofertaProdutosDados.length; index++) {
            const ofertaProdutos = ofertaProdutosDados[index];

            ofertaProdutosDadosAux.push ({
                ...ofertaProdutos
            })
        }
        

        /*
        let  = new Array({ofertaProdutosDados})
    
        ofertaProdutosDadosComposicao = []
        let cabecalhoProduto = []
        let jaIncluiuCabecalho = 0
        let cabecalhoProdutoComposicao = 0
        let indexOfertaProdutosDadosComposicao = -1
        for (let index = 0; index < ofertaProdutosDadosAux.length; index++) {
            const ofertaProdutosAux = ofertaProdutosDadosAux[index];

            if (ofertaProdutosAux.fornecedor == null) {
                cabecalhoProduto = ofertaProdutosAux
                jaIncluiuCabecalho = 0
                ofertaProdutosAux.quantidade = 0
                ofertaProdutosAux.quantidadeOfertados = 0
                ofertaProdutosAux.totalDisponiveis = 0
            }

            if (Number(ofertaProdutosAux.quantidade) > 0) {
                if (jaIncluiuCabecalho == 0) {
                    ofertaProdutosDadosComposicao.push ({
                        ...cabecalhoProduto
                    })
                    jaIncluiuCabecalho = 1
                    indexOfertaProdutosDadosComposicao = indexOfertaProdutosDadosComposicao + 1
                    cabecalhoProdutoComposicao = indexOfertaProdutosDadosComposicao

                    }
                ofertaProdutosDadosComposicao.push ({
                   ...ofertaProdutosAux
                })
                indexOfertaProdutosDadosComposicao = indexOfertaProdutosDadosComposicao + 1
                    
                ofertaProdutosDadosComposicao[cabecalhoProdutoComposicao].quantidadeOfertados = ofertaProdutosDadosComposicao[cabecalhoProdutoComposicao].quantidadeOfertados + ofertaProdutosAux.quantidadeOfertados
                ofertaProdutosDadosComposicao[cabecalhoProdutoComposicao].totalDisponiveis = ofertaProdutosDadosComposicao[cabecalhoProdutoComposicao].totalDisponiveis + ofertaProdutosAux.totalDisponiveis
                ofertaProdutosDadosComposicao[cabecalhoProdutoComposicao].quantidade = ofertaProdutosDadosComposicao[cabecalhoProdutoComposicao].quantidade + ofertaProdutosAux.quantidade
        
            }
            
        }*/


        ofertaProdutosDados.sort((a,b) => (a.fornecedor > b.fornecedor) ? 1 : ((b.fornecedor > a.fornecedor) ? -1 : 0))
        

        
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
        else {

            return res.redirect('/login')

            // DESENVOLVIMENTO
            /*usuarioAtivo.push({
                email: "jsfarinaci@gmail.com",
                picture: "https://lh3.googleusercontent.com/a-/AOh14GgJtCHmUVeMyPR3OiAHnnsp4NCI3bupns-WFHIekQ=s96-c",
                name: "Juliana Farinaci",
                email_verified: "false",
                id: 2,
                perfil: ['admin','consumidor']       
            })
            loginStatus = 'usuarioAtivo'*/

        }
        // USUARIO FIM


        if (loginStatus == 'usuarioAtivo') {
            if (usuarioAtivo[0].perfil.indexOf('admin') >= 0 ) {
                return res.render('pedidosFornecedoresSobra',{ produtosPedidosFornecedoresDados: ofertaProdutosDados, ciclo: ciclo})
                //return res.render('composicao',{ ofertaProdutosDados: ofertaProdutosDados, ofertaProdutosDadosComposicao: ofertaProdutosDadosComposicao, ciclo: ciclo, quantItensCesta: quantItensCesta, valorCestaDiferenca: valorCestaDiferenca, valorCesta: valorCesta, cicloCestasDados: cicloCestasDados, cicloCestaSel: cicloCestaSel, composicaoId: composicao.id})
            }
            else {
                return res.redirect('/login')
            }
        }
        
        //return res.render('composicao',{ ofertaProdutosDados: ofertaProdutosDados, ofertaProdutosDadosComposicao: ofertaProdutosDadosComposicao, ciclo: ciclo, quantItensCesta: quantItensCesta, valorCestaDiferenca: valorCestaDiferenca, valorCesta: valorCesta, cicloCestasDados: cicloCestasDados, cicloCestaSel: cicloCestaSel, composicaoId: composicao.id})
    },
















    async showTodosPedidosFornecedores(req, res) {

        const cicloId = req.params.id

        const dadosCiclo = await Ciclo.getCicloId(cicloId)

        if (dadosCiclo == 'error') {
            return res.send('Ciclo não existe!')
        }  

        ciclo = dadosCiclo.ciclo[0]
        cicloCestas = dadosCiclo.cicloCestas

        const produtos = await Produto.get()
        const cestas = await Cesta.get()

        // BEGIN to-do será alterado para trazer array de usuários que usuário logado pode ver e usuários fornecedores
        const usuarios = await Usuario.get();

        let arrayUsuarios = []

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
        else {

            return res.redirect('/login')

            // DESENVOLVIMENTO
            /*usuarioAtivo.push({
                email: "jsfarinaci@gmail.com",
                picture: "https://lh3.googleusercontent.com/a-/AOh14GgJtCHmUVeMyPR3OiAHnnsp4NCI3bupns-WFHIekQ=s96-c",
                name: "Juliana Farinaci",
                email_verified: "false",
                id: 2,
                perfil: ['consumidor']       
            })
            loginStatus = 'usuarioAtivo'*/

        }
        // USUARIO FIM

        


        

        for (let index = 0; index < usuarios.length; index++) {
            const usuario = usuarios[index];
            arrayUsuarios.push(usuario.id)   
        }
        // FIM

        if (loginStatus == 'usuarioAtivo') {
            if (usuarioAtivo[0].perfil.indexOf('admin') < 0 )  { // diferente de admin
                arrayUsuarios = []
                arrayUsuarios.push(usuarioAtivo[0].id)
            }
        }

        const ofertas = await Oferta.getOfertasPorCicloPorUsuarios({
            cicloId: cicloId,
            arrayUsuarios: arrayUsuarios
        })


        let cicloProdutosOfertados = []

        //let arrayOfertas = []

        for (let index = 0; index < ofertas.length; index++) {
            const oferta = ofertas[index];
            
            produtosOferta = await Oferta.getProdutosPorOferta({
                ofertaId: oferta.id
            })

            usuarioDados = usuarios.find(usuario => Number(usuario.id) === Number(oferta.usuarioId))
            
            produtosOferta.forEach(produtoOferta => {
              cicloProdutosOfertados.push({
                  id: produtoOferta.id,
                  quantidadeOfertado:produtoOferta.quantidade,
                  produtoId: produtoOferta.produtoId,
                  fornecedorId: oferta.usuarioId,
                  fornecedor: usuarioDados.nome
              })

            });
        } 
        
        cicloProdutosOfertados.sort((a,b) => (a.usuarioId > b.usuarioId) ? 1 : ((b.usuarioId > a.usuarioId) ? -1 : 0))

        let usuarioCorrente = 0

        let pedidosPorFornecedor = []

        let quantPedidosFornecedor

        let pedidosCestas

        for (let index = 0; index < cicloProdutosOfertados.length; index++) {
            const cicloOfertaProduto = cicloProdutosOfertados[index]

            produtoDados = produtos.find(produto => Number(produto.id) === Number(cicloOfertaProduto.produtoId))
            
            PedidosPorOfertaFornecedor = await Composicao.getPedidosPorOferta({
                ofertaProdutoId: cicloOfertaProduto.id,
                cicloCestas: cicloCestas
            })

            pedidosCestas = []
            quantPedidosFornecedor = 0

            for (let index = 0; index < PedidosPorOfertaFornecedor.length; index++) {
                const pedidosPorOferta = PedidosPorOfertaFornecedor[index];

                    cicloCestaDados = cicloCestas.find(cicloCesta => Number(cicloCesta.id) === Number(pedidosPorOferta['composicaoOfertaProdutos.cicloCestaId']))
                    cestaDados = cestas.find(cesta => Number(cesta.id) === Number(cicloCestaDados.cestaId))
            
                    if (usuarioDados.id != usuarioCorrente.id) {
                        
                        usuarioCorrenteId = cicloOfertaProduto.fornecedorId

                    }

                    if (cicloOfertaProduto.quantidadeOfertado) {
                        quantidadeOfertado = Number(cicloOfertaProduto.quantidadeOfertado)
                    }

                    quantPedidosFornecedor = quantPedidosFornecedor + pedidosPorOferta.quantidade

                    if ( pedidosPorOferta.quantidade > 0 ) {
                        pedidosCestas.push ({
                        cestaId: cestaDados.id,
                        cestaNome: cestaDados.nome,
                        cestaQuantidade: pedidosPorOferta.quantidade
                        })
                    }

            }

            if (quantPedidosFornecedor > 0) {
                pedidosPorFornecedor.push ({
                    id: cicloOfertaProduto.id,
                    nome: produtoDados.nome,
                    medida: produtoDados.medida,
                    valorReferencia: produtoDados.valorReferencia,
                    quantidadeOfertado: quantidadeOfertado,
                    quantidadePedidos: quantPedidosFornecedor,
                    fornecedor: cicloOfertaProduto.fornecedor,
                    fornecedorId: cicloOfertaProduto.fornecedorId,
                    pedidosCestas: pedidosCestas
                })
            }
                        
        }

        pedidosPorFornecedor.sort((a,b) => (a.fornecedor > b.fornecedor) ? 1 : ((b.fornecedor > a.fornecedor) ? -1 : 0))


        return res.render('pedidosFornecedoresTodos',{ produtosPedidosFornecedoresDados: pedidosPorFornecedor, ciclo: ciclo})
    },

    async showPedidosFornecedores(req, res) {

        const cicloId = req.params.id

        const dadosCiclo = await Ciclo.getCicloId(cicloId)
        
        if (dadosCiclo == 'error') {
            return res.send('Ciclo não existe!')
        }

        ciclo = dadosCiclo.ciclo[0]
        cicloCestas = dadosCiclo.cicloCestas

        const produtos = await Produto.get()
        const cestas = await Cesta.get()

        // BEGIN to-do será alterado para trazer array de usuários que usuário logado pode ver e usuários fornecedores
        const usuarios = await Usuario.get();

        let arrayUsuarios = []

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
        else {

            return res.redirect('/login')
     
            // ATIVAR para DESENVOLVIMENTO
            /*usuarioAtivo.push({
                email: "jsfarinaci@gmail.com",
                picture: "https://lh3.googleusercontent.com/a-/AOh14GgJtCHmUVeMyPR3OiAHnnsp4NCI3bupns-WFHIekQ=s96-c",
                name: "Juliana Farinaci",
                email_verified: "false",
                id: 2,
                perfil: ['consumidor']       
            })
            loginStatus = 'usuarioAtivo'*/


        }
        // USUARIO FIM

        


        

        for (let index = 0; index < usuarios.length; index++) {
            const usuario = usuarios[index];
            arrayUsuarios.push(usuario.id)   
        }
        // FIM

        if (loginStatus == 'usuarioAtivo') {
            if (usuarioAtivo[0].perfil.indexOf('admin') < 0 )  { // diferente de admin
                arrayUsuarios = []
                arrayUsuarios.push(usuarioAtivo[0].id)
            }
        }

        const ofertas = await Oferta.getOfertasPorCicloPorUsuarios({
            cicloId: cicloId,
            arrayUsuarios: arrayUsuarios
        })


        let cicloProdutosOfertados = []

        //let arrayOfertas = []

        for (let index = 0; index < ofertas.length; index++) {
            const oferta = ofertas[index];
            
            produtosOferta = await Oferta.getProdutosPorOferta({
                ofertaId: oferta.id
            })

            usuarioDados = usuarios.find(usuario => Number(usuario.id) === Number(oferta.usuarioId))
            
            produtosOferta.forEach(produtoOferta => {
              cicloProdutosOfertados.push({
                  id: produtoOferta.id,
                  quantidadeOfertado:produtoOferta.quantidade,
                  produtoId: produtoOferta.produtoId,
                  fornecedorId: oferta.usuarioId,
                  fornecedor: usuarioDados.nome
              })

            });
        } 
        
        cicloProdutosOfertados.sort((a,b) => (a.usuarioId > b.usuarioId) ? 1 : ((b.usuarioId > a.usuarioId) ? -1 : 0))

        let usuarioCorrente = 0

        let pedidosPorFornecedor = []

        let quantPedidosFornecedor

        let pedidosCestas

        for (let index = 0; index < cicloProdutosOfertados.length; index++) {
            const cicloOfertaProduto = cicloProdutosOfertados[index]

            produtoDados = produtos.find(produto => Number(produto.id) === Number(cicloOfertaProduto.produtoId))
            
            PedidosPorOfertaFornecedor = await Composicao.getPedidosPorOferta({
                ofertaProdutoId: cicloOfertaProduto.id,
                cicloCestas: cicloCestas
            })

            pedidosCestas = []
            quantPedidosFornecedor = 0

            for (let index = 0; index < PedidosPorOfertaFornecedor.length; index++) {
                const pedidosPorOferta = PedidosPorOfertaFornecedor[index];

                    cicloCestaDados = cicloCestas.find(cicloCesta => Number(cicloCesta.id) === Number(pedidosPorOferta['composicaoOfertaProdutos.cicloCestaId']))
                    cestaDados = cestas.find(cesta => Number(cesta.id) === Number(cicloCestaDados.cestaId))
            
                    if (usuarioDados.id != usuarioCorrente.id) {
                        
                        usuarioCorrenteId = cicloOfertaProduto.fornecedorId

                    }

                    if (cicloOfertaProduto.quantidadeOfertado) {
                        quantidadeOfertado = Number(cicloOfertaProduto.quantidadeOfertado)
                    }

                    quantPedidosFornecedor = quantPedidosFornecedor + pedidosPorOferta.quantidade

                    if ( pedidosPorOferta.quantidade > 0 ) {
                        pedidosCestas.push ({
                        cestaId: cestaDados.id,
                        cestaNome: cestaDados.nome,
                        cestaQuantidade: pedidosPorOferta.quantidade
                        })
                    }

            }

            if (quantPedidosFornecedor > 0) {
                pedidosPorFornecedor.push ({
                    id: cicloOfertaProduto.id,
                    nome: produtoDados.nome,
                    medida: produtoDados.medida,
                    valorReferencia: produtoDados.valorReferencia,
                    quantidadeOfertado: quantidadeOfertado,
                    quantidadePedidos: quantPedidosFornecedor,
                    fornecedor: cicloOfertaProduto.fornecedor,
                    fornecedorId: cicloOfertaProduto.fornecedorId,
                    pedidosCestas: pedidosCestas
                })
            }
                        
        }

        pedidosPorFornecedor.sort((a,b) => (a.fornecedor > b.fornecedor) ? 1 : ((b.fornecedor > a.fornecedor) ? -1 : 0))


        return res.render('pedidosFornecedoresIndiv',{ produtosPedidosFornecedoresDados: pedidosPorFornecedor, ciclo: ciclo})
    },



    async showTodosPedidosFornecedoresOld(req, res) {
        const cicloId = req.params.id

        const dadosCiclo = await Ciclo.getCicloId(cicloId)
        ciclo = dadosCiclo.ciclo[0]

        const cicloComposicoes = dadosCiclo.cicloComposicoes
        
        // array para busca da quantidade por produto para calculo de itens pedidos
        let arrayComposicoes = []
        cicloComposicoes.forEach(cicloComposicao => {
            arrayComposicoes.push(cicloComposicao.id)
        });
        
        /*produtosComposicao = await Composicao.getProdutosPorCicloComposicao({
                                composicaoId: composicao.id
                        })*/
        
        const produtos = await Produto.get();
        const usuarios = await Usuario.get();

        // Busca produtosOfertaDados
        
        const ofertas = await Oferta.getOfertasPorCiclo({
            cicloId: cicloId
        })

        let cicloProdutosOfertados = []

        let arrayOfertas = []

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

              arrayOfertas.push({
                  produtoOfertaId:produtoOferta.id,
                  produtoId: produtoOferta.produtoId,
              })

            });
        } 
        
        cicloProdutosOfertados.sort((a,b) => (a.produtoId > b.produtoId) ? 1 : ((b.produtoId > a.produtoId) ? -1 : 0))

        let cicloOfertaProdutosDados = []

        let produtoCorrente = {
            id: 0,
            nome: "",
            quantidade: 0,
            fornecedores: "vazio"
        }

        let quantidadeOfertados = 0
        let quantidadeParaPedir = 0
        let quantidadeFaltaPedir = 0
        let arrayProdutosOfertas = []

        for (let index = 0; index < cicloProdutosOfertados.length; index++) {
            const cicloOfertaProduto = cicloProdutosOfertados[index]
            
            produtoDados = produtos.find(produto => Number(produto.id) === Number(cicloOfertaProduto.produtoId))
            usuarioDados = usuarios.find(usuario => Number(usuario.id) === Number(cicloOfertaProduto.usuarioId))

            const quantPedidoFornecedor = await Composicao.getPedidoFornecedores({
                id: cicloOfertaProduto.id,
            })
 
            if (produtoDados.id != produtoCorrente.id) {
                
                // BEGIN - calculo da quantidade de produtos, por produto, que precisa ser pedido aos fornecedores
                    quantidadeProdutoComposicao = await Composicao.getQuantidadeProdutosComposicao({
                        arrayComposicoes: arrayComposicoes,
                        produtoId: produtoDados.id
                    })

                    quantidadeProdutoPedidoConsumidores = await PedidoConsumidores.getQuantidadeProdutoPedidoConsumidores({
                        cicloId: cicloId,
                        produtoId: produtoDados.id
                    })

                    quantidadeParaPedir = 0
                    if (quantidadeProdutoComposicao[0]) {
                        quantidadeParaPedir = Number(quantidadeProdutoComposicao[0].SumQuantidade)
                    }

                    if (quantidadeProdutoPedidoConsumidores) {
                        quantidadeParaPedir = quantidadeParaPedir + Number(quantidadeProdutoPedidoConsumidores)
                    }

                    
                // END

                arrayProdutosOfertas = []
                arrayOfertas.forEach(oferta => {
                    if (oferta.produtoId == produtoDados.id) {
                        arrayProdutosOfertas.push(oferta.produtoOfertaId)
                    }
                });

                quantidadeProdutoPedidoFornecedores = await Composicao.getQuantidadeProdutoPedidoFornecedores({
                    arrayProdutosOfertas: arrayProdutosOfertas
                })

                quantidadeFaltaPedir = quantidadeParaPedir - Number(quantidadeProdutoPedidoFornecedores)

                produtoCorrente.id = produtoDados.id

                //produtoCorrente.nome = produtoDados.nome
                //produtoCorrente.quantidade = produtoCorrente.quantidade + cicloOfertaProduto.quantidade        
            }


            if (cicloOfertaProduto.quantidade) {
                quantidadeOfertados = cicloOfertaProduto.quantidade
            }

            if (quantPedidoFornecedor > 0) {
                cicloOfertaProdutosDados.push ({
                    id: cicloOfertaProduto.id,
                    nome: produtoDados.nome,
                    valorReferencia: produtoDados.valorReferencia,
                    quantidadeOfertados: quantidadeOfertados,
                    quantidadeParaPedir: quantidadeParaPedir,
                    quantidadeFaltaPedir: quantidadeFaltaPedir,
                    quantidade: quantPedidoFornecedor,
                    fornecedor: usuarioDados.nome,
                    fornecedorId: usuarioDados.id
                })
            }
                
        }

        //cicloOfertaProdutosDados.sort()
        cicloOfertaProdutosDados.sort((a,b) => (a.fornecedor > b.fornecedor) ? 1 : ((b.fornecedor > a.fornecedor) ? -1 : 0))
        // FIM Busca produtosOfertaDados

        produtosPedidosFornecedoresDados = cicloOfertaProdutosDados

        return res.render('pedidosFornecedoresTodos',{ produtosPedidosFornecedoresDados: produtosPedidosFornecedoresDados, ciclo: ciclo})
    },

    
    async save(req, res) {

        //const produtos = await Produto.get();

        composicaoId = req.body.composicaoId
        cicloCestaId = req.body.cicloCestaId
        quantidadeCestas = req.body.quantidadeCestas
        cicloId = req.body.cicloId

        const ofertas = await Oferta.getOfertasPorCiclo({
            cicloId: cicloId
        })

        //produtosComposicao = await Composicao.getProdutosPorComposicao({
            //composicaoId: composicaoId
        //})

        let nomeInput = ''

        for (let index = 0; index < ofertas.length; index++) {
            const oferta = ofertas[index];
            
            produtosOferta = await Oferta.getProdutosPorOferta({
                ofertaId: oferta.id
            })


            for (let index = 0; index < produtosOferta.length; index++) {
                const produtoOferta = produtosOferta[index];

                //produtoDados = produtos.find(produto => Number(produto.id) === Number(produtoComposicao.produtoId))
        
                nomeInput = 'quantidade'+ produtoOferta.id.toString()        

                let valueInput = 0

                
                if (req.body[nomeInput]) {
                  valueInput = req.body[nomeInput]

                  composicaoOfertaProdutos = await Composicao.findOrCreateComposicaoProduto ({
                            composicaoId: Number(composicaoId),
                            ofertaProdutoId: Number(produtoOferta.id)
                            })
                
                  await Composicao.updateComposicaoProduto ({
                    id: Number(composicaoOfertaProdutos),
                    quantidade: Number(valueInput)
                    })
                }
    
            }

        }



        return res.redirect('/composicao/' + cicloId + '?cst=' + cicloCestaId)

    }

    
    /*delete(req, res) {
        const composicaoId = req.params.id

        Composicao.delete(composicaoId)

        return res.redirect('/composicao-index')
    }*/
}

    
