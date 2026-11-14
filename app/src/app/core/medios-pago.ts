import { MedioPago, Moneda } from './models/venta';

export const MEDIOS_PAGO: readonly MedioPago[] = [
  'efectivo',
  'transferencia',
  'tarjeta de débito',
  'tarjeta de crédito',
];

export const MONEDAS: readonly Moneda[] = ['ARS', 'USD'];
