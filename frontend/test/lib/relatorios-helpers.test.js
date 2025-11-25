/**
 * relatorios-helpers.test.js
 * Tests BDD para relatorios-helpers.ts
 */

import { expect } from "chai";
import {
  validarPeriodo,
  filtrarVendasPorPeriodo,
  filtrarVendasPorStatus,
  calcularTotalVendas,
  calcularTicketMedio,
  calcularTotalItens,
  agruparVendasPorCiclo,
  calcularTotalKgProdutos,
  ordenarProdutosPorQuantidade,
  filtrarProdutosPorFornecedor,
  calcularTotalVendidoMercados,
  calcularTicketMedioGeral,
  ordenarMercadosPorVendas,
  formatarValorMonetario,
  formatarDataBR,
  gerarCSVVendas,
  gerarCSVQuantidades,
  gerarCSVMercados,
} from "../../src/lib/relatorios-helpers.ts";

describe("relatorios-helpers.ts - Funções auxiliares de relatórios", () => {
  // ============================================================================
  // VALIDAÇÕES
  // ============================================================================

  describe("validarPeriodo()", () => {
    it("Dado período válido, Quando validar, Então deve retornar válido", () => {
      // Given
      const periodo = { inicio: "2024-01-01", fim: "2024-12-31" };

      // When
      const resultado = validarPeriodo(periodo);

      // Then
      expect(resultado.valido).to.be.true;
      expect(resultado.erro).to.be.undefined;
    });

    it("Dado período com data início posterior à data fim, Quando validar, Então deve retornar erro", () => {
      // Given
      const periodo = { inicio: "2024-12-31", fim: "2024-01-01" };

      // When
      const resultado = validarPeriodo(periodo);

      // Then
      expect(resultado.valido).to.be.false;
      expect(resultado.erro).to.equal(
        "Data início deve ser anterior à data fim",
      );
    });

    it("Dado período incompleto, Quando validar, Então deve retornar erro", () => {
      // Given
      const periodo = { inicio: "2024-01-01", fim: "" };

      // When
      const resultado = validarPeriodo(periodo);

      // Then
      expect(resultado.valido).to.be.false;
      expect(resultado.erro).to.equal("Período incompleto");
    });
  });

  // ============================================================================
  // FILTROS
  // ============================================================================

  describe("filtrarVendasPorPeriodo()", () => {
    it("Dado vendas em diferentes datas, Quando filtrar por período, Então deve retornar apenas vendas no período", () => {
      // Given
      const vendas = [
        {
          id: 1,
          ciclo: "Janeiro",
          itens: 10,
          valor: 100,
          status: "Concluído",
          data: "2024-01-15",
        },
        {
          id: 2,
          ciclo: "Fevereiro",
          itens: 20,
          valor: 200,
          status: "Concluído",
          data: "2024-02-15",
        },
        {
          id: 3,
          ciclo: "Março",
          itens: 30,
          valor: 300,
          status: "Concluído",
          data: "2024-03-15",
        },
      ];
      const periodo = { inicio: "2024-02-01", fim: "2024-03-31" };

      // When
      const resultado = filtrarVendasPorPeriodo(vendas, periodo);

      // Then
      expect(resultado).to.have.lengthOf(2);
      expect(resultado[0].ciclo).to.equal("Fevereiro");
      expect(resultado[1].ciclo).to.equal("Março");
    });

    it("Dado vendas fora do período, Quando filtrar, Então deve retornar array vazio", () => {
      // Given
      const vendas = [
        {
          id: 1,
          ciclo: "Janeiro",
          itens: 10,
          valor: 100,
          status: "Concluído",
          data: "2024-01-15",
        },
      ];
      const periodo = { inicio: "2024-06-01", fim: "2024-06-30" };

      // When
      const resultado = filtrarVendasPorPeriodo(vendas, periodo);

      // Then
      expect(resultado).to.have.lengthOf(0);
    });
  });

  describe("filtrarVendasPorStatus()", () => {
    it("Dado vendas com diferentes status, Quando filtrar por status, Então deve retornar apenas vendas com o status especificado", () => {
      // Given
      const vendas = [
        {
          id: 1,
          ciclo: "A",
          itens: 10,
          valor: 100,
          status: "Concluído",
          data: "2024-01-01",
        },
        {
          id: 2,
          ciclo: "B",
          itens: 20,
          valor: 200,
          status: "Em andamento",
          data: "2024-01-02",
        },
        {
          id: 3,
          ciclo: "C",
          itens: 30,
          valor: 300,
          status: "Concluído",
          data: "2024-01-03",
        },
      ];

      // When
      const resultado = filtrarVendasPorStatus(vendas, "Concluído");

      // Then
      expect(resultado).to.have.lengthOf(2);
      expect(resultado[0].ciclo).to.equal("A");
      expect(resultado[1].ciclo).to.equal("C");
    });
  });

  // ============================================================================
  // CÁLCULOS - VENDAS
  // ============================================================================

  describe("calcularTotalVendas()", () => {
    it("Dado lista de vendas, Quando calcular total, Então deve retornar soma dos valores", () => {
      // Given
      const vendas = [
        {
          id: 1,
          ciclo: "A",
          itens: 10,
          valor: 100,
          status: "Concluído",
          data: "2024-01-01",
        },
        {
          id: 2,
          ciclo: "B",
          itens: 20,
          valor: 200,
          status: "Concluído",
          data: "2024-01-02",
        },
      ];

      // When
      const resultado = calcularTotalVendas(vendas);

      // Then
      expect(resultado).to.equal(300);
    });

    it("Dado array vazio, Quando calcular total, Então deve retornar 0", () => {
      // Given
      const vendas = [];

      // When
      const resultado = calcularTotalVendas(vendas);

      // Then
      expect(resultado).to.equal(0);
    });
  });

  describe("calcularTicketMedio()", () => {
    it("Dado vendas, Quando calcular ticket médio, Então deve retornar média dos valores", () => {
      // Given
      const vendas = [
        {
          id: 1,
          ciclo: "A",
          itens: 10,
          valor: 100,
          status: "Concluído",
          data: "2024-01-01",
        },
        {
          id: 2,
          ciclo: "B",
          itens: 20,
          valor: 200,
          status: "Concluído",
          data: "2024-01-02",
        },
      ];

      // When
      const resultado = calcularTicketMedio(vendas);

      // Then
      expect(resultado).to.equal(150);
    });

    it("Dado array vazio, Quando calcular ticket médio, Então deve retornar 0", () => {
      // Given
      const vendas = [];

      // When
      const resultado = calcularTicketMedio(vendas);

      // Then
      expect(resultado).to.equal(0);
    });
  });

  describe("calcularTotalItens()", () => {
    it("Dado vendas, Quando calcular total de itens, Então deve retornar soma dos itens", () => {
      // Given
      const vendas = [
        {
          id: 1,
          ciclo: "A",
          itens: 10,
          valor: 100,
          status: "Concluído",
          data: "2024-01-01",
        },
        {
          id: 2,
          ciclo: "B",
          itens: 20,
          valor: 200,
          status: "Concluído",
          data: "2024-01-02",
        },
      ];

      // When
      const resultado = calcularTotalItens(vendas);

      // Then
      expect(resultado).to.equal(30);
    });
  });

  describe("agruparVendasPorCiclo()", () => {
    it("Dado vendas de diferentes ciclos, Quando agrupar, Então deve retornar vendas agrupadas por ciclo", () => {
      // Given
      const vendas = [
        {
          id: 1,
          ciclo: "Janeiro",
          itens: 10,
          valor: 100,
          status: "Concluído",
          data: "2024-01-01",
        },
        {
          id: 2,
          ciclo: "Janeiro",
          itens: 20,
          valor: 200,
          status: "Concluído",
          data: "2024-01-02",
        },
        {
          id: 3,
          ciclo: "Fevereiro",
          itens: 30,
          valor: 300,
          status: "Concluído",
          data: "2024-02-01",
        },
      ];

      // When
      const resultado = agruparVendasPorCiclo(vendas);

      // Then
      expect(resultado["Janeiro"]).to.have.lengthOf(2);
      expect(resultado["Fevereiro"]).to.have.lengthOf(1);
    });
  });

  // ============================================================================
  // CÁLCULOS - QUANTIDADES
  // ============================================================================

  describe("calcularTotalKgProdutos()", () => {
    it("Dado produtos, Quando calcular total kg, Então deve retornar soma", () => {
      // Given
      const quantidades = [
        { produto: "Tomate", totalKg: 100, fornecedores: ["João"], ciclos: 1 },
        {
          produto: "Alface",
          totalKg: 200,
          fornecedores: ["Maria"],
          ciclos: 1,
        },
      ];

      // When
      const resultado = calcularTotalKgProdutos(quantidades);

      // Then
      expect(resultado).to.equal(300);
    });
  });

  describe("ordenarProdutosPorQuantidade()", () => {
    it("Dado produtos, Quando ordenar desc, Então deve retornar produtos ordenados por quantidade decrescente", () => {
      // Given
      const quantidades = [
        { produto: "A", totalKg: 100, fornecedores: [], ciclos: 1 },
        { produto: "B", totalKg: 300, fornecedores: [], ciclos: 1 },
        { produto: "C", totalKg: 200, fornecedores: [], ciclos: 1 },
      ];

      // When
      const resultado = ordenarProdutosPorQuantidade(quantidades, "desc");

      // Then
      expect(resultado[0].produto).to.equal("B");
      expect(resultado[1].produto).to.equal("C");
      expect(resultado[2].produto).to.equal("A");
    });

    it("Dado produtos, Quando ordenar asc, Então deve retornar produtos ordenados por quantidade crescente", () => {
      // Given
      const quantidades = [
        { produto: "A", totalKg: 100, fornecedores: [], ciclos: 1 },
        { produto: "B", totalKg: 300, fornecedores: [], ciclos: 1 },
        { produto: "C", totalKg: 200, fornecedores: [], ciclos: 1 },
      ];

      // When
      const resultado = ordenarProdutosPorQuantidade(quantidades, "asc");

      // Then
      expect(resultado[0].produto).to.equal("A");
      expect(resultado[1].produto).to.equal("C");
      expect(resultado[2].produto).to.equal("B");
    });
  });

  describe("filtrarProdutosPorFornecedor()", () => {
    it("Dado produtos de diferentes fornecedores, Quando filtrar por fornecedor, Então deve retornar apenas produtos do fornecedor", () => {
      // Given
      const quantidades = [
        {
          produto: "Tomate",
          totalKg: 100,
          fornecedores: ["João"],
          ciclos: 1,
        },
        {
          produto: "Alface",
          totalKg: 200,
          fornecedores: ["João", "Maria"],
          ciclos: 2,
        },
        {
          produto: "Cenoura",
          totalKg: 150,
          fornecedores: ["Maria"],
          ciclos: 1,
        },
      ];

      // When
      const resultado = filtrarProdutosPorFornecedor(quantidades, "João");

      // Then
      expect(resultado).to.have.lengthOf(2);
      expect(resultado[0].produto).to.equal("Tomate");
      expect(resultado[1].produto).to.equal("Alface");
    });
  });

  // ============================================================================
  // CÁLCULOS - MERCADOS
  // ============================================================================

  describe("calcularTotalVendidoMercados()", () => {
    it("Dado mercados, Quando calcular total vendido, Então deve retornar soma", () => {
      // Given
      const mercados = [
        {
          mercado: "Mercado A",
          totalVendido: 1000,
          ticketMedio: 100,
          pedidos: 10,
        },
        {
          mercado: "Mercado B",
          totalVendido: 2000,
          ticketMedio: 200,
          pedidos: 10,
        },
      ];

      // When
      const resultado = calcularTotalVendidoMercados(mercados);

      // Then
      expect(resultado).to.equal(3000);
    });
  });

  describe("calcularTicketMedioGeral()", () => {
    it("Dado mercados, Quando calcular ticket médio geral, Então deve retornar média ponderada", () => {
      // Given
      const mercados = [
        {
          mercado: "Mercado A",
          totalVendido: 1000,
          ticketMedio: 100,
          pedidos: 10,
        },
        {
          mercado: "Mercado B",
          totalVendido: 2000,
          ticketMedio: 200,
          pedidos: 10,
        },
      ];

      // When
      const resultado = calcularTicketMedioGeral(mercados);

      // Then
      expect(resultado).to.equal(150); // 3000 / 20 pedidos
    });

    it("Dado array vazio, Quando calcular ticket médio geral, Então deve retornar 0", () => {
      // Given
      const mercados = [];

      // When
      const resultado = calcularTicketMedioGeral(mercados);

      // Then
      expect(resultado).to.equal(0);
    });
  });

  describe("ordenarMercadosPorVendas()", () => {
    it("Dado mercados, Quando ordenar desc, Então deve retornar mercados ordenados por vendas decrescentes", () => {
      // Given
      const mercados = [
        {
          mercado: "A",
          totalVendido: 1000,
          ticketMedio: 100,
          pedidos: 10,
        },
        {
          mercado: "B",
          totalVendido: 3000,
          ticketMedio: 100,
          pedidos: 10,
        },
        {
          mercado: "C",
          totalVendido: 2000,
          ticketMedio: 100,
          pedidos: 10,
        },
      ];

      // When
      const resultado = ordenarMercadosPorVendas(mercados, "desc");

      // Then
      expect(resultado[0].mercado).to.equal("B");
      expect(resultado[1].mercado).to.equal("C");
      expect(resultado[2].mercado).to.equal("A");
    });
  });

  // ============================================================================
  // FORMATAÇÃO
  // ============================================================================

  describe("formatarValorMonetario()", () => {
    it("Dado valor numérico, Quando formatar, Então deve retornar string no formato BRL", () => {
      // Given
      const valor = 1234.56;

      // When
      const resultado = formatarValorMonetario(valor);

      // Then
      expect(resultado).to.match(/R\$\s*1\.234,56/);
    });
  });

  describe("formatarDataBR()", () => {
    it("Dado data ISO, Quando formatar, Então deve retornar data no formato DD/MM/YYYY", () => {
      // Given
      const data = "2024-11-25T12:00:00Z";

      // When
      const resultado = formatarDataBR(data);

      // Then
      expect(resultado).to.match(/25\/11\/2024|24\/11\/2024/);
    });

    it("Dado string vazia, Quando formatar, Então deve retornar string vazia", () => {
      // Given
      const data = "";

      // When
      const resultado = formatarDataBR(data);

      // Then
      expect(resultado).to.equal("");
    });
  });

  // ============================================================================
  // EXPORTAÇÃO
  // ============================================================================

  describe("gerarCSVVendas()", () => {
    it("Dado vendas, Quando gerar CSV, Então deve retornar string CSV válida", () => {
      // Given
      const vendas = [
        {
          id: 1,
          ciclo: "Janeiro",
          itens: 10,
          valor: 100,
          status: "Concluído",
          data: "2024-01-15",
        },
      ];

      // When
      const resultado = gerarCSVVendas(vendas);

      // Then
      expect(resultado).to.include("Ciclo,Itens,Valor,Status,Data");
      expect(resultado).to.include('"Janeiro",10,100.00,"Concluído"');
    });
  });

  describe("gerarCSVQuantidades()", () => {
    it("Dado quantidades, Quando gerar CSV, Então deve retornar string CSV válida", () => {
      // Given
      const quantidades = [
        {
          produto: "Tomate",
          totalKg: 100,
          fornecedores: ["João", "Maria"],
          ciclos: 2,
        },
      ];

      // When
      const resultado = gerarCSVQuantidades(quantidades);

      // Then
      expect(resultado).to.include("Produto,Total (kg),Fornecedores,Ciclos");
      expect(resultado).to.include('"Tomate",100,"João; Maria",2');
    });
  });

  describe("gerarCSVMercados()", () => {
    it("Dado mercados, Quando gerar CSV, Então deve retornar string CSV válida", () => {
      // Given
      const mercados = [
        {
          mercado: "Mercado Central",
          totalVendido: 1000,
          ticketMedio: 100,
          pedidos: 10,
        },
      ];

      // When
      const resultado = gerarCSVMercados(mercados);

      // Then
      expect(resultado).to.include(
        "Mercado,Total Vendido,Ticket Médio,Pedidos",
      );
      expect(resultado).to.include('"Mercado Central",1000.00,100.00,10');
    });
  });
});
