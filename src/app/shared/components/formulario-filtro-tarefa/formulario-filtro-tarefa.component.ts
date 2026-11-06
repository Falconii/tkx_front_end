import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ParametroModel } from '../../../models/parametro-model';
import { RelatorioDisponivel, TarefaSituacoes } from '../../../models/tarefa-model';
import { ParametroParametro01 } from '../../../parametros/parametro-parametro01';
import { GlobalService } from '../../../services/global.service';
import { ParametroService } from '../../../services/parametro.service';
import { TarefaService } from '../../../services/tarefa.service';
import { AppSnackbar } from '../../classes/app-snackbar';
import { Orderby } from '../../classes/orderby';
import { SimNao } from '../../classes/sim-nao';
import { GetValueJsonString, messageError } from '../../classes/util';

@Component({
  selector: 'app-formulario-filtro-tarefa',
  templateUrl: './formulario-filtro-tarefa.component.html',
  styleUrl: './formulario-filtro-tarefa.component.css',
})
export class FormularioFiltroTarefaComponent implements OnInit, OnDestroy {
  @Input('PARAMNAME') paramName: string = '';
  @Input('HIDE') hide: boolean = true;
  @Output('changeParametro') change = new EventEmitter<ParametroModel>();
  @Output('changeHide') changeHide = new EventEmitter<boolean>();

  inscricaoParametro!: Subscription;
  inscricaoRelatorios!: Subscription;

  formulario: FormGroup;

  orderby: Orderby[] = [
    { sigla: '000000', descricao: 'Mais recentes' },
    { sigla: '000001', descricao: 'Mais antigas' },
  ];

  situacoes: SimNao[] = TarefaSituacoes;
  relatorios: RelatorioDisponivel[] = [];

  parametro: ParametroModel = new ParametroModel();

  enable_filter: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private globalService: GlobalService,
    private parametroService: ParametroService,
    private tarefaSrv: TarefaService,
    private appSnackBar: AppSnackbar,
  ) {
    this.formulario = formBuilder.group({
      orderby: [''],
      status: [''],
      sigla: [''],
    });
  }

  ngOnInit(): void {
    this.inscricaoRelatorios = this.tarefaSrv.getRelatorios().subscribe({
      next: (lista) => (this.relatorios = lista),
      error: () => (this.relatorios = []),
    });
    this.loadParametros();
  }

  ngOnDestroy(): void {
    this.inscricaoParametro?.unsubscribe();
    this.inscricaoRelatorios?.unsubscribe();
  }

  /* ---------- parâmetros salvos por usuário/módulo ---------- */
  InicializaParametro(): ParametroModel {
    const param = new ParametroModel();
    param.id_empresa = this.globalService.getEmpresa().id;
    param.modulo = this.paramName;
    param.assinatura = 'V1.00 05/11/2026';
    param.id_usuario = this.globalService.getUsuario().id;
    param.parametro = JSON.stringify({
      status: '',
      sigla: '',
      orderby: '000000',
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
    this.enable_filter = false;
    this.setValues();
    this.enable_filter = true;
    this.onChangeParametros();
  }

  setValues() {
    const config = this.parametro.getParametro();
    this.formulario.setValue({
      orderby: GetValueJsonString(config, 'orderby') ?? '000000',
      status: GetValueJsonString(config, 'status') ?? '',
      sigla: GetValueJsonString(config, 'sigla') ?? '',
    });
  }

  refreshParametro() {
    const config = this.parametro.getParametro();
    const form = this.formulario.value;
    Object(config).orderby = form.orderby;
    Object(config).status = form.status ?? '';
    Object(config).sigla = form.sigla ?? '';
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

  onHide() {
    this.hide = !this.hide;
    this.changeHide.emit(this.hide);
  }

  clearValue(campo: string) {
    this.formulario.patchValue({ [campo]: '' });
    this.onChangeParametros();
  }
}
