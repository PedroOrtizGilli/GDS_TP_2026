import { inject, Injectable } from '@angular/core';
import { calcularTotal } from './formato';
import { DatosVenta, FiltrosVenta, Venta } from './models/venta';
import { SUPABASE_CLIENT } from './supabase.client';

export interface PaginaVentas {
  ventas: Venta[];
  total: number;
}

export type VentaParaResumen = Pick<Venta, 'moneda' | 'medio_pago' | 'total'>;

@Injectable({ providedIn: 'root' })
export class VentasService {
  private readonly supabase = inject(SUPABASE_CLIENT);

  /** Página del listado ordenada por fecha descendente, con el total de filas filtradas. */
  async listar(filtros: FiltrosVenta, pagina: number, tamanoPagina: number): Promise<PaginaVentas> {
    const desde = (pagina - 1) * tamanoPagina;

    let consulta = this.supabase.from('ventas').select('*', { count: 'exact' });
    if (filtros.fechaDesde) {
      consulta = consulta.gte('fecha', filtros.fechaDesde);
    }
    if (filtros.fechaHasta) {
      consulta = consulta.lte('fecha', filtros.fechaHasta);
    }
    if (filtros.cliente.trim()) {
      consulta = consulta.ilike('cliente', `%${filtros.cliente.trim()}%`);
    }
    if (filtros.medioPago) {
      consulta = consulta.eq('medio_pago', filtros.medioPago);
    }
    if (filtros.moneda) {
      consulta = consulta.eq('moneda', filtros.moneda);
    }

    const { data, count, error } = await consulta
      .order('fecha', { ascending: false })
      .order('creado_en', { ascending: false })
      .range(desde, desde + tamanoPagina - 1)
      .returns<Venta[]>();

    if (error) {
      throw error;
    }

    return { ventas: data ?? [], total: count ?? 0 };
  }

  /**
   * Todas las filas del período filtrado, sin paginar, para calcular el resumen.
   * No se puede usar la página visible porque el resumen abarca todo el período.
   */
  async listarParaResumen(filtros: FiltrosVenta): Promise<VentaParaResumen[]> {
    let consulta = this.supabase.from('ventas').select('moneda,medio_pago,total');
    if (filtros.fechaDesde) {
      consulta = consulta.gte('fecha', filtros.fechaDesde);
    }
    if (filtros.fechaHasta) {
      consulta = consulta.lte('fecha', filtros.fechaHasta);
    }
    if (filtros.cliente.trim()) {
      consulta = consulta.ilike('cliente', `%${filtros.cliente.trim()}%`);
    }
    if (filtros.medioPago) {
      consulta = consulta.eq('medio_pago', filtros.medioPago);
    }
    if (filtros.moneda) {
      consulta = consulta.eq('moneda', filtros.moneda);
    }

    const { data, error } = await consulta.returns<VentaParaResumen[]>();
    if (error) {
      throw error;
    }

    return data ?? [];
  }

  async obtener(id: string): Promise<Venta | null> {
    const { data, error } = await this.supabase
      .from('ventas')
      .select('*')
      .eq('id', id)
      .limit(1)
      .returns<Venta[]>();

    if (error) {
      throw error;
    }

    return data?.[0] ?? null;
  }

  async crear(datos: DatosVenta): Promise<Venta> {
    const ahora = new Date().toISOString();
    const fila = {
      ...datos,
      total: calcularTotal(datos.items),
      creado_en: ahora,
      actualizado_en: ahora,
    };

    const { data, error } = await this.supabase
      .from('ventas')
      .insert(fila)
      .select()
      .returns<Venta[]>();

    if (error) {
      throw error;
    }

    const creada = data?.[0];
    if (!creada) {
      throw new Error('No se pudo guardar la venta.');
    }

    return creada;
  }

  async actualizar(id: string, datos: DatosVenta): Promise<void> {
    const { error } = await this.supabase
      .from('ventas')
      .update({
        ...datos,
        total: calcularTotal(datos.items),
        actualizado_en: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      throw error;
    }
  }

  async eliminar(id: string): Promise<void> {
    const { error } = await this.supabase.from('ventas').delete().eq('id', id);

    if (error) {
      throw error;
    }
  }
}
