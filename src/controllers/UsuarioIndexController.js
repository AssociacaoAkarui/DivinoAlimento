const Usuario = require('../model/Usuario')

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

        const view = req.query.view

        let usuarios = []

        if (view == 'all') {
            usuarios = await Usuario.get();
        } else {
            usuarios = await Usuario.getUsuariosAtivos()
        }

        return res.render("usuario-index", { usuarioAtivo: usuarioAtivo[0],usuarios: usuarios, view: view})

    }
}
