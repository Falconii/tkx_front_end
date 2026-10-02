"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.CrudDetalheDialogComponent = void 0;
var core_1 = require("@angular/core");
var parametro_model_1 = require("../../../models/parametro-model");
var controle_paginas_1 = require("../../../shared/classes/controle-paginas");
var dialog_1 = require("@angular/material/dialog");
var cadastro_acoes_1 = require("../../../shared/classes/cadastro-acoes");
var detPlanilha_model_1 = require("../../../models/detPlanilha-model");
var tipo_operacao_1 = require("../../../shared/classes/tipo-operacao");
var parametro_detPlanilha01_1 = require("../../../parametros/parametro-detPlanilha01");
var util_1 = require("../../../shared/classes/util");
var atualiza_parametro_detplanilha01_1 = require("../../../shared/classes/atualiza-parametro-detplanilha01");
var edit_detalhe_dialog_component_1 = require("../edit-detalhe-dialog/edit-detalhe-dialog.component");
var CrudDetalheDialogComponent = /** @class */ (function () {
    function CrudDetalheDialogComponent(globalService, detplanilhaSrv, route, router, appSnackBar, editDetalheDialog, data, dialogRef, deleteDialog) {
        this.globalService = globalService;
        this.detplanilhaSrv = detplanilhaSrv;
        this.route = route;
        this.router = router;
        this.appSnackBar = appSnackBar;
        this.editDetalheDialog = editDetalheDialog;
        this.data = data;
        this.dialogRef = dialogRef;
        this.deleteDialog = deleteDialog;
        this.controlePaginas = new controle_paginas_1.ControlePaginas(0, 0);
        this.tamPagina = 50;
        this.parametro = new parametro_model_1.ParametroModel();
        this.lsDetalhes = [];
        this.hide = false;
    }
    CrudDetalheDialogComponent.prototype.ngOnInit = function () {
    };
    CrudDetalheDialogComponent.prototype.ngOnDestroy = function () {
        var _a;
        (_a = this.inscricaoDetalhe) === null || _a === void 0 ? void 0 : _a.unsubscribe();
    };
    CrudDetalheDialogComponent.prototype.escolha = function (opcao, i, detalhe) {
        if (detalhe == null) {
            detalhe = new detPlanilha_model_1.DetplanilhaModel();
            detalhe.id_empresa = this.data.cabPlanilha.id_empresa;
            detalhe.id_evento = this.data.cabPlanilha.id_evento;
            detalhe.id_cabec = this.data.cabPlanilha.id;
            this.openDetalheDialog(opcao, i, detalhe);
        }
        else {
            if ((opcao == cadastro_acoes_1.CadastroAcoes.Consulta) || (opcao == cadastro_acoes_1.CadastroAcoes.Edicao)) {
                this.openDetalheDialog(opcao, i, detalhe);
            }
            if (opcao == cadastro_acoes_1.CadastroAcoes.Exclusao) {
                this.openDetalheDialog(opcao, i, detalhe);
            }
        }
    };
    CrudDetalheDialogComponent.prototype.getAcoes = function () {
        return cadastro_acoes_1.CadastroAcoes;
    };
    CrudDetalheDialogComponent.prototype.getDetalhes = function (tipoOperacao) {
        var _this = this;
        if (tipoOperacao === void 0) { tipoOperacao = tipo_operacao_1.TipoOperacao.Pesquisa; }
        var par = new parametro_detPlanilha01_1.ParametroDetplanilha01();
        par.id_empresa = this.globalService.getEmpresa().id;
        par.id_cabec = this.data.cabPlanilha.id;
        par.id_evento = this.data.cabPlanilha.id_evento;
        par = atualiza_parametro_detplanilha01_1.AtualizaParametroDetplanilha01(par, this.parametro.getParametro());
        if (tipoOperacao == tipo_operacao_1.TipoOperacao.Contador) {
            par.contador = 'S';
        }
        else {
            par.pagina = this.controlePaginas.getPaginalAtual();
            par.tamPagina = this.controlePaginas.getTamPagina();
        }
        console.log('Paramentros de Consulta 2:', par);
        this.inscricaoDetalhe = this.detplanilhaSrv
            .getDetplanilhasParametro_01(par)
            .subscribe({ next: function (data) {
                if (tipoOperacao == tipo_operacao_1.TipoOperacao.Pesquisa) {
                    _this.lsDetalhes = data;
                    console.log('Detalhes:', _this.lsDetalhes);
                }
                else {
                    _this.controlePaginas = new controle_paginas_1.ControlePaginas(_this.tamPagina, data.total == 0 ? 1 : data.total);
                    _this.getDetalhes();
                }
            },
            error: function (error) {
                console.log(error);
                _this.lsDetalhes = [];
                _this.controlePaginas = new controle_paginas_1.ControlePaginas(_this.tamPagina, 0);
            }
        });
    };
    CrudDetalheDialogComponent.prototype.getTexto = function () {
        return util_1.MensagensBotoes;
    };
    CrudDetalheDialogComponent.prototype.onChangePage = function () {
        this.getDetalhes();
    };
    CrudDetalheDialogComponent.prototype.onChangeHide = function (hide) {
        this.hide = hide;
    };
    CrudDetalheDialogComponent.prototype.onChangeParametros = function (param) {
        this.parametro = param;
        console.log('Paramentro de Pesquisa', this.parametro);
        this.getDetalhes(tipo_operacao_1.TipoOperacao.Contador);
    };
    CrudDetalheDialogComponent.prototype.onCancel = function () {
        this.closeModal();
    };
    CrudDetalheDialogComponent.prototype.closeModal = function () {
        this.data.result = true;
        this.dialogRef.close(this.data);
    };
    /*  openDeletePartipantePlanilha(opcao: CadastroAcoes, indice: number, detalhe: DetplanilhaModel) {
         const dialogRef = this.deleteDialog.open(ConfirmDialogComponent, {
           width: '380px',
           data: {
             title: 'Excluir Planilha',
             message: `${detalhe.nome}`,
             confirmText: 'Sim, excluir',
             cancelText: 'Cancelar',
             icone: 'play_circle_filled',
           },
         });
   
         dialogRef.afterClosed().subscribe((result) => {
           if (result) {
              //this.deletePlanilha(planilha, indice);
           }
         });
       } */
    CrudDetalheDialogComponent.prototype.openDetalheDialog = function (opcao, i, detPlanilha) {
        var _this = this;
        if (opcao === void 0) { opcao = cadastro_acoes_1.CadastroAcoes.Consulta; }
        var data = {
            idAcao: opcao,
            result: false,
            detPlanilha: detPlanilha
        };
        var dialogConfig = new dialog_1.MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.id = 'EditDetalheDialogComponent';
        // FULLSCREEN REAL
        dialogConfig.width = '100vw';
        dialogConfig.height = '100vh';
        dialogConfig.maxWidth = '100vw';
        dialogConfig.data = data;
        this.editDetalheDialog
            .open(edit_detalhe_dialog_component_1.EditDetalheDialogComponent, dialogConfig)
            .beforeClosed()
            .subscribe(function (result) {
            if (result === null || result === void 0 ? void 0 : result.result) {
                _this.data.result = true;
                _this.getDetalhes(tipo_operacao_1.TipoOperacao.Contador);
            }
        });
    };
    CrudDetalheDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-crud-detalhe-dialog',
            templateUrl: './crud-detalhe-dialog.component.html',
            styleUrl: './crud-detalhe-dialog.component.css'
        }),
        __param(6, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], CrudDetalheDialogComponent);
    return CrudDetalheDialogComponent;
}());
exports.CrudDetalheDialogComponent = CrudDetalheDialogComponent;
