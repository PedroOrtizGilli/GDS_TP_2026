import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { debounceTime } from 'rxjs';
import {
  formatoFecha,
  formatoMonto,
  primerDiaDelMesISO,
  ultimoDiaDelMesISO,
} from '../../../core/formato';
import { MEDIOS_PAGO, MONEDAS } from '../../../core/medios-pago';
import { FiltrosVenta, MedioPago, Moneda, Venta } from '../../../core/models/venta';
import {
  calcularTotalPaginas,
  TAMANOS_PAGINA,
  TAMANO_PAGINA_POR_DEFECTO,
} from '../../../core/paginacion';
import { VentasService } from '../../../core/ventas.service';
import { ConfirmDialog } from '../../../shared/confirm-dialog/confirm-dialog';
import { ResumenVentas } from '../resumen-ventas/resumen-ventas';
import { VentaDetailModal } from '../venta-detail-modal/venta-detail-modal';

@Component({
  selector: 'app-venta-list',
  imports: [ReactiveFormsModule, RouterLink, ResumenVentas, VentaDetailModal, ConfirmDialog],
  templateUrl: './venta-list.html',
  styleUrl: './venta-list.css',
})
export class VentaList {
  private readonly ventasService = inject(VentasService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  protected readonly mediosPago = MEDIOS_PAGO;
  protected readonly monedas = MONEDAS;
  protected readonly tamanosPagina = TAMANOS_PAGINA;
  protected readonly formatoFecha = formatoFecha;
  protected readonly formatoMonto = formatoMonto;

  protected readonly formFiltros = this.fb.nonNullable.group({
    fechaDesde: [primerDiaDelMesISO()],
    fechaHasta: [ultimoDiaDelMesISO()],
    cliente: [''],
    medioPago: ['' as MedioPago | ''],
    moneda: ['' as Moneda | ''],
  });

  protected readonly filtros = signal<FiltrosVenta>(this.formFiltros.getRawValue());
  protected readonly pagina = signal(1);
  protected readonly tamanoPagina = signal<number>(TAMANO_PAGINA_POR_DEFECTO);
  protected readonly ventas = signal<Venta[]>([]);
  protected readonly total = signal(0);
  protected readonly cargando = signal(false);
  protected readonly error = signal('');
  protected readonly ventaDetalle = signal<Venta | null>(null);
  protected readonly ventaAEliminar = signal<Venta | null>(null);
  protected readonly refresco = signal(0);

  protected readonly totalPaginas = computed(() =>
    calcularTotalPaginas(this.total(), this.tamanoPagina()),
  );

  private solicitud = 0;

  constructor() {
    this.formFiltros.valueChanges
      .pipe(debounceTime(300), takeUntilDestroyed())
      .subscribe(() => {
        this.filtros.set(this.formFiltros.getRawValue());
        this.pagina.set(1);
        void this.cargar();
      });

    void this.cargar();
  }

  protected cambiarPagina(pagina: number): void {
    if (pagina < 1 || pagina > this.totalPaginas()) {
      return;
    }
    this.pagina.set(pagina);
    void this.cargar();
  }

  protected alCambiarTamano(evento: Event): void {
    const select = evento.target as HTMLSelectElement;
    const tamano = Number(select.value);
    if (!Number.isFinite(tamano) || tamano <= 0) {
      return;
    }
    this.tamanoPagina.set(tamano);
    this.pagina.set(1);
    void this.cargar();
  }

  protected limpiarFiltros(): void {
    this.formFiltros.reset({
      fechaDesde: primerDiaDelMesISO(),
      fechaHasta: ultimoDiaDelMesISO(),
      cliente: '',
      medioPago: '',
      moneda: '',
    });
  }

  protected verDetalle(venta: Venta): void {
    this.ventaDetalle.set(venta);
  }

  protected editarDesdeDetalle(venta: Venta): void {
    this.ventaDetalle.set(null);
    void this.router.navigate(['/ventas', venta.id, 'editar']);
  }

  protected pedirEliminar(venta: Venta): void {
    this.ventaAEliminar.set(venta);
  }

  protected async confirmarEliminar(): Promise<void> {
    const venta = this.ventaAEliminar();
    if (!venta) {
      return;
    }

    try {
      await this.ventasService.eliminar(venta.id);
      this.ventaAEliminar.set(null);
      if (this.ventas().length === 1 && this.pagina() > 1) {
        this.pagina.set(this.pagina() - 1);
      }
      this.refresco.update((valor) => valor + 1);
      await this.cargar();
    } catch {
      this.ventaAEliminar.set(null);
      this.error.set('No se pudo eliminar la venta. Intentá de nuevo.');
    }
  }

  private async cargar(): Promise<void> {
    const solicitud = ++this.solicitud;
    this.cargando.set(true);
    this.error.set('');

    try {
      const resultado = await this.ventasService.listar(
        this.filtros(),
        this.pagina(),
        this.tamanoPagina(),
      );
      if (solicitud !== this.solicitud) {
        return;
      }
      this.ventas.set(resultado.ventas);
      this.total.set(resultado.total);
    } catch {
      if (solicitud !== this.solicitud) {
        return;
      }
      this.error.set('No se pudieron cargar las ventas. Revisá la conexión e intentá de nuevo.');
      this.ventas.set([]);
      this.total.set(0);
    } finally {
      if (solicitud === this.solicitud) {
        this.cargando.set(false);
      }
    }
  }
}
