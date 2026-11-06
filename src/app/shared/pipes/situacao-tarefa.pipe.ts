import { Pipe, PipeTransform } from '@angular/core';
import { TarefaSituacoes } from '../../models/tarefa-model';

@Pipe({
  name: 'situacao_tarefa',
})
export class SituacaoTarefaPipe implements PipeTransform {
  transform(value: string): string {
    return TarefaSituacoes.find((s) => s.sigla === value)?.descricao ?? '';
  }
}
