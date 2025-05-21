const db = require('../../models/index.js');

module.exports = {

    async getCategoriaProdutos() {

        let categoriasProdutos = []    
                
        categoriasProdutos = await db.CategoriaProdutos.findAll({
            raw: true,
        })
  
        return categoriasProdutos

    },

    async insertNewCategoria (newCategoria) {
        await db.CategoriaProdutos.create({
            nome: newCategoria.nome,
            status: newCategoria.status
            });
    },
    
    async updateCategoria (categoria) {
        await db.CategoriaProdutos.update({
            nome: categoria.nome,
            status: categoria.status
            }, {
            where: {
                id: categoria.id
            } 
            });
    },
    
        async deleteCategoria (categoriaId) {

            // TODO: checar antes de apagar se categoria está sendo utilizada

            await db.CategoriaProdutos.destroy({
                where: {
                    id: categoriaId
                }
              });
        }

}