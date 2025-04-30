const PDFDocument =  require('pdfkit');
const Ciclo = require('../model/Ciclo')
const Produto = require('../model/Produto')
const Usuario = require('../model/Usuario')
const Oferta = require('../model/Oferta')
const Composicao = require('../model/Composicao')
const PedidoConsumidores = require('../model/PedidoConsumidores')
const Profile = require('../model/Profile')


module.exports = {
    async downloadEntregaCicloPDF (req, res, next) {
      
      /*const cicloId = req.params.id

      const produtos = await Produto.get();
      const usuarios = await Usuario.get();

      const dadosCiclo = await Ciclo.getCicloId(cicloId)
      
      ciclo = dadosCiclo.ciclo[0]

      pedidosFornecedores  = dadosCiclo.cicloPedidosFornecedores

      console.log('RelatoriosCONTROLLER pedidosFornecedores', pedidosFornecedores)


      pedidosFornecedoresDados = pedidosFornecedores*/


      const cicloId = req.params.id

      const dadosCiclo = await Ciclo.getCicloId(cicloId)
      ciclo = dadosCiclo.ciclo[0]

      const cicloComposicoes = dadosCiclo.cicloComposicoes
      
      // array para busca da quantidade por produto para calculo de itens pedidos
      let arrayComposicoes = []
      cicloComposicoes.forEach(cicloComposicao => {
          arrayComposicoes.push(cicloComposicao.id)
      });
      
      /*produtosComposicao = await Composicao.getProdutosPorCicloComposicao({
                              composicaoId: composicao.id
                      })*/
      
      const produtos = await Produto.get();
      const usuarios = await Usuario.get();

      // Busca produtosOfertaDados
      
      const ofertas = await Oferta.getOfertasPorCiclo({
          cicloId: cicloId
      })

      let cicloProdutosOfertados = []

      let arrayOfertas = []

      for (let index = 0; index < ofertas.length; index++) {
          const oferta = ofertas[index];
          produtosOferta = await Oferta.getProdutosPorOferta({
              ofertaId: oferta.id
          })
          produtosOferta.forEach(produtoOferta => {
            cicloProdutosOfertados.push({
                id: produtoOferta.id,
                quantidade:produtoOferta.quantidade,
                produtoId: produtoOferta.produtoId,
                usuarioId: oferta.usuarioId
            })

            arrayOfertas.push({
                produtoOfertaId:produtoOferta.id,
                produtoId: produtoOferta.produtoId,
            })

          });
      } 
      
      cicloProdutosOfertados.sort((a,b) => (a.produtoId > b.produtoId) ? 1 : ((b.produtoId > a.produtoId) ? -1 : 0))

      let cicloOfertaProdutosDados = []

      let produtoCorrente = {
          id: 0,
          nome: "",
          quantidade: 0,
          fornecedores: "vazio"
      }

      let quantidadeOfertados = 0
      let quantidadeParaPedir = 0
      let quantidadeFaltaPedir = 0
      let arrayProdutosOfertas = []

      for (let index = 0; index < cicloProdutosOfertados.length; index++) {
          const cicloOfertaProduto = cicloProdutosOfertados[index]
          
          produtoDados = produtos.find(produto => Number(produto.id) === Number(cicloOfertaProduto.produtoId))
          usuarioDados = usuarios.find(usuario => Number(usuario.id) === Number(cicloOfertaProduto.usuarioId))

          const quantPedidoFornecedor = await Composicao.getPedidoFornecedores({
              id: cicloOfertaProduto.id,
          })

          if (produtoDados.id != produtoCorrente.id) {
              
              // BEGIN - calculo da quantidade de produtos, por produto, que precisa ser pedido aos fornecedores
                  quantidadeProdutoComposicao = await Composicao.getQuantidadeProdutosComposicao({
                      arrayComposicoes: arrayComposicoes,
                      produtoId: produtoDados.id
                  })

                  quantidadeProdutoPedidoConsumidores = await PedidoConsumidores.getQuantidadeProdutoPedidoConsumidores({
                      cicloId: cicloId,
                      produtoId: produtoDados.id
                  })

                  quantidadeParaPedir = 0
                  if (quantidadeProdutoComposicao[0]) {
                      quantidadeParaPedir = Number(quantidadeProdutoComposicao[0].SumQuantidade)
                  }

                  if (quantidadeProdutoPedidoConsumidores) {
                      quantidadeParaPedir = quantidadeParaPedir + Number(quantidadeProdutoPedidoConsumidores)
                  }

                  console.log("quantidadeParaPedir:", quantidadeParaPedir)


                  
              // END

              arrayProdutosOfertas = []
              arrayOfertas.forEach(oferta => {
                  if (oferta.produtoId == produtoDados.id) {
                      arrayProdutosOfertas.push(oferta.produtoOfertaId)
                  }
              });

              quantidadeProdutoPedidoFornecedores = await Composicao.getQuantidadeProdutoPedidoFornecedores({
                  arrayProdutosOfertas: arrayProdutosOfertas
              })

              quantidadeFaltaPedir = quantidadeParaPedir - Number(quantidadeProdutoPedidoFornecedores)

              produtoCorrente.id = produtoDados.id

              //produtoCorrente.nome = produtoDados.nome
              //produtoCorrente.quantidade = produtoCorrente.quantidade + cicloOfertaProduto.quantidade        
          }


          if (cicloOfertaProduto.quantidade) {
              quantidadeOfertados = cicloOfertaProduto.quantidade
          }

          cicloOfertaProdutosDados.push ({
              id: cicloOfertaProduto.id,
              nome: produtoDados.nome,
              valorReferencia: produtoDados.valorReferencia,
              quantidadeOfertados: quantidadeOfertados,
              quantidadeParaPedir: quantidadeParaPedir,
              quantidadeFaltaPedir: quantidadeFaltaPedir,
              quantidade: quantPedidoFornecedor,
              fornecedor: usuarioDados.nome
          })
              
      }

      //cicloOfertaProdutosDados.sort()
      cicloOfertaProdutosDados.sort((a,b) => (a.fornecedor > b.fornecedor) ? 1 : ((b.fornecedor > a.fornecedor) ? -1 : 0))
      // FIM Busca produtosOfertaDados

      produtosPedidosFornecedoresDados = cicloOfertaProdutosDados

      // Busca produtosComposicaoDados
      /*let produtosComposicaoDados = []

      let totalValorCesta = 0
      let ValorCesta = 0
      let valorCestaDiferenca = 0
      let totalItensCesta = 0
      let quantItensCesta = 0

      produtosComposicao.forEach(produtoComposicao => {
          produtoDados = produtos.find(produto => Number(produto.id) === Number(produtoComposicao.produtoId))

          produtosOfertados = cicloOfertaProdutosDados.find(produtoOfertado => Number(produtoOfertado.id) === Number(produtoComposicao.produtoId))

          produtosComposicaoDados.push ({
              id: produtoComposicao.id,
              nome: produtoDados.nome,
              quantidade: produtoComposicao.quantidade,
              valorReferencia: produtoDados.valorReferencia,
              quantidadeOfertados: produtosOfertados.quantidade
          })
          totalValorCesta = (totalValorCesta + produtoComposicao.quantidade*produtoDados.valorReferencia)
          totalItensCesta = (totalItensCesta + produtoComposicao.quantidade)
      });
      valorCesta = totalValorCesta / cicloCestaSel.quantidade
      valorCestaDiferenca = cicloCestaSel.valormaximo - valorCesta    
      quantItensCesta = totalItensCesta / cicloCestaSel.quantidade
          
      // FIM Busca produtosComposicaoDados

      produtosComposicaoDados.sort((a,b) => (a.nome > b.nome) ? 1 : ((b.nome > a.nome) ? -1 : 0))*/
      

      


      /*pedidosFornecedoresDados = []
      for (let index = 0; index < pedidosFornecedores.length; index++) {
        const pedidoFornecedor = pedidosFornecedores[index];
        
        //produtoDados = produtos.find(produto => Number(produto.id) === Number(pedidoFornecedor.produtoId))
        //usuarioDados = usuarios.find(usuario => Number(usuario.id) === Number(pedidoFornecedor.usuarioId))
  
        pedidosFornecedoresDados.push ({
          nomeFornecedor: pedidoFornecedor.id,
          quantidade: pedidoFornecedor.quantidade
        })

      }*/

      


      const arrayCiclo = [
        'Nome: '+ ciclo.nome,
        'Período para Oferta: de '+  ciclo.ofertaInicio+ ' a '+ ciclo.OfertaFim,
        'Período para Pedido de Itens Adicionais: de '+  ciclo.itensAdicionaisInicio+ ' a '+ ciclo.itensAdicionaisFim,
        'Período para Retirada da Cesta: de '+  ciclo.retiradaConsumidorInicio+ ' a '+ ciclo.retiradaConsumidorFim
      ]


      
      var myDoc = new PDFDocument({bufferPages: true});
      
      let buffers = [];
      myDoc.on('data', buffers.push.bind(buffers));
      myDoc.on('end', () => {
      
          let pdfData = Buffer.concat(buffers);
          res.writeHead(200, {
          'Content-Length': Buffer.byteLength(pdfData),
          'Content-Type': 'application/pdf',
          'Content-disposition': 'attachment;filename=entregaCiclo.pdf',})
          .end(pdfData);
      
      });
      
      myDoc
          .font('Times-Roman')
          .fontSize(12)
           
      //dadosCiclo.forEach(ciclo => {
      myDoc
          .fontSize(15)
          .text('')
          .text('CICLO:')
          .fontSize(12)
          .text('Nome: '+ ciclo.nome)
          //.list(['Período para Oferta:',[ciclo.ofertaInicio, ciclo.OfertaFim,]])
      //});

      const tablePedForn = 270
      const nomeForn = 50
      const nomeProd = 200
      //const medida = 250
      const quantidade = 300
      const valor = 350
           
      myDoc
            .fontSize(10)
            .text('Fornecedor', nomeForn, tablePedForn, {bold: true})
            .text('Produto', nomeProd, tablePedForn)
            //.text('Medida', medida, tablePedForn)
            .text('Quantidade', quantidade, tablePedForn)
            .text('Valor', valor, tablePedForn)
      
      if (produtosPedidosFornecedoresDados) {
          for (let index = 0; index < produtosPedidosFornecedoresDados.length; index++) {
            const pedido = produtosPedidosFornecedoresDados[index];
            
            const y = tablePedForn + 25 + (index * 25)
            
            myDoc
                .fontSize(10)
                .text(pedido.fornecedor, nomeForn, y)
                .text(pedido.nome, nomeProd, y)
                //.text(pedido.quantidade, medida, y)
                .text(pedido.quantidade, quantidade, y)
                .text(`R$ ${pedido.valorReferencia}`, valor, y)

            
          }
      }
      
      myDoc.end();

        //return res.render("cesta")
    },
}