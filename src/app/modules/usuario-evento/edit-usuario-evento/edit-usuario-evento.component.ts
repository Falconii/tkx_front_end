import { Usuario_EventoModel } from './../../../models/usuario_evento-model';
import { Component, Inject, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { Usuario_EventoService } from '../../../services/usuario_evento.service';
import { UsuarioService } from '../../../services/usuario.service';
import { EditUsuarioEventoDialogData } from './edit-usuario-evento-dialog-data';
import { GlobalService } from '../../../services/global.service';
import { AppSnackbar } from '../../../shared/classes/app-snackbar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CadastroAcoes } from '../../../shared/classes/cadastro-acoes';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ValidatorCnpjCpf } from '../../../shared/Validators/validator-Cnpj-Cpf';
import { ValidatorStringLen } from '../../../shared/Validators/validator-string-len';
import { messageError } from '../../../shared/classes/util';
import { LocalStorageService } from '../../../services/localStorage.service';

@Component({
  selector: 'app-edit-usuario-evento',
  templateUrl: './edit-usuario-evento.component.html',
  styleUrl: './edit-usuario-evento.component.css'
})
export class EditUsuarioEventoComponent {

  @ViewChild(CdkScrollable) scrollable!: CdkScrollable;

  formulario: FormGroup;

  acao: string = 'Sem Definição';

  idAcao: number = CadastroAcoes.None

  readOnly: boolean = true;

  inscricaoUsuarioEvento!: Subscription;
  inscricaoUsuario!:Subscription;
  inscricaoAcao!:Subscription;

  labelCadastro: string = '';

  constructor(
        private formBuilder: FormBuilder,
        private globalService: GlobalService,
        private usuarioEventoSrv:Usuario_EventoService,
        private usuarioSrv:UsuarioService,
        private appSnackBar: AppSnackbar,
        @Inject(MAT_DIALOG_DATA) public data: EditUsuarioEventoDialogData,
        private dialogRef: MatDialogRef<EditUsuarioEventoComponent>,
        private localStorageSrv: LocalStorageService
      ) {
        this.formulario = formBuilder.group({
              cpf: [{ value: '' }, [ValidatorCnpjCpf(true)]],
              nome: [{ value: '' }, [ValidatorStringLen(3, 40, true)]],
            });
      }
      ngOnInit(): void {
        if (this.data.acao == CadastroAcoes.Inclusao){
           this.setValues();
        } else {
          this.setValueNoParam();
          this.getUsuarioEvento();
        }
      }

      ngOnDestroy(): void {
        this.inscricaoUsuarioEvento?.unsubscribe();
        this.inscricaoUsuario?.unsubscribe();
        this.inscricaoAcao?.unsubscribe();
      }

    getUsuario(){

    }

  getUsuarioEvento(){
  this.inscricaoUsuarioEvento = this.usuarioEventoSrv
    .getUsuario_Evento(this.data.usuario.id_empresa, this.data.usuario.id_evento, this.data.usuario.cnpj_cpf)
          .subscribe({
            next: (data: Usuario_EventoModel) => {
              console.log("getusuarioEvento",data);
              this.data.usuario = data;
              this.setValues();
            },
            error: (error: any) => {
              if (error.status && error.status == 401) {
                this.localStorageSrv.clear();
                this.appSnackBar.openFailureSnackBar('Ação Não Autoizada', 'OK');
                return;
              } else {
                if (error.status && error.status == 409) {
                  this.appSnackBar.openFailureSnackBar(
                    'Nenhum Operador Encontrado Para Este Evento!',
                    'OK',
                  );
                } else {
                  this.appSnackBar.openFailureSnackBar(
                    `Erro Na Pesquisa De Usuario De Evento ${messageError(error)}`,
                    'OK',
                  );
                }
              }
            },
          });
  }


  incluirUsuario(usuario:Usuario_EventoModel) {
    this.inscricaoAcao = this.usuarioEventoSrv
      .usuario_eventoInsert(usuario)
      .subscribe({
        next: (data: Usuario_EventoModel) => {
          this.data.usuario = data;
          this.appSnackBar.openSuccessSnackBar("Usuario Incluído Com Sucesso!","OK");
          this.data.result = true;
          this.closeModal();
        },
        error: (error: any) => {
          if (error.status && error.status == 401) {
            this.localStorageSrv.clear();
            this.appSnackBar.openFailureSnackBar('Ação Não Autoizada', 'OK');
            return;
          } else {
            if (error.status && error.status == 409) {
              this.appSnackBar.openFailureSnackBar(
                'Nenhum Operador Encontrado Para Este Evento!',
                'OK',
              );
            } else {
              this.appSnackBar.openFailureSnackBar(
                `Falha Na Inclusão Do usuário ${messageError(error)}`,
                'OK',
              );
            }
          }
        },
      });
  }

  alterarUsuario(usuario: Usuario_EventoModel) {
    this.inscricaoAcao = this.usuarioEventoSrv
      .usuario_eventoUpdate(usuario)
      .subscribe({
        next: (data: Usuario_EventoModel) => {
          this.data.usuario = data;
          this.data.result = true;
          this.appSnackBar.openSuccessSnackBar("Usuario Incluído Com Sucesso!", "OK");
          this.closeModal();
        },
        error: (error: any) => {
          if (error.status && error.status == 401) {
            this.localStorageSrv.clear();
            this.appSnackBar.openFailureSnackBar('Ação Não Autoizada', 'OK');
            return;
          } else {
            if (error.status && error.status == 409) {
              this.appSnackBar.openFailureSnackBar(
                'Nenhum Operador Encontrado Para Este Evento!',
                'OK',
              );
            } else {
              this.appSnackBar.openFailureSnackBar(
                `Falha Na Alteração Do usuário ${messageError(error)}`,
                'OK',
              );
            }
          }
        },
      });
  }


  setValueNoParam() {
    this.formulario.setValue({
      cpf: '',
      nome: '',
    });
  }
  setValues() {
    console.log("setValues",this.data.usuario);
    this.formulario.setValue({
      cpf: this.data.usuario.cnpj_cpf,
      nome: this.data.usuario.razao,
    });
  }
    NoValidtouchedOrDirty(campo: string): boolean {
      if (
        !this.formulario.get(campo)?.valid &&
        (this.formulario.get(campo)?.touched || this.formulario.get(campo)?.dirty)
      ) {
        return true;
      }
      return false;
    }

    getMensafield(field: string): string {
      return this.formulario.get(field)?.errors?.['message'];
    }

    hasValue(campo: string): boolean {
      if (this.formulario.get(campo)?.value == '') {
        return false;
      }
      return true;
    }

    closeModal() {
      this.dialogRef.close(this.data);
    }

    onProcessar() {
      if (this.formulario.valid) {
        console.log("formulario cpf", this.formulario.value?.cpf);
        this.data.usuario.cnpj_cpf = this.formulario.value?.cpf;
        this.data.usuario.razao    =  this.formulario.value?.nome.toUpperCase();
        console.log("usuario gravacao",this.data.usuario);
        if (this.data.acao == CadastroAcoes.Inclusao){
           this.incluirUsuario(this.data.usuario);
        }
        if (this.data.acao == CadastroAcoes.Edicao){
          this.alterarUsuario(this.data.usuario)
        }
      } else {
        this.formulario.markAllAsTouched();
        this.appSnackBar.openSuccessSnackBar(
          `Formulário Com Campos Inválidos.`,
          'OK',
        );
      }
    }

    onCancelar() {
      this.data.result = false;
      this.closeModal();
    }


    scrollAte(event: FocusEvent) {
      const el = event.target as HTMLElement;

    setTimeout(() => {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 250);
    }

  getAcoes() {
    return CadastroAcoes;
  }


}
