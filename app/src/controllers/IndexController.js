const Ciclo = require('../model/Ciclo')

const Usuario = require('../model/Usuario')

const PedidoConsumidores = require('../model/PedidoConsumidores')


module.exports = {

    async showIndex(req, res) {
        
        // USUARIO V20210720
        usuarioAtivo = []
        user = req.oidc.user
        let controleUsuario = ""

        let haUsuarios = true;

        let ambiente = ""
        if (process.env.NODE_ENV === 'development') {
            ambiente = "desenvolvimento"
        }
        

        const usuarios = await Usuario.get();
             
        if (usuarios.length === 0) {
            haUsuarios = false;
        }

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

                console.log("USUÁRIO CADASTRADO:",usuarioAtivo[0] )

                controleUsuario = "usuarioCadastrado"
    
            }
            else {

                usuarioAtivo.push({
                    email: user.email,
                    picture: user.picture,
                    name: user.name,
                    email_verified: user.email_verified
                })

                
                
            }  

        }
        else {
            usuarioAtivo.push({
                email_verified: "false"        
            })
        }
        
        // USUARIO FIM


        const data = await Ciclo.getCiclosMin();
        const ciclos = data.ciclos

        let ciclosAtivos = []
        for (let index = 0; index < ciclos.length; index++) {
            const ciclo = ciclos[index];
  
            let status = "";

            // verificando se o ciclo está ativo ou inativo
            const dataRetiradaConsumidorFim = new Date(ciclo.retiradaConsumidorFim)
            let dataCorte = dataRetiradaConsumidorFim
            dataCorte.setDate(dataRetiradaConsumidorFim.getDate() + 1)
            dataCorte = Date.parse(dataCorte);
            const dataAtual = Date.now()

            
            //var time = new Date('2014-03-14T23:54:00');
            //var outraData = new Date();
            //outraData.setDate(time.getDate() + 3); // Adiciona 3 dias
            
            pedidoConsumidorFinalizado = false
            if (user) {
                if (usuarioAtivo[0].id) {
                    pedidoConsumidorFinalizado = await PedidoConsumidores.pedidoConsumidorFinalizado(ciclo.id, usuarioAtivo[0].id)
                }
            }

            if (dataAtual > dataCorte) {
                status = 'inativo'
            } else {
                status = 'ativo'
                ciclosAtivos.unshift ( {
                    ...ciclo,
                    pedidoConsumidorFinalizado: pedidoConsumidorFinalizado
                })
            }
        }
        
        //const cicloId = req.params.id
        
        // to-do alterar para usuário corrente quando módulo de usuários estiver ativo
        //let usuarioId = 4 //desenvolvimento
        //let usuarioId = 2 //producao

        //if (req.query.usr) {
            //usuarioId = req.query.usr
        //}

        //let usuarios = []
        //try {
            // to-do: trazer apensas usuários que podem ser geridos por usuário corrente
            //usuarios = await Usuario.get()
        //} catch (error) {
            //console.log('OfertaController error - falha Usuario.get')
        //}

        

        //const dadosCiclo = await Ciclo.getCicloId(cicloId)
        //ciclo = dadosCiclo.ciclo[0]

        //const cicloComposicoes = dadosCiclo.cicloComposicoes

        if (user) {
            if (controleUsuario == "usuarioCadastrado") {
                return res.render('index',{ciclos: ciclosAtivos, usuarioAtivo: usuarioAtivo[0]})
            }
            else {

                return res.render('usuarionovo',{usuarioAtivo: usuarioAtivo[0], haUsuarios: haUsuarios, ambiente:ambiente})
            }  
        }
        else {
            return res.render('index',{ciclos: ciclosAtivos, usuarioAtivo: usuarioAtivo[0]})
        }


    }

    
}