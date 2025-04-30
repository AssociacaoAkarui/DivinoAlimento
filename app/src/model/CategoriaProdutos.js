const categoriaProdutosSql = require('../db/categoriaProdutosSql')

module.exports ={
    async get(){
        data = await categoriaProdutosSql.getCategoriaProdutos()
        return data
    },
    async update(categoria) {
            await categoriaProdutosSql.updateCategoria(categoria)
    },
    async delete(id) {
        await categoriaProdutosSql.deleteCategoria(id)
    },
    async create(newCategoria) {
        //data.push(newCesta)
        await categoriaProdutosSql.insertNewCategoria(newCategoria)
    }
}