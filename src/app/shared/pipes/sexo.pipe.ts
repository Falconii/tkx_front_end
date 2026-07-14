import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'SexoPipe',
})
export class SexoPipe implements PipeTransform {
  transform(value: string): string {
    if (value == "") return "";
    let retorno = "";
    if (value == 'M') retorno = 'Masculino';
    else if (value == "F") {
            retorno = 'Feminino';}
          else {
            retorno = "Não Informar"
          }
    return retorno;
  }
}
