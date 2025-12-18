const {
  actualizarCantidadOfrecida,
  calcularDisponible,
  validarCantidadOfrecida,
  calcularTotalOfrecido,
  calcularValorEstimado,
  obtenerResumenOferta,
  filtrarProductosConOferta,
  puedeIncrementarOferta,
  puedeDecrementarOferta,
  formatearValorMoneda,
} = require("../../src/lib/venda-helpers");

describe("venda-helpers", () => {
  describe("actualizarCantidadOfrecida", () => {
    context("Given un producto con cantidad ofrecida", () => {
      context("When se incrementa la cantidad dentro del disponible", () => {
        it("Then retorna el producto con la cantidad actualizada", () => {
          const producto = {
            id: 1,
            name: "Tomate",
            unit: "kg",
            factor: 1,
            totalStock: 100,
            reserved: 20,
            available: 80,
            suppliers: ["Juan"],
            offered: 10,
          };

          const resultado = actualizarCantidadOfrecida(producto, 5);

          expect(resultado.offered).to.equal(15);
          expect(resultado.id).to.equal(1);
          expect(resultado.name).to.equal("Tomate");
        });
      });

      context(
        "When se incrementa la cantidad excediendo el disponible",
        () => {
          it("Then retorna el producto con la cantidad limitada al disponible", () => {
            const producto = {
              id: 1,
              name: "Tomate",
              unit: "kg",
              factor: 1,
              totalStock: 100,
              reserved: 20,
              available: 80,
              suppliers: ["Juan"],
              offered: 75,
            };

            const resultado = actualizarCantidadOfrecida(producto, 10);

            expect(resultado.offered).to.equal(80);
          });
        },
      );

      context("When se decrementa la cantidad", () => {
        it("Then retorna el producto con la cantidad decrementada", () => {
          const producto = {
            id: 1,
            name: "Tomate",
            unit: "kg",
            factor: 1,
            totalStock: 100,
            reserved: 20,
            available: 80,
            suppliers: ["Juan"],
            offered: 10,
          };

          const resultado = actualizarCantidadOfrecida(producto, -3);

          expect(resultado.offered).to.equal(7);
        });
      });

      context("When se decrementa por debajo de cero", () => {
        it("Then retorna el producto con cantidad cero", () => {
          const producto = {
            id: 1,
            name: "Tomate",
            unit: "kg",
            factor: 1,
            totalStock: 100,
            reserved: 20,
            available: 80,
            suppliers: ["Juan"],
            offered: 5,
          };

          const resultado = actualizarCantidadOfrecida(producto, -10);

          expect(resultado.offered).to.equal(0);
        });
      });
    });
  });

  describe("calcularDisponible", () => {
    context("Given stock total y cantidad reservada", () => {
      context("When el stock es mayor que lo reservado", () => {
        it("Then retorna la diferencia", () => {
          const resultado = calcularDisponible(100, 30);
          expect(resultado).to.equal(70);
        });
      });

      context("When el stock es igual a lo reservado", () => {
        it("Then retorna cero", () => {
          const resultado = calcularDisponible(50, 50);
          expect(resultado).to.equal(0);
        });
      });

      context("When lo reservado excede el stock", () => {
        it("Then retorna cero", () => {
          const resultado = calcularDisponible(30, 50);
          expect(resultado).to.equal(0);
        });
      });
    });
  });

  describe("validarCantidadOfrecida", () => {
    context("Given una cantidad ofrecida y cantidad disponible", () => {
      context("When la cantidad ofrecida es válida", () => {
        it("Then retorna válido true", () => {
          const resultado = validarCantidadOfrecida(50, 100);
          expect(resultado.valido).to.be.true;
          expect(resultado.error).to.be.undefined;
        });
      });

      context("When la cantidad ofrecida es cero", () => {
        it("Then retorna válido true", () => {
          const resultado = validarCantidadOfrecida(0, 100);
          expect(resultado.valido).to.be.true;
        });
      });

      context("When la cantidad ofrecida es negativa", () => {
        it("Then retorna válido false con mensaje de error", () => {
          const resultado = validarCantidadOfrecida(-5, 100);
          expect(resultado.valido).to.be.false;
          expect(resultado.error).to.equal("La cantidad no puede ser negativa");
        });
      });

      context("When la cantidad ofrecida excede el disponible", () => {
        it("Then retorna válido false con mensaje de error", () => {
          const resultado = validarCantidadOfrecida(150, 100);
          expect(resultado.valido).to.be.false;
          expect(resultado.error).to.include("excede el disponible");
        });
      });
    });
  });

  describe("calcularTotalOfrecido", () => {
    context("Given un array de productos", () => {
      context("When hay productos con cantidad ofrecida", () => {
        it("Then retorna la suma total de cantidades ofrecidas", () => {
          const productos = [
            { id: 1, offered: 10 },
            { id: 2, offered: 20 },
            { id: 3, offered: 15 },
          ];

          const resultado = calcularTotalOfrecido(productos);
          expect(resultado).to.equal(45);
        });
      });

      context("When hay productos sin cantidad ofrecida", () => {
        it("Then retorna la suma ignorando productos con cero", () => {
          const productos = [
            { id: 1, offered: 10 },
            { id: 2, offered: 0 },
            { id: 3, offered: 5 },
          ];

          const resultado = calcularTotalOfrecido(productos);
          expect(resultado).to.equal(15);
        });
      });

      context("When el array está vacío", () => {
        it("Then retorna cero", () => {
          const resultado = calcularTotalOfrecido([]);
          expect(resultado).to.equal(0);
        });
      });
    });
  });

  describe("calcularValorEstimado", () => {
    context("Given un array de productos y precio por kg", () => {
      context("When se usa el precio por defecto", () => {
        it("Then retorna el valor estimado con precio 7.5", () => {
          const productos = [
            { id: 1, offered: 10 },
            { id: 2, offered: 20 },
          ];

          const resultado = calcularValorEstimado(productos);
          expect(resultado).to.equal(225);
        });
      });

      context("When se especifica un precio por kg", () => {
        it("Then retorna el valor estimado con el precio especificado", () => {
          const productos = [
            { id: 1, offered: 10 },
            { id: 2, offered: 20 },
          ];

          const resultado = calcularValorEstimado(productos, 10);
          expect(resultado).to.equal(300);
        });
      });

      context("When hay productos sin cantidad ofrecida", () => {
        it("Then ignora productos con offered cero", () => {
          const productos = [
            { id: 1, offered: 10 },
            { id: 2, offered: 0 },
          ];

          const resultado = calcularValorEstimado(productos, 10);
          expect(resultado).to.equal(100);
        });
      });
    });
  });

  describe("obtenerResumenOferta", () => {
    context("Given un array de productos", () => {
      context("When hay productos con cantidad ofrecida", () => {
        it("Then retorna resumen con totalItems y valorEstimado", () => {
          const productos = [
            { id: 1, offered: 10 },
            { id: 2, offered: 20 },
          ];

          const resultado = obtenerResumenOferta(productos);

          expect(resultado.totalItems).to.equal(30);
          expect(resultado.valorEstimado).to.equal(225);
        });
      });

      context("When se especifica precio por kg personalizado", () => {
        it("Then calcula el valor con el precio especificado", () => {
          const productos = [
            { id: 1, offered: 10 },
            { id: 2, offered: 20 },
          ];

          const resultado = obtenerResumenOferta(productos, 5);

          expect(resultado.totalItems).to.equal(30);
          expect(resultado.valorEstimado).to.equal(150);
        });
      });
    });
  });

  describe("filtrarProductosConOferta", () => {
    context("Given un array de productos", () => {
      context("When hay productos con y sin cantidad ofrecida", () => {
        it("Then retorna solo productos con offered mayor a cero", () => {
          const productos = [
            { id: 1, name: "Tomate", offered: 10 },
            { id: 2, name: "Lechuga", offered: 0 },
            { id: 3, name: "Zanahoria", offered: 5 },
          ];

          const resultado = filtrarProductosConOferta(productos);

          expect(resultado).to.have.lengthOf(2);
          expect(resultado[0].name).to.equal("Tomate");
          expect(resultado[1].name).to.equal("Zanahoria");
        });
      });

      context("When ningún producto tiene cantidad ofrecida", () => {
        it("Then retorna array vacío", () => {
          const productos = [
            { id: 1, offered: 0 },
            { id: 2, offered: 0 },
          ];

          const resultado = filtrarProductosConOferta(productos);
          expect(resultado).to.have.lengthOf(0);
        });
      });

      context("When todos los productos tienen cantidad ofrecida", () => {
        it("Then retorna todos los productos", () => {
          const productos = [
            { id: 1, offered: 10 },
            { id: 2, offered: 5 },
          ];

          const resultado = filtrarProductosConOferta(productos);
          expect(resultado).to.have.lengthOf(2);
        });
      });
    });
  });

  describe("puedeIncrementarOferta", () => {
    context("Given un producto", () => {
      context("When la cantidad ofrecida es menor al disponible", () => {
        it("Then retorna true", () => {
          const producto = {
            id: 1,
            offered: 50,
            available: 100,
          };

          const resultado = puedeIncrementarOferta(producto);
          expect(resultado).to.be.true;
        });
      });

      context("When la cantidad ofrecida es igual al disponible", () => {
        it("Then retorna false", () => {
          const producto = {
            id: 1,
            offered: 100,
            available: 100,
          };

          const resultado = puedeIncrementarOferta(producto);
          expect(resultado).to.be.false;
        });
      });

      context("When la cantidad ofrecida excede el disponible", () => {
        it("Then retorna false", () => {
          const producto = {
            id: 1,
            offered: 150,
            available: 100,
          };

          const resultado = puedeIncrementarOferta(producto);
          expect(resultado).to.be.false;
        });
      });
    });
  });

  describe("puedeDecrementarOferta", () => {
    context("Given un producto", () => {
      context("When la cantidad ofrecida es mayor a cero", () => {
        it("Then retorna true", () => {
          const producto = {
            id: 1,
            offered: 10,
          };

          const resultado = puedeDecrementarOferta(producto);
          expect(resultado).to.be.true;
        });
      });

      context("When la cantidad ofrecida es cero", () => {
        it("Then retorna false", () => {
          const producto = {
            id: 1,
            offered: 0,
          };

          const resultado = puedeDecrementarOferta(producto);
          expect(resultado).to.be.false;
        });
      });
    });
  });

  describe("formatearValorMoneda", () => {
    context("Given un valor numérico", () => {
      context("When el valor tiene decimales", () => {
        it("Then retorna el valor formateado con coma", () => {
          const resultado = formatearValorMoneda(123.45);
          expect(resultado).to.equal("123,45");
        });
      });

      context("When el valor es entero", () => {
        it("Then retorna el valor con dos decimales y coma", () => {
          const resultado = formatearValorMoneda(100);
          expect(resultado).to.equal("100,00");
        });
      });

      context("When el valor tiene muchos decimales", () => {
        it("Then retorna el valor redondeado a dos decimales", () => {
          const resultado = formatearValorMoneda(99.999);
          expect(resultado).to.equal("100,00");
        });
      });

      context("When el valor es cero", () => {
        it("Then retorna cero formateado", () => {
          const resultado = formatearValorMoneda(0);
          expect(resultado).to.equal("0,00");
        });
      });
    });
  });
});
