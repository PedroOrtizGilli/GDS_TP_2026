import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  calcularTotal,
  formatoMonto,
  hoyISO,
  subtotalLinea,
} from '../../../core/formato';
import { MEDIOS_PAGO, MONEDAS } from '../../../core/medios-pago';
import { DatosVenta, ItemVenta, MedioPago, Moneda } from '../../../core/models/venta';
import { mayorACero, noVacio } from '../../../core/validadores';
import { VentasService } from '../../../core/ventas.service';

@Component({
  selector: 'app-venta-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './venta-form.html',
  styleUrl: './venta-form.css',
})
export class VentaForm implements OnInit {
  /** Lo completa el router con el parámetro :id de la ruta de edición. */
  readonly id = input<string>();

  private readonly fb = inject(FormBuilder);
  private readonly ventasService = inject(VentasService);
  private readonly router = inject(Router);

  protected readonly mediosPago = MEDIOS_PAGO;
  protected readonly monedas = MONEDAS;
  protected readonly formatoMonto = formatoMonto;
  protected readonly esEdicion = computed(() => Boolean(this.id()));
  protected readonly cargando = signal(false);
  protected readonly guardando = signal(false);
  readonly error = signal('');

  readonly form = this.fb.nonNullable.group({
    fecha: [hoyISO(), Validators.required],
    cliente: ['', [Validators.required, noVacio]],
    medio_pago: ['efectivo' as MedioPago, Validators.required],
    moneda: ['ARS' as Moneda, Validators.required],
    descripcion: [''],
    items: this.fb.array([this.crearLinea()], Validators.minLength(1)),
  });

  readonly lineas = this.form.controls.items;
  readonly valores = signal(this.form.getRawValue());
  readonly total = computed(() => calcularTotal(this.valores().items));

  constructor() {
    this.form.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.valores.set(this.form.getRawValue()));
  }

  async ngOnInit(): Promise<void> {
    const id = this.id();
    if (!id) {
      return;
    }

    this.cargando.set(true);
    try {
      const venta = await this.ventasService.obtener(id);
      if (!venta) {
        this.error.set('No se encontró la venta que querés editar.');
        return;
      }

      this.form.patchValue({
        fecha: venta.fecha,
        cliente: venta.cliente,
        medio_pago: venta.medio_pago,
        moneda: venta.moneda,
        descripcion: venta.descripcion ?? '',
      });

      this.lineas.clear();
      for (const item of venta.items) {
        this.lineas.push(this.crearLinea(item));
      }
      this.valores.set(this.form.getRawValue());
    } catch {
      this.error.set('No se pudo cargar la venta. Intentá de nuevo.');
    } finally {
      this.cargando.set(false);
    }
  }

  agregarLinea(): void {
    this.lineas.push(this.crearLinea());
  }

  quitarLinea(indice: number): void {
    if (this.lineas.length <= 1) {
      return;
    }
    this.lineas.removeAt(indice);
  }

  subtotal(indice: number): number {
    const item = this.valores().items[indice];
    return item ? subtotalLinea(item) : 0;
  }

  protected campoInvalido(campo: 'fecha' | 'cliente' | 'medio_pago' | 'moneda'): boolean {
    const control = this.form.controls[campo];
    return control.invalid && control.touched;
  }

  async guardar(): Promise<void> {
    this.error.set('');

    if (this.form.invalid || this.lineas.length === 0) {
      this.form.markAllAsTouched();
      this.error.set('Revisá los campos marcados antes de guardar.');
      return;
    }

    const valores = this.form.getRawValue();
    const datos: DatosVenta = {
      fecha: valores.fecha,
      cliente: valores.cliente.trim(),
      medio_pago: valores.medio_pago,
      moneda: valores.moneda,
      descripcion: valores.descripcion.trim() || null,
      items: valores.items.map((item) => ({
        producto: item.producto.trim(),
        cantidad: Number(item.cantidad),
        precioUnitario: Number(item.precioUnitario),
      })),
    };

    this.guardando.set(true);
    try {
      const id = this.id();
      if (id) {
        await this.ventasService.actualizar(id, datos);
      } else {
        await this.ventasService.crear(datos);
      }
      await this.router.navigate(['/ventas']);
    } catch {
      this.error.set('No se pudo guardar la venta. Intentá de nuevo.');
    } finally {
      this.guardando.set(false);
    }
  }

  private crearLinea(item?: ItemVenta) {
    return this.fb.nonNullable.group({
      producto: [item?.producto ?? '', [Validators.required, noVacio]],
      cantidad: [item?.cantidad ?? 1, [Validators.required, mayorACero]],
      precioUnitario: [item?.precioUnitario ?? 0, [Validators.required, Validators.min(0)]],
    });
  }
}
