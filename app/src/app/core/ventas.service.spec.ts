import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { DatosVenta, FiltrosVenta, Venta } from './models/venta';
import { SUPABASE_CLIENT } from './supabase.client';
import { VentasService } from './ventas.service';

interface ResultadoConsulta {
  data: unknown;
  count: number | null;
  error: unknown;
}

class ConsultaFalsa implements PromiseLike<ResultadoConsulta> {
  readonly llamadas: Array<{ metodo: string; args: unknown[] }> = [];

  constructor(private readonly resultado: ResultadoConsulta) {}

  private registrar(metodo: string, args: unknown[]): this {
    this.llamadas.push({ metodo, args });
    return this;
  }

  select(...args: unknown[]): this {
    return this.registrar('select', args);
  }
  order(...args: unknown[]): this {
    return this.registrar('order', args);
  }
  range(...args: unknown[]): this {
    return this.registrar('range', args);
  }
  gte(...args: unknown[]): this {
    return this.registrar('gte', args);
  }
  lte(...args: unknown[]): this {
    return this.registrar('lte', args);
  }
  ilike(...args: unknown[]): this {
    return this.registrar('ilike', args);
  }
  eq(...args: unknown[]): this {
    return this.registrar('eq', args);
  }
  limit(...args: unknown[]): this {
    return this.registrar('limit', args);
  }
  insert(...args: unknown[]): this {
    return this.registrar('insert', args);
  }
  update(...args: unknown[]): this {
    return this.registrar('update', args);
  }
  delete(...args: unknown[]): this {
    return this.registrar('delete', args);
  }

  returns(): Promise<ResultadoConsulta> {
    return Promise.resolve(this.resultado);
  }

  then<TResult1 = ResultadoConsulta, TResult2 = never>(
    onfulfilled?: ((value: ResultadoConsulta) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ): Promise<TResult1 | TResult2> {
    return Promise.resolve(this.resultado).then(onfulfilled, onrejected);
  }
}

function configurar(resultado: Partial<ResultadoConsulta> = {}) {
  const consulta = new ConsultaFalsa({
    data: resultado.data ?? [],
    count: resultado.count ?? null,
    error: resultado.error ?? null,
  });
  const cliente = { from: vi.fn(() => consulta) };

  TestBed.configureTestingModule({
    providers: [{ provide: SUPABASE_CLIENT, useValue: cliente }],
  });

  return { servicio: TestBed.inject(VentasService), consulta, cliente };
}

function argumentos(consulta: ConsultaFalsa, metodo: string): unknown[][] {
  return consulta.llamadas.filter((llamada) => llamada.metodo === metodo).map((llamada) => llamada.args);
}

const filtros: FiltrosVenta = {
  fechaDesde: '2026-11-01',
  fechaHasta: '2026-11-30',
  cliente: 'acme',
  medioPago: 'efectivo',
  moneda: 'ARS',
};

const datos: DatosVenta = {
  fecha: '2026-11-14',
  cliente: 'Acme',
  medio_pago: 'efectivo',
  moneda: 'ARS',
  descripcion: null,
  items: [
    { producto: 'A', cantidad: 3, precioUnitario: 1500.5 },
    { producto: 'B', cantidad: 2, precioUnitario: 100 },
  ],
};

describe('VentasService', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('lista con filtros, orden y paginación', async () => {
    const { servicio, consulta } = configurar({ data: [], count: 31 });

    const pagina = await servicio.listar(filtros, 2, 25);

    expect(pagina).toEqual({ ventas: [], total: 31 });
    expect(consulta.llamadas[0]).toEqual({ metodo: 'select', args: ['*', { count: 'exact' }] });
    expect(argumentos(consulta, 'gte')).toContainEqual(['fecha', '2026-11-01']);
    expect(argumentos(consulta, 'lte')).toContainEqual(['fecha', '2026-11-30']);
    expect(argumentos(consulta, 'ilike')).toEqual([['cliente', '%acme%']]);
    expect(argumentos(consulta, 'eq')).toEqual([
      ['medio_pago', 'efectivo'],
      ['moneda', 'ARS'],
    ]);
    expect(argumentos(consulta, 'order')).toEqual([
      ['fecha', { ascending: false }],
      ['creado_en', { ascending: false }],
    ]);
    expect(argumentos(consulta, 'range')).toEqual([[25, 49]]);
  });

  it('trae todas las filas del período para el resumen, sin paginar', async () => {
    const { servicio, consulta } = configurar({
      data: [{ moneda: 'ARS', medio_pago: 'efectivo', total: 100 }],
    });

    const filas = await servicio.listarParaResumen(filtros);

    expect(filas).toHaveLength(1);
    expect(argumentos(consulta, 'select')).toEqual([['moneda,medio_pago,total']]);
    expect(argumentos(consulta, 'range')).toEqual([]);
  });

  it('crea la venta con total calculado y fechas de auditoría', async () => {
    const creada = { id: '1', ...datos, total: 4701.5 } as Venta;
    const { servicio, consulta } = configurar({ data: [creada] });

    const resultado = await servicio.crear(datos);

    expect(resultado).toBe(creada);
    const insertado = argumentos(consulta, 'insert')[0][0] as Record<string, unknown>;
    expect(insertado['total']).toBe(4701.5);
    expect(insertado['cliente']).toBe('Acme');
    expect(typeof insertado['creado_en']).toBe('string');
    expect(insertado['creado_en']).toBe(insertado['actualizado_en']);
  });

  it('actualiza la venta y recalcula el total', async () => {
    const { servicio, consulta } = configurar();

    await servicio.actualizar('abc', datos);

    const actualizado = argumentos(consulta, 'update')[0][0] as Record<string, unknown>;
    expect(actualizado['total']).toBe(4701.5);
    expect(typeof actualizado['actualizado_en']).toBe('string');
    expect(argumentos(consulta, 'eq')).toEqual([['id', 'abc']]);
  });

  it('elimina por id', async () => {
    const { servicio, consulta } = configurar();

    await servicio.eliminar('abc');

    expect(argumentos(consulta, 'delete')).toHaveLength(1);
    expect(argumentos(consulta, 'eq')).toEqual([['id', 'abc']]);
  });

  it('obtiene una venta o null si no existe', async () => {
    const venta = { id: 'abc', ...datos, total: 4701.5 } as Venta;
    const { servicio } = configurar({ data: [venta] });
    expect(await servicio.obtener('abc')).toBe(venta);

    TestBed.resetTestingModule();
    const vacio = configurar({ data: [] });
    expect(await vacio.servicio.obtener('abc')).toBeNull();
  });

  it('propaga el error de Supabase', async () => {
    const { servicio } = configurar({ error: new Error('sin conexión') });

    await expect(servicio.listar(filtros, 1, 25)).rejects.toThrow('sin conexión');
  });
});
