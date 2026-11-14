import { redondear } from './formato';
import { MedioPago, Moneda, Venta } from './models/venta';

export interface Totales {
  cantidad: number;
  total: number;
}

export interface TotalesPorMedioPago {
  medioPago: MedioPago;
  ARS: Totales;
  USD: Totales;
}

export interface ResumenPeriodo {
  cantidadVentas: number;
  porMoneda: Record<Moneda, Totales>;
  porMedioPago: TotalesPorMedioPago[];
}

export type VentaParaResumen = Pick<Venta, 'moneda' | 'medio_pago' | 'total'>;

function totalesVacios(): Totales {
  return { cantidad: 0, total: 0 };
}

/**
 * Agrupa las ventas del período filtrado. ARS y USD siempre se acumulan por
 * separado: la app no convierte entre monedas.
 */
export function resumirVentas(
  ventas: readonly VentaParaResumen[],
  mediosPago: readonly MedioPago[],
): ResumenPeriodo {
  const porMoneda: Record<Moneda, Totales> = {
    ARS: totalesVacios(),
    USD: totalesVacios(),
  };

  const porMedio = new Map<MedioPago, TotalesPorMedioPago>();
  for (const medioPago of mediosPago) {
    porMedio.set(medioPago, { medioPago, ARS: totalesVacios(), USD: totalesVacios() });
  }

  for (const venta of ventas) {
    const total = Number(venta.total) || 0;

    porMoneda[venta.moneda].cantidad += 1;
    porMoneda[venta.moneda].total = redondear(porMoneda[venta.moneda].total + total);

    const fila = porMedio.get(venta.medio_pago);
    if (fila) {
      fila[venta.moneda].cantidad += 1;
      fila[venta.moneda].total = redondear(fila[venta.moneda].total + total);
    }
  }

  return {
    cantidadVentas: ventas.length,
    porMoneda,
    porMedioPago: [...porMedio.values()],
  };
}
