const Ciclo = require('../model/Ciclo')
const Cesta = require('../model/Cesta')
const Profile = require('../model/Profile')
const Usuario = require('../model/Usuario')

module.exports = {

    async index(req, res) {
        const data = await Ciclo.get();
        const ciclos = data.ciclos
        const profile = Profile.get();

        let statusCount = {
            ativo: 0,
            legAtivo: "Em andamento",
            inativo: 0,
            legInativo: "Encerrados",
            total: ciclos.length,
            legTotal: "Total de ciclos"
        }


        // USUARIO V010921
        usuarioAtivo = []
        loginStatus = ""
        user = req.oidc.user
        if (user) {
            
            // Já é usuário cadastrado na base do sistema

            usuarioCadastrado = await Usuario.retornaUsuarioCadastrado(user.email)

            if (usuarioCadastrado != 0) {
                usuarioAtivo.push({
                    email: user.email,
                    picture: user.picture,
                    name: user.name,
                    email_verified: user.email_verified,
                    id: usuarioCadastrado.id,
                    perfil: usuarioCadastrado.perfil       
                })

                loginStatus = 'usuarioAtivo'

            }
            else {

                usuarioAtivo.push({
                    email: user.email,
                    picture: user.picture,
                    name: user.name,
                    email_verified: user.email_verified
                })
                
                return res.render('usuarionovo',{usuarioAtivo: usuarioAtivo[0]})

            }  

        }
        else {

            return res.redirect('/login')

            // DESENVOLVIMENTO
            /*usuarioAtivo.push({
                email: "jsfarinaci@gmail.com",
                picture: "https://lh3.googleusercontent.com/a-/AOh14GgJtCHmUVeMyPR3OiAHnnsp4NCI3bupns-WFHIekQ=s96-c",
                name: "Juliana Farinaci",
                email_verified: "true",
                id: 2,
                perfil: ['consumidor', 'admin']       
            })
            loginStatus = 'usuarioAtivo'*/

        }
        // USUARIO FIM







        updatedCiclos = []
        
        for (let index = 0; index < ciclos.length; index++) {
            const cicloatual = ciclos[index];
  
            let status = "";

            // verificando se o ciclo está ativo ou inativo
            const dataRetiradaConsumidorFim = Date.parse(cicloatual.retiradaConsumidorFim);
            const dataAtual = Date.now();
            

            if (dataAtual > dataRetiradaConsumidorFim) {
                status = 'inativo'
            } else {
                status = 'ativo'
            }



            const cicloId = cicloatual.id

            const dadosCiclo = await Ciclo.getCicloId(cicloId)
            ciclo = dadosCiclo.ciclo[0]

            const cicloCestas = dadosCiclo.cicloCestas
   
            const cestas = await Cesta.get()
        
            cicloCestaOfertas_1 = 0
            cicloCestaPedidosExtras_5 = 0
            cicloCestas.forEach(cicloCesta => {
                 cestaDados = cestas.find(cesta => Number(cesta.id) === Number(cicloCesta.cestaId))

                    if (cicloCesta.cestaId == 1) {
                        cicloCestaOfertas_1 = cicloCesta.id
                    }
                    if (cicloCesta.cestaId == 5) {
                        cicloCestaPedidosExtras_5 = cicloCesta.id
                    }
                

                 
                    /*cicloCestasVisiveis.push({
                        id: cicloCesta.id,
                        nome: cestaDados.nome,
                        quantidade: cicloCesta.quantidadeCestas,
                        valormaximo: cestaDados.valormaximo,
                        cestaId: cicloCesta.cestaId
                    })*/
            })




            // somando a quantidade de status
            //statusCount[status] += 1;

            updatedCiclos.push({
                ...ciclo,
                status,
                cicloCestaOfertas_1: cicloCestaOfertas_1,
                cicloCestaPedidosExtras_5: cicloCestaPedidosExtras_5
            })

        }

        // TEMP para rodar
        //status = 'ativo'

        /*const updatedCiclos = {
            ...ciclos,
            status
        }*/
        // TEMPFim para rodar



        return res.render("ciclo-index", { usuarioAtivo: usuarioAtivo[0], ciclos: updatedCiclos, profile: profile, statusCount: statusCount})

    }
}
