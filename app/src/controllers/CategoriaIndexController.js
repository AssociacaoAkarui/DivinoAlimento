const Categoria = require('../model/CategoriaProdutos')
const Usuario = require('../model/Usuario')

module.exports = {
    async index(req, res) {
        const categorias = await Categoria.get();

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


        return res.render("categoria-index", { categorias: categorias, usuarioAtivo: usuarioAtivo[0] })

    }
}
