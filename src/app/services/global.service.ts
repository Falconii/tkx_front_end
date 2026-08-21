import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioModel } from '../models/usuario-model';
import { EmpresaModel } from '../models/empresa-model';
import { UsuarioService } from './usuario.service';
import { SimNao } from '../shared/classes/sim-nao';
import { EventoModel } from '../models/evento-model';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  usuario: UsuarioModel;
  empresa: EmpresaModel;
  evento: EventoModel = new EventoModel();
  evento_situacoes: SimNao[] = [];
  planilha_situacoes: SimNao[] = [];
  detalhe_situacoes:SimNao[] = [];
  lsSexos: SimNao[] = [];
  logado: boolean = false;
  showSpin: boolean = false;

  shomMenuEmitter = new EventEmitter<boolean>();

  showEmpresaEmitter = new EventEmitter<boolean>();
  showUsuarioEmitter = new EventEmitter();
  isMobileEmitter = new EventEmitter<boolean>();

  onSubmit = new EventEmitter<boolean>();

  changePassWordEmitter = new EventEmitter<boolean>();

  private showSpinSubject = new BehaviorSubject<boolean>(false);

  // Observable público para os componentes assinarem
  showSpin$ = this.showSpinSubject.asObservable();

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
  ) {
    this.usuario = new UsuarioModel();
    this.logado = false;
    this.empresa = new EmpresaModel();
    this.empresa.id = 1;
    this.logado = false;
    this.evento_situacoes = [
      new SimNao('0', 'Aguardando Liberação'),
      new SimNao('1', 'Aguardando Importação'),
      new SimNao('2', 'StandBy'),
      new SimNao('3', 'Ativo'),
      new SimNao('4', 'Encerrado'),
    ];
    this.planilha_situacoes = [
      new SimNao('1', 'Importada'),
      new SimNao('2', 'Processada'),
      new SimNao('9', 'Processamento Não Finalizada')
    ];
    this.detalhe_situacoes = [
      new SimNao('0', 'Importado'),
      new SimNao("2","Processado"),
      new SimNao('3', 'Erro Na Planilha CVS'),
      new SimNao('9', 'Erro De Informação'),
    ];
    this.lsSexos = [
      { sigla: 'M', descricao: 'MASCULINO' },
      { sigla: 'F', descricao: 'FEMININO' },
      { sigla: 'O', descricao: 'OUTROS' },
    ];

    this.evento.id_empresa = 1;
    this.evento.id = 6;
    this.evento.descricao = 'ESPORTE E MOVIMENTO';
    this.evento.status = '1';
  }

  //setMobile(value: boolean) {
  //  this.isMobileEmitter.emit(value);
  // }

  getEmpresa(): EmpresaModel {
    return this.empresa;
  }

  setEmpresa(emp: EmpresaModel) {
    this.empresa = emp;
  }

  getUsuario(): UsuarioModel {
    return this.usuario;
  }

  setUsuario(user: UsuarioModel) {
    this.usuario = user;
  }

  getEvento(): EventoModel {
    return this.evento;
  }

  setTrocaUsuario() {
    this.showUsuarioEmitter.emit();
  }

  setLogado(value: boolean) {
    this.shomMenuEmitter.emit(value);
    this.logado = value;
    this.router.navigate(['/']);
  }

  getLogado(): boolean {
    if (this.usuario.id == 0) {
      return false;
    } else {
      return true;
    }
  }

  setSpin(value: boolean) {
    Promise.resolve().then(() => {
      this.showSpinSubject.next(value);
    });
  }

  getSpin(): boolean {
    return this.showSpinSubject.value;
  }
  getSituacoesEvento(): SimNao[] {
    return this.evento_situacoes;
  }
  getSituacoesEventoByCodigo(value: string): SimNao {
    const idx = this.evento_situacoes.findIndex(
      (situacao) => situacao.sigla === value,
    );
    if (idx >= 0 && idx < this.evento_situacoes.length) {
      return this.evento_situacoes[idx];
    } else {
      return new SimNao('', '');
    }
  }

  getLsSexo(): SimNao[] {
    return this.lsSexos;
  }
  getSexoBySigla(value: string): SimNao {
    const idx = this.lsSexos.findIndex((sexo) => sexo.sigla === value);
    if (idx >= 0 && idx < this.lsSexos.length) {
      return this.lsSexos[idx];
    } else {
      return new SimNao('', '');
    }
  }

  getPlanilha_situacoes(): SimNao[] {
    return this.planilha_situacoes;
  }
  getPlanilha_situacoesBySigla(value: string): SimNao {
    const idx = this.planilha_situacoes.findIndex(
      (plan) => plan.sigla === value,
    );
    if (idx >= 0 && idx < this.planilha_situacoes.length) {
      return this.planilha_situacoes[idx];
    } else {
      return new SimNao('', '');
    }
  }

  getDetalhe_situacoes(): SimNao[] {
    return this.detalhe_situacoes;
  }
  getDetalhe_situacoesBySigla(value: string): SimNao {
    const idx = this.detalhe_situacoes.findIndex(
      (plan) => plan.sigla === value,
    );
    if (idx >= 0 && idx < this.detalhe_situacoes.length) {
      return this.detalhe_situacoes[idx];
    } else {
      return new SimNao('', '');
    }
  }



  setChangePassWord() {
    this.changePassWordEmitter.emit();
  }

  setOnSubmit(value: boolean) {
    this.onSubmit.emit(value);
  }
}
