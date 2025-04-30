const cestaSql = require('../db/cestaSql')

module.exports ={
    async get(){
        data = await cestaSql.getCestas()
        return data
    },
    async getCestasAtivas(){
        data = await cestaSql.getCestasAtivas()
        return data
    },
    async verificaCriaCestasInternas() {
        await cestaSql.verificaCriaCestasInternas()
    }, 
    async update(cesta) {
        await cestaSql.updateCesta(cesta)
    },
    async delete(id) {
        await cestaSql.deleteCesta(id)
    },
    async create(newCesta) {
        //data.push(newCesta)
        await cestaSql.insertNewCesta(newCesta)
    }
}