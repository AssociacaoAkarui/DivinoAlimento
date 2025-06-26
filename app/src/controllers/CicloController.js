const Ciclo = require('../model/Ciclo')
const PontoEntrega = require('../model/PontoEntrega')
const Cesta = require('../model/Cesta')
const Produto = require('../model/Produto')
const Profile = require('../model/Profile')

module.exports = {
    
    
    async create(req, res) {
        const pontosEntrega = await PontoEntrega.get();
        const tiposCesta = await Cesta.getCestasAtivas();

        // inserir verificacao da existência das cestas 1 e 5 e caso não exista criar estas linhas no banco
        Cesta.verificaCriaCestasInternas();

        return res.render("ciclo", { pontosEntrega: pontosEntrega, tiposCesta: tiposCesta })
    },

    
    async save(req, res) {      
        //inicio - cria vetor de atualização das datas de entrega

        var countEntregas = 1;

        entregaFornecedorInicio = req.body.entregaFornecedorInicio1;
        entregaFornecedorFim = req.body.entregaFornecedorFim1;

        var cicloEntregas = [];

        while (entregaFornecedorInicio) {
            
            cicloEntregas.push({
                    entregaFornecedorInicio: entregaFornecedorInicio, 
                    entregaFornecedorFim: entregaFornecedorFim
            });

            countEntregas += 1;

            newEntregaFornecedorInicio = 'entregaFornecedorInicio' + countEntregas.toString();
            newEntregaFornecedorFim = 'entregaFornecedorFim' + countEntregas.toString();

            entregaFornecedorInicio = req.body[newEntregaFornecedorInicio];
            entregaFornecedorFim = req.body[newEntregaFornecedorFim];

        }
        //fim - cria vetor de atualização das datas de entrega

        

        //inicio - cria vetor de atualização das cestas e quantidades
        var countCestas = 1;

        cestaId = req.body.cestaId1;
        quantidadeCestas = req.body.quantidadeCestas1;

        var cicloCestas = [];

        while (quantidadeCestas) {
            if (quantidadeCestas > 0) {
                cicloCestas.push({
                    cestaId: cestaId, 
                    quantidadeCestas: quantidadeCestas
                });
            }

            countCestas += 1;

            newCestaId = 'cestaId' + countCestas.toString();
            newQuantidadeCestas = 'quantidadeCestas' + countCestas.toString();

            cestaId = req.body[newCestaId];
            quantidadeCestas = req.body[newQuantidadeCestas];

        }
        //fim - cria vetor de atualização das cestas e quantidade

        
            await Ciclo.create({
                nome: req.body.nome,
                pontoEntregaId: req.body.pontoEntregaId,
                ofertaInicio: req.body.ofertaInicio,
                ofertaFim: req.body.ofertaFim,
                itensAdicionaisInicio: req.body.itensAdicionaisInicio,
                itensAdicionaisFim: req.body.itensAdicionaisFim,
                retiradaConsumidorInicio: req.body.retiradaConsumidorInicio,
                retiradaConsumidorFim: req.body.retiradaConsumidorFim,
                observacao: req.body.observacao,
                cicloEntregas: cicloEntregas,
                cicloCestas: cicloCestas
            })
        
          console.log("ATENÇÃO ATENÇÃO ATENÇÃO ATENÇÃO ATENÇÃO ATENÇÃO TESTE_4")
    
        return res.redirect('/ciclo-index')
    },



    async show(req, res) {

        const cicloId = req.params.id

        const dadosCiclo = await Ciclo.getCicloIdMin(cicloId)
        const ciclo = dadosCiclo.ciclo[0]

        console.log('---------------------------------------------------------------------------------------------------------------entrou no Controller show')

        const cicloEntregas = dadosCiclo.cicloEntregas

        const cicloCestas = dadosCiclo.cicloCestas

        console.log('---------------------------------------------------------------------------------------------------------------Controller showCestas ',dadosCiclo.cicloCestas)

        if (!ciclo) {
            return res.send('Ciclo não existe!')
        }

        const pontosEntrega = await PontoEntrega.get();
        const tiposCesta = await Cesta.getCestasAtivas();
        //const produtos = await Produto.get();

        return res.render("ciclo-edit", { ciclo:ciclo, pontosEntrega:pontosEntrega, cicloEntregas: cicloEntregas, cicloCestas: cicloCestas, tiposCesta:tiposCesta })
    },

    async update(req, res) {

        const cicloId = req.params.id

        const dadosCiclo = await Ciclo.getCicloIdMin(cicloId)
        const ciclo = dadosCiclo.ciclo[0]

        console.log('---------------------------------------------------------------------------------------------------------------entrou no Controller update')
          

        //const data = await Ciclo.get()
        //const ciclos = data.ciclos
        //const ciclo = ciclos.find(ciclo => Number(ciclo.id) === Number(cicloId))

        if (!ciclo) {
            return res.send('Ciclo não existe!')
        }

        //inicio - cria vetor de atualização das datas de entrega
        var countEntregas = 1;

        entregaFornecedorInicio = req.body.entregaFornecedorInicio1;
        entregaFornecedorFim = req.body.entregaFornecedorFim1;

        var cicloEntregas = [];

        while (entregaFornecedorInicio) {
            
            cicloEntregas.push({
                    entregaFornecedorInicio: entregaFornecedorInicio, 
                    entregaFornecedorFim: entregaFornecedorFim
            });

            countEntregas += 1;

            newEntregaFornecedorInicio = 'entregaFornecedorInicio' + countEntregas.toString();
            newEntregaFornecedorFim = 'entregaFornecedorFim' + countEntregas.toString();

            entregaFornecedorInicio = req.body[newEntregaFornecedorInicio];
            entregaFornecedorFim = req.body[newEntregaFornecedorFim];

        }
        //fim - cria vetor de atualização das datas de entrega

        //inicio - cria vetor de atualização das cestas e quantidades
        var countCestas = 1;

        cestaId = req.body.cestaId1;
        quantidadeCestas = req.body.quantidadeCestas1;

        var cicloCestas = [];

        while (quantidadeCestas) {
            
            if (quantidadeCestas >= 0) {
                cicloCestas.push({
                    cestaId: cestaId, 
                    quantidadeCestas: quantidadeCestas
                });
            }

            countCestas += 1;

            newCestaId = 'cestaId' + countCestas.toString();
            newQuantidadeCestas = 'quantidadeCestas' + countCestas.toString();

            cestaId = req.body[newCestaId];
            quantidadeCestas = req.body[newQuantidadeCestas];

        }
        //fim - cria vetor de atualização das cestas e quantidade


        const updatedCiclo = { 
            id: cicloId,
            nome: req.body.nome,
            pontoEntregaId: req.body.pontoEntregaId,
            ofertaInicio: req.body.ofertaInicio,
            ofertaFim: req.body.ofertaFim,
            itensAdicionaisInicio: req.body.itensAdicionaisInicio,
            itensAdicionaisFim: req.body.itensAdicionaisFim,
            retiradaConsumidorInicio: req.body.retiradaConsumidorInicio,
            retiradaConsumidorFim: req.body.retiradaConsumidorFim,
            observacao: req.body.observacao,
            cicloEntregas: cicloEntregas,
            cicloCestas: cicloCestas
            //cicloProdutos: cicloProdutos  
        }


        await Ciclo.update(updatedCiclo)

        res.redirect('/ciclo/' + cicloId)
    },

    delete(req, res) {
        const cicloId = req.params.id

        Ciclo.delete(cicloId)

        return res.redirect('/ciclo-index')
    }
}