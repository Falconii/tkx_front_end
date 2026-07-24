import { EditUsuarioEventoDialogData } from './../edit-usuario-evento/edit-usuario-evento-dialog-data';
import { Usuario_EventoService } from './../../../services/usuario_evento.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../../services/global.service';
import { LocalStorageService } from '../../../services/localStorage.service';
import { AppSnackbar } from '../../../shared/classes/app-snackbar';
import { Subscription } from 'rxjs/internal/Subscription';
import { ParametroModel } from '../../../models/parametro-model';
import { ControlePaginas } from '../../../shared/classes/controle-paginas';
import { Usuario_EventoModel } from '../../../models/usuario_evento-model';
import { EventoModel } from '../../../models/evento-model';
import { CadastroAcoes } from '../../../shared/classes/cadastro-acoes';
import { ParametroEvento01 } from '../../../parametros/parametro-evento01';
import { MensagensBotoes, messageError } from '../../../shared/classes/util';
import { EventoService } from '../../../services/evento.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ParametroUsuario_Evento01 } from '../../../parametros/parametro-usuario_evento01';
import { AtualizaParametroUsuarioEvento01 } from '../../../shared/classes/atualiza-parametro-usuario-evento01';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditUsuarioEventoComponent } from '../edit-usuario-evento/edit-usuario-evento.component';

@Component({
  selector: 'app-crud-usuario-evento',
  templateUrl: './crud-usuario-evento.component.html',
  styleUrl: './crud-usuario-evento.component.scss'
})
export class CrudUsuarioEventoComponent {


    inscricaoUsuarioEvento!: Subscription;
    inscricaoEventoAtivo!: Subscription;
    inscricaoEventoAcao!: Subscription;

    tamPagina = 50;

    parametro: ParametroModel = new ParametroModel();

    controlePaginas: ControlePaginas = new ControlePaginas(
      this.tamPagina,
      this.tamPagina,
    );

    lsUsuariosEventos: Usuario_EventoModel[] = [];

    lsEventos: EventoModel[] = [];

    evento:EventoModel = new EventoModel();

    isMobile: boolean = false;

    constructor(
      private globalService: GlobalService,
      private UsuarioEventoSrv:Usuario_EventoService,
      private eventoSrv:EventoService,
      private route: ActivatedRoute,
      private router: Router,
      private appSnackBar: AppSnackbar,
      private localStorageSrv: LocalStorageService,
      private breakpoint: BreakpointObserver,
      private deleteDialog: MatDialog,
      private editDialog:MatDialog
    ) {}

    ngOnInit(): void {
       this.breakpoint.observe([Breakpoints.Handset]).subscribe((result) => {
                this.isMobile = result.matches;
              });
          const data = this.route.snapshot.data['eventoAtivo'];
          this.lsEventos = data;
         if (this.lsEventos.length == 0 && !this.isMobile) {
            this.onHome();
          }
          if (this.globalService.getUsuario().grupo == 4 ){
            this.appSnackBar.openWarningnackBar("Opção Não Disponível Para OPERADORES","OK");
            this.onHome();
          }
          this.evento = this.lsEventos[0];
    }

    ngOnDestroy() {
      this.inscricaoUsuarioEvento?.unsubscribe();
      this.inscricaoEventoAtivo?.unsubscribe();
      this.inscricaoEventoAcao?.unsubscribe();
    }

    getUsuariosEventos() {

      let par: ParametroUsuario_Evento01 = new ParametroUsuario_Evento01();

      par.id_empresa = this.globalService.getEmpresa().id;

      par.orderby = '000001';

      par = AtualizaParametroUsuarioEvento01(par,this.parametro.getParametro());

      console.log("Paramentro: Consulta",par);

      this.inscricaoUsuarioEvento = this.UsuarioEventoSrv
        .getUsuarios_EventosParametro_01(par)
        .subscribe({
          next: (data: Usuario_EventoModel[]) => {
            if (data.length > 0) {
              this.lsUsuariosEventos = data;
            } else {
              this.lsUsuariosEventos = [];
            }
            console.log("usuarios",this.lsUsuariosEventos);
          },
          error: (error: any) => {
            this.lsUsuariosEventos =[];
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

    getEventoAtivo() {
      const par: ParametroEvento01 = new ParametroEvento01();

      par.id_empresa = this.globalService.getEmpresa().id;

      par.status = '3';

      par.orderby = '000001';

      this.inscricaoEventoAtivo = this.eventoSrv
        .getEventosParametro_01(par)
        .subscribe({
          next: (data: EventoModel[]) => {
            if (data.length > 0) {
              this.evento = data[0];
            } else {
              this.evento = new EventoModel();
            }
          },
          error: (error: any) => {
            if (error.status && error.status == 401) {
              this.localStorageSrv.clear();
              this.appSnackBar.openFailureSnackBar('Ação Não Autoizada', 'OK');
              return;
            } else {
              if (error.status && error.status == 409) {
                this.appSnackBar.openFailureSnackBar(
                  'Nenhum Evento Ativo Encontrado Para Pesquisa Dos Participantes!',
                  'OK',
                );
              } else {
                this.appSnackBar.openFailureSnackBar(
                  `Erro Na Pesquisa Dos Eventos ${messageError(error)}`,
                  'OK',
                );
              }
            }
          },
        });
    }

    onChangeParametro(param:ParametroModel ) {
      this.parametro = param;
      console.log("Parametros",param)
      this.getUsuariosEventos();
    }

    escolha(opcao: CadastroAcoes,indice:number, usuario?: Usuario_EventoModel) {
      if (opcao == CadastroAcoes.Inclusao && usuario == null ) {
        console.log(this.evento);
        usuario = new Usuario_EventoModel();
        usuario.id_empresa = this.evento.id_empresa;
        usuario.id_evento  = this.evento.id;
        usuario.ativo  = "S";
        this.openUsuarioDialog(opcao, indice, usuario);
        return;
      }
      if (usuario == null){
        return;
      }
      if (opcao == CadastroAcoes.Exclusao ) {
        this.openDeleteUsuario(usuario, indice);
        return;
      }
      this.openUsuarioDialog(opcao,indice,usuario);
    }

    onSair() {

    }

    onHome(){
      this.router.navigate(['/home']);
    }


    getAcoes() {
      return CadastroAcoes;
    }

  getTexto() {
    return MensagensBotoes;
  }


    openDeleteUsuario(usuario: Usuario_EventoModel, indice: number) {
          const dialogRef = this.deleteDialog.open(ConfirmDialogComponent, {
            width: '380px',
            data: {
              title: 'Excluir Usuario Do Evento',
              message: `${usuario.usuario_razao}`,
              confirmText: 'Sim, excluir',
              cancelText: 'Cancelar',
              icone: 'play_circle_filled',
            },
          });

          dialogRef.afterClosed().subscribe((result) => {
            if (result) {
              this.deleteUsuario(usuario, indice);
            }
          });
        }

    deleteUsuario(usuario: Usuario_EventoModel, indice: number) {
      this.inscricaoEventoAcao = this.UsuarioEventoSrv
        .usuario_eventoDelete(usuario.id_empresa,usuario.id_evento,usuario.cnpj_cpf)
        .subscribe({
          next: (data: any) => {
            this.appSnackBar.openSuccessSnackBar(
              `Usuário Excluída Com Sucesso!`,
              'OK',
            );
            this.lsUsuariosEventos.splice(indice, 1);
          },
          error: (error: any) => {
            this.appSnackBar.openFailureSnackBar(
              `Erro Na Exclusão ${messageError(error)}`,
              'OK',
            );
          },
        });
    }

      openUsuarioDialog(opcao:CadastroAcoes,indice:number,usuario: Usuario_EventoModel): void {
        const data: EditUsuarioEventoDialogData = new EditUsuarioEventoDialogData();
        data.acao = opcao;
        data.usuario = usuario;
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.id = 'trocar';
        dialogConfig.width = '700px';
        dialogConfig.autoFocus = true;
        dialogConfig.data = data;
        const modalDialog = this.editDialog
          .open(EditUsuarioEventoComponent, dialogConfig)
              .beforeClosed()
          .subscribe((data: EditUsuarioEventoDialogData) => {
                if (data.result) {
                  switch(opcao){
                    case CadastroAcoes.Inclusao:{
                      this.getUsuariosEventos();
                      break;
                    }
                    case CadastroAcoes.Edicao :{
                      this.lsUsuariosEventos[indice] = data.usuario;
                      break
                    }

                  }
                }
              });

      }


}
