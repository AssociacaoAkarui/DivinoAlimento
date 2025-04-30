//const Ciclo = require('../model/Ciclo')

module.exports = {

    async showIndex(req, res) {       
       
        //return res.render('index',{ciclos: ciclosAtivos, usuarioAtivo: usuarioAtivo[0]})
        return res.render('limitesolar')
        
    }

}