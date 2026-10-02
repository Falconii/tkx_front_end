"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CrudPlanilhaComponent = void 0;
var processa_planilha_dialog_data_1 = require("./../processa-planilha-dialog/processa-planilha-dialog-data");
var core_1 = require("@angular/core");
var parametro_cabplanilha01_1 = require("../../../parametros/parametro-cabplanilha01");
var parametro_model_1 = require("../../../models/parametro-model");
var controle_paginas_1 = require("../../../shared/classes/controle-paginas");
var util_1 = require("../../../shared/classes/util");
var cadastro_acoes_1 = require("../../../shared/classes/cadastro-acoes");
var tipo_operacao_1 = require("../../../shared/classes/tipo-operacao");
var atualiza_parametro_cabEmpresa01_1 = require("../../../shared/classes/atualiza-parametro-cabEmpresa01");
var dialog_1 = require("@angular/material/dialog");
var import_planilha_dialog_component_1 = require("../import-planilha-dialog/import-planilha-dialog.component");
var importplanilha_data_1 = require("../import-planilha-dialog/importplanilha-data");
var confirm_dialog_component_1 = require("../../../shared/components/confirm-dialog/confirm-dialog.component");
var processa_planilha_dialog_component_1 = require("../processa-planilha-dialog/processa-planilha-dialog.component");
var crud_detalhe_dialog_component_1 = require("../crud-detalhe-dialog/crud-detalhe-dialog.component");
var CrudPlanilhaComponent = /** @class */ (function () {
    function CrudPlanilhaComponent(globalService, cabSrv, cabComplSrv, route, router, appSnackBar, uploadDialog, deleteDialog, detalheDialog) {
        this.globalService = globalService;
        this.cabSrv = cabSrv;
        this.cabComplSrv = cabComplSrv;
        this.route = route;
        this.router = router;
        this.appSnackBar = appSnackBar;
        this.uploadDialog = uploadDialog;
        this.deleteDialog = deleteDialog;
        this.detalheDialog = detalheDialog;
        this.parametro = new parametro_model_1.ParametroModel();
        this.lsPlanilhas = [];
        this.controlePaginas = new controle_paginas_1.ControlePaginas(0, 0);
        this.tamPagina = 50;
        this.hide = false;
    }
    CrudPlanilhaComponent.prototype.ngOnInit = function () { };
    CrudPlanilhaComponent.prototype.ngOnDestroy = function () {
        var _a, _b, _c;
        (_a = this.inscricaoPlanilha) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        (_b = this.inscricaoDelete) === null || _b === void 0 ? void 0 : _b.unsubscribe();
        (_c = this.inscricaoProcessa) === null || _c === void 0 ? void 0 : _c.unsubscribe();
    };
    CrudPlanilhaComponent.prototype.getPlanilhas = function (tipoOperacao) {
        var _this = this;
        if (tipoOperacao === void 0) { tipoOperacao = tipo_operacao_1.TipoOperacao.Pesquisa; }
        var par = new parametro_cabplanilha01_1.ParametroCabplanilha01();
        par.id_empresa = this.globalService.getEmpresa().id;
        par.id_evento = 1;
        par = atualiza_parametro_cabEmpresa01_1.AtualizaParametrocabEmpresa(par, this.parametro.getParametro());
        if (tipoOperacao == tipo_operacao_1.TipoOperacao.Contador) {
            par.contador = 'S';
        }
        else {
            par.pagina = this.controlePaginas.getPaginalAtual();
            par.tamPagina = this.controlePaginas.getTamPagina();
        }
        console.log('Parametro:', par);
        this.inscricaoPlanilha = this.cabSrv
            .getCabplanilhasParametro_01(par)
            .subscribe({
            next: function (data) {
                if (tipoOperacao == tipo_operacao_1.TipoOperacao.Pesquisa) {
                    _this.lsPlanilhas = data;
                }
                else {
                    _this.controlePaginas = new controle_paginas_1.ControlePaginas(_this.tamPagina, data.total == 0 ? 1 : data.total);
                    _this.getPlanilhas();
                }
            },
            error: function (error) {
                console.log(error);
                _this.lsPlanilhas = [];
                _this.controlePaginas = new controle_paginas_1.ControlePaginas(_this.tamPagina, 0);
            }
        });
    };
    CrudPlanilhaComponent.prototype.deletePlanilha = function (planilha, indice) {
        var _this = this;
        this.inscricaoPlanilha = this.cabSrv
            .cabplanilhaDelete(planilha.id_empresa, planilha.id_evento, planilha.id)
            .subscribe({
            next: function (data) {
                _this.appSnackBar.openSuccessSnackBar("Planilha Exclu\u00EDda Com Sucesso!", 'OK');
                _this.lsPlanilhas.splice(indice, 1);
            },
            error: function (error) {
                _this.appSnackBar.openFailureSnackBar("Erro Na Exclus\u00E3o " + util_1.messageError(error), 'OK');
            }
        });
    };
    CrudPlanilhaComponent.prototype.onHome = function () { };
    CrudPlanilhaComponent.prototype.onChangeHide = function (hide) {
        this.hide = hide;
    };
    CrudPlanilhaComponent.prototype.onChangePage = function () {
        this.getPlanilhas();
    };
    CrudPlanilhaComponent.prototype.onChangeParametros = function (param) {
        this.parametro = param;
        this.getPlanilhas(tipo_operacao_1.TipoOperacao.Contador);
    };
    CrudPlanilhaComponent.prototype.escolha = function (opcao, indice, planilha) {
        if (planilha == null) {
            if (opcao == cadastro_acoes_1.CadastroAcoes.Inclusao) {
                this.openUloadLoadDialog();
            }
        }
        else {
            if (opcao == cadastro_acoes_1.CadastroAcoes.Consulta) {
                this.openCrudDetalheDialog(opcao, indice, planilha);
            }
            if (opcao == cadastro_acoes_1.CadastroAcoes.Exclusao) {
                this.openDeletePlanilha(planilha, indice);
            }
            if (opcao == cadastro_acoes_1.CadastroAcoes.Processar) {
                this.openProcessaPlanilha(planilha, indice);
            }
        }
    };
    CrudPlanilhaComponent.prototype.getTexto = function () {
        return util_1.MensagensBotoes;
    };
    CrudPlanilhaComponent.prototype.getAcoes = function () {
        return cadastro_acoes_1.CadastroAcoes;
    };
    CrudPlanilhaComponent.prototype.openUloadLoadDialog = function () {
        var _this = this;
        var dialogConfig = new dialog_1.MatDialogConfig();
        var data = new importplanilha_data_1.Importplanilhadata();
        dialogConfig.autoFocus = true;
        dialogConfig.width = '1000px';
        dialogConfig.height = '480px';
        dialogConfig.disableClose = true;
        dialogConfig.id = 'upload-planilha-dialog';
        dialogConfig.data = data;
        var modalDialog = this.uploadDialog
            .open(import_planilha_dialog_component_1.ImportPlanilhaDialogComponent, dialogConfig)
            .beforeClosed()
            .subscribe(function (data) {
            if (data === null || data === void 0 ? void 0 : data.processar) {
                _this.getPlanilhas(tipo_operacao_1.TipoOperacao.Contador);
            }
        });
    };
    CrudPlanilhaComponent.prototype.openDeletePlanilha = function (planilha, indice) {
        var _this = this;
        var dialogRef = this.deleteDialog.open(confirm_dialog_component_1.ConfirmDialogComponent, {
            width: '380px',
            data: {
                title: 'Excluir Planilha',
                message: "" + planilha.arquivo,
                confirmText: 'Sim, excluir',
                cancelText: 'Cancelar',
                icone: 'play_circle_filled'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                _this.deletePlanilha(planilha, indice);
            }
        });
    };
    CrudPlanilhaComponent.prototype.openProcessaPlanilha = function (planilha, indice) {
        var _this = this;
        if (planilha.total_linhas_erro > 0) {
            this.appSnackBar.openFailureSnackBar("Planilha Possui Erros. Não Pode Ser Processada!", "OK");
            return;
        }
        var dialogRef = this.deleteDialog.open(confirm_dialog_component_1.ConfirmDialogComponent, {
            width: '380px',
            data: {
                title: 'Processar Planilha',
                message: 'Processar Planilha',
                confirmText: 'Sim, Processar',
                cancelText: 'Cancelar',
                icone: 'play_circle_filled'
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                var dialogConfig = new dialog_1.MatDialogConfig();
                var data = new processa_planilha_dialog_data_1.ProcessaPlanilhaDialogData();
                data.planilha = planilha;
                dialogConfig.autoFocus = true;
                dialogConfig.width = '1000px';
                dialogConfig.height = '480px';
                dialogConfig.disableClose = true;
                dialogConfig.id = 'processar-planilha-dialog';
                dialogConfig.data = data;
                var modalDialog = _this.uploadDialog
                    .open(processa_planilha_dialog_component_1.ProcessaPlanilhaDialogComponent, dialogConfig)
                    .beforeClosed()
                    .subscribe(function (data) {
                    if (data === null || data === void 0 ? void 0 : data.processar) {
                        _this.getPlanilhas(tipo_operacao_1.TipoOperacao.Contador);
                    }
                });
            }
        });
    };
    CrudPlanilhaComponent.prototype.openCrudDetalheDialog = function (opcao, i, cabPlanilha) {
        var _this = this;
        if (opcao === void 0) { opcao = cadastro_acoes_1.CadastroAcoes.Consulta; }
        var data = {
            idAcao: opcao,
            cabPlanilha: this.lsPlanilhas[i],
            result: false
        };
        var dialogConfig = new dialog_1.MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.id = 'crud_detplanilha';
        // FULLSCREEN REAL
        dialogConfig.width = '100vw';
        dialogConfig.height = '100vh';
        dialogConfig.maxWidth = '100vw';
        dialogConfig.panelClass = 'fullscreen-dialog';
        dialogConfig.data = data;
        this.detalheDialog
            .open(crud_detalhe_dialog_component_1.CrudDetalheDialogComponent, dialogConfig)
            .beforeClosed()
            .subscribe(function (result) {
            if (result === null || result === void 0 ? void 0 : result.result) {
                switch (opcao) {
                    case cadastro_acoes_1.CadastroAcoes.Inclusao:
                        _this.getPlanilhas();
                        break;
                    case cadastro_acoes_1.CadastroAcoes.Consulta:
                        _this.getPlanilhas();
                        break;
                    case cadastro_acoes_1.CadastroAcoes.Edicao:
                        _this.getPlanilhas();
                        break;
                    case cadastro_acoes_1.CadastroAcoes.Exclusao:
                        _this.getPlanilhas();
                        break;
                }
            }
        });
    };
    CrudPlanilhaComponent = __decorate([
        core_1.Component({
            selector: 'app-crud-planilha',
            templateUrl: './crud-planilha.component.html',
            styleUrl: './crud-planilha.component.css'
        })
    ], CrudPlanilhaComponent);
    return CrudPlanilhaComponent;
}());
exports.CrudPlanilhaComponent = CrudPlanilhaComponent;
