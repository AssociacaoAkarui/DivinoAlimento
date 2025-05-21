const Cesta = require('../model/Cesta')
const Profile = require('../model/Profile')

module.exports = {
    async index(req, res) {
        const cestas = await Cesta.getCestasAtivas();
        const profile = Profile.get();        

        let statusCount = {
            progress: 0,
            done: 0,
            total: cestas.length
        }

        /*const updatedCestas = cestas.map((cesta) => {
            
            const status = cesta.status;

            // somando a quantidade de status
            statusCount[status] += 1;

            return {
                ...cesta,
                status
            }
        })*/

        return res.render("cesta-index", { cestas: cestas, profile: profile, statusCount: statusCount})

    }
}
