"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FormularioFiltroUsuarioComponent = void 0;
var tipo_pesquisa_1 = require("./../../classes/tipo-pesquisa");
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var operators_1 = require("rxjs/operators");
var parametro_parametro01_1 = require("../../../parametros/parametro-parametro01");
var util_1 = require("../../classes/util");
var parametro_grupousuario01_1 = require("../../../parametros/parametro-grupousuario01");
var email_dialog_data_1 = require("../email-dialog/email-dialog-data");
var email_dialog_component_1 = require("../email-dialog/email-dialog.component");
var download_dialog_data_1 = require("../download-dialog/download-dialog-data");
var download_dialog_component_1 = require("../download-dialog/download-dialog.component");
var parametro_sendemailv2_1 = require("../../../parametros/parametro-sendemailv2");
var controle_paginas_1 = require("../../classes/controle-paginas");
var parametro_model_1 = require("../../../models/parametro-model");
var Pesquisa_1 = require("../../classes/Pesquisa");
var util_2 = require("../../classes/util");
var FormularioFiltroUsuarioComponent = /** @class */ (function () {
    function FormularioFiltroUsuarioComponent(formBuilder, globalService, parametroService, grupousuarioSrv, emailService, appSnackBar, EmailDialog, DownLoadDialog) {
        this.formBuilder = formBuilder;
        this.globalService = globalService;
        this.parametroService = parametroService;
        this.grupousuarioSrv = grupousuarioSrv;
        this.emailService = emailService;
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
        this.grupos = [];
        this.orderby = [
            { sigla: '000000', descricao: 'Código' },
            { sigla: '000001', descricao: 'Razão Social' },
            { sigla: '000002', descricao: 'Grupo' },
            { sigla: '000003', descricao: 'CNPJ-CPF' },
        ];
        this.parametro = new parametro_model_1.ParametroModel();
        this.pesquisa = new Pesquisa_1.Pesquisa();
        this.enable_filter = false;
        this.valueChangeSubs = [];
        this.formulario = formBuilder.group({
            orderby: [{ value: '' }],
            pesquisa: [{ value: '' }],
            grupos: [{ value: '' }]
        });
        this.setHide();
        this.setValuesNoParam();
        this.getGruposUsuarios();
    }
    FormularioFiltroUsuarioComponent.prototype.ngOnInit = function () { };
    FormularioFiltroUsuarioComponent.prototype.setEnableFilter = function (value) {
        var _this = this;
        var _a;
        this.enable_filter = value;
        // Se desativar, cancelar todas as subscriptions
        if (!value) {
            this.valueChangeSubs.forEach(function (sub) { return sub.unsubscribe(); });
            this.valueChangeSubs = [];
            return;
        }
        // Se ativar, registrar os valueChanges
        var pesquisarSub = (_a = this.formulario
            .get('pesquisa')) === null || _a === void 0 ? void 0 : _a.valueChanges.pipe(operators_1.map(function (value) { return value === null || value === void 0 ? void 0 : value.trim(); }), operators_1.filter(function (value) { return (value === null || value === void 0 ? void 0 : value.length) >= 0; }), operators_1.debounceTime(350), operators_1.distinctUntilChanged()).subscribe(function () { return _this.onChangeParametros(); });
        this.valueChangeSubs = [pesquisarSub].filter(function (sub) { return !!sub; });
    };
    FormularioFiltroUsuarioComponent.prototype.ngOnDestroy = function () {
        var _a, _b, _c;
        (_a = this.inscricaoGrupo) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        (_b = this.inscricaoParametro) === null || _b === void 0 ? void 0 : _b.unsubscribe();
        (_c = this.inscricaoEmail) === null || _c === void 0 ? void 0 : _c.unsubscribe();
        this.valueChangeSubs.forEach(function (sub) { return sub.unsubscribe(); });
        this.valueChangeSubs = [];
    };
    FormularioFiltroUsuarioComponent.prototype.getGruposUsuarios = function () {
        var _this = this;
        var par = new parametro_grupousuario01_1.ParametroGrupousuario01();
        par.id_empresa = this.globalService.getEmpresa().id;
        par.orderby = '000002';
        this.inscricaoGrupo = this.grupousuarioSrv
            .getGruposusuariosParametro_01(par)
            .subscribe({
            next: function (data) {
                _this.grupos = data;
                _this.loadParametros();
            },
            error: function (error) {
                _this.setValuesNoParam();
                _this.appSnackBar.openFailureSnackBar("Pesquisa Nos Grupos De Usu\u00E1rios " + util_1.messageError(error), 'OK');
            }
        });
    };
    FormularioFiltroUsuarioComponent.prototype.onGetExcelToEmailOrDownLoad = function (destino) {
        if (destino.toUpperCase() == 'E-MAIL') {
            this.openEmailDialog();
        }
        else {
            this.openDownLoadDialog();
        }
    };
    FormularioFiltroUsuarioComponent.prototype.sendMail = function (fileName) {
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
    FormularioFiltroUsuarioComponent.prototype.setValues = function () {
        this.enable_filter = false;
        this.formulario.setValue({
            orderby: util_1.GetValueJsonString(this.parametro.getParametro(), 'orderby'),
            pesquisa: util_1.GetValueJsonString(this.parametro.getParametro(), 'pesquisa'),
            grupos: util_1.GetValueJsonNumber(this.parametro.getParametro(), 'grupo')
        });
        this.enable_filter = true;
    };
    FormularioFiltroUsuarioComponent.prototype.setValuesNoParam = function () {
        this.formulario.setValue({
            orderby: '',
            pesquisa: '',
            grupos: 0
        });
    };
    FormularioFiltroUsuarioComponent.prototype.setHide = function () {
        this.hide = !this.hide;
        this.hideAcao = this.hide ? 'Mostrar' : 'Ocultar';
    };
    FormularioFiltroUsuarioComponent.prototype.onlimparParametros = function () {
        this.parametro = this.InicializaParametro();
        this.setEnableFilter(false);
        this.setValues();
        this.setEnableFilter(true);
        this.onChangeParametros();
    };
    FormularioFiltroUsuarioComponent.prototype.InicializaParametro = function () {
        var param = new parametro_model_1.ParametroModel();
        param.id_empresa = this.globalService.getEmpresa().id;
        param.modulo = this.paramName;
        param.assinatura = 'V1.00 06/11/2025';
        param.id_usuario = this.globalService.getUsuario().id;
        param.parametro = JSON.stringify({
            id_evento: '',
            pesquisa: '',
            pesquisarPor: '',
            grupo: '',
            tamPagina: 50,
            contador: '',
            orderby: '000001',
            page: 0,
            sharp: false
        });
        return param;
    };
    FormularioFiltroUsuarioComponent.prototype.loadParametros = function () {
        this.parametro = this.InicializaParametro();
        this.getParametro();
    };
    FormularioFiltroUsuarioComponent.prototype.getParametro = function () {
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
                _this.setValues();
                _this.setEnableFilter(true);
                _this.onChangeParametros();
            }
        });
    };
    FormularioFiltroUsuarioComponent.prototype.updateParametros = function () {
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
    FormularioFiltroUsuarioComponent.prototype.refreshParametro = function () {
        var config = this.parametro.getParametro();
        Object(config).pesquisa =
            this.formulario.value.pesquisa.toUpperCase() || '';
        Object(config).pesquisarPor = this.definirPesquisa();
        Object(config).grupo = this.formulario.value.grupos;
        Object(config).orderby = this.formulario.value.orderby;
        this.parametro.parametro = JSON.stringify(config);
    };
    FormularioFiltroUsuarioComponent.prototype.onChangeParametros = function () {
        this.refreshParametro();
        this.change.emit(this.parametro);
    };
    FormularioFiltroUsuarioComponent.prototype.onSaveConfig = function () {
        this.updateParametros();
    };
    FormularioFiltroUsuarioComponent.prototype.onHide = function () {
        this.setHide();
        this.changeHide.emit(this.hide);
    };
    FormularioFiltroUsuarioComponent.prototype.hasValue = function (campo) {
        var _a;
        if (((_a = this.formulario.get(campo)) === null || _a === void 0 ? void 0 : _a.value) == '') {
            return false;
        }
        return true;
    };
    FormularioFiltroUsuarioComponent.prototype.clearValue = function (campo) {
        if (campo == 'pesquisa') {
            this.formulario.patchValue({
                pesquisa: ''
            });
        }
        if (campo == 'grupos')
            this.formulario.patchValue({
                grupos: ''
            });
        this.onChangeParametros();
    };
    FormularioFiltroUsuarioComponent.prototype.ChangeValue = function (campo, value) {
        if (campo == 'pesquisa')
            this.formulario.patchValue({
                pesquisa: value
            });
        if (campo == 'grupos')
            this.formulario.patchValue({
                grupos: value
            });
    };
    FormularioFiltroUsuarioComponent.prototype.openEmailDialog = function () {
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
    FormularioFiltroUsuarioComponent.prototype.openDownLoadDialog = function () {
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
    FormularioFiltroUsuarioComponent.prototype.NoValidtouchedOrDirty = function (campo) {
        var _a, _b, _c;
        if (!((_a = this.formulario.get(campo)) === null || _a === void 0 ? void 0 : _a.valid) &&
            (((_b = this.formulario.get(campo)) === null || _b === void 0 ? void 0 : _b.touched) || ((_c = this.formulario.get(campo)) === null || _c === void 0 ? void 0 : _c.dirty))) {
            return true;
        }
        return false;
    };
    FormularioFiltroUsuarioComponent.prototype.getMensafield = function (field) {
        var _a, _b;
        return (_b = (_a = this.formulario.get(field)) === null || _a === void 0 ? void 0 : _a.errors) === null || _b === void 0 ? void 0 : _b['message'];
    };
    FormularioFiltroUsuarioComponent.prototype.definirPesquisa = function () {
        var _a;
        var texto = ((_a = this.formulario.get('pesquisa')) === null || _a === void 0 ? void 0 : _a.value) || '';
        if (texto.trim().length == 0) {
            return tipo_pesquisa_1.TipoPesquisa.None;
        }
        var isTexto = util_2.hasNonNumeric(texto);
        if (isTexto) {
            return tipo_pesquisa_1.TipoPesquisa.Nome;
        }
        if (texto.trim().length <= 6) {
            return tipo_pesquisa_1.TipoPesquisa.Codigo;
        }
        return tipo_pesquisa_1.TipoPesquisa.Cpf;
    };
    FormularioFiltroUsuarioComponent.prototype.getTextoTipoPesquisa = function () {
        try {
            var tipo = parseInt(Object(this.parametro.getParametro()).pesquisarPor, 10);
            switch (tipo) {
                case tipo_pesquisa_1.TipoPesquisa.Nome:
                    return 'Pelo Descrição';
                case tipo_pesquisa_1.TipoPesquisa.Cpf:
                    return 'Pelo CPF/CNPJ';
                case tipo_pesquisa_1.TipoPesquisa.Codigo:
                    return 'Pelo Código';
                default:
                    return '';
            }
        }
        catch (err) {
            return '';
        }
    };
    __decorate([
        core_1.Input('PARAMNAME')
    ], FormularioFiltroUsuarioComponent.prototype, "paramName");
    __decorate([
        core_1.Input('RETORNO')
    ], FormularioFiltroUsuarioComponent.prototype, "retorno");
    __decorate([
        core_1.Input('EMAIL')
    ], FormularioFiltroUsuarioComponent.prototype, "email");
    __decorate([
        core_1.Input('DOWNLOAD')
    ], FormularioFiltroUsuarioComponent.prototype, "download");
    __decorate([
        core_1.Input('CONTROLE_PAGINAS')
    ], FormularioFiltroUsuarioComponent.prototype, "controle_paginas");
    __decorate([
        core_1.Input('HIDE')
    ], FormularioFiltroUsuarioComponent.prototype, "hide");
    __decorate([
        core_1.Output('changeParametro')
    ], FormularioFiltroUsuarioComponent.prototype, "change");
    __decorate([
        core_1.Output('changeHide')
    ], FormularioFiltroUsuarioComponent.prototype, "changeHide");
    FormularioFiltroUsuarioComponent = __decorate([
        core_1.Component({
            selector: 'app-formulario-filtro-usuario',
            templateUrl: './formulario-filtro-usuario.component.html',
            styleUrls: ['./formulario-filtro-usuario.component.scss']
        })
    ], FormularioFiltroUsuarioComponent);
    return FormularioFiltroUsuarioComponent;
}());
exports.FormularioFiltroUsuarioComponent = FormularioFiltroUsuarioComponent;
