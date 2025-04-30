const Movimentacao = require('../model/Movimentacao')
const Usuario = require('../model/Usuario')

module.exports = {
    async showCreateEdit(req, res) {

        const usuarioId = req.params.id

        const dataMovimentacao = req.query.dt

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
            usuarioAtivo.push({
                email: "jsfarinaci@gmail.com",
                picture: "https://lh3.googleusercontent.com/a-/AOh14GgJtCHmUVeMyPR3OiAHnnsp4NCI3bupns-WFHIekQ=s96-c",
                name: "Juliana Farinaci",
                email_verified: "true",
                id: 2,
                perfil: ['admin','consumidor']       
            })

            loginStatus = 'usuarioAtivo'

        }
        // USUARIO FIM


        /*if (req.query.usr) {
            usuarioId = req.query.usr
        } else {
            usuarioId = usuarioAtivo[0].id
        }*/
        
        // to-do alterar para usuário corrente quando módulo de usuários estiver ativo
        //let usuarioId = 2 //enquanto login nao ok

        //if (req.query.usr) {
            //usuarioId = req.query.usr
        //}

        let usuarios = []
        try {
            // to-do: trazer apensas usuários que podem ser geridos por usuário corrente
            usuarios = await Usuario.get()
        } catch (error) {
            //console.log('OfertaController error - falha Usuario.get')
        }

        usuarios.sort((a,b) => (a.nome.toLowerCase() > b.nome.toLowerCase()) ? 1 : ((b.nome.toLowerCase() > a.nome.toLowerCase()) ? -1 : 0))
        
        const movimentacao = await Movimentacao.findOrCreateMovimentacao({
            usuarioId: usuarioId,
            data: dataMovimentacao
        })

        const usuarioMovimentacao = usuarios.find(usuario => Number(usuario.id) === Number(movimentacao.usuarioId)) 
        
        return res.render("movimentacao", {movimentacao: movimentacao, usuarioMovimentacao: usuarioMovimentacao, usuarioAtivo: usuarioAtivo[0], usuarios: usuarios})
    },

    async save(req, res) {
        await Movimentacao.create({
            usuarioId: req.body.usuarioId,
            tipoMovimentacao: req.body.tipoMovimentacaoId,
            data: req.body.data,
            valor: req.body.valor,
            status: req.body.status,
            observacao: req.body.observacao,
            linkArquivo: req.body.linkArquivo
        })
    
        return res.redirect('/movimentacao-index')
    },

    

    async update(req, res) {

        const movimentacaoId = req.params.id

        const movimentacoes = await Movimentacao.get();

        const movimentacao = movimentacoes.find(movimentacao => Number(movimentacao.id) === Number(movimentacaoId))

        if (!movimentacao) {
            return res.send('Movimentação não existe!')
        }

        const updatedMovimentacao = {
            id: movimentacaoId,
            tipoMovimentacao: req.body.tipoMovimentacaoId,
            data: req.body.data,
            valor: req.body.valor,
            status: req.body.status,
            observacao: req.body.observacao,
            linkArquivo: req.body.linkArquivo, 
        }

        await Movimentacao.update(updatedMovimentacao)

        res.redirect('/movimentacao/' + movimentacaoId)
    },

    delete(req, res) {
        const movimentacaoId = req.params.id

        Movimentacao.delete(movimentacaoId)

        return res.redirect('/movimentacao-index')
    },

    async showTodasMovimentacoes(req, res) {

        movimentacaoDados = await Movimentacao.getMovimentacoesAtivas()
        
        	
        return res.render("movimentacaoTodos", {movimentacaoDados: movimentacaoDados})
    

    },

}