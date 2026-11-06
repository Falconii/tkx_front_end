import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { ParametroModel } from '../../../models/parametro-model';
import { ParametroCategoria01 } from '../../../parametros/parametro-categoria01';
import { ParametroParametro01 } from '../../../parametros/parametro-parametro01';
import { GlobalService } from '../../../services/global.service';
import { ParametroService } from '../../../services/parametro.service';
import { AppSnackbar } from '../../classes/app-snackbar';
import { AtualizaParametroCategoria01 } from '../../classes/atualiza-parametro-categoria01';
import { ControlePaginas } from '../../classes/controle-paginas';
import { Orderby } from '../../classes/orderby';
import { GetValueJsonString, messageError } from '../../classes/util';
import {
  FinalizacaoRelatorio,
  RelatorioDialogData,
} from '../relatorio-dialog/relatorio-dialog-data';
import { RelatorioDialogComponent } from '../relatorio-dialog/relatorio-dialog.component';

@Component({
  selector: 'app-formulario-filtro-categoria',
  templateUrl: './formulario-filtro-categoria.component.html',
  styleUrl: './formulario-filtro-categoria.component.css',
})
export class FormularioFiltroCategoriaComponent implements OnInit, OnDestroy {
  @Input('PARAMNAME') paramName: string = '';
  @Input('EMAIL') email: boolean = false;
  @Input('DOWNLOAD') download: boolean = false;
  @Input('CONTROLE_PAGINAS') controle_paginas: ControlePaginas =
    new ControlePaginas(50, 0);
  @Input('HIDE') hide: boolean = true;
  @Output('changeParametro') change = new EventEmitter<ParametroModel>();
  @Output('changeHide') changeHide = new EventEmitter<boolean>();

  inscricaoParametro!: Subscription;
  valueChangeSubs: Subscription[] = [];

  formulario: FormGroup;

  hideAcao: string = 'Ocultar';

  orderby: Orderby[] = [
    { sigla: '000000', descricao: 'Código' },
    { sigla: '000001', descricao: 'Descrição' },
  ];

  parametro: ParametroModel = new ParametroModel();

  enable_filter: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private globalService: GlobalService,
    private parametroService: ParametroService,
    private appSnackBar: AppSnackbar,
    private dialog: MatDialog,
  ) {
    this.formulario = formBuilder.group({
      orderby: [''],
      id: [''],
      descricao: [''],
    });
    this.setHide();
  }

  ngOnInit(): void {
    this.loadParametros();
  }

  ngOnDestroy(): void {
    this.inscricaoParametro?.unsubscribe();
    this.valueChangeSubs.forEach((sub) => sub.unsubscribe());
  }

  /* ---------- reação aos campos de texto ---------- */
  setEnableFilter(value: boolean): void {
    this.enable_filter = value;

    this.valueChangeSubs.forEach((sub) => sub.unsubscribe());
    this.valueChangeSubs = [];
    if (!value) return;

    for (const campo of ['id', 'descricao']) {
      const sub = this.formulario
        .get(campo)
        ?.valueChanges.pipe(
          map((v) => String(v ?? '').trim()),
          filter((v) => v.length >= 0),
          debounceTime(350),
          distinctUntilChanged(),
        )
        .subscribe(() => this.onChangeParametros());
      if (sub) this.valueChangeSubs.push(sub);
    }
  }

  /* ---------- parâmetros salvos por usuário/módulo ---------- */
  InicializaParametro(): ParametroModel {
    const param = new ParametroModel();
    param.id_empresa = this.globalService.getEmpresa().id;
    param.modulo = this.paramName;
    param.assinatura = 'V1.00 05/11/2026';
    param.id_usuario = this.globalService.getUsuario().id;
    param.parametro = JSON.stringify({
      id: '',
      descricao: '',
      orderby: '000001',
      sharp: false,
    });
    return param;
  }

  loadParametros() {
    this.parametro = this.InicializaParametro();
    this.getParametro();
  }

  getParametro() {
    const par = new ParametroParametro01();
    par.id_empresa = this.parametro.id_empresa;
    par.modulo = this.parametro.modulo;
    par.assinatura = this.parametro.assinatura;
    par.id_usuario = this.parametro.id_usuario;

    this.inscricaoParametro = this.parametroService
      .getParametrosParametro_01(par)
      .subscribe({
        next: (data: ParametroModel[]) => {
          const salvo = data[0];
          this.parametro = new ParametroModel();
          this.parametro.id_empresa = salvo.id_empresa;
          this.parametro.modulo = salvo.modulo;
          this.parametro.id_usuario = salvo.id_usuario;
          this.parametro.assinatura = salvo.assinatura;
          this.parametro.parametro = salvo.parametro;
          this.parametro.user_insert = salvo.user_insert;
          this.parametro.user_update = salvo.user_update;
          this.iniciarFiltro();
        },
        error: () => this.iniciarFiltro(), // sem parâmetros salvos: usa o padrão
      });
  }

  private iniciarFiltro() {
    this.setEnableFilter(false);
    this.setValues();
    this.setEnableFilter(true);
    this.onChangeParametros();
  }

  setValues() {
    const config = this.parametro.getParametro();
    this.formulario.setValue({
      orderby: GetValueJsonString(config, 'orderby') ?? '000001',
      id: GetValueJsonString(config, 'id') ?? '',
      descricao: GetValueJsonString(config, 'descricao') ?? '',
    });
  }

  refreshParametro() {
    const config = this.parametro.getParametro();
    const form = this.formulario.value;
    Object(config).orderby = form.orderby;
    Object(config).id = String(form.id ?? '').trim();
    Object(config).descricao = String(form.descricao ?? '').toUpperCase();
    this.parametro.parametro = JSON.stringify(config);
  }

  updateParametros() {
    this.parametro.user_insert = this.globalService.usuario.id;
    this.parametro.user_update = this.globalService.usuario.id;
    this.refreshParametro();
    this.inscricaoParametro = this.parametroService
      .ParametroAtualiza(this.parametro)
      .subscribe({
        next: () =>
          this.appSnackBar.openSuccessSnackBar('Parâmetros Salvos Com Sucesso!', 'OK'),
        error: (error: any) =>
          this.appSnackBar.openFailureSnackBar(
            `Falha Ao Salvar Os Parâmetros! ${messageError(error)}`,
            'OK',
          ),
      });
  }

  onChangeParametros() {
    if (this.enable_filter) {
      this.refreshParametro();
      this.change.emit(this.parametro);
    }
  }

  onlimparParametros() {
    this.parametro = this.InicializaParametro();
    this.iniciarFiltro();
  }

  onSaveConfig() {
    this.updateParametros();
  }

  /* ---------- mostrar/esconder ---------- */
  setHide() {
    this.hide = !this.hide;
    this.hideAcao = this.hide ? 'Mostrar' : 'Ocultar';
  }

  onHide() {
    this.setHide();
    this.changeHide.emit(this.hide);
  }

  hasValue(campo: string): boolean {
    return this.formulario.get(campo)?.value !== '';
  }

  clearValue(campo: string) {
    this.formulario.patchValue({ [campo]: '' });
    this.onChangeParametros();
  }

  /* ---------- relatório (Excel) ---------- */
  onGetExcelToEmailOrDownLoad(destino: string) {
    this.openRelatorioDialog(
      destino.toUpperCase() == 'E-MAIL' ? 'email' : 'download',
    );
  }

  /**
   * Relatório assíncrono (Excel): cria uma tarefa no backend e acompanha por polling curto.
   * Os parâmetros seguem o mesmo caminho da listagem: configuração do filtro ->
   * ParametroCategoria01 tipado. O diálogo só decide a paginação (pagina 0 = toda a consulta).
   */
  openRelatorioDialog(finalizacao: FinalizacaoRelatorio): void {
    let par = new ParametroCategoria01();
    par.id_empresa = this.globalService.getEmpresa().id;
    par = AtualizaParametroCategoria01(par, this.parametro.getParametro());

    const data: RelatorioDialogData = new RelatorioDialogData();
    data.titulo =
      finalizacao === 'email'
        ? 'ENVIAR CONSULTA VIA E-MAIL'
        : 'DOWNLOAD DE CONSULTA';
    data.sigla = 'categoria01';
    data.finalizacao = finalizacao;
    data.destinatario = this.globalService.usuario.email;
    data.escopo = 'T';
    data.pagina = this.controle_paginas.getPaginalAtual();
    data.tamPagina = this.controle_paginas.getTamPagina();
    data.parametros = par;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = 'consulta-relatorio';
    dialogConfig.width = '800px';
    dialogConfig.data = data;
    this.dialog.open(RelatorioDialogComponent, dialogConfig);
  }
}
