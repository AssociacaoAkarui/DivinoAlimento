const Usuario = require('../model/Usuario')

module.exports = {
    async create(req, res) {
        return res.render("usuario")
    },

    async save(req, res) {
        await Usuario.create({
            nome: req.body.nome,
            nomeoficial: req.body.nomeoficial,
            celular: req.body.celular,
            descritivo: req.body.descritivo,
            email: req.body.email,
            cientepolitica: req.body.cientepolitica,
            perfil: req.body.perfil,
            status: req.body.status
        })
    
        return res.redirect('/usuario-index')
    },

    async show(req, res) {

        const usuarioId = req.params.id

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
                return res.redirect('/login')
            }
        }
        else {
            return res.redirect('/login')
        }
        // USUARIO FIM


        const usuarios = await Usuario.get();

        const usuario = usuarios.find(usuario => Number(usuario.id) === Number(usuarioId))

        if (!usuario) {
            return res.send('Usuário não existe!')
        }

        return res.render("usuario-edit", { usuarioAtivo: usuarioAtivo[0], usuario: usuario })
    },

    async update(req, res) {

        const usuarioId = req.params.id

        const usuarios = await Usuario.get();

        const usuario = usuarios.find(usuario => Number(usuario.id) === Number(usuarioId))

        if (!usuario) {
            return res.send('Usuário não existe!')
        }

        const updatedUsuario = {
            //...usuario,
            id: usuarioId,
            nome: req.body.nome,
            nomeoficial: req.body.nomeoficial,
            celular: req.body.celular,
            descritivo: req.body.descritivo,
            email: req.body.email,
            cientepolitica: req.body.cientepolitica,
            perfil: req.body.perfil,
            status: req.body.status,
        }

        console.log("ATENCAO ATENCAO ATENCAO",req.body.nomeoficial)

        /*const newUsuario = usuarios.map(usuario =>  {
            if(Number(usuario.id) === Number(usuarioId)) {
                usuario = updatedUsuario
            }

            return usuario
        })*/

        await Usuario.update(updatedUsuario)

        res.redirect('/usuario/' + usuarioId)
    },

    delete(req, res) {
        const usuarioId = req.params.id

        Usuario.delete(usuarioId)

        return res.redirect('/usuario-index')
    },

    async createAutomatico(req, res) {
        return res.render("usuarionovo")
    },

    async saveAutomatico(req, res) {
        await Usuario.create({
            nome: req.body.nome,
            nomeoficial: req.body.nomeoficial,
            celular: req.body.celular,
            descritivo: req.body.descritivo,
            email: req.body.email,
            cientepolitica: req.body.cientepolitica,
            perfil: req.body.perfil,
            status: req.body.status,
        })
    
        return res.redirect('/')
    },

    async updateAutomatico(req, res) {

        const usuarioId = req.params.id

        const usuarios = await Usuario.get();

        const usuario = usuarios.find(usuario => Number(usuario.id) === Number(usuarioId))

        if (!usuario) {
            return res.send('Usuário não existe!')
        }

        const updatedUsuario = {
            //...usuario,
            id: usuarioId,
            nome: req.body.nome,
            nomeoficial: req.body.nomeoficial,
            celular: req.body.celular,
            descritivo: req.body.descritivo,
            email: req.body.email,
            cientepolitica: req.body.cientepolitica,
            perfil: req.body.perfil,
            status: req.body.status,
        }

        /*const newUsuario = usuarios.map(usuario =>  {
            if(Number(usuario.id) === Number(usuarioId)) {
                usuario = updatedUsuario
            }

            return usuario
        })*/

        await Usuario.update(updatedUsuario)

        res.redirect('/usuarionovo/' + usuarioId)
    },


}