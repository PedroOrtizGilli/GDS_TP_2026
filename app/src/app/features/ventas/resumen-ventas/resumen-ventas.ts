import { Component, effect, inject, input, signal } from '@angular/core';
import { formatoMonto } from '../../../core/formato';
import { MEDIOS_PAGO } from '../../../core/medios-pago';
import { FiltrosVenta } from '../../../core/models/venta';
import { ResumenPeriodo, resumirVentas } from '../../../core/resumen';
import { VentasService } from '../../../core/ventas.service';

@Component({
  selector: 'app-resumen-ventas',
  templateUrl: './resumen-ventas.html',
  styleUrl: './resumen-ventas.css',
})
export class ResumenVentas {
  readonly filtros = input.required<FiltrosVenta>();
  /** Cambia cuando se elimina una venta, para forzar el recálculo. */
  readonly refresco = input(0);

  private readonly ventasService = inject(VentasService);

  protected readonly resumen = signal<ResumenPeriodo | null>(null);
  protected readonly cargando = signal(false);
  protected readonly error = signal('');
  protected readonly formatoMonto = formatoMonto;

  private solicitud = 0;

  constructor() {
    effect(() => {
      const filtros = this.filtros();
      void this.refresco();
      void this.cargar(filtros);
    });
  }

  private async cargar(filtros: FiltrosVenta): Promise<void> {
    const solicitud = ++this.solicitud;
    this.cargando.set(true);
    this.error.set('');

    try {
      const ventas = await this.ventasService.listarParaResumen(filtros);
      if (solicitud !== this.solicitud) {
        return;
      }
      this.resumen.set(resumirVentas(ventas, MEDIOS_PAGO));
    } catch {
      if (solicitud !== this.solicitud) {
        return;
      }
      this.error.set('No se pudo calcular el resumen del período.');
      this.resumen.set(null);
    } finally {
      if (solicitud === this.solicitud) {
        this.cargando.set(false);
      }
    }
  }
}
