import { EventoService } from './../../../services/evento.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, map, Subscription } from 'rxjs';
import { CategoriaModel } from '../../../models/categoria-model';
import { EventoModel } from '../../../models/evento-model';
import { ParametroModel } from '../../../models/parametro-model';
import { ControlePaginas } from '../../classes/controle-paginas';
import { Orderby } from '../../classes/orderby';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EmailService } from '../../../services/email.service';
import { GlobalService } from '../../../services/global.service';
import { ParametroService } from '../../../services/parametro.service';
import { AppSnackbar } from '../../classes/app-snackbar';
import { SimNao } from '../../classes/sim-nao';
import { TipoPesquisa } from '../../classes/tipo-pesquisa';
import { GetValueJsonNumber, GetValueJsonString, hasNonNumeric, messageError } from '../../classes/util';
import { ParametroCategoria01 } from '../../../parametros/parametro-categoria01';
import { ParametroEvento01 } from '../../../parametros/parametro-evento01';
import { ParametroParametro01 } from '../../../parametros/parametro-parametro01';
import { ParametroSendemailv2 } from '../../../parametros/parametro-sendemailv2';
import { TipoOperacao } from '../../classes/tipo-operacao';
import {
  FinalizacaoRelatorio,
  RelatorioDialogData,
} from '../relatorio-dialog/relatorio-dialog-data';
import { RelatorioDialogComponent } from '../relatorio-dialog/relatorio-dialog.component';
import { ParametroDetplanilha01 } from '../../../parametros/parametro-detPlanilha01';
import { AtualizaParametroDetplanilha01 } from '../../classes/atualiza-parametro-detplanilha01';
import { CabplanilhaModel } from '../../../models/cabplanilha-model';

@Component({
  selector: 'app-formulario-filtro-detplanilha',
  templateUrl: './formulario-filtro-detplanilha.component.html',
  styleUrl: './formulario-filtro-detplanilha.component.scss'
})
export class FormularioFiltroDetplanilhaComponent {


    @Input('PARAMNAME') paramName: string = '';
    @Input('RETORNO') retorno: boolean = false;
    @Input('EMAIL') email: boolean = false;
    @Input('DOWNLOAD') download: boolean = false;
    @Input('CONTROLE_PAGINAS') controle_paginas: ControlePaginas =
      new ControlePaginas(50, 0);
    @Input('HIDE') hide: boolean = true;
    @Input("CABPLANILHA")cabPlanilha:CabplanilhaModel = new CabplanilhaModel();
    @Output('changeParametro') change = new EventEmitter<ParametroModel>();
    @Output('changeHide') changeHide = new EventEmitter<boolean>();

    inscricaoParametro!: Subscription;
    inscricaoEmail!: Subscription;
    inscricaoEvento!: Subscription;

    formulario: FormGroup;

    showFiltro: boolean = true;

    hideAcao: string = 'Ocultar';

    lsStatus:SimNao[] = [];

    orderby: Orderby[] = [
      { sigla: '000000', descricao: 'Nome' },
      { sigla: '000001', descricao: 'CPF' },
      { sigla: '000002', descricao: 'Nº Do Peito' },
      { sigla: '000003', descricao: 'Incrição' }
    ];

    parametro: ParametroModel = new ParametroModel();

    enable_filter: boolean = false;

    valueChangeSubs: Subscription[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private globalService: GlobalService,
        private parametroService: ParametroService,
        private eventoSrv:EventoService,
        private emailService: EmailService,
        private appSnackBar: AppSnackbar,
        private dialog: MatDialog,
      ) {
        console.log("Olha o ParamName:",this.paramName)
        this.formulario = formBuilder.group({
          orderby: [{ value: '' }],
          pesquisa: [{ value: '' }],
          status: [{ value: '' }],        });
        this.lsStatus = this.globalService.getDetalhe_situacoes();
        this.setHide();
        this.setValuesNoParam();
        this.loadParametros();
      }

        ngOnInit(): void {
          this.parametro = this.InicializaParametro();
          this.setValuesNoParam();


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
          const pesquisaSub = this.formulario
            .get('pesquisa')
            ?.valueChanges.pipe(
              map((value) => value?.trim()),
              filter((value) => value?.length >= 0),
              debounceTime(350),
              distinctUntilChanged(),
            )
            .subscribe(() => this.onChangeParametros());

          this.valueChangeSubs = [pesquisaSub].filter(
            (sub): sub is Subscription => !!sub,
          );
        }

        ngOnDestroy(): void {
          this.inscricaoParametro?.unsubscribe();
          this.inscricaoEmail?.unsubscribe();
          this.inscricaoEvento?.unsubscribe();
          this.valueChangeSubs.forEach((sub) => sub.unsubscribe());
        }



  onGetExcelToEmailOrDownLoad(destino: string) {
    this.openRelatorioDialog(
      destino.toUpperCase() == 'E-MAIL' ? 'email' : 'download',
    );
  }

  sendMail(fileName: string) {
    let par = new ParametroSendemailv2();

    par.id_empresa = this.globalService.getEmpresa().id;

    par.id_evento = this.cabPlanilha.id_evento;

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
          'OK',
        );
      },
      error: (error: any) => {
        this.appSnackBar.openFailureSnackBar(`Falha Ao Enviar O E-Mail`, 'OK');
      },
    });
  }

  setValues() {
    try {
      console.log("status => ",this.parametro.getParametro(), 'status');
    } catch (error){
      console.log(error);
    }
    this.formulario.setValue({
      orderby: GetValueJsonString(this.parametro.getParametro(), 'orderby'),
      pesquisa:
        GetValueJsonString(
          this.parametro.getParametro(),
          'pesquisa',
        ).toUpperCase() || '',
      status: GetValueJsonString(this.parametro.getParametro(), 'status') || '',
    });
  }

  setValuesNoParam() {
    this.formulario.setValue({
      orderby: '000001',
      pesquisa: '',
      status: ''
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
    console.log("PARAMNAME", this.paramName);
    const param = new ParametroModel();
    param.id_empresa = this.globalService.getEmpresa().id;
    param.modulo = this.paramName;
    param.assinatura = 'V1.00 20/04/2026';
    param.id_usuario = this.globalService.getUsuario().id;
    param.parametro = JSON.stringify({
      id_evento: "",
      pesquisa: "",
      pesquisarPor: "",
      status: "",
      tamPagina: 50,
      contador: "N",
      orderby: "000001",
      page: 0,
      sharp: false
    });


    console.log("Param Zerado..",param);

    return param;
  }

  loadParametros() {
    this.parametro = this.InicializaParametro();
    console.log("Parametro Inicializado:" , this.parametro);
    this.getParametro();
  }

  getParametro() {
    this.globalService.setSpin(true);
    let par = new ParametroParametro01();
    par.id_empresa = this.parametro.id_empresa;
    par.modulo = this.parametro.modulo;
    par.assinatura = this.parametro.assinatura;
    par.id_usuario = this.parametro.id_usuario;

    console.log("ParametroParametro01", this.parametro);


    this.inscricaoParametro = this.parametroService
      .getParametrosParametro_01(par)
      .subscribe({
        next: (data: ParametroModel[]) => {
          console.log("Achei",data);
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
    this.inscricaoParametro = this.parametroService
      .ParametroAtualiza(this.parametro)
      .subscribe({
        next: (data: ParametroModel) => {
          this.appSnackBar.openSuccessSnackBar(
            `Parâmetros Salvos Com Sucesso!`,
            'OK',
          );
        },
        error: (error: any) => {
          this.appSnackBar.openFailureSnackBar(
            `Falha Ao Salvar Os Parâmetros! ${messageError(error)}`,
            'OK',
          );
        },
      });
  }

  refreshParametro() {
    let config = this.parametro.getParametro();
    console.log('parametro para refresh', config);
    Object(config).orderby = this.formulario.value.orderby;
    Object(config).id_evento = this.cabPlanilha.id_evento;
    Object(config).pesquisa =
      this.formulario.value.pesquisa.toUpperCase() || '';
    Object(config).pesquisarPor = this.definirPesquisa();
    Object(config).status = this.formulario.value.status;
    this.parametro.parametro = JSON.stringify(config);
  }

  onChangeParametros() {
    this.refreshParametro();
    this.change.emit(this.parametro);
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
    if (campo == 'pesquisa') {
      this.formulario.patchValue({
        pesquisa: '',
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
    if (campo == 'pesquisa')
      this.formulario.patchValue({
        pesquisa: value,
      });
  }

  /**
   * Relatório assíncrono (Excel): cria uma tarefa no backend e acompanha por polling curto.
   * Os parâmetros seguem o mesmo caminho da listagem do detalhe da planilha: empresa,
   * planilha (id_cabec) e evento da planilha selecionada + configuração do filtro ->
   * ParametroDetplanilha01 tipado. O diálogo só decide a paginação (pagina 0 = toda a consulta).
   */
  openRelatorioDialog(finalizacao: FinalizacaoRelatorio): void {
    let par = new ParametroDetplanilha01();
    par.id_empresa = this.globalService.getEmpresa().id;
    par.id_cabec = this.cabPlanilha.id;
    par.id_evento = this.cabPlanilha.id_evento;
    par = AtualizaParametroDetplanilha01(par, this.parametro.getParametro());

    const data: RelatorioDialogData = new RelatorioDialogData();
    data.titulo =
      finalizacao === 'email'
        ? 'ENVIAR CONSULTA VIA E-MAIL'
        : 'DOWNLOAD DE CONSULTA';
    data.sigla = 'detplanilha01';
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

  definirPesquisa(): TipoPesquisa {
    const texto = this.formulario.get('pesquisa')?.value || '';
    if (texto.trim().length == 0) {
      return TipoPesquisa.None;
    }
    const isTexto = hasNonNumeric(texto);
    if (isTexto) {
      return TipoPesquisa.Nome;
    }
    if (texto.trim().length == 6) {
      return TipoPesquisa.Inscricao;
    }
    if (texto.trim().length < 6) {
      return TipoPesquisa.Nro_Peito;
    }
    return TipoPesquisa.Cpf;
  }

  getTextoTipoPesquisa(): string {
    const tipo = parseInt(
      Object(this.parametro.getParametro()).pesquisarPor,
      10,
    );
    switch (tipo) {
      case TipoPesquisa.Nome:
        return 'Pelo Nome';

      case TipoPesquisa.Cpf:
        return 'Pelo CPF';

      case TipoPesquisa.Inscricao:
        return 'Pela Incrição';

      case TipoPesquisa.Nro_Peito:
        return 'Pelo Nº Do Peito';

      default:
        return '';
    }
  }



}
