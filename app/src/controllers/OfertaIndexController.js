const Oferta = require('../model/Oferta')
const Profile = require('../model/Profile')

module.exports = {
    async index(req, res) {
        const ofertas = await Oferta.get();
        const profile = Profile.get();

        let statusCount = {
            progress: 0,
            done: 0,
            total: ofertas.length
        }

        /*const updatedOfertas = ofertas.map((oferta) => {
            
            const status = oferta.status;

            // somando a quantidade de status
            statusCount[status] += 1;

            return {
                ...oferta,
                status
            }
        })*/

        return res.render("oferta-index", { ofertas: ofertas, profile: profile, statusCount: statusCount})

    }
}
