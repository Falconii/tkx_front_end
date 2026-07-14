import { Pipe, PipeTransform } from '@angular/core';
import { GlobalService } from '../../services/global.service';

@Pipe({
  name: 'situacao_det_planilha',
})
export class SituacaoDetPlanilhaPipe implements PipeTransform {
  constructor(private globalService: GlobalService) {}

  transform(value: number): string {
    return (
      this.globalService.getDetalhe_situacoesBySigla(value.toString())?.descricao ?? ''
    );
  }
}
