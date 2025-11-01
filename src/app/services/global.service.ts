import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioModel } from '../models/usuario-model';
import { EmpresaModel } from '../models/empresa-model';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {

  token:string='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF9lbXByZXNhIjoxLCJpZF91c3VhcmlvIjoxLCJpYXQiOjE3NjE5MTk5ODIsImV4cCI6MTc2MjUyNDc4Mn0.1L5CweiLEsIU9vZZXym1lLzC0aeDefGQSNKyrv4Xkho';
  usuario: UsuarioModel;
  empresa: EmpresaModel;
  logado: boolean = false;
  showSpin: boolean = false;
  shomMenuEmitter = new EventEmitter<boolean>();
  showSpinEmitter = new EventEmitter<boolean>();
  isMobileEmitter = new EventEmitter<boolean>();


  constructor(
    private usuarioService: UsuarioService, private router: Router)
    {
       this.usuario = new UsuarioModel();
       this.logado = false;
       this.empresa = new EmpresaModel();
       this.empresa.id = 1;
       this.logado = false;
    }

   setMobile(value: boolean) {
    this.isMobileEmitter.emit(value);
  }


  getEmpresa(): EmpresaModel {
    return this.empresa;
  }

  setEmpresa(emp: EmpresaModel) {
    this.empresa = emp;
  }


  setSpin(value: boolean) {
    this.showSpin = value;
    this.showSpinEmitter.emit(this.showSpin);
  }

  getSpin(): boolean {
    return this.showSpin;
  }

  getToken(): string {
    return this.token;
  }

}
