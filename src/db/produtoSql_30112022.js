const db = require('../../models/index.js');
//const Produto = require('../model/Produto.js');

module.exports = {

    async getProdutos() {

        let produto = []    
                
        produtos = await db.Produto.findAll({
            raw: true,
            order: ['nome']
        })

        let listaProdutos = []   

        for (let index = 0; index < produtos.length; index++) {
            const produto = produtos[index];

            let categoriaNome = ''

            if (produto.categoriaId) {
                categoria = await db.CategoriaProdutos.findAll({
                    raw: true,
                    where: {
                        id: produto.categoriaId
                    }
                })
                categoriaNome = categoria[0].nome
            }

            listaProdutos.push({
                ...produto,
                categoriaNome: categoriaNome
            })
        }
        
                
        return listaProdutos

    },

    async getProdutosAtivos() {

        let produto = []    
                
        produtos = await db.Produto.findAll({
            raw: true,
            where: {
                status: 'ativo'
            },
            order: ['nome']
        })

        let listaProdutos = []   

        for (let index = 0; index < produtos.length; index++) {
            const produto = produtos[index];

            let categoriaNome = ''

            if (produto.categoriaId) {
                categoria = await db.CategoriaProdutos.findAll({
                    raw: true,
                    where: {
                        id: produto.categoriaId
                    }
                })
                categoriaNome = categoria[0].nome
            }

            listaProdutos.push({
                ...produto,
                categoriaNome: categoriaNome
            })
        }
        
                
        return listaProdutos

    },

    async getProdutosAtivosPorCategoria() {

        let listaProdutos = []    
                
        produtos = await db.Produto.findAll({
            raw: true,
            where: {
                status: 'ativo'
            },
            order: ['categoriaId','nome']
        })

        for (let index = 0; index < produtos.length; index++) {
            const produto = produtos[index];

            let categoriaNome = ''
            let usuarioNome = ''

            if (produto.categoriaId) {
                categoria = await db.CategoriaProdutos.findAll({
                    raw: true,
                    where: {
                        id: produto.categoriaId
                    }
                })
                categoriaNome = categoria[0].nome
            } 

            if (produto.usuarioId) {
                usuario = await db.Usuario.findAll({
                    raw: true,
                    where: {
                        id: produto.usuarioId
                    }
                })
                usuarioNome = usuario[0].nome
            }

            listaProdutos.push({
                ...produto,
                categoriaNome: categoriaNome,
                usuarioNome: usuarioNome
            })

            
            
        }
                
        return listaProdutos

    },

    async insertNewProduto (newProduto) {
        await db.Produto.create({
            nome: newProduto.nome,
            medida: newProduto.medida,
            pesoGrama: newProduto.pesoGrama,
            valorReferencia: newProduto.valorReferencia,
            status: newProduto.status,
            categoriaId: newProduto.categoriaId,
            descritivo: newProduto.descritivo
          });
    },

    async updateProduto (produto) {
        await db.Produto.update({
            nome: produto.nome,
            medida: produto.medida,
            pesoGrama: produto.pesoGrama,
            valorReferencia: produto.valorReferencia,
            status: produto.status,
            categoriaId: produto.categoriaId,
            descritivo: produto.descritivo
          }, {
            where: {
                id: produto.id
            } 
          });
    },

    async deleteProduto (produtoId) {
        await db.Produto.destroy({
            where: {
                id: produtoId
            }
          });
    }
    

}


