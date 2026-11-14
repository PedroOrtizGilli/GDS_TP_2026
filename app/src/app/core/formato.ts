import { ItemVenta } from './models/venta';

const formateadorNumero = new Intl.NumberFormat('es-AR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function redondear(valor: number): number {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}

/** Monto con dos decimales y coma decimal, por ejemplo 4.501,50. */
export function formatoMonto(valor: number): string {
  return formateadorNumero.format(redondear(Number(valor) || 0));
}

/** Fecha ISO (YYYY-MM-DD) a dd/mm/aaaa, sin corrimientos de zona horaria. */
export function formatoFecha(fecha: string): string {
  if (!fecha) {
    return '';
  }
  const [anio, mes, dia] = fecha.split('-');
  return `${dia}/${mes}/${anio}`;
}

export function fechaISO(fecha: Date): string {
  const anio = fecha.getFullYear();
  const mes = `${fecha.getMonth() + 1}`.padStart(2, '0');
  const dia = `${fecha.getDate()}`.padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

export function hoyISO(): string {
  return fechaISO(new Date());
}

export function primerDiaDelMesISO(referencia = new Date()): string {
  return fechaISO(new Date(referencia.getFullYear(), referencia.getMonth(), 1));
}

export function ultimoDiaDelMesISO(referencia = new Date()): string {
  return fechaISO(new Date(referencia.getFullYear(), referencia.getMonth() + 1, 0));
}

export function subtotalLinea(item: ItemVenta): number {
  return redondear((Number(item.cantidad) || 0) * (Number(item.precioUnitario) || 0));
}

export function calcularTotal(items: readonly ItemVenta[]): number {
  return redondear(items.reduce((acumulado, item) => acumulado + subtotalLinea(item), 0));
}
