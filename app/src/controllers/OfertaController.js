const Oferta = require('../model/Oferta')
const Ciclo = require('../model/Ciclo')
const Usuario = require('../model/Usuario')
const Produto = require('../model/Produto')

//let usuarioId

let loadAposSalvar = 0

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


        if (req.query.usr) {
            usuarioId = req.query.usr
        } else {
            usuarioId = usuarioAtivo[0].id
        }


       
        oferta = await Oferta.findOrCreate({
                        cicloId: cicloId,
                        usuarioId: usuarioId
                })
        
        if (oferta == 'error') {
            return res.send('Ciclo/Oferta não existem!')
        }

        const dadosCiclo = await Ciclo.getCicloId(cicloId)
        ciclo = dadosCiclo.ciclo[0]

        
        produtosOferta = await Oferta.getProdutosPorOferta({
                                ofertaId: oferta.id
                        })
        
        const produtos = await Produto.get();

        //const produtosAtivos = await Produto.getProdutosAtivos();

        
        const produtosAtivos = await Oferta.getProdutosMaisOfertadosPorFornecedor(usuarioId); 
        

        let produtosOfertaDados = []

        produtosOferta.forEach(produtoOferta => {
            produtoDados = produtos.find(produto => Number(produto.id) === Number(produtoOferta.produtoId))

            produtosOfertaDados.push ({
                id: produtoOferta.id,
                produtoId: produtoOferta.produtoId,
                nome: produtoDados.nome,
                medida: produtoDados.medida,
                quantidade: produtoOferta.quantidade,
                valorReferencia: produtoDados.valorReferencia
            })
        });

        let produtosAtivosOfertados = [];

        produtosAtivos.forEach(produto => {
                produtoOfertado = produtosOfertaDados.find(produtooferta => Number(produtooferta.produtoId) === Number(produto.id))

                if (produtoOfertado) {
                    produtosAtivosOfertados.push ({
                        id: produto.id,
                        nome: produto.nome,
                        medida: produto.medida,
                        quantidade: produtoOfertado.quantidade,
                        valorReferencia: produto.valorReferencia
                    })
                } else {
                    produtosAtivosOfertados.push ({
                        id: produto.id,
                        nome: produto.nome,
                        medida: produto.medida,
                        quantidade: 0,
                        valorReferencia: produto.valorReferencia,
                        origemProduto: produto.origemProduto
                    })
                }
            

        });
        
        let usuarios = []
        try {
            // to-do: trazer apensas usuários que podem ser geridos por usuário corrente
            usuarios = await Usuario.getUsuariosAtivos()
        } catch (error) {
            //console.log('OfertaController error - falha Usuario.get')
        }

        const usuarioOferta = usuarios.find(usuario => Number(usuario.id) === Number(usuarioId)) 
        
        produtosOfertaDados.sort((a,b) => (a.nome > b.nome) ? 1 : ((b.nome > a.nome) ? -1 : 0))

        let auxloadAposSalvar = loadAposSalvar
        loadAposSalvar = 0
        
        if (loginStatus == 'usuarioAtivo') {
            if ((usuarioAtivo[0].perfil.indexOf('admin') >= 0 ) || (usuarioAtivo[0].perfil.indexOf('fornecedor') >= 0 ) ) {
                return res.render('oferta',{ loadAposSalvar: auxloadAposSalvar, produtosOfertaDados: produtosOfertaDados, ciclo: ciclo, produtos: produtosAtivosOfertados, usuarios: usuarios, usuarioOferta: usuarioOferta, usuarioAtivo: usuarioAtivo[0], oferta: oferta })
            }
            else {
                return res.redirect('/')
            }
        }
    },

    async savePartial(req, res) {

        const produtos = await Produto.get();

        ofertaId = req.body.ofertaId
        cicloId = req.body.cicloId
        usuarioOfertaId = req.body.usuarioOfertaId

        for (let index = 0; index < produtos.length; index++) {
            const produto = produtos[index];

            //nomeCheck = 'ofertaProdSel'+ produto.id.toString();

            nomeInputQuant = 'ofertaProdSelQuant'+ produto.id.toString();

            //ofertaProdSel = req.body[nomeCheck]

            if (req.body[nomeInputQuant]) {
                ofertaProdSelQuant = req.body[nomeInputQuant]
            } else {
                ofertaProdSelQuant = 0
            } 
            
            console.log("retorno modal produto:", produto.id)
            
            console.log("retorno modal:", ofertaProdSelQuant)

            /*if (ofertaProdSelQuant > 0) {
                await Oferta.findOrCreateProduto({
                    ofertaId: ofertaId,
                    produtoId: produto.id,
                    quantidade: ofertaProdSelQuant
                })*/
                
            //if (ofertaProdSel == 'selecionado') {
                //await Oferta.findOrCreateProduto({
                    //ofertaId: ofertaId,
                    //produtoId: produto.id,
                    //quantidade: ofertaProdSelQuant
                //})
            /*} */   
        }

        /*produtosOferta = await Oferta.getProdutosPorOferta({
            ofertaId: ofertaId
        })*/

        
        /*let nomeInput = ''*/


        /*for (let index = 0; index < produtosOferta.length; index++) {
            const produtoOferta = produtosOferta[index];

            produtoDados = produtos.find(produto => Number(produto.id) === Number(produtoOferta.produtoId))

            nomeInput = 'quant'+ produtoOferta.id.toString()        

            if (req.body[nomeInput]) {
                await Oferta.updateOfertaProduto ({
                    ofertaId: produtoOferta.id,
                    quantidade: req.body[nomeInput]
                })
            }
        }*/

        // TO-do: tem que passar o ciclo e usuário
        return res.redirect('/oferta/' + cicloId + '?usr=' + usuarioOfertaId)
    },

    async save(req, res) {

        const produtos = await Produto.getProdutosAtivos();

        ofertaId = req.body.ofertaId
        cicloId = req.body.cicloId
        usuarioOfertaId = req.body.usuarioOfertaId


        //produtosOferta = await Oferta.getProdutosPorOferta({
            //ofertaId: ofertaId
        //})

        let nomeInput = ''

        for (let index = 0; index < produtos.length; index++) {
            const produto = produtos[index];

            //produtoDados = produtos.find(produto => Number(produto.id) === Number(produtoOferta.produtoId))

            nomeInput = 'quantidade'+ produto.id.toString()        

            let valueInput = 0

            if (req.body[nomeInput]) {
              valueInput = req.body[nomeInput]
            }

            if (valueInput > 0) {

                ofertaProdutoId = await Oferta.findOrCreateOfertaProduto({
                    ofertaId: ofertaId,
                    produtoId: produto.id
                })

                await Oferta.updateOfertaProduto ({
                    ofertaId: ofertaProdutoId,
                    quantidade: valueInput
                })
            }
        }

        //await Oferta.deleteOfertasZero ({
            //ofertaId: ofertaId
        //})

        loadAposSalvar = 1

        // TO-do: tem que passar o ciclo e usuário
        return res.redirect('/oferta/' + cicloId + '?usr=' + usuarioOfertaId)
    },

    async apagarProduto(req, res) {

        var selOfertaProduto = req.body.ofertaproduto;
        
        cicloId = req.body.cicloId
        usuarioOfertaId = req.body.usuarioOfertaId

        await Oferta.updateOfertaProduto ({
            ofertaId: selOfertaProduto,
            quantidade: 0
        })

        return res.redirect('/oferta/' + cicloId + '?usr=' + usuarioOfertaId)
    },

    
    /*delete(req, res) {
        const ofertaId = req.params.id

        Oferta.delete(ofertaId)

        return res.redirect('/oferta-index')
    }*/
}