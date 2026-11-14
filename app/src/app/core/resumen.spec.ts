import { MEDIOS_PAGO } from './medios-pago';
import { VentaParaResumen, resumirVentas } from './resumen';

function venta(
  moneda: 'ARS' | 'USD',
  medio_pago: (typeof MEDIOS_PAGO)[number],
  total: number,
): VentaParaResumen {
  return { moneda, medio_pago, total };
}

describe('resumirVentas', () => {
  it('separa los totales por moneda y no los combina', () => {
    const resumen = resumirVentas(
      [venta('ARS', 'efectivo', 1000), venta('ARS', 'transferencia', 500.5), venta('USD', 'efectivo', 20)],
      MEDIOS_PAGO,
    );

    expect(resumen.cantidadVentas).toBe(3);
    expect(resumen.porMoneda.ARS).toEqual({ cantidad: 2, total: 1500.5 });
    expect(resumen.porMoneda.USD).toEqual({ cantidad: 1, total: 20 });
  });

  it('desglosa cantidad y total por medio de pago y moneda', () => {
    const resumen = resumirVentas(
      [venta('ARS', 'efectivo', 1000), venta('USD', 'efectivo', 20), venta('ARS', 'tarjeta de crédito', 300)],
      MEDIOS_PAGO,
    );

    const efectivo = resumen.porMedioPago.find((fila) => fila.medioPago === 'efectivo');
    expect(efectivo?.ARS).toEqual({ cantidad: 1, total: 1000 });
    expect(efectivo?.USD).toEqual({ cantidad: 1, total: 20 });

    const credito = resumen.porMedioPago.find((fila) => fila.medioPago === 'tarjeta de crédito');
    expect(credito?.ARS).toEqual({ cantidad: 1, total: 300 });
    expect(credito?.USD).toEqual({ cantidad: 0, total: 0 });

    expect(resumen.porMedioPago).toHaveLength(MEDIOS_PAGO.length);
  });

  it('devuelve un resumen en cero cuando no hay ventas', () => {
    const resumen = resumirVentas([], MEDIOS_PAGO);

    expect(resumen.cantidadVentas).toBe(0);
    expect(resumen.porMoneda.ARS).toEqual({ cantidad: 0, total: 0 });
    expect(resumen.porMoneda.USD).toEqual({ cantidad: 0, total: 0 });
  });
});
