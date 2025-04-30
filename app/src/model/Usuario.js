const usuarioSql = require('../db/usuarioSql')

module.exports ={
    async get(){
        data = await usuarioSql.getUsuarios()
        return data
    },
    async getUsuariosAtivos(){
        data = await usuarioSql.getUsuariosAtivos()
        return data
    },
    async update(usuario) {
        await usuarioSql.updateUsuario(usuario)
    },
    async delete(id) {
        await usuarioSql.deleteUsuario(id)
    },
    async create(newUsuario) {
        await usuarioSql.insertNewUsuario(newUsuario)
    },
    async retornaUsuarioCadastrado(emailGoogle) {
        data = await usuarioSql.retornaUsuarioCadastrado(emailGoogle)
        return data
    }
}