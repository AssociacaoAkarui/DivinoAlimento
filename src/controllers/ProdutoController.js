const CategoriaProdutos = require('../model/CategoriaProdutos')
const Produto = require('../model/Produto')
const Profile = require('../model/Profile')

module.exports = {
    async create(req, res) {

        const categoriasProdutos = await CategoriaProdutos.get()

        return res.render("produto", { categoriasProdutos: categoriasProdutos})

    },

    async save(req, res) {

        await Produto.create({
            nome: req.body.nome,   
            medida: req.body.medida,
            pesoGrama: req.body.pesoGrama,
            valorReferencia: req.body.valorReferencia,
            status: req.body.status,
            categoriaId: req.body.categoriaId,
            descritivo: req.body.descritivo
        })
    
        return res.redirect('/produto-index')
    },

    async show(req, res) {

        const produtoId = req.params.id
        const produtos = await Produto.get()
        const categoriasProdutos = await CategoriaProdutos.get()
        const profile  = Profile.get()

        const produto = produtos.find(produto => Number(produto.id) === Number(produtoId))

        if (!produto) {
            return res.send('Produto não existe!')
        }

        return res.render("produto-edit", { produto: produto, categoriasProdutos: categoriasProdutos })
        
    },

    async update(req, res) {

        const produtoId = req.params.id

        const produtos = await Produto.get();

        const produto = produtos.find(produto => Number(produto.id) === Number(produtoId))

        if (!produto) {
            return res.send('Produto não existe!')
        }

        const updatedProduto = {
            //...produto,
            id: produtoId,
            nome: req.body.nome,
            medida: req.body.medida,
            pesoGrama: req.body.pesoGrama,
            valorReferencia: req.body.valorReferencia,
            status: req.body.status,
            categoriaId: req.body.categoriaId,
            descritivo: req.body.descritivo  
        }

        /*const newProduto = produtos.map(produto =>  {
            if(Number(produto.id) === Number(produtoId)) {
                produto = updatedProduto
            }

            return produto
        })*/

        await Produto.update(updatedProduto)

        //res.redirect('/produto/' + produtoId)

        return res.redirect('/produto-index/#' + produtoId)
    },

    delete(req, res) {
        const produtoId = req.params.id

        Produto.delete(produtoId)

        return res.redirect('/produto-index')
    }
}