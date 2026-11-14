export type Moneda = 'ARS' | 'USD';

export type MedioPago =
  | 'efectivo'
  | 'transferencia'
  | 'tarjeta de débito'
  | 'tarjeta de crédito';

export interface ItemVenta {
  producto: string;
  cantidad: number;
  precioUnitario: number;
}

/** Fila de la tabla `ventas` de Supabase. Los nombres respetan el snake_case del esquema. */
export interface Venta {
  id: string;
  fecha: string;
  cliente: string;
  medio_pago: MedioPago;
  moneda: Moneda;
  descripcion: string | null;
  items: ItemVenta[];
  total: number;
  creado_en: string;
  actualizado_en: string;
}

/** Datos que carga la app; el id, el total y las fechas de auditoría los completa la aplicación. */
export interface DatosVenta {
  fecha: string;
  cliente: string;
  medio_pago: MedioPago;
  moneda: Moneda;
  descripcion: string | null;
  items: ItemVenta[];
}

export interface FiltrosVenta {
  fechaDesde: string;
  fechaHasta: string;
  cliente: string;
  medioPago: MedioPago | '';
  moneda: Moneda | '';
}
