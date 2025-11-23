import { UsuarioService } from './../../../services/usuario.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlePaginas } from '../../classes/controle-paginas';
import { Subscription, finalize } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Orderby } from '../../classes/orderby';
import { AppSnackbar } from '../../classes/app-snackbar';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { GlobalService } from '../../../services/global.service';
import { EmailService } from '../../../services/email.service';
import {
  map,
  filter,
  tap,
  take,
  distinctUntilChanged,
  debounceTime,
} from 'rxjs/operators';
import { ParametroParametro01 } from '../../../parametros/parametro-parametro01';
import {
  messageError,
  GetValueJsonString,
  GetValueJsonNumber,
} from '../../classes/util';
import { ParametroModel } from '../../../models/parametro-model';
import { ParametrosService } from '../../../services/parametro.service';
import { EmailDialogData } from '../email-dialog/email-dialog-data';
import { EmailDialogComponent } from '../email-dialog/email-dialog.component';
import { DownloadDialogData } from '../download-dialog/download-dialog-data';
import { DownloadDialogComponent } from '../download-dialog/download-dialog.component';
import { ParametroSendemailv2 } from '../../../parametros/parametro-sendemailv2';
import { ParametroUsuario01 } from '../../../parametros/parametro-usuario01';
import { UsuarioModel } from '../../../models/usuario-model';
import { SimNao } from '../../classes/sim-nao';

@Component({
  selector: 'app-formulario-filtro-evento',
  templateUrl: './formulario-filtro-evento.component.html',
  styleUrl: './formulario-filtro-evento.component.css',
})
export class FormularioFiltroEventoComponent {
  @Input('PARAMNAME') paramName: string = '';
  @Input('RETORNO') retorno: boolean = false;
  @Input('EMAIL') email: boolean = false;
  @Input('DOWNLOAD') download: boolean = false;
  @Input('CONTROLE_PAGINAS') controle_paginas: ControlePaginas =
    new ControlePaginas(50, 0);
  @Input('HIDE') hide: boolean = true;
  @Output('changeParametro') change = new EventEmitter<ParametroModel>();
  @Output('changeHide') changeHide = new EventEmitter<boolean>();

  inscricaoParametro!: Subscription;
  inscricaoUsuario!: Subscription;
  inscricaoEmail!: Subscription;

  formulario: FormGroup;

  showFiltro: boolean = true;

  hideAcao: string = 'Ocultar';

  orderby: Orderby[] = [
    { sigla: '000000', descricao: 'Número' },
    { sigla: '000001', descricao: 'Descrição' },
    { sigla: '000002', descricao: 'Responsável' },
    { sigla: '000003', descricao: 'Situação' },
  ];

  responsaveis: UsuarioModel[] = [];

  parametro: ParametroModel = new ParametroModel();

  enable_filter: boolean = false;

  valueChangeSubs: Subscription[] = [];

  situacoes: SimNao[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private globalService: GlobalService,
    private usuarioSrv: UsuarioService,
    private parametrosService: ParametrosService,
    private emailService: EmailService,
    private appSnackBar: AppSnackbar,
    private EmailDialog: MatDialog,
    private DownLoadDialog: MatDialog
  ) {
    this.formulario = formBuilder.group({
      orderby: [{ value: '' }],
      id: [{ value: '' }],
      descricao: [{ value: '' }],
      id_responsavel: [{ value: '' }],
      status: [{ value: '' }],
    });
    this.situacoes = this.globalService.getSituacoesEvento();
    this.setHide();
    this.setValuesNoParam();
  }

  ngOnInit(): void {
    this.getUsuarios();
  }
  setEnableFilter(value: boolean): void {
    this.enable_filter = value;

    // Se desativar, cancelar todas as subscriptions
    if (!value) {
      this.valueChangeSubs.forEach((sub) => sub.unsubscribe());
      this.valueChangeSubs = [];
      return;
    }

    // Se ativar, registrar os valueChanges
    const idSub = this.formulario
      .get('id')
      ?.valueChanges.pipe(
        map((value) => value?.trim()),
        filter((value) => value?.length > 0),
        debounceTime(350),
        distinctUntilChanged()
      )
      .subscribe(() => this.onChangeParametros());

    const idDesc = this.formulario
      .get('descricao')
      ?.valueChanges.pipe(
        map((value) => value?.trim()),
        filter((value) => value?.length > 0),
        debounceTime(350),
        distinctUntilChanged()
      )
      .subscribe(() => this.onChangeParametros());

    this.valueChangeSubs = [idSub, idDesc].filter(
      (sub): sub is Subscription => !!sub
    );
  }

  ngOnDestroy(): void {
    this.inscricaoParametro?.unsubscribe();
    this.inscricaoEmail?.unsubscribe();
    this.inscricaoUsuario?.unsubscribe();
  }

  getUsuarios() {
    let par = new ParametroUsuario01();

    par.id_empresa = this.globalService.getEmpresa().id;

    this.inscricaoUsuario = this.usuarioSrv
      .getUsuariosParametro_01(par)
      .subscribe({
        next: (data: any) => {
          this.responsaveis = data;
          this.loadParametros();
        },
        error: (error: any) => {
          this.responsaveis = [];
          this.appSnackBar.openFailureSnackBar(
            `Problemas Na Tabela De usuários!`,
            'OK'
          );
        },
      });
  }

  onGetExcelToEmailOrDownLoad(destino: string) {
    if (destino.toUpperCase() == 'E-MAIL') {
      this.openEmailDialog();
    } else {
      this.openDownLoadDialog();
    }
  }

  sendMail(fileName: string) {
    let par = new ParametroSendemailv2();

    par.id_empresa = this.globalService.getEmpresa().id;

    par.id_evento = 1;

    par.assunto = 'Relatório Dos Ativos Do Inventário';

    par.destinatario = this.globalService.usuario.email;

    par.mensagem =
      'Mensagem enviada automaticamento por solicitação do usuário. Favor Verificar Anexo.';

    par.fileName = fileName;

    this.globalService.setSpin(true);

    this.inscricaoEmail = this.emailService.sendEmailV2(par).subscribe({
      next: (data: any) => {
        this.appSnackBar.openSuccessSnackBar(
          `E-Mail Enviado Com Sucesso!`,
          'OK'
        );
      },
      error: (error: any) => {
        this.appSnackBar.openFailureSnackBar(`Falha Ao Enviar O E-Mail`, 'OK');
      },
    });
  }

  setValues() {
    this.formulario.setValue({
      orderby: GetValueJsonString(this.parametro.getParametro(), 'orderby'),
      id: GetValueJsonNumber(this.parametro.getParametro(), 'id'),
      descricao: GetValueJsonString(this.parametro.getParametro(), 'descricao'),
      id_responsavel: GetValueJsonString(
        this.parametro.getParametro(),
        'id_responsavel'
      ),
      status: GetValueJsonString(this.parametro.getParametro(), 'status'),
    });
  }

  setValuesNoParam() {
    this.formulario.setValue({
      orderby: '',
      id: '',
      descricao: '',
      id_responsavel: '',
      status: '',
    });
  }

  setHide() {
    this.hide = !this.hide;
    this.hideAcao = this.hide ? 'Mostrar' : 'Ocultar';
  }

  onlimparParametros() {
    this.parametro = this.InicializaParametro();
    this.setEnableFilter(false);
    this.setValues();
    this.setEnableFilter(true);
    this.onChangeParametros();
  }

  InicializaParametro(): ParametroModel {
    const param = new ParametroModel();
    param.id_empresa = this.globalService.getEmpresa().id;
    param.modulo = this.paramName;
    param.assinatura = 'V1.00 06/11/2025';
    param.id_usuario = this.globalService.getUsuario().id;
    param.parametro = `
         {
            "id":"",
            "descricao":"",
            "id_responsavel":"",
            "status":"",
            "tamPagina":50,
            "contador":"N",
            "orderby":"000001",
            "page":0,
            "sharp":false
        }`;

    return param;
  }

  loadParametros() {
    this.parametro = this.InicializaParametro();
    this.getParametro();
  }

  getParametro() {
    this.globalService.setSpin(true);
    let par = new ParametroParametro01();
    par.id_empresa = this.parametro.id_empresa;
    par.modulo = this.parametro.modulo;
    par.assinatura = this.parametro.assinatura;
    par.id_usuario = this.parametro.id_usuario;

    this.inscricaoParametro = this.parametrosService
      .getParametrosParametro01(par)
      .subscribe({
        next: (data: ParametroModel[]) => {
          this.parametro = new ParametroModel();
          this.parametro.id_empresa = data[0].id_empresa;
          this.parametro.modulo = data[0].modulo;
          this.parametro.id_usuario = data[0].id_usuario;
          this.parametro.assinatura = data[0].assinatura;
          this.parametro.parametro = data[0].parametro;
          this.parametro.user_insert = data[0].user_insert;
          this.parametro.user_update = data[0].user_update;
          this.setValues();
          this.setEnableFilter(true);
          this.onChangeParametros();
        },
        error: (error: any) => {
          this.setValues();
          this.setEnableFilter(true);
          this.onChangeParametros();
        },
      });
  }

  updateParametros() {
    console.log('Salvando Parâmetros...', this.parametro.getParametro());
    this.parametro.user_insert = this.globalService.usuario.id;
    this.parametro.user_update = this.globalService.usuario.id;
    this.refreshParametro();
    this.inscricaoParametro = this.parametrosService
      .ParametroAtualiza(this.parametro)
      .subscribe({
        next: (data: ParametroModel) => {
          this.appSnackBar.openSuccessSnackBar(
            `Parâmetros Salvos Com Sucesso!`,
            'OK'
          );
        },
        error: (error: any) => {
          this.appSnackBar.openFailureSnackBar(
            `Falha Ao Salvar Os Parâmetros! ${messageError(error)}`,
            'OK'
          );
        },
      });
  }

  refreshParametro() {
    let config = this.parametro.getParametro();
    Object(config).orderby = this.formulario.value.orderby;
    Object(config).id = this.formulario.value.codigo;
    Object(config).descricao = this.formulario.value.descricao.toUpperCase();
    Object(config).id_responsavel = this.formulario.value.id_responsavel;
    Object(config).status = this.formulario.value.status;

    this.parametro.parametro = JSON.stringify(config);
  }

  onChangeParametros() {
    if (this.enable_filter) {
      this.refreshParametro();
      this.change.emit(this.parametro);
    }
  }

  onSaveConfig() {
    this.updateParametros();
  }

  onHide() {
    this.setHide();
    this.changeHide.emit(this.hide);
  }

  hasValue(campo: string): boolean {
    if (this.formulario.get(campo)?.value == '') {
      return false;
    }
    return true;
  }

  clearValue(campo: string) {
    if (campo == 'id') {
      this.formulario.patchValue({
        id: '',
      });
    }
    if (campo == 'descricao') {
      this.formulario.patchValue({
        descricao: '',
      });
    }
    if (campo == 'id_responsavel') {
      this.formulario.patchValue({
        id_responsavel: '',
      });
    }
    if (campo == 'status') {
      this.formulario.patchValue({
        status: '',
      });
    }

    this.onChangeParametros();
  }

  ChangeValue(campo: string, value: string) {
    if (campo == 'id')
      this.formulario.patchValue({
        codigo: value,
      });
    if (campo == 'descricao')
      this.formulario.patchValue({
        descricao: value,
      });
  }

  openEmailDialog(): void {
    const data: EmailDialogData = new EmailDialogData();
    data.titulo = 'ENVIAR CONSULTA VIA E-MAIL';
    data.destinatario = this.globalService.usuario.email;
    data.escopo = 'T';
    data.labelBottomNao = 'Cancelar';
    data.labelBottonSim = 'Processar';
    data.id_empresa = this.globalService.empresa.id;
    data.pagina = this.controle_paginas.getPaginalAtual();
    data.parametro = this.parametro;

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.id = 'consulta-email';
    dialogConfig.width = '800px';
    dialogConfig.data = data;
    const modalDialog = this.EmailDialog.open(
      EmailDialogComponent,
      dialogConfig
    )
      .beforeClosed()
      .subscribe((data: EmailDialogData) => {});
  }

  openDownLoadDialog(): void {
    console.log('Pagina: ', this.controle_paginas.getPaginalAtual());

    const data: DownloadDialogData = new DownloadDialogData();
    data.titulo = 'DOWNLOAD DE CONSULTA';
    data.escopo = 'T';
    data.labelBottomNao = 'Cancelar';
    data.labelBottonSim = 'Processar';
    data.id_empresa = this.globalService.empresa.id;
    data.id_evento = 1;
    data.pagina = this.controle_paginas.getPaginalAtual();
    data.parametro = this.parametro;

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.id = 'consulta-download';
    dialogConfig.width = '800px';
    dialogConfig.data = data;
    const modalDialog = this.DownLoadDialog.open(
      DownloadDialogComponent,
      dialogConfig
    )
      .beforeClosed()
      .subscribe((data: DownloadDialogData) => {});
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
}
