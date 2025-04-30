const Ciclo = require('../model/Ciclo')
const Cesta = require('../model/Cesta')
const Produto = require('../model/Produto')
const Usuario = require('../model/Usuario')
const Oferta = require('../model/Oferta')
const Composicao = require('../model/Composicao')
const PedidoConsumidores = require('../model/PedidoConsumidores')
const Profile = require('../model/Profile')


module.exports = {

    async showTodosCiclos(req, res) {
        
        const data = await Ciclo.getCiclosMin_v2({ordem:'inversa'});
        const ciclos = data.ciclos
        
        return res.render('pedidosFornecedoresCiclosSelecao',{ciclos: ciclos})
    },

    async showTodosCiclosConsumidores(req, res) {
        
        const data = await Ciclo.getCiclosMin_v2({ordem:'inversa'});
        const ciclos = data.ciclos
        
        return res.render('pedidosConsumidoresCiclosSelecao',{ciclos: ciclos})
    },

    async downloadPedidosFornecedoresCiclos(req, res) {

        'use strict';

        const fs = require('fs');

        const pathDownloads = 'public/downloads/'

        let pedidosfornecedores = { 
            name: 'Mike_dentro_public',
            age: 23, 
            gender: 'Male',
            department: 'English',
            car: 'Honda' 
        };
 
        //let data = JSON.stringify(student);

        const json2csv = require('json2csv').parse;
        const csvString = json2csv(pedidosfornecedores);
        //res.setHeader('Content-disposition', 'attachment; filename=shifts-report.csv');
        //res.set('Content-Type', 'text/csv');
        //res.status(200).send(csvString);


        fs.writeFileSync(pathDownloads + 'relatorioFornecedores.csv', csvString);
        res.download(pathDownloads + 'relatorioFornecedores.csv');

        //return res.redirect('/')

    },
        

   
    async showPedidosFornecedoresCiclos(req, res) {
        
        var selBotao = req.body.relatorio;

        const cicloId = req.body.ciclos

        const dadosCiclo = await Ciclo.getCicloId(cicloId)
        ciclo = dadosCiclo.ciclo[0]
        cicloCestas = dadosCiclo.cicloCestas

        ciclos = dadosCiclo.ciclo

        const produtos = await Produto.get()
        const cestas = await Cesta.get()

        // BEGIN to-do será alterado para trazer array de usuários que usuário logado pode ver e usuários fornecedores
        const usuarios = await Usuario.get();

        let arrayUsuarios = []

        

        for (let index = 0; index < usuarios.length; index++) {
            const usuario = usuarios[index];
            arrayUsuarios.push(usuario.id)   
        }
        // FIM

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
            cicloDados = ciclos.find(cicl => Number(cicl.id) === Number(oferta.cicloId))
            
            produtosOferta.forEach(produtoOferta => {
              cicloProdutosOfertados.push({
                  id: produtoOferta.id,
                  quantidadeOfertado:produtoOferta.quantidade,
                  produtoId: produtoOferta.produtoId,
                  fornecedorId: oferta.usuarioId,
                  fornecedor: usuarioDados.nome,
                  cicloId: cicloDados.nome,
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
                    pedidosCestas: pedidosCestas,
                    cicloId: cicloOfertaProduto.cicloId
                })
            }
                        
        }

        pedidosPorFornecedor.sort((a,b) => (a.fornecedor > b.fornecedor) ? 1 : ((b.fornecedor > a.fornecedor) ? -1 : 0))

        if (selBotao == 'download') {

            //let pedidosfornecedores = pedidosPorFornecedor

            let dadosPedidosFornecedores = []

            for (let index = 0; index < pedidosPorFornecedor.length; index++) {
                const pedido = pedidosPorFornecedor[index];

                quantCRAS = 0
                quantVILA = 0
                quantGRUPO = 0
                quantEXTRA = 0
                quantTOTAL = 0
                valorTOTAL = 0
                pedidoscestas = pedido.pedidosCestas
                for (let index = 0; index < pedidoscestas.length; index++) {
                    const cesta = pedidoscestas[index];

                    if (cesta.cestaId == 2) {
                        quantCRAS += cesta.cestaQuantidade
                    } else {
                        if (cesta.cestaId == 4) {
                            quantVILA += cesta.cestaQuantidade
                        } else {
                            if ((cesta.cestaId == 3) || (cesta.cestaId == 7)){
                                quantGRUPO += cesta.cestaQuantidade
                            } else {
                                if (cesta.cestaId == 5) {
                                    quantEXTRA += cesta.cestaQuantidade
                                }
                            }
                        }
                    }
                }

                quantTOTAL = quantCRAS + quantVILA + quantGRUPO + quantEXTRA
                valorTotal = quantTOTAL * Number(pedido.valorReferencia)

                dadosPedidosFornecedores.push ({
                    fornecedor:pedido.fornecedor,
                    ciclo: pedido.cicloId,
                    produto: pedido.nome,
                    medida: pedido.medida,
                    valor: pedido.valorReferencia,
                    CRAS: quantCRAS,
                    VILA: quantVILA,
                    GRUPO: quantGRUPO,
                    EXTRA:quantEXTRA,
                    TOTAL: quantTOTAL,
                    ValorTotal: valorTotal
                    //id: cicloOfertaProduto.id,
                    //quantidadeOfertado: quantidadeOfertado,
                    //fornecedorId: cicloOfertaProduto.fornecedorId,
                    //pedidosCestas: pedidosCestas,

                })
                
            }

            const fs = require('fs');
            const pathDownloads = 'public/downloads/'
            const json2csv = require('json2csv').parse;
            const csvString = json2csv(dadosPedidosFornecedores,{ delimiter:";" });
            /*const csvString = json2csv(dadosPedidosFornecedores);*/
            fs.writeFileSync(pathDownloads + 'relatorioFornecedores.csv', csvString);
            res.download(pathDownloads + 'relatorioFornecedores.csv');
        } else {
            return res.render('pedidosFornecedoresCiclos',{ produtosPedidosFornecedoresDados: pedidosPorFornecedor, ciclo: ciclo})
        }
    },


    async showPedidosConsumidoresCiclos (req, res) {
        const cicloId = req.body.ciclos

        const dadosCiclo = await Ciclo.getCicloId(cicloId)
        ciclo = dadosCiclo.ciclo[0]

        //cicloCestas = dadosCiclo.cicloCestas

        ciclos = dadosCiclo.ciclo
    
        var inputValue = req.body.relatorio;

        if (req.query.usr) {
            usuarioId = req.query.usr
        } else {
            usuarioId = 2
        }

        if (req.query.view) {
            view = req.query.view
        } else {
            view = "all_t"
        }

        console.log('view',view)


        usuarios = await Usuario.get()

        

        const produtos = await Produto.get();

        // Busca produtosOfertaDados

        pedidosConsumidores = await PedidoConsumidores.getProdutosPedidosConsumidores(cicloId,usuarioId,view)
        
        pedidosConsumidores.sort((a,b) => (a.usuarioId > b.usuarioId) ? 1 : ((b.usuarioId > a.usuarioId) ? -1 : 0))

        produtosPedidosConsumidorDados = []
        let usuarioCorrente = 0
        if ((pedidosConsumidores[0].usuarioId) > 0) {
            usuarioCorrente =  pedidosConsumidores[0].usuarioId
        }
        for (let index = 0; index < pedidosConsumidores.length; index++) {
            const pedidoConsumidor = pedidosConsumidores[index]
            
            produtoDados = produtos.find(produto => Number(produto.id) === Number(pedidoConsumidor.produtoId))
            usuarioDados = usuarios.find(usuario => Number(usuario.id) === Number(pedidoConsumidor.usuarioId))
            cicloDados = ciclos.find(cicl => Number(cicl.id) === Number(pedidoConsumidor.cicloId))
            

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
                    valorAcumuladoPedido: 0,
                    cicloId: cicloDados.nome,
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
                
        if (inputValue == 'produto') {
            produtosPedidosConsumidorDados.sort((a,b) => (a.nome > b.nome) ? 1 : ((b.nome > a.nome) ? -1 : 0))
        }
        else
        {
            produtosPedidosConsumidorDados.sort((a,b) => (a.consumidor > b.consumidor) ? 1 : ((b.consumidor > a.consumidor) ? -1 : 0))
        }
        // FIM Busca produtosOfertaDados

        // USUARIO V20210720
        usuarioAtivo = []
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

                

                if (inputValue == 'produto') {
                    return res.render('pedidosConsumidoresCiclosProdutos',{ usuarioAtivo: usuarioAtivo[0], produtosPedidosConsumidorDados: produtosPedidosConsumidorDados, ciclo: ciclo, view:view})
                }
                else {
                    if (inputValue == 'consumidor_csv') {

                        
                        let dadosPedidosConsumidores = []
            
                        for (let index = 0; index < produtosPedidosConsumidorDados.length; index++) {
                            const pedido = produtosPedidosConsumidorDados[index];
            
                            
                            dadosPedidosConsumidores.push ({
                                consumidor: pedido.consumidor,
                                ciclo: pedido.cicloId,
                                produto: pedido.nome,
                                medida: pedido.medida,
                                valor: pedido.valorReferencia,
                                quantidade: pedido.quantidade,
                                total: (Number(pedido.valorReferencia) * Number(pedido.quantidade))
                            })
                            
                        }
            
                        const fs = require('fs');
                        const pathDownloads = 'public/downloads/'
                        const json2csv = require('json2csv').parse;
                        const csvString = json2csv(dadosPedidosConsumidores,{ delimiter:";" });
                        /*const csvString = json2csv(dadosPedidosFornecedores);*/
                        fs.writeFileSync(pathDownloads + 'relatorioConsumidores.csv', csvString);
                        res.download(pathDownloads + 'relatorioConsumidores.csv');
                    } else {
                        return res.render('pedidosConsumidoresCiclos',{ usuarioAtivo: usuarioAtivo[0], produtosPedidosConsumidorDados: produtosPedidosConsumidorDados, ciclo: ciclo, view:view})
                    }
                }
    
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
            usuarioAtivo.push({
                email: "jsfarinaci@gmail.com",
                picture: "https://lh3.googleusercontent.com/a-/AOh14GgJtCHmUVeMyPR3OiAHnnsp4NCI3bupns-WFHIekQ=s96-c",
                name: "Juliana Farinaci",
                email_verified: "false",
                id: 2,
                perfil: ['admin','consumidor']
            })

            if (inputValue == 'produto') {
                return res.render('pedidosConsumidoresCiclosProdutos',{ usuarioAtivo: usuarioAtivo[0], produtosPedidosConsumidorDados: produtosPedidosConsumidorDados, ciclo: ciclo, view:view})
            }
            else {
                return res.render('pedidosConsumidoresCiclos',{ usuarioAtivo: usuarioAtivo[0], produtosPedidosConsumidorDados: produtosPedidosConsumidorDados, ciclo: ciclo, view:view})
            }

        }
        // USUARIO FIM


        //return res.render('pedidosConsumidoresTodos',{ produtosPedidosConsumidorDados: produtosPedidosConsumidorDados, ciclo: ciclo})
    },




}

    
