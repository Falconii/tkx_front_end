import { Component, ViewChild } from '@angular/core';
import { Participantev2Model } from '../../../models/participantev2-model';
import { Subscription } from 'rxjs';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ParametroModel } from '../../../models/parametro-model';
import { ControlePaginas } from '../../../shared/classes/controle-paginas';
import { GlobalService } from '../../../services/global.service';
import { Participantev2Service } from '../../../services/participantev2.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSnackbar } from '../../../shared/classes/app-snackbar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EmpresaModel } from '../../../models/empresa-model';
import { CadastroAcoes } from '../../../shared/classes/cadastro-acoes';
import { TipoOperacao } from '../../../shared/classes/tipo-operacao';
import { ParametroParticipantev201 } from '../../../parametros/parametro-participantev201';
import { AtualizaParametroParticipantev201 } from '../../../shared/classes/atualiza-parametro-participante.v201';
import { MensagensBotoes } from '../../../shared/classes/util';
import { ParticipanteV2DialogData } from '../participantev2-dialog/participantev2-dialog-data';
import { Participantev2DialogComponent } from '../participantev2-dialog/participantev2-dialog.component';
import { SimNao } from '../../../shared/classes/sim-nao';

@Component({
  selector: 'app-crud-participantev2',
  templateUrl: './crud-participantev2.component.html',
  styleUrl: './crud-participantev2.component.scss',
})
export class CrudParticipantev2Component {
  @ViewChild(CdkVirtualScrollViewport) viewPort!: CdkVirtualScrollViewport;

  inscricaoParticipante!: Subscription;

  participantes: Participantev2Model[] = [];

  controlePaginas: ControlePaginas = new ControlePaginas(0, 0);

  tamPagina: number = 50;

  retorno: boolean = false;

  parametro: ParametroModel = new ParametroModel();

  hide: boolean = false;

  lsSexos: SimNao[] = [];

  constructor(
    private globalService: GlobalService,
    private participanteSrv: Participantev2Service,
    private route: ActivatedRoute,
    private router: Router,
    private appSnackBar: AppSnackbar,
    private participanteDialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.lsSexos = this.globalService.getLsSexo();
  }

  ngOnDestroy() {
    this.inscricaoParticipante?.unsubscribe();
  }

  getEmpresa(): EmpresaModel {
    return this.globalService.getEmpresa();
  }

  escolha(opcao: number, i: number, participante?: Participantev2Model) {
    this.openParticipanteDialog(opcao, i, participante);
  }

  onHome() {
    this.router.navigate(['']);
  }

  getAcoes() {
    return CadastroAcoes;
  }

  getParticpantes(tipoOperacao: TipoOperacao = TipoOperacao.Pesquisa) {
    let par = new ParametroParticipantev201();

    par.id_empresa = this.globalService.getEmpresa().id;

    par = AtualizaParametroParticipantev201(par, this.parametro.getParametro());

    if (tipoOperacao == TipoOperacao.Contador) {
      par.contador = 'S';
    } else {
      par.pagina = this.controlePaginas.getPaginalAtual();
      par.tamPagina = this.controlePaginas.getTamPagina();
    }

    console.log('Paramentros de Consulta:', par);
    this.inscricaoParticipante = this.participanteSrv
      .getParticipantesv2Parametro_01(par)
      .subscribe({
        next: (data: any) => {
          if (tipoOperacao == TipoOperacao.Pesquisa) {
            this.participantes = data;
          } else {
            this.controlePaginas = new ControlePaginas(
              this.tamPagina,
              data.total == 0 ? 1 : data.total,
            );
            this.getParticpantes();
          }
        },
        error: (error: any) => {
          console.log(error);
          this.participantes = [];
          this.controlePaginas = new ControlePaginas(this.tamPagina, 0);
        },
      });
  }

  getTexto() {
    return MensagensBotoes;
  }

  onChangePage() {
    this.getParticpantes();
  }

  onChangeHide(hide: boolean) {
    this.hide = hide;
  }

  onChangeParametros(param: ParametroModel) {
    this.parametro = param;
    console.log('Paramentro de Pesquisa', this.parametro);
    this.getParticpantes(TipoOperacao.Contador);
  }

  openParticipanteDialog(
    opcao: CadastroAcoes = CadastroAcoes.Consulta,
    i: number,
    paticipante?: Participantev2Model,
  ): void {
    const data: ParticipanteV2DialogData = {
      indice: i,
      opcao,
      processar: false,
      participante: paticipante ?? {
        ...new Participantev2Model(),
        id_empresa: this.globalService.getEmpresa().id,
      },
    };

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.id = 'participantev2-dialog-fullscreen';

    // FULLSCREEN REAL
    dialogConfig.width = '100vw';
    dialogConfig.height = '100vh';
    dialogConfig.maxWidth = '100vw';
    dialogConfig.panelClass = 'fullscreen-dialog';

    dialogConfig.data = data;

    this.participanteDialog
      .open(Participantev2DialogComponent, dialogConfig)
      .beforeClosed()
      .subscribe((result: ParticipanteV2DialogData | null) => {
        if (result?.processar) {
          switch (opcao) {
            case CadastroAcoes.Inclusao:
              this.participantes.push(result.participante!);
              break;

            case CadastroAcoes.Edicao:
              if (i >= 0)
                this.participantes[result.indice] = result.participante!;
              break;

            case CadastroAcoes.Exclusao:
              this.participantes.splice(result.indice, 1);
              break;
          }
        }
      });
  }

  sexoBySigla(value: string): SimNao {
    return this.globalService.getSexoBySigla(value);
  }
}
