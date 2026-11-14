import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Acepta únicamente números finitos mayores a 0 (la cantidad de una línea). */
export const mayorACero: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const valor = Number(control.value);
  return Number.isFinite(valor) && valor > 0 ? null : { mayorACero: true };
};

/** Rechaza cadenas vacías o formadas solo por espacios. */
export const noVacio: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const valor = control.value;
  return typeof valor === 'string' && valor.trim().length > 0 ? null : { noVacio: true };
};
