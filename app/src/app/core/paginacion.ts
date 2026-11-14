export const TAMANOS_PAGINA = [10, 25, 50] as const;

export const TAMANO_PAGINA_POR_DEFECTO = 25;

export function calcularTotalPaginas(total: number, tamanoPagina: number): number {
  if (tamanoPagina <= 0) {
    return 1;
  }
  return Math.max(1, Math.ceil(total / tamanoPagina));
}
