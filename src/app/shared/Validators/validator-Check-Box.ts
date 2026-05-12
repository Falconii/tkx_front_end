import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ValidatorCheckBox(
  tamMin: number,
  tamMax: number,
  required: boolean = false,
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    let message = '';

    let valido = true;

    let value = control.value;

    value = value == null ? '' : String(value);

    value = value == '0' ? '' : value;

    if (!required && value == null) {
      return null;
    }

    if (required && value == null) {
      return { ValidatorCheckBox: true, message: 'Dado Obrigatório' };
    }

    if (required && value.length == 0) {
      return { ValidatorCheckBox: true, message: 'Dado Obrigatório' };
    }

    if (!required && value.length == 0) {
      console.log('Saiu por estar vazio', value.length);
      return { ValidatorCheckBox: true, message: 'Dado Obrigatório' };
    }

    if (tamMin > 0 && value.length < tamMin) {
      message = `Campo Obrigatório`;

      valido = false;
    }

    if (tamMax > 0 && value.length > tamMax) {
      message = `Tamanho Máximo ${tamMax} Caracteres.`;

      valido = false;
    }

    return !valido ? { ValidatorCheckBox: true, message: message } : null;
  };
}
