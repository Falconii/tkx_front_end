import { EmpresaDialogComponent } from './empresa-dialog/empresa-dialog.component';
import { Component, ViewChild } from '@angular/core';
import { ControlePaginas } from '../../../shared/classes/controle-paginas';
import { ParametroModel } from '../../../models/parametro-model';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Subscription } from 'rxjs';
import { EmpresaModel } from '../../../models/empresa-model';
import { GlobalService } from '../../../services/global.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpresaService } from '../../../services/empresa.service';
import { AppSnackbar } from '../../../shared/classes/app-snackbar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CadastroAcoes } from '../../../shared/classes/cadastro-acoes';
import { TipoOperacao } from '../../../shared/classes/tipo-operacao';
import { ParametroEmpresa01 } from '../../../parametros/parametro-empresa01';
import { AtualizaParametroEmpresa01 } from '../../../shared/classes/atualiza-parametro-empresa01';
import { DataDDMMYYYY, MensagensBotoes } from '../../../shared/classes/util';
import { EmpresaDialogData } from './empresa-dialog/EmpresaDialogData';

@Component({
  selector: 'app-crud-empresa',
  templateUrl: './crud-empresa.component.html',
  styleUrl: './crud-empresa.component.scss'
})
export class CrudEmpresaComponent {

    @ViewChild(CdkVirtualScrollViewport) viewPort!: CdkVirtualScrollViewport;

    inscricaoEmpresa!: Subscription;

    empresas: EmpresaModel[] = [];

    controlePaginas: ControlePaginas = new ControlePaginas(0, 0);

    tamPagina: number = 50;

    retorno: boolean = false;

    parametro: ParametroModel = new ParametroModel();

    hide: boolean = false;

      constructor(
        private globalService: GlobalService,
        private empresaSrv:EmpresaService,
        private route: ActivatedRoute,
        private router: Router,
        private appSnackBar: AppSnackbar,
        private empresaDialog: MatDialog
      ) {
      }

      ngOnInit(): void {
      }

      ngOnDestroy() {
        this.inscricaoEmpresa?.unsubscribe();
      }


      escolha(opcao: number, i:number, usuario?: EmpresaModel) {

        this.openEmpresaDialog(opcao,i,usuario);
      }

      onHome() {
        this.router.navigate(['']);
      }

      getAcoes() {
        return CadastroAcoes;
      }


      getEmpresas(tipoOperacao:TipoOperacao = TipoOperacao.Pesquisa)
      {
            let par = new ParametroEmpresa01()


            par = AtualizaParametroEmpresa01(par,this.parametro.getParametro());

             if (tipoOperacao == TipoOperacao.Contador){
               par.contador = "S";
            } else {
              par.pagina = this.controlePaginas.getPaginalAtual();
              par.tamPagina = this.controlePaginas.getTamPagina();
            }

            this.inscricaoEmpresa = this.empresaSrv.getEmpresasParametro_01(par)
            .subscribe({
              next: (data:any) => {
                if (tipoOperacao == TipoOperacao.Pesquisa){
                  this.empresas = data;
                } else {
                   this.controlePaginas = new ControlePaginas(
                      this.tamPagina,
                      data.total == 0 ? 1 : data.total
                    );
                  this.getEmpresas()
                }
              },
              error: (error: any) => {
                console.log(error);
                this.empresas = [];
                this.controlePaginas = new ControlePaginas(this.tamPagina, 0);
              }
            });

      }




      getTexto() {
        return MensagensBotoes;
      }

      onChangePage() {
        this.getEmpresas();
      }

      onChangeHide(hide:boolean){
        this.hide = hide;
      }

       onChangeParametros(param:ParametroModel) {
        this.parametro = param;
        console.log("Paramentro de Pesquisa",this.parametro);
        this.getEmpresas(TipoOperacao.Contador);
      }


      openEmpresaDialog(opcao:CadastroAcoes = CadastroAcoes.Consulta,i:number,empresa?:EmpresaModel): void {
        const data: EmpresaDialogData = new EmpresaDialogData();

        if (empresa == null){
          empresa = new EmpresaModel();
          empresa.cadastr = DataDDMMYYYY(new Date());
        }
        data.opcao = opcao;
        data.processar = false;
        data.empresa = empresa;
        console.log("Ação:",opcao,data.empresa);
        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.id     = 'dialog-empresa-component';
        dialogConfig.width = '80vw';
        dialogConfig.height =  '80vh';
        dialogConfig.disableClose = true;
        dialogConfig.panelClass = 'dialog-font-small';
        dialogConfig.data = data;
        const modalDialog = this.empresaDialog.open(
          EmpresaDialogComponent,
          dialogConfig
        )
        .beforeClosed().subscribe((data: EmpresaDialogData | null) => {
            if (data?.processar) {
                switch (opcao) {
                  case CadastroAcoes.Inclusao:
                    this.empresas.push(data.empresa!);
                    break;
                  case CadastroAcoes.Edicao:
                    if (i >= 0){
                      this.empresas[i] = data.empresa!;
                    }
                    break;
                  case CadastroAcoes.Exclusao:
                    this.empresas.splice(i, 1);
                    break;
                  default:
                    break;
                }
            }
            else {

            }
          });
      }




}
