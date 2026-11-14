import { calcularTotalPaginas } from './paginacion';

describe('calcularTotalPaginas', () => {
  it('redondea hacia arriba', () => {
    expect(calcularTotalPaginas(30, 25)).toBe(2);
    expect(calcularTotalPaginas(51, 50)).toBe(2);
    expect(calcularTotalPaginas(25, 25)).toBe(1);
  });

  it('siempre devuelve al menos una página', () => {
    expect(calcularTotalPaginas(0, 25)).toBe(1);
    expect(calcularTotalPaginas(10, 0)).toBe(1);
  });
});
