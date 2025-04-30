const Categoria = require('../model/CategoriaProdutos')
const Usuario = require('../model/Usuario')

module.exports = {
    create(req, res) {
        return res.render("categoria")
    },

    async save(req, res) {

        
        await Categoria.create({
            nome: req.body.nome,
            status: req.body.status
        })

        
    
        return res.redirect('/categoria-index')
    },

    async show(req, res) {
        
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


        const categoriaId = req.params.id
        const categorias = await Categoria.get();

        const categoria = categorias.find(categoria => Number(categoria.id) === Number(categoriaId))

        if (!categoria) {
            return res.send('Categoria não existe!')
        }

        return res.render("categoria-edit", { categoria, usuarioAtivo: usuarioAtivo[0]  })
    },

    async update(req, res) {

        const categoriaId = req.params.id

        const categorias = await Categoria.get();

        const categoria = categorias.find(categoria => Number(categoria.id) === Number(categoriaId))

        if (!categoria) {
            return res.send('Categoria não existe!')
        }

        const updatedCategoria = {
            //...categoria,
            id: categoriaId,
            nome: req.body.nome,
            status: req.body.status,  
        }

        await Categoria.update(updatedCategoria)

        res.redirect('/categoria/' + categoriaId)
    },

    delete(req, res) {
        const categoriaId = req.params.id

        Categoria.delete(categoriaId)

        return res.redirect('/categoria-index')
    }
}