import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioModel } from '../models/usuario-model';
import { EmpresaModel } from '../models/empresa-model';
import { UsuarioService } from './usuario.service';
import { SimNao } from '../shared/classes/sim-nao';
import { EventoModel } from '../models/evento-model';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  usuario: UsuarioModel;
  empresa: EmpresaModel;
  evento: EventoModel = new EventoModel();
  evento_situacoes: SimNao[] = [];
  logado: boolean = false;
  showSpin: boolean = false;

  shomMenuEmitter = new EventEmitter<boolean>();
  showSpinEmitter = new EventEmitter<boolean>();
  showEmpresaEmitter = new EventEmitter<boolean>();
  showUsuarioEmitter = new EventEmitter();
  isMobileEmitter = new EventEmitter<boolean>();

  onSubmit = new EventEmitter<boolean>();

  changePassWordEmitter = new EventEmitter<boolean>();

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
      new SimNao('0', 'Em Abeto'),
      new SimNao('1', 'Em Andamento'),
      new SimNao('0', 'Encerrado'),
    ];
    this.evento.id_empresa = 1;
    this.evento.id = 4;
    this.evento.descricao = 'EVENTO PIRACICABA/26';
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
    this.showSpin = value;
    this.showSpinEmitter.emit(this.showSpin);
  }

  getSpin(): boolean {
    return this.showSpin;
  }

  getSituacoesEvento(): SimNao[] {
    return this.evento_situacoes;
  }
  getSituacoesEventoByCodigo(idx: number): SimNao {
    if (idx >= 0 && idx < this.evento_situacoes.length) {
      return this.evento_situacoes[idx];
    } else {
      // aqui você decide o que retornar quando o índice é inválido
      // pode ser um valor padrão de SimNao, ou lançar erro
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
