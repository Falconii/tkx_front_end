import { GrupousuarioModel } from './../../../models/grupousuario-model';
import { Component, ViewChild } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Subscription } from 'rxjs';
import { GlobalService } from '../../../services/global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpresaService } from '../../../services/empresa.service';
import { AppSnackbar } from '../../../shared/classes/app-snackbar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CadastroAcoes } from '../../../shared/classes/cadastro-acoes';
import { TipoOperacao } from '../../../shared/classes/tipo-operacao';
import { ParametroEmpresa01 } from '../../../parametros/parametro-empresa01';
import { DataDDMMYYYY, MensagensBotoes } from '../../../shared/classes/util';
import { GrupoUsuarioDialogData } from './grupousuario-dialog/GrupoUsuarioDialogData';
import { GrupousuarioDialogComponent } from './grupousuario-dialog/grupousuario-dialog.component';
import { AtualizaParametroGrupousuario01 } from '../../../shared/classes/atualiza-parametro-grupousuario01';
import { ParametroModel } from '../../../models/parametro-model';
import { ControlePaginas } from '../../../shared/classes/controle-paginas';
import { ParametroGrupousuario01 } from '../../../parametros/parametro-grupousuario01';
import { GrupousuarioService } from '../../../services/grupousuario.service';

@Component({
  selector: 'app-crud-grupousuario',
  templateUrl: './crud-grupousuario.component.html',
  styleUrl: './crud-grupousuario.component.scss',
})
export class CrudGrupousuarioComponent {
  @ViewChild(CdkVirtualScrollViewport) viewPort!: CdkVirtualScrollViewport;

  inscricaoGrupoUsuario!: Subscription;

  gruposusuarios: GrupousuarioModel[] = [];

  controlePaginas: ControlePaginas = new ControlePaginas(0, 0);

  tamPagina: number = 50;

  retorno: boolean = false;

  parametro: ParametroModel = new ParametroModel();

  hide: boolean = false;

  constructor(
    private globalService: GlobalService,
    private gruposUsuariosSrv: GrupousuarioService,
    private route: ActivatedRoute,
    private router: Router,
    private appSnackBar: AppSnackbar,
    private empresaDialog: MatDialog
  ) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this.inscricaoGrupoUsuario?.unsubscribe();
  }

  escolha(opcao: number, i: number, grupoUsuario?: GrupousuarioModel) {
    this.openGrupoUsuarioDialog(opcao, i, grupoUsuario);
  }

  onHome() {
    this.router.navigate(['']);
  }

  getAcoes() {
    return CadastroAcoes;
  }

  getGruposUsuarios(tipoOperacao: TipoOperacao = TipoOperacao.Pesquisa) {
    let par = new ParametroGrupousuario01();

    par = AtualizaParametroGrupousuario01(par, this.parametro.getParametro());

    if (tipoOperacao == TipoOperacao.Contador) {
      par.contador = 'S';
    } else {
      par.pagina = this.controlePaginas.getPaginalAtual();
      par.tamPagina = this.controlePaginas.getTamPagina();
    }

    this.inscricaoGrupoUsuario = this.gruposUsuariosSrv
      .getGruposusuariosParametro_01(par)
      .subscribe({
        next: (data: any) => {
          if (tipoOperacao == TipoOperacao.Pesquisa) {
            this.gruposusuarios = data;
          } else {
            this.controlePaginas = new ControlePaginas(
              this.tamPagina,
              data.total == 0 ? 1 : data.total
            );
            this.getGruposUsuarios();
          }
        },
        error: (error: any) => {
          console.log(error);
          this.gruposusuarios = [];
          this.controlePaginas = new ControlePaginas(this.tamPagina, 0);
        },
      });
  }

  getTexto() {
    return MensagensBotoes;
  }

  onChangePage() {
    this.getGruposUsuarios();
  }

  onChangeHide(hide: boolean) {
    this.hide = hide;
  }

  onChangeParametros(param: ParametroModel) {
    this.parametro = param;
    console.log('Paramentro de Pesquisa', this.parametro);
    this.getGruposUsuarios(TipoOperacao.Contador);
  }

  openGrupoUsuarioDialog(
    opcao: CadastroAcoes = CadastroAcoes.Consulta,
    i: number,
    grupousuario?: GrupousuarioModel
  ): void {
    const data: GrupoUsuarioDialogData = new GrupoUsuarioDialogData();

    if (grupousuario == null) {
      grupousuario = new GrupousuarioModel();
      grupousuario.id_empresa = this.globalService.getEmpresa().id;
    }
    data.opcao = opcao;
    data.processar = false;
    data.grupoUsuario = grupousuario;
    console.log('Ação:', opcao, data.grupoUsuario);
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.id = 'dialog-grupousuario-component';
    dialogConfig.width = '80vw';
    dialogConfig.height = '80vh';
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = 'dialog-font-small';
    dialogConfig.data = data;
    const modalDialog = this.empresaDialog
      .open(GrupousuarioDialogComponent, dialogConfig)
      .beforeClosed()
      .subscribe((data: GrupoUsuarioDialogData | null) => {
        if (data?.processar) {
          switch (opcao) {
            case CadastroAcoes.Inclusao:
              this.gruposusuarios.push(data.grupoUsuario!);
              break;
            case CadastroAcoes.Edicao:
              if (i >= 0) {
                this.gruposusuarios[i] = data.grupoUsuario!;
              }
              break;
            case CadastroAcoes.Exclusao:
              this.gruposusuarios.splice(i, 1);
              break;
            default:
              break;
          }
        } else {
        }
      });
  }
}
