import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'ventas' },
  {
    path: 'ventas',
    loadComponent: () =>
      import('./features/ventas/venta-list/venta-list').then((m) => m.VentaList),
  },
  {
    path: 'ventas/nueva',
    loadComponent: () =>
      import('./features/ventas/venta-form/venta-form').then((m) => m.VentaForm),
  },
  {
    path: 'ventas/:id/editar',
    loadComponent: () =>
      import('./features/ventas/venta-form/venta-form').then((m) => m.VentaForm),
  },
  { path: '**', redirectTo: 'ventas' },
];
