const db = require('../../models/index.js');

module.exports = {

    async getUsuarios() {

        let usuarios = []    
                
        usuarios = await db.Usuario.findAll({
            raw: true,
            order: ['nome']
        })
                
        return usuarios

    },
    

    async getUsuariosAtivos() {

        let usuarios = []    
                
        usuarios = await db.Usuario.findAll({
            raw: true,
            order: ['nome'],
            where: {
                status: 'ativo'
            }
        })
                
        return usuarios

    },

    async insertNewUsuario (newUsuario) {

        if (Array.isArray(newUsuario.perfil)) {
            await db.Usuario.create({
                nome: newUsuario.nome,
                perfil: newUsuario.perfil,
                email: newUsuario.email,
                status: newUsuario.status
              })
        } else {
            perfilArray = []
            perfilArray.push(newUsuario.perfil)

            await db.Usuario.create({
                nome: newUsuario.nome,
                perfil: perfilArray,
                email: newUsuario.email,
                status: newUsuario.status
              });
        }

        
    },

    async updateUsuario (usuario) {

        if (Array.isArray(usuario.perfil)) {
            await db.Usuario.update({
                nome: usuario.nome,
                nomeoficial: usuario.nomeoficial,
                celular: usuario.celular,
                descritivo: usuario.descritivo,
                email: usuario.email,
                cientepolitica: usuario.cientepolitica,
                perfil: usuario.perfil,
                status: usuario.status
              }, {
                where: {
                    id: usuario.id
                } 
              })
        } else {
            perfilArray = []
            perfilArray.push(usuario.perfil)

            await db.Usuario.update({
                nome: usuario.nome,
                nomeoficial: usuario.nomeoficial,
                celular: usuario.celular,
                descritivo: usuario.descritivo,
                email: usuario.email,
                cientepolitica: usuario.cientepolitica,
                perfil: perfilArray,
                status: usuario.status
              }, {
                where: {
                    id: usuario.id
                } 
              });
            }
    },

    async deleteUsuario (usuarioId) {
        await db.Usuario.destroy({
            where: {
                id: usuarioId
            }
          });
    },

    async retornaUsuarioCadastrado(emailGoogle) {

        if (emailGoogle) {
            usuario = await db.Usuario.findAll({
                raw: true,
                where: {
                    email: emailGoogle
                },
            })

            if (usuario[0]) {
            usuario = usuario[0]
            }
            else {
            usuario = 0
            }

            return usuario
        }
        else
        {
            usuario = []
            return usuario
        }

    }
    

}


