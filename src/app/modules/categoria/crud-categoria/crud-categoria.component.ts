import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CategoriaModel } from '../../../models/categoria-model';
import { ParametroModel } from '../../../models/parametro-model';
import { ParametroCategoria01 } from '../../../parametros/parametro-categoria01';
import { CategoriaService } from '../../../services/categoria.service';
import { GlobalService } from '../../../services/global.service';
import { AtualizaParametroCategoria01 } from '../../../shared/classes/atualiza-parametro-categoria01';
import { CadastroAcoes } from '../../../shared/classes/cadastro-acoes';
import { ControlePaginas } from '../../../shared/classes/controle-paginas';
import { TipoOperacao } from '../../../shared/classes/tipo-operacao';
import { MensagensBotoes } from '../../../shared/classes/util';
import { CategoriaDialogData } from '../categoria-dialog/CategoriaDialogData';
import { CategoriaDialogComponent } from '../categoria-dialog/categoria-dialog.component';

@Component({
  selector: 'app-crud-categoria',
  templateUrl: './crud-categoria.component.html',
  styleUrl: './crud-categoria.component.scss',
})
export class CrudCategoriaComponent implements OnDestroy {
  inscricaoCategoria!: Subscription;

  categorias: CategoriaModel[] = [];

  controlePaginas: ControlePaginas = new ControlePaginas(0, 0);

  tamPagina: number = 50;

  parametro: ParametroModel = new ParametroModel();

  hide: boolean = false;

  constructor(
    private globalService: GlobalService,
    private categoriaSrv: CategoriaService,
    private router: Router,
    private categoriaDialog: MatDialog,
  ) {}

  ngOnDestroy() {
    this.inscricaoCategoria?.unsubscribe();
  }

  escolha(opcao: number, i: number, categoria?: CategoriaModel) {
    this.openCategoriaDialog(opcao, i, categoria);
  }

  onHome() {
    this.router.navigate(['']);
  }

  getAcoes() {
    return CadastroAcoes;
  }

  getTexto() {
    return MensagensBotoes;
  }

  getCategorias(tipoOperacao: TipoOperacao = TipoOperacao.Pesquisa) {
    let par = new ParametroCategoria01();

    par.id_empresa = this.globalService.getEmpresa().id;

    par = AtualizaParametroCategoria01(par, this.parametro.getParametro());

    if (tipoOperacao == TipoOperacao.Contador) {
      par.contador = 'S';
    } else {
      par.pagina = this.controlePaginas.getPaginalAtual();
      par.tamPagina = this.controlePaginas.getTamPagina();
    }

    this.inscricaoCategoria = this.categoriaSrv
      .getCategoriasParametro_01(par)
      .subscribe({
        next: (data: any) => {
          if (tipoOperacao == TipoOperacao.Pesquisa) {
            this.categorias = data;
          } else {
            this.controlePaginas = new ControlePaginas(
              this.tamPagina,
              data.total == 0 ? 1 : data.total,
            );
            this.getCategorias();
          }
        },
        error: (error: any) => {
          console.log(error);
          this.categorias = [];
          this.controlePaginas = new ControlePaginas(this.tamPagina, 0);
        },
      });
  }

  onChangePage() {
    this.getCategorias();
  }

  onChangeHide(hide: boolean) {
    this.hide = hide;
  }

  onChangeParametros(param: ParametroModel) {
    this.parametro = param;
    this.getCategorias(TipoOperacao.Contador);
  }

  openCategoriaDialog(
    opcao: CadastroAcoes = CadastroAcoes.Consulta,
    i: number,
    categoria?: CategoriaModel,
  ): void {
    const data: CategoriaDialogData = {
      indice: i,
      opcao: opcao,
      processar: false,
      categoria: categoria
        ? { ...categoria }
        : {
            ...new CategoriaModel(),
            id_empresa: this.globalService.getEmpresa().id,
            contador: '00',
          },
    };

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = 'dialog-categoria-component';
    dialogConfig.width = '600px';
    dialogConfig.panelClass = 'dialog-font-small';
    dialogConfig.data = data;

    this.categoriaDialog
      .open(CategoriaDialogComponent, dialogConfig)
      .beforeClosed()
      .subscribe((result: CategoriaDialogData | null) => {
        if (!result?.processar) return;

        switch (opcao) {
          case CadastroAcoes.Inclusao:
            this.categorias.push(result.categoria);
            break;
          case CadastroAcoes.Edicao:
            if (i >= 0) this.categorias[i] = result.categoria;
            break;
          case CadastroAcoes.Exclusao:
            if (i >= 0) this.categorias.splice(i, 1);
            break;
        }
      });
  }
}
