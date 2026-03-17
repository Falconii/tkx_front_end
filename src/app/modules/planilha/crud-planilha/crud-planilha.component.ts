import { CabplanilhaModel } from './../../../models/cabplanilha-model';
import { ParametroDeletaplanilha } from './../../../parametros/parametro-deletaplanilha';
import { Component } from '@angular/core';
import { ParametroCabplanilha01 } from '../../../parametros/parametro-cabplanilha01';
import { ParametroModel } from '../../../models/parametro-model';
import { ControlePaginas } from '../../../shared/classes/controle-paginas';
import { MensagensBotoes } from '../../../shared/classes/util';
import { CadastroAcoes } from '../../../shared/classes/cadastro-acoes';
import { Subscription } from 'rxjs';
import { GlobalService } from '../../../services/global.service';
import { CabplanilhaService } from '../../../services/cabplanilha.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSnackbar } from '../../../shared/classes/app-snackbar';
import { TipoOperacao } from '../../../shared/classes/tipo-operacao';
import { AtualizaParametrocabEmpresa } from '../../../shared/classes/atualiza-parametro-cabEmpresa01';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ImportPlanilhaDialogComponent } from '../import-planilha-dialog/import-planilha-dialog.component';
import { Importplanilhadata } from '../import-planilha-dialog/importplanilha-data';
import { CabplanilhaComplementarService } from '../../../services/cabplanilhaComplementar.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-crud-planilha',
  templateUrl: './crud-planilha.component.html',
  styleUrl: './crud-planilha.component.css',
})
export class CrudPlanilhaComponent {
  parametro: ParametroModel = new ParametroModel();
  lsPlanilhas: CabplanilhaModel[] = [];

  inscricaoPlanilha!: Subscription;
  inscricaoDelete!: Subscription;
  inscricaoProcessa!: Subscription;

  controlePaginas: ControlePaginas = new ControlePaginas(0, 0);

  tamPagina: number = 50;

  hide: boolean = false;

  constructor(
    private globalService: GlobalService,
    private cabSrv: CabplanilhaService,
    private cabComplSrv: CabplanilhaComplementarService,
    private route: ActivatedRoute,
    private router: Router,
    private appSnackBar: AppSnackbar,
    private uploadDialog: MatDialog,
    private deleteDialog: MatDialog,
  ) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this.inscricaoPlanilha?.unsubscribe();
    this.inscricaoDelete?.unsubscribe();
    this.inscricaoProcessa?.unsubscribe();
  }

  getPlanilhas(tipoOperacao: TipoOperacao = TipoOperacao.Pesquisa) {
    let par = new ParametroCabplanilha01();

    par.id_empresa = this.globalService.getEmpresa().id;

    par.id_evento = 1;

    par = AtualizaParametrocabEmpresa(par, this.parametro.getParametro());

    if (tipoOperacao == TipoOperacao.Contador) {
      par.contador = 'S';
    } else {
      par.pagina = this.controlePaginas.getPaginalAtual();
      par.tamPagina = this.controlePaginas.getTamPagina();
    }

    console.log('Parametro:', par);

    this.inscricaoPlanilha = this.cabSrv
      .getCabplanilhasParametro_01(par)
      .subscribe({
        next: (data: any) => {
          if (tipoOperacao == TipoOperacao.Pesquisa) {
            this.lsPlanilhas = data;
          } else {
            this.controlePaginas = new ControlePaginas(
              this.tamPagina,
              data.total == 0 ? 1 : data.total,
            );
            this.getPlanilhas();
          }
        },
        error: (error: any) => {
          console.log(error);
          this.lsPlanilhas = [];
          this.controlePaginas = new ControlePaginas(this.tamPagina, 0);
        },
      });
  }

  deletePlanilha(planilha: CabplanilhaModel, indice: number) {
    let par = new ParametroDeletaplanilha();

    par.id_empresa = planilha.id_empresa;

    par.id_evento = planilha.id_evento;

    par.id_planilha = planilha.id;
    console.log('Parametro:', par);

    this.inscricaoPlanilha = this.cabComplSrv.deletePlanilha(par).subscribe({
      next: (data: any) => {
        this.lsPlanilhas.splice(indice, 1);
        this.getPlanilhas();
      },
      error: (error: any) => {
        this.appSnackBar.openFailureSnackBar(
          `Erro No UpLoad ${error.error?.tabela ?? ''} - ${error.error?.erro ?? ''} - ${error.error?.message ?? ''}`,
          'OK',
        );
      },
    });
  }

  onHome() {}

  onChangeHide(hide: boolean) {
    this.hide = hide;
  }

  onChangePage() {
    this.getPlanilhas();
  }

  onChangeParametros(param: ParametroModel) {
    this.parametro = param;

    this.getPlanilhas(TipoOperacao.Contador);
  }

  escolha(opcao: number, indice: number, planilha?: CabplanilhaModel) {
    if (planilha == null) {
      if (opcao == CadastroAcoes.Inclusao) {
        this.openUloadLoadDialog();
      }
    } else {
      if (opcao == CadastroAcoes.Exclusao) {
        this.openDeletePlanilha(planilha, indice);
      }
      if (opcao == CadastroAcoes.Processar) {
        this.openProcessaPlanilha(planilha, indice);
      }
    }
  }

  getTexto() {
    return MensagensBotoes;
  }

  getAcoes() {
    return CadastroAcoes;
  }

  openUloadLoadDialog() {
    const dialogConfig = new MatDialogConfig();
    const data: Importplanilhadata = new Importplanilhadata();
    dialogConfig.disableClose = true;
    dialogConfig.id = 'linkmanual';
    dialogConfig.panelClass = 'fullscreen-dialog';
    dialogConfig.data = data;
    const modalDialog = this.uploadDialog
      .open(ImportPlanilhaDialogComponent, dialogConfig)
      .beforeClosed()
      .subscribe((data: Importplanilhadata | null) => {
        if (data?.processar) {
          this.getPlanilhas(TipoOperacao.Contador);
        }
      });
  }

  openDeletePlanilha(planilha: CabplanilhaModel, indice: number) {
    const dialogRef = this.deleteDialog.open(ConfirmDialogComponent, {
      width: '380px',
      data: {
        title: 'Excluir Planilha',
        message: `${planilha.arquivo}`,
        confirmText: 'Sim, excluir',
        cancelText: 'Cancelar',
        icone: 'play_circle_filled',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deletePlanilha(planilha, indice);
      }
    });
  }

  openProcessaPlanilha(planilha: CabplanilhaModel, indice: number) {
    const dialogRef = this.deleteDialog.open(ConfirmDialogComponent, {
      width: '380px',
      data: {
        title: 'Processar Planilha',
        message: `${planilha.arquivo}`,
        confirmText: 'Sim, Processar',
        cancelText: 'Cancelar',
        icone: 'play_circle_filled',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        //this.deletePlanilha(planilha, indice);
      }
    });
  }
}
