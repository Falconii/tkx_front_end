import { Pipe, PipeTransform } from '@angular/core';
import { EstadoService } from '../classes/EstadoService';
import { GlobalService } from '../../services/global.service';

@Pipe({
  name: 'situacao_evento',
})
export class SituacaoEventoPipe implements PipeTransform {
  constructor(private globalService: GlobalService) {}

  transform(value: string): string {
    return (
      this.globalService.getSituacoesEventoByCodigo(value)?.descricao ?? ''
    );
  }
}
