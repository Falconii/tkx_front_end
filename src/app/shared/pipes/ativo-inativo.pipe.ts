import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'SituacaoUsuario',
})
export class SituacaoUsuarioPipe implements PipeTransform {
  transform(value: string): string {
    if (value == '') return '';
    let retorno = 'Inativo';
    if (value == 'S') retorno = 'Ativo';
    else retorno = 'Inativo';
    return retorno;
  }
}
