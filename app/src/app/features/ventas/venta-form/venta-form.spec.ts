import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { VentasService } from '../../../core/ventas.service';
import { VentaForm } from './venta-form';

const crear = vi.fn();
const actualizar = vi.fn();
const obtener = vi.fn();

const servicioFalso = { crear, actualizar, obtener };

function crearComponente() {
  const fixture = TestBed.createComponent(VentaForm);
  fixture.detectChanges();
  return { fixture, componente: fixture.componentInstance };
}

describe('VentaForm', () => {
  beforeEach(async () => {
    crear.mockReset();
    actualizar.mockReset();
    obtener.mockReset();

    await TestBed.configureTestingModule({
      imports: [VentaForm],
      providers: [
        provideRouter([{ path: 'ventas', children: [] }]),
        { provide: VentasService, useValue: servicioFalso },
      ],
    }).compileComponents();
  });

  it('arranca inválido hasta completar cliente y producto', () => {
    const { componente } = crearComponente();

    expect(componente.form.valid).toBe(false);

    componente.form.patchValue({ cliente: 'Acme' });
    componente.lineas.at(0).patchValue({ producto: 'Producto', cantidad: 1, precioUnitario: 0 });

    expect(componente.form.valid).toBe(true);
  });

  it('exige cantidad mayor a 0 y precio no negativo', () => {
    const { componente } = crearComponente();

    componente.form.patchValue({ cliente: 'Acme' });
    componente.lineas.at(0).patchValue({ producto: 'Producto', cantidad: 0, precioUnitario: -1 });

    expect(componente.lineas.at(0).get('cantidad')?.hasError('mayorACero')).toBe(true);
    expect(componente.lineas.at(0).get('precioUnitario')?.hasError('min')).toBe(true);
    expect(componente.form.valid).toBe(false);
  });

  it('calcula subtotales y total en vivo', () => {
    const { componente } = crearComponente();

    componente.lineas.at(0).patchValue({ cantidad: 3, precioUnitario: 1500.5 });
    expect(componente.subtotal(0)).toBe(4501.5);

    componente.agregarLinea();
    componente.lineas.at(1).patchValue({ producto: 'B', cantidad: 2, precioUnitario: 100 });
    expect(componente.subtotal(1)).toBe(200);
    expect(componente.total()).toBe(4701.5);
  });

  it('agrega líneas y no permite quedarse sin ninguna', () => {
    const { componente } = crearComponente();

    expect(componente.lineas.length).toBe(1);
    componente.agregarLinea();
    expect(componente.lineas.length).toBe(2);

    componente.quitarLinea(1);
    expect(componente.lineas.length).toBe(1);

    componente.quitarLinea(0);
    expect(componente.lineas.length).toBe(1);
  });

  it('no guarda si el formulario es inválido y marca los campos', async () => {
    const { componente } = crearComponente();

    await componente.guardar();

    expect(crear).not.toHaveBeenCalled();
    expect(componente.form.controls.cliente.touched).toBe(true);
    expect(componente.error()).toContain('Revisá los campos');
  });

  it('guarda la venta con los datos normalizados y vuelve al listado', async () => {
    const router = TestBed.inject(Router);
    const navegar = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    const { componente } = crearComponente();
    componente.form.patchValue({
      fecha: '2026-11-14',
      cliente: '  Acme  ',
      medio_pago: 'transferencia',
      moneda: 'USD',
      descripcion: '  ',
    });
    componente.lineas.at(0).patchValue({
      producto: '  Producto  ',
      cantidad: 3,
      precioUnitario: 1500.5,
    });

    await componente.guardar();

    expect(crear).toHaveBeenCalledTimes(1);
    expect(crear).toHaveBeenCalledWith({
      fecha: '2026-11-14',
      cliente: 'Acme',
      medio_pago: 'transferencia',
      moneda: 'USD',
      descripcion: null,
      items: [{ producto: 'Producto', cantidad: 3, precioUnitario: 1500.5 }],
    });
    expect(navegar).toHaveBeenCalledWith(['/ventas']);
  });
});
