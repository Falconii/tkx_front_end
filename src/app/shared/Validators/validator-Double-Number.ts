import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ValidatorDoubleNumber(required: boolean = false): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let valor = control.value;

    let retorno: number = 0;

    if (!required && valor == null) {
      return null;
    }

    retorno = parseFloat(valor);

    if (isNaN(valor))
      return { ValidatorDoubleNumber: true, message: 'Valor Inválido!' };

    return null;
  };
}
