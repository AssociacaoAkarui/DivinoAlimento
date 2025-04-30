const Usuario = require('../model/Usuario')
const Produto = require('../model/Produto')

module.exports = {
    async index(req, res) {

        // begin: verifica se usuario esta logado
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
        }
        // end: verifica se usuario esta logado

        // Segue se o usuário for ativo
         
        const view = req.query.view

        let produtos = []

        if (view == 'all') {
            produtos = await Produto.get();
        } else {
            produtos = await Produto.getProdutosAtivosComCategoria()
        }

        console.log("listaProdutos:",produtos)

        return res.render("produto-index", {usuarioAtivo: usuarioAtivo[0],produtos: produtos, view: view})

    }
}
