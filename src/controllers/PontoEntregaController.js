const PontoEntrega = require('../model/PontoEntrega')
const Profile = require('../model/Profile')

module.exports = {
    create(req, res) {
        return res.render("pontoentrega")
    },

    async save(req, res) {
        
        await PontoEntrega.create({
            nome: req.body.nome,
            endereco: req.body.endereco,
            status: req.body.status
        })
    
        return res.redirect('/pontoentrega-index')
    },

    async show(req, res) {
        
        const pontoEntregaId = req.params.id
        const pontosEntrega = await PontoEntrega.get();
        const profile  = Profile.get()

        const pontoEntrega = pontosEntrega.find(pontoEntrega => Number(pontoEntrega.id) === Number(pontoEntregaId))

        if (!pontoEntrega) {
            return res.send('Ponto de Entrega não existe!')
        }

        return res.render("pontoentrega-edit", { pontoEntrega })
    },

    async update(req, res) {

        const pontoEntregaId = req.params.id

        const pontosEntrega = await PontoEntrega.get();

        const pontoEntrega = pontosEntrega.find(pontoEntrega => Number(pontoEntrega.id) === Number(pontoEntregaId))

        if (!pontoEntrega) {
            return res.send('Ponto de Entrega não existe!')
        }

        const updatedPontoEntrega = {
            //...pontoEntrega,
            id: pontoEntregaId,
            nome: req.body.nome,
            endereco: req.body.endereco,
            status: req.body.status,  
        }

        /*const newPontoEntrega = pontosEntrega.map(pontoEntrega =>  {
            if(Number(pontoEntrega.id) === Number(pontoEntregaId)) {
                pontoEntrega = updatedPontoEntrega
            }

            return pontoEntrega
        })*/

        await PontoEntrega.update(updatedPontoEntrega)

        res.redirect('/pontoentrega/' + pontoEntregaId)
    },

    delete(req, res) {
        const pontoEntregaId = req.params.id

        PontoEntrega.delete(pontoEntregaId)

        return res.redirect('/pontoentrega-index')
    }
}