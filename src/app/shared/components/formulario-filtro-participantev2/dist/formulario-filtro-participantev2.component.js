"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FormularioFiltroParticipantev2Component = void 0;
var tipo_pesquisa_1 = require("./../../classes/tipo-pesquisa");
var core_1 = require("@angular/core");
var controle_paginas_1 = require("../../classes/controle-paginas");
var dialog_1 = require("@angular/material/dialog");
var operators_1 = require("rxjs/operators");
var parametro_parametro01_1 = require("../../../parametros/parametro-parametro01");
var util_1 = require("../../classes/util");
var parametro_model_1 = require("../../../models/parametro-model");
var email_dialog_data_1 = require("../email-dialog/email-dialog-data");
var email_dialog_component_1 = require("../email-dialog/email-dialog.component");
var download_dialog_data_1 = require("../download-dialog/download-dialog-data");
var download_dialog_component_1 = require("../download-dialog/download-dialog.component");
var parametro_sendemailv2_1 = require("../../../parametros/parametro-sendemailv2");
var util_2 = require("../../classes/util");
var tipo_operacao_1 = require("../../classes/tipo-operacao");
var parametro_evento01_1 = require("../../../parametros/parametro-evento01");
var parametro_categoria01_1 = require("../../../parametros/parametro-categoria01");
var FormularioFiltroParticipantev2Component = /** @class */ (function () {
    function FormularioFiltroParticipantev2Component(formBuilder, globalService, parametroService, emailService, categoriaSrv, eventoSrv, appSnackBar, EmailDialog, DownLoadDialog) {
        this.formBuilder = formBuilder;
        this.globalService = globalService;
        this.parametroService = parametroService;
        this.emailService = emailService;
        this.categoriaSrv = categoriaSrv;
        this.eventoSrv = eventoSrv;
        this.appSnackBar = appSnackBar;
        this.EmailDialog = EmailDialog;
        this.DownLoadDialog = DownLoadDialog;
        this.paramName = '';
        this.retorno = false;
        this.email = false;
        this.download = false;
        this.controle_paginas = new controle_paginas_1.ControlePaginas(50, 0);
        this.hide = true;
        this.change = new core_1.EventEmitter();
        this.changeHide = new core_1.EventEmitter();
        this.showFiltro = true;
        this.hideAcao = 'Ocultar';
        this.orderby = [
            { sigla: '000000', descricao: 'Inscrição' },
            { sigla: '000001', descricao: 'Nº Do Peito' },
            { sigla: '000002', descricao: 'Categoria' },
            { sigla: '000003', descricao: 'Nome' },
            { sigla: '000004', descricao: 'CPF' },
        ];
        this.parametro = new parametro_model_1.ParametroModel();
        this.enable_filter = false;
        this.valueChangeSubs = [];
        this.eventos = [];
        this.categorias = [];
        this.tamPagina = 50;
        this.controlePaginas = new controle_paginas_1.ControlePaginas(50, 0);
        this.formulario = formBuilder.group({
            orderby: [{ value: '' }],
            id_evento: [{ value: 0 }],
            pesquisa: [{ value: '' }],
            id: [{ value: '' }],
            id_categoria: [{ value: '' }]
        });
        this.setHide();
        this.setValuesNoParam();
    }
    FormularioFiltroParticipantev2Component.prototype.ngOnInit = function () {
        this.parametro = this.InicializaParametro();
        this.setValuesNoParam();
        this.getEventos(tipo_operacao_1.TipoOperacao.Contador);
        /* try {
          this.parametro = this.InicializaParametro();
          this.setValuesNoParam();
    
          const par = JSON.parse(this.parametro.parametro);
          console.log('Parametro de Consulta', par);
          this.setEnableFilter(true);
        } catch (error) {
          console.log('Erro ao carregar os parâmetros de consulta', error);
        } */
    };
    FormularioFiltroParticipantev2Component.prototype.setEnableFilter = function (value) {
        var _this = this;
        var _a, _b;
        this.enable_filter = value;
        // Se desativar, cancelar todas as subscriptions
        if (!value) {
            this.valueChangeSubs.forEach(function (sub) { return sub.unsubscribe(); });
            this.valueChangeSubs = [];
            return;
        }
        // Se ativar, registrar os valueChanges
        var pesquisaSub = (_a = this.formulario
            .get('pesquisa')) === null || _a === void 0 ? void 0 : _a.valueChanges.pipe(operators_1.map(function (value) { return value === null || value === void 0 ? void 0 : value.trim(); }), operators_1.filter(function (value) { return (value === null || value === void 0 ? void 0 : value.length) >= 0; }), operators_1.debounceTime(350), operators_1.distinctUntilChanged()).subscribe(function () { return _this.onChangeParametros(); });
        var idSub = (_b = this.formulario
            .get('id')) === null || _b === void 0 ? void 0 : _b.valueChanges.pipe(operators_1.map(function (value) { return value === null || value === void 0 ? void 0 : value.trim(); }), operators_1.filter(function (value) { return (value === null || value === void 0 ? void 0 : value.length) >= 0; }), operators_1.debounceTime(350), operators_1.distinctUntilChanged()).subscribe(function () { return _this.onChangeParametros(); });
        this.valueChangeSubs = [pesquisaSub].filter(function (sub) { return !!sub; });
    };
    FormularioFiltroParticipantev2Component.prototype.ngOnDestroy = function () {
        var _a, _b, _c, _d;
        (_a = this.inscricaoParametro) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        (_b = this.inscricaoEmail) === null || _b === void 0 ? void 0 : _b.unsubscribe();
        (_c = this.inscricaoEvento) === null || _c === void 0 ? void 0 : _c.unsubscribe();
        (_d = this.InscricaoCategoria) === null || _d === void 0 ? void 0 : _d.unsubscribe();
        this.valueChangeSubs.forEach(function (sub) { return sub.unsubscribe(); });
    };
    FormularioFiltroParticipantev2Component.prototype.getEventos = function (tipoOperacao) {
        var _this = this;
        if (tipoOperacao === void 0) { tipoOperacao = tipo_operacao_1.TipoOperacao.Pesquisa; }
        var par = new parametro_evento01_1.ParametroEvento01();
        par.id_empresa = this.globalService.getEmpresa().id;
        par.orderby = '000001';
        if (tipoOperacao == tipo_operacao_1.TipoOperacao.Contador) {
            par.contador = 'S';
        }
        else {
            par.pagina = this.controlePaginas.getPaginalAtual();
            par.tamPagina = this.controlePaginas.getTamPagina();
        }
        this.inscricaoEvento = this.eventoSrv
            .getEventosParametro_01(par)
            .subscribe({
            next: function (data) {
                if (tipoOperacao == tipo_operacao_1.TipoOperacao.Pesquisa) {
                    _this.eventos = data;
                    _this.getCategorias(tipo_operacao_1.TipoOperacao.Contador);
                }
                else {
                    _this.controlePaginas = new controle_paginas_1.ControlePaginas(_this.tamPagina, data.total == 0 ? 1 : data.total);
                    _this.getEventos();
                }
            },
            error: function (error) {
                console.log(error);
                _this.eventos = [];
                _this.controlePaginas = new controle_paginas_1.ControlePaginas(_this.tamPagina, 0);
            }
        });
    };
    FormularioFiltroParticipantev2Component.prototype.getCategorias = function (tipoOperacao) {
        var _this = this;
        if (tipoOperacao === void 0) { tipoOperacao = tipo_operacao_1.TipoOperacao.Pesquisa; }
        var par = new parametro_categoria01_1.ParametroCategoria01();
        par.id_empresa = this.globalService.getEmpresa().id;
        par.orderby = '000001';
        if (tipoOperacao == tipo_operacao_1.TipoOperacao.Contador) {
            par.contador = 'S';
        }
        else {
            par.pagina = this.controlePaginas.getPaginalAtual();
            par.tamPagina = this.controlePaginas.getTamPagina();
        }
        this.InscricaoCategoria = this.categoriaSrv
            .getCategoriasParametro_01(par)
            .subscribe({
            next: function (data) {
                if (tipoOperacao == tipo_operacao_1.TipoOperacao.Pesquisa) {
                    _this.categorias = data;
                    _this.loadParametros();
                }
                else {
                    _this.controlePaginas = new controle_paginas_1.ControlePaginas(_this.tamPagina, data.total == 0 ? 1 : data.total);
                    _this.getCategorias();
                }
            },
            error: function (error) {
                console.log(error);
                _this.categorias = [];
                _this.controlePaginas = new controle_paginas_1.ControlePaginas(_this.tamPagina, 0);
            }
        });
    };
    FormularioFiltroParticipantev2Component.prototype.onGetExcelToEmailOrDownLoad = function (destino) {
        if (destino.toUpperCase() == 'E-MAIL') {
            this.openEmailDialog();
        }
        else {
            this.openDownLoadDialog();
        }
    };
    FormularioFiltroParticipantev2Component.prototype.sendMail = function (fileName) {
        var _this = this;
        var par = new parametro_sendemailv2_1.ParametroSendemailv2();
        par.id_empresa = this.globalService.getEmpresa().id;
        par.id_evento = 1;
        par.assunto = 'Relatório Dos Ativos Do Inventário';
        par.destinatario = this.globalService.usuario.email;
        par.mensagem =
            'Mensagem enviada automaticamento por solicitação do usuário. Favor Verificar Anexo.';
        par.fileName = fileName;
        this.globalService.setSpin(true);
        this.inscricaoEmail = this.emailService.sendEmailV2(par).subscribe({
            next: function (data) {
                _this.appSnackBar.openSuccessSnackBar("E-Mail Enviado Com Sucesso!", 'OK');
            },
            error: function (error) {
                _this.appSnackBar.openFailureSnackBar("Falha Ao Enviar O E-Mail", 'OK');
            }
        });
    };
    FormularioFiltroParticipantev2Component.prototype.setValues = function () {
        this.formulario.setValue({
            orderby: util_1.GetValueJsonString(this.parametro.getParametro(), 'orderby'),
            pesquisa: util_1.GetValueJsonString(this.parametro.getParametro(), 'pesquisa').toUpperCase() || '',
            id: util_1.GetValueJsonNumber(this.parametro.getParametro(), 'id'),
            id_evento: util_1.GetValueJsonNumber(this.parametro.getParametro(), 'id_evento'),
            id_categoria: util_1.GetValueJsonNumber(this.parametro.getParametro(), 'id_categoria')
        });
    };
    FormularioFiltroParticipantev2Component.prototype.setValuesNoParam = function () {
        this.formulario.setValue({
            orderby: '000001',
            pesquisa: '',
            id: '',
            id_evento: '',
            id_categoria: ''
        });
    };
    FormularioFiltroParticipantev2Component.prototype.setHide = function () {
        this.hide = !this.hide;
        this.hideAcao = this.hide ? 'Mostrar' : 'Ocultar';
    };
    FormularioFiltroParticipantev2Component.prototype.onlimparParametros = function () {
        this.parametro = this.InicializaParametro();
        this.setEnableFilter(false);
        this.setValues();
        this.setEnableFilter(true);
        this.onChangeParametros();
    };
    FormularioFiltroParticipantev2Component.prototype.InicializaParametro = function () {
        var param = new parametro_model_1.ParametroModel();
        param.id_empresa = this.globalService.getEmpresa().id;
        param.modulo = this.paramName;
        param.assinatura = 'V1.00 20/04/2026';
        param.id_usuario = this.globalService.getUsuario().id;
        param.parametro = JSON.stringify({
            id_evento: '',
            pesquisa: '',
            pesquisarPor: '',
            id: '',
            id_categoria: '',
            tamPagina: 50,
            contador: '',
            orderby: '000001',
            page: 0,
            sharp: false
        });
        return param;
    };
    FormularioFiltroParticipantev2Component.prototype.loadParametros = function () {
        this.parametro = this.InicializaParametro();
        this.getParametro();
    };
    FormularioFiltroParticipantev2Component.prototype.getParametro = function () {
        var _this = this;
        this.globalService.setSpin(true);
        var par = new parametro_parametro01_1.ParametroParametro01();
        par.id_empresa = this.parametro.id_empresa;
        par.modulo = this.parametro.modulo;
        par.assinatura = this.parametro.assinatura;
        par.id_usuario = this.parametro.id_usuario;
        this.inscricaoParametro = this.parametroService
            .getParametrosParametro_01(par)
            .subscribe({
            next: function (data) {
                _this.parametro = new parametro_model_1.ParametroModel();
                _this.parametro.id_empresa = data[0].id_empresa;
                _this.parametro.modulo = data[0].modulo;
                _this.parametro.id_usuario = data[0].id_usuario;
                _this.parametro.assinatura = data[0].assinatura;
                _this.parametro.parametro = data[0].parametro;
                _this.parametro.user_insert = data[0].user_insert;
                _this.parametro.user_update = data[0].user_update;
                _this.setValues();
                _this.setEnableFilter(true);
                _this.onChangeParametros();
            },
            error: function (error) {
                console.log(_this.parametro.getParametro());
                _this.setValues();
                _this.setEnableFilter(true);
                _this.onChangeParametros();
            }
        });
    };
    FormularioFiltroParticipantev2Component.prototype.updateParametros = function () {
        var _this = this;
        console.log('Salvando Parâmetros...', this.parametro.getParametro());
        this.parametro.user_insert = this.globalService.usuario.id;
        this.parametro.user_update = this.globalService.usuario.id;
        this.refreshParametro();
        this.inscricaoParametro = this.parametroService
            .ParametroAtualiza(this.parametro)
            .subscribe({
            next: function (data) {
                _this.appSnackBar.openSuccessSnackBar("Par\u00E2metros Salvos Com Sucesso!", 'OK');
            },
            error: function (error) {
                _this.appSnackBar.openFailureSnackBar("Falha Ao Salvar Os Par\u00E2metros! " + util_1.messageError(error), 'OK');
            }
        });
    };
    FormularioFiltroParticipantev2Component.prototype.refreshParametro = function () {
        var config = this.parametro.getParametro();
        console.log('parametro para refresh', config);
        Object(config).orderby = this.formulario.value.orderby;
        Object(config).pesquisa =
            this.formulario.value.pesquisa.toUpperCase() || '';
        Object(config).pesquisarPor = this.definirPesquisa();
        Object(config).id = this.formulario.value.id;
        Object(config).id_evento = this.formulario.value.id_evento;
        Object(config).id_categoria = this.formulario.value.id_categoria;
        this.parametro.parametro = JSON.stringify(config);
    };
    FormularioFiltroParticipantev2Component.prototype.onChangeParametros = function () {
        this.refreshParametro();
        this.change.emit(this.parametro);
    };
    FormularioFiltroParticipantev2Component.prototype.onSaveConfig = function () {
        this.updateParametros();
    };
    FormularioFiltroParticipantev2Component.prototype.onHide = function () {
        this.setHide();
        this.changeHide.emit(this.hide);
    };
    FormularioFiltroParticipantev2Component.prototype.hasValue = function (campo) {
        var _a;
        if (((_a = this.formulario.get(campo)) === null || _a === void 0 ? void 0 : _a.value) == '') {
            return false;
        }
        return true;
    };
    FormularioFiltroParticipantev2Component.prototype.clearValue = function (campo) {
        if (campo == 'pesquisa') {
            this.formulario.patchValue({
                pesquisa: ''
            });
        }
        if (campo == 'id') {
            this.formulario.patchValue({
                id: ''
            });
        }
        if (campo == 'id_evento') {
            this.formulario.patchValue({
                id_evento: ''
            });
        }
        if (campo == 'id_categoria') {
            this.formulario.patchValue({
                id_categoria: ''
            });
        }
        this.onChangeParametros();
    };
    FormularioFiltroParticipantev2Component.prototype.ChangeValue = function (campo, value) {
        if (campo == 'pesquisa')
            this.formulario.patchValue({
                pesquisa: value
            });
    };
    FormularioFiltroParticipantev2Component.prototype.openEmailDialog = function () {
        var data = new email_dialog_data_1.EmailDialogData();
        data.titulo = 'ENVIAR CONSULTA VIA E-MAIL';
        data.destinatario = this.globalService.usuario.email;
        data.escopo = 'T';
        data.labelBottomNao = 'Cancelar';
        data.labelBottonSim = 'Processar';
        data.id_empresa = this.globalService.empresa.id;
        data.pagina = this.controle_paginas.getPaginalAtual();
        data.parametro = this.parametro;
        var dialogConfig = new dialog_1.MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.id = 'consulta-email';
        dialogConfig.width = '800px';
        dialogConfig.data = data;
        var modalDialog = this.EmailDialog.open(email_dialog_component_1.EmailDialogComponent, dialogConfig)
            .beforeClosed()
            .subscribe(function (data) { });
    };
    FormularioFiltroParticipantev2Component.prototype.openDownLoadDialog = function () {
        console.log('Pagina: ', this.controle_paginas.getPaginalAtual());
        var data = new download_dialog_data_1.DownloadDialogData();
        data.titulo = 'DOWNLOAD DE CONSULTA';
        data.escopo = 'T';
        data.labelBottomNao = 'Cancelar';
        data.labelBottonSim = 'Processar';
        data.id_empresa = this.globalService.empresa.id;
        data.id_evento = 1;
        data.pagina = this.controle_paginas.getPaginalAtual();
        data.parametro = this.parametro;
        var dialogConfig = new dialog_1.MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.id = 'consulta-download';
        dialogConfig.width = '800px';
        dialogConfig.data = data;
        var modalDialog = this.DownLoadDialog.open(download_dialog_component_1.DownloadDialogComponent, dialogConfig)
            .beforeClosed()
            .subscribe(function (data) { });
    };
    FormularioFiltroParticipantev2Component.prototype.NoValidtouchedOrDirty = function (campo) {
        var _a, _b, _c;
        if (!((_a = this.formulario.get(campo)) === null || _a === void 0 ? void 0 : _a.valid) &&
            (((_b = this.formulario.get(campo)) === null || _b === void 0 ? void 0 : _b.touched) || ((_c = this.formulario.get(campo)) === null || _c === void 0 ? void 0 : _c.dirty))) {
            return true;
        }
        return false;
    };
    FormularioFiltroParticipantev2Component.prototype.getMensafield = function (field) {
        var _a, _b;
        return (_b = (_a = this.formulario.get(field)) === null || _a === void 0 ? void 0 : _a.errors) === null || _b === void 0 ? void 0 : _b['message'];
    };
    FormularioFiltroParticipantev2Component.prototype.definirPesquisa = function () {
        var _a;
        var texto = ((_a = this.formulario.get('pesquisa')) === null || _a === void 0 ? void 0 : _a.value) || '';
        if (texto.trim().length == 0) {
            return tipo_pesquisa_1.TipoPesquisa.None;
        }
        var isTexto = util_2.hasNonNumeric(texto);
        if (isTexto) {
            return tipo_pesquisa_1.TipoPesquisa.Nome;
        }
        if (texto.trim().length == 6) {
            return tipo_pesquisa_1.TipoPesquisa.Inscricao;
        }
        if (texto.trim().length < 6) {
            return tipo_pesquisa_1.TipoPesquisa.Nro_Peito;
        }
        return tipo_pesquisa_1.TipoPesquisa.Cpf;
    };
    FormularioFiltroParticipantev2Component.prototype.getTextoTipoPesquisa = function () {
        var tipo = parseInt(Object(this.parametro.getParametro()).pesquisarPor, 10);
        switch (tipo) {
            case tipo_pesquisa_1.TipoPesquisa.Nome:
                return 'Pelo Nome';
            case tipo_pesquisa_1.TipoPesquisa.Cpf:
                return 'Pelo CPF';
            case tipo_pesquisa_1.TipoPesquisa.Inscricao:
                return 'Pela Incrição';
            case tipo_pesquisa_1.TipoPesquisa.Nro_Peito:
                return 'Pelo Nº Do Peito';
            default:
                return '';
        }
    };
    __decorate([
        core_1.Input('PARAMNAME')
    ], FormularioFiltroParticipantev2Component.prototype, "paramName");
    __decorate([
        core_1.Input('RETORNO')
    ], FormularioFiltroParticipantev2Component.prototype, "retorno");
    __decorate([
        core_1.Input('EMAIL')
    ], FormularioFiltroParticipantev2Component.prototype, "email");
    __decorate([
        core_1.Input('DOWNLOAD')
    ], FormularioFiltroParticipantev2Component.prototype, "download");
    __decorate([
        core_1.Input('CONTROLE_PAGINAS')
    ], FormularioFiltroParticipantev2Component.prototype, "controle_paginas");
    __decorate([
        core_1.Input('HIDE')
    ], FormularioFiltroParticipantev2Component.prototype, "hide");
    __decorate([
        core_1.Output('changeParametro')
    ], FormularioFiltroParticipantev2Component.prototype, "change");
    __decorate([
        core_1.Output('changeHide')
    ], FormularioFiltroParticipantev2Component.prototype, "changeHide");
    FormularioFiltroParticipantev2Component = __decorate([
        core_1.Component({
            selector: 'app-formulario-filtro-participantev2',
            templateUrl: './formulario-filtro-participantev2.component.html',
            styleUrl: './formulario-filtro-participantev2.component.scss'
        })
    ], FormularioFiltroParticipantev2Component);
    return FormularioFiltroParticipantev2Component;
}());
exports.FormularioFiltroParticipantev2Component = FormularioFiltroParticipantev2Component;
