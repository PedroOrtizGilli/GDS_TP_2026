import { Component, input, output } from '@angular/core';
import { formatoFecha, formatoMonto, subtotalLinea } from '../../../core/formato';
import { ItemVenta, Venta } from '../../../core/models/venta';

@Component({
  selector: 'app-venta-detail-modal',
  templateUrl: './venta-detail-modal.html',
  styleUrl: './venta-detail-modal.css',
})
export class VentaDetailModal {
  readonly venta = input<Venta | null>(null);
  readonly cerrar = output<void>();
  readonly editar = output<Venta>();

  protected readonly formatoFecha = formatoFecha;
  protected readonly formatoMonto = formatoMonto;

  protected subtotal(item: ItemVenta): number {
    return subtotalLinea(item);
  }
}
