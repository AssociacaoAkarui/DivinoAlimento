const Cesta = require('../model/Cesta')
const Profile = require('../model/Profile')

module.exports = {
    create(req, res) {

        // inserir verificacao da existência das cestas 1 e 5 e caso não exista criar estas linhas no banco

        Cesta.verificaCriaCestasInternas();

        return res.render("cesta")
    },

    async save(req, res) {
        
        await Cesta.create({
            nome: req.body.nome,
            valormaximo: req.body.valormaximo,
            status: req.body.status
        })
    
        return res.redirect('/cesta-index')
    },

    async show(req, res) {

        const cestaId = req.params.id
        const cestas = await Cesta.get();
        const profile  = Profile.get()

        const cesta = cestas.find(cesta => Number(cesta.id) === Number(cestaId))

        if (!cesta) {
            return res.send('Cesta não existe!')
        }

        return res.render("cesta-edit", { cesta })
    },

    async update(req, res) {

        const cestaId = req.params.id

        const cestas = await Cesta.get();

        const cesta = cestas.find(cesta => Number(cesta.id) === Number(cestaId))

        if (!cesta) {
            return res.send('Cesta não existe!')
        }

        const updatedCesta = {
            //...cesta,
            id: cestaId,
            nome: req.body.nome,
            valormaximo: req.body.valormaximo,
            status: req.body.status,  
        }

        /*const newCesta = cestas.map(cesta =>  {
            if(Number(cesta.id) === Number(cestaId)) {
                cesta = updatedCesta
            }

            return cesta
        })*/

        await Cesta.update(updatedCesta)

        res.redirect('/cesta/' + cestaId)
    },

    delete(req, res) {
        const cestaId = req.params.id

        Cesta.delete(cestaId)

        return res.redirect('/cesta-index')
    }
}