import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function ValidadorInterger(required: boolean = false): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    // Se não é required e está vazio → válido
    if (!required && (value === null || value === undefined || value === '')) {
      return null;
    }

    // Se é required e está vazio → inválido
    if (required && (value === null || value === undefined || value === '')) {
      return { integerValidator: true, message: 'Dado obrigatório' };
    }

    // Converter para número
    const num = Number(value);

    // Verifica se é número inteiro
    if (!Number.isInteger(num)) {
      return {
        integerValidator: true,
        message: 'Informe um número inteiro válido',
      };
    }

    // Se required e número é 0 → inválido
    if (required && num === 0) {
      return { integerValidator: true, message: 'Valor não pode ser zero' };
    }

    return null;
  };
}
