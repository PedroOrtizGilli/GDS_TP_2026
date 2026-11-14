import {
  calcularTotal,
  formatoFecha,
  formatoMonto,
  primerDiaDelMesISO,
  redondear,
  ultimoDiaDelMesISO,
} from './formato';

describe('formato', () => {
  it('formatea montos con dos decimales y coma decimal (es-AR)', () => {
    expect(formatoMonto(4501.5)).toBe('4.501,50');
    expect(formatoMonto(0)).toBe('0,00');
    expect(formatoMonto(1234567.891)).toBe('1.234.567,89');
  });

  it('formatea fechas ISO como dd/mm/aaaa', () => {
    expect(formatoFecha('2026-11-14')).toBe('14/11/2026');
    expect(formatoFecha('')).toBe('');
  });

  it('calcula el rango del mes en curso con el último día real', () => {
    const febrero2024 = new Date(2024, 1, 10);
    expect(primerDiaDelMesISO(febrero2024)).toBe('2024-02-01');
    expect(ultimoDiaDelMesISO(febrero2024)).toBe('2024-02-29');

    const febrero2026 = new Date(2026, 1, 10);
    expect(ultimoDiaDelMesISO(febrero2026)).toBe('2026-02-28');
  });

  it('redondea a dos decimales', () => {
    expect(redondear(0.1 + 0.2)).toBe(0.3);
    expect(redondear(10.005)).toBe(10.01);
  });

  it('suma los subtotales de las líneas', () => {
    expect(
      calcularTotal([
        { producto: 'A', cantidad: 3, precioUnitario: 1500.5 },
        { producto: 'B', cantidad: 2, precioUnitario: 100 },
      ]),
    ).toBe(4701.5);
    expect(calcularTotal([])).toBe(0);
  });
});
