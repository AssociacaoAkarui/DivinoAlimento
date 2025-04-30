const pontoEntregaSql = require('../db/pontoEntregaSql')

module.exports ={
    async get(){
        data = await pontoEntregaSql.getPontosEntrega()
        return data
    },
    async update(pontoEntrega) {
        await pontoEntregaSql.updatePontoEntrega(pontoEntrega)
    },
    async delete(id) {
        await pontoEntregaSql.deletePontoEntrega(id)
    },
    async create(newPontoEntrega) {
        await pontoEntregaSql.insertNewPontoEntrega(newPontoEntrega)
    }
}