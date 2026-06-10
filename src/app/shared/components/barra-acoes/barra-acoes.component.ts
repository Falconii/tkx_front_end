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
  @Input('KIT') kit: boolean = false;
  @Input('PROCESSAR') processar: boolean = false;
  @Input('BARRA_VERTICAL') barra: boolean = false;
  @Input('BARRA_EXCLUIR') barra_excluir: boolean = false;
  @Input('BARRA_LIBERAR') barra_liberar: boolean = false;
  @Input('BARRA_ATIVAR') barra_ativar: boolean = false;
  @Input('BARRA_ENCERRAR') barra_encerrar: boolean = false;
  @Input('BARRA_ZERAR_SENHA') barra_zerar_senha: boolean = false;
  @Input('BARRA_ATIVO_INATIVO') barra_ativo_inativo: boolean = false;
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
