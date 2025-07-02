const cicloSql = require('../db/cicloSql')

module.exports ={
    async getCiclosMin() {
        data = await cicloSql.getCiclosMin()
        return data
    },
    async getCiclosMin_v2(dados) {
        data = await cicloSql.getCiclosMin_v2(dados)
        return data
    },
    async get(){
        data = await cicloSql.getCiclos()
        return {ciclos: data.ciclos, cicloCestas: data.cicloCestas, cicloEntregas: data.cicloEntregas, cicloProdutos: data.cicloProdutos }
    },
    async getCicloId(cicloId){
        data = await cicloSql.getCicloPorId(cicloId)
        return data
        //return {ciclo: data.ciclo, cicloCestas: data.cicloCestas, cicloEntregas: data.cicloEntregas, cicloComposicoes: data.cicloComposicoes }
    },
    async getCicloIdMin(cicloId){
        data = await cicloSql.getCicloPorIdMin(cicloId)
        return data
        //return {ciclo: data.ciclo, cicloCestas: data.cicloCestas}
        // não retorna cicloCestas 1 e 5, de uso interno do sistema
    },
    async update(ciclo) {
        await cicloSql.updateCiclo(ciclo)
    },
    async updateCicloStatus(ciclo) {
        await cicloSql.updateCicloStatus(ciclo)
    },
    async delete(id) {
        await cicloSql.deleteCiclo(id)
    },
    async create(newCiclo) {
        //data.push(newCiclo)
        await cicloSql.insertNewCiclo(newCiclo)
    }
}