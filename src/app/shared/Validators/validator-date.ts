import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { DataYYYYMMDD, ddmmaaaatoaaaammdd } from '../classes/util';

export function ValidatorDate(
  required: boolean = false,
  otherDateControlName?: string,
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    // Campo obrigatório
    if (required && (!value || value.length === 0)) {
      return { ValidatorDate: true, message: 'Data Obrigatória' };
    }

    // Campo opcional vazio → válido
    if (!required && (!value || value.length === 0)) {
      return null;
    }

    // Validação da data atual
    let parsedDate: number;
    try {
      parsedDate = Date.parse(ddmmaaaatoaaaammdd(value) + ' 00:00:00 GMT-0300');
      if (isNaN(parsedDate)) {
        return { ValidatorDate: true, message: 'Data Inválida' };
      }

      const dt = new Date(parsedDate);
      if (ddmmaaaatoaaaammdd(value) !== DataYYYYMMDD(dt)) {
        return { ValidatorDate: true, message: 'Data Inválida' };
      }
    } catch {
      return { ValidatorDate: true, message: 'Data Inválida' };
    }

    // Se não há outra data para comparar, retorna válido
    if (!otherDateControlName) {
      return null;
    }

    // Busca o outro campo no form
    const parent = control.parent;
    if (!parent) return null;

    const otherControl = parent.get(otherDateControlName);
    if (!otherControl) return null;

    const otherValue = otherControl.value;

    // Se o outro campo está vazio, não compara
    if (!otherValue) return null;

    // Converte a outra data
    const parsedOther = Date.parse(
      ddmmaaaatoaaaammdd(otherValue) + ' 00:00:00 GMT-0300',
    );

    if (isNaN(parsedOther)) return null; // outro campo inválido → não validar aqui

    // Comparação cronológica
    if (parsedDate < parsedOther) {
      return {
        ValidatorDate: true,
        message: 'Datas cronologicamente erradas',
      };
    }

    return null;
  };
}
