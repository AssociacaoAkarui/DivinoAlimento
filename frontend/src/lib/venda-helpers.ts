export interface ProductoVenda {
  id: number;
  name: string;
  unit: string;
  factor: number;
  totalStock: number;
  reserved: number;
  available: number;
  suppliers: string[];
  offered: number;
}

export interface ResumenOferta {
  totalItems: number;
  valorEstimado: number;
}

export function actualizarCantidadOfrecida(
  producto: ProductoVenda,
  cambio: number,
): ProductoVenda {
  const nuevaCantidad = producto.offered + cambio;
  const cantidadFinal = Math.max(0, Math.min(producto.available, nuevaCantidad));

  return {
    ...producto,
    offered: cantidadFinal,
  };
}

export function calcularDisponible(totalStock: number, reserved: number): number {
  return Math.max(0, totalStock - reserved);
}

export function validarCantidadOfrecida(
  cantidadOfrecida: number,
  disponible: number,
): { valido: boolean; error?: string } {
  if (cantidadOfrecida < 0) {
    return { valido: false, error: "La cantidad no puede ser negativa" };
  }

  if (cantidadOfrecida > disponible) {
    return {
      valido: false,
      error: `La cantidad excede el disponible (${disponible})`,
    };
  }

  return { valido: true };
}

export function calcularTotalOfrecido(productos: ProductoVenda[]): number {
  return productos.reduce((sum, producto) => sum + producto.offered, 0);
}

export function calcularValorEstimado(
  productos: ProductoVenda[],
  precioPorKg: number = 7.5,
): number {
  return productos.reduce(
    (sum, producto) => sum + producto.offered * precioPorKg,
    0,
  );
}

export function obtenerResumenOferta(
  productos: ProductoVenda[],
  precioPorKg: number = 7.5,
): ResumenOferta {
  return {
    totalItems: calcularTotalOfrecido(productos),
    valorEstimado: calcularValorEstimado(productos, precioPorKg),
  };
}

export function filtrarProductosConOferta(
  productos: ProductoVenda[],
): ProductoVenda[] {
  return productos.filter((producto) => producto.offered > 0);
}

export function puedeIncrementarOferta(producto: ProductoVenda): boolean {
  return producto.offered < producto.available;
}

export function puedeDecrementarOferta(producto: ProductoVenda): boolean {
  return producto.offered > 0;
}

export function formatearValorMoneda(valor: number): string {
  return valor.toFixed(2).replace(".", ",");
}
