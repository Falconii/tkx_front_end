import { Component } from '@angular/core';
import { ParametroCabplanilha01 } from '../../../parametros/parametro-cabplanilha01';
import { ParametroModel } from '../../../models/parametro-model';
import { ControlePaginas } from '../../../shared/classes/controle-paginas';
import { CabplanilhaModel } from '../../../models/cabplanilha-model';
import { MensagensBotoes } from '../../../shared/classes/util';
import { CadastroAcoes } from '../../../shared/classes/cadastro-acoes';
import { Subscription } from 'rxjs';
import { GlobalService } from '../../../services/global.service';
import { CabplanilhaService } from '../../../services/cabplanilha.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSnackbar } from '../../../shared/classes/app-snackbar';
import { TipoOperacao } from '../../../shared/classes/tipo-operacao';
import { AtualizaParametrocabEmpresa } from '../../../shared/classes/atualiza-parametro-cabEmpresa01';

@Component({
  selector: 'app-crud-planilha',
  templateUrl: './crud-planilha.component.html',
  styleUrl: './crud-planilha.component.css',
})
export class CrudPlanilhaComponent {
  parametro: ParametroModel = new ParametroModel();
  lsPlanilhas: CabplanilhaModel[] = [];
  inscricaoPlanilha!: Subscription;

  controlePaginas: ControlePaginas = new ControlePaginas(0, 0);

  tamPagina: number = 50;

  hide: boolean = false;

  constructor(
    private globalService: GlobalService,
    private cabSrv: CabplanilhaService,
    private route: ActivatedRoute,
    private router: Router,
    private appSnackBar: AppSnackbar,
  ) {}

  ngOnInit(): void {}

  ngOnDestroy() {
    this.inscricaoPlanilha?.unsubscribe();
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

  escolha(
    opcao: number,
    i: number,
    cabPlanilha: CabplanilhaModel = new CabplanilhaModel(),
  ) {
    if (!cabPlanilha) {
      return;
    }
    console.log(opcao, i, cabPlanilha);
    if (opcao == 25) {
      //if (contrato.id_paf) this.downLoad(contrato.id_paf);
      //this.openDownloadDialog(contrato);
    }
  }

  getTexto() {
    return MensagensBotoes;
  }

  getAcoes() {
    return CadastroAcoes;
  }
}
