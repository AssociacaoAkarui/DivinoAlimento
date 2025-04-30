const PontoEntrega = require('../model/PontoEntrega')
const Profile = require('../model/Profile')

module.exports = {
    async index(req, res) {
        const pontosEntrega = await PontoEntrega.get();
        const profile = Profile.get();

        let statusCount = {
            progress: 0,
            done: 0,
            total: pontosEntrega.length
        }

        /*const updatedPontosEntrega = pontosEntrega.map((pontoEntrega) => {
            
            const status = pontoEntrega.status;

            // somando a quantidade de status
            statusCount[status] += 1;

            return {
                ...pontoEntrega,
                status
            }
        })*/

        return res.render("pontoentrega-index", { pontosEntrega: pontosEntrega, profile: profile, statusCount: statusCount})

    }
}
