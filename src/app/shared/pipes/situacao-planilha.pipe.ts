import { Pipe, PipeTransform } from '@angular/core';
import { GlobalService } from '../../services/global.service';

@Pipe({
  name: 'situacao_planilha',
})
export class SituacaoPlanilhaPipe implements PipeTransform {
  constructor(private globalService: GlobalService) {}

  transform(value: string): string {
    return (
      this.globalService.getPlanilha_situacoesBySigla(value)?.descricao ?? ''
    );
  }
}
