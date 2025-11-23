import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MensagensBotoes } from '../../classes/util';
import { CadastroAcoes } from '../../classes/cadastro-acoes';

@Component({
  selector: 'barra-acoes',
  templateUrl: './barra-acoes.component.html',
  styleUrls: ['./barra-acoes.component.css'],
})
export class BarraAcoesComponent implements OnInit {

  @Input('CONSULTAR') consulta: boolean = true;
  @Input('ALTERAR') alterar: boolean = true;
  @Input('EXCLUIR') excluir: boolean = true;
  @Input('BARRA_VERTICAL') barra: boolean = false;
  @Input('BARRA_EXCLUIR') barra_excluir: boolean = true;
  @Output('changeOpcao') changeOpcao = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {}

  getTexto() {
    return MensagensBotoes;
  }

  getAcoes() {
    return CadastroAcoes;
  }

  onChangeOpcao(op: number) {
    this.changeOpcao.emit(op);
  }
}
