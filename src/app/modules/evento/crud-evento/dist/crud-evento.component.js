"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.CrudEventoComponent = void 0;
var core_1 = require("@angular/core");
var util_1 = require("../../../shared/classes/util");
var cadastro_acoes_1 = require("../../../shared/classes/cadastro-acoes");
var scrolling_1 = require("@angular/cdk/scrolling");
var tipo_operacao_1 = require("../../../shared/classes/tipo-operacao");
var dialog_1 = require("@angular/material/dialog");
var util_2 = require("../../../shared/classes/util");
var parametro_model_1 = require("../../../models/parametro-model");
var controle_paginas_1 = require("../../../shared/classes/controle-paginas");
var evento_model_1 = require("../../../models/evento-model");
var evento_dialog_component_1 = require("../evento-dialog/evento-dialog.component");
var parametro_evento01_1 = require("../../../parametros/parametro-evento01");
var atualiza_parametro_evento01_1 = require("../../../shared/classes/atualiza-parametro-evento01");
var CrudEventoComponent = /** @class */ (function () {
    function CrudEventoComponent(globalService, eventoSrv, usuarioSrv, route, router, appSnackBar, eventoDialog, confirmDialog) {
        this.globalService = globalService;
        this.eventoSrv = eventoSrv;
        this.usuarioSrv = usuarioSrv;
        this.route = route;
        this.router = router;
        this.appSnackBar = appSnackBar;
        this.eventoDialog = eventoDialog;
        this.confirmDialog = confirmDialog;
        this.eventos = [];
        this.usuarios = [];
        this.controlePaginas = new controle_paginas_1.ControlePaginas(0, 0);
        this.tamPagina = 50;
        this.retorno = false;
        this.parametro = new parametro_model_1.ParametroModel();
        this.hide = false;
    }
    CrudEventoComponent.prototype.ngOnInit = function () { };
    CrudEventoComponent.prototype.ngOnDestroy = function () {
        var _a, _b;
        (_a = this.inscricaoEvento) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        (_b = this.inscricaoSituacao) === null || _b === void 0 ? void 0 : _b.unsubscribe();
    };
    CrudEventoComponent.prototype.getEmpresa = function () {
        return this.globalService.getEmpresa();
    };
    CrudEventoComponent.prototype.escolha = function (opcao, i, evento) {
        if (evento) {
            switch (opcao) {
                case this.getAcoes().Liberar:
                    this.alteraSituacao(opcao, evento);
                    break;
                case this.getAcoes().Standby:
                    this.alteraSituacao(opcao, evento);
                    break;
                case this.getAcoes().Ativar:
                    this.alteraSituacao(opcao, evento);
                    break;
                case this.getAcoes().Encerrar:
                    this.alteraSituacao(opcao, evento);
                    break;
                case this.getAcoes().Resumo_Evento:
                    this.openResumoEvento(evento);
                    break;
                default:
                    this.openEventooDialog(opcao, i, evento);
                    break;
            }
        }
        else {
            this.openEventooDialog(opcao, i, evento);
        }
    };
    CrudEventoComponent.prototype.openResumoEvento = function (evento) {
        // TODO: Resumo Do Evento (nova planilha) — a definir
        this.appSnackBar.openSuccessSnackBar("Resumo Do Evento " + evento.descricao + ": Em Constru\u00E7\u00E3o.", 'OK');
    };
    CrudEventoComponent.prototype.onHome = function () {
        this.router.navigate(['']);
    };
    CrudEventoComponent.prototype.getAcoes = function () {
        return cadastro_acoes_1.CadastroAcoes;
    };
    CrudEventoComponent.prototype.getEventos = function (tipoOperacao) {
        var _this = this;
        if (tipoOperacao === void 0) { tipoOperacao = tipo_operacao_1.TipoOperacao.Pesquisa; }
        var par = new parametro_evento01_1.ParametroEvento01();
        par.id_empresa = this.globalService.getEmpresa().id;
        par = atualiza_parametro_evento01_1.AtualizaParametroEvento01(par, this.parametro.getParametro());
        if (tipoOperacao == tipo_operacao_1.TipoOperacao.Contador) {
            par.contador = 'S';
        }
        else {
            par.pagina = this.controlePaginas.getPaginalAtual();
            par.tamPagina = this.controlePaginas.getTamPagina();
        }
        console.log('Paramentros de Consulta:', par);
        this.inscricaoEvento = this.eventoSrv
            .getEventosParametro_01(par)
            .subscribe({
            next: function (data) {
                if (tipoOperacao == tipo_operacao_1.TipoOperacao.Pesquisa) {
                    _this.eventos = data;
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
    CrudEventoComponent.prototype.getTexto = function () {
        return util_1.MensagensBotoes;
    };
    CrudEventoComponent.prototype.onChangePage = function () {
        this.getEventos();
    };
    CrudEventoComponent.prototype.onChangeHide = function (hide) {
        this.hide = hide;
    };
    CrudEventoComponent.prototype.onChangeParametros = function (param) {
        this.parametro = param;
        console.log('Paramentro de Pesquisa', this.parametro);
        this.getEventos(tipo_operacao_1.TipoOperacao.Contador);
    };
    CrudEventoComponent.prototype.openEventooDialog = function (opcao, i, evento) {
        var _this = this;
        if (opcao === void 0) { opcao = cadastro_acoes_1.CadastroAcoes.Consulta; }
        var data = {
            indice: i,
            opcao: opcao,
            processar: false,
            evento: evento !== null && evento !== void 0 ? evento : __assign(__assign({}, new evento_model_1.EventoModel()), { id_empresa: this.globalService.getEmpresa().id, inicio: util_2.DataDDMMYYYY(new Date()) })
        };
        var dialogConfig = new dialog_1.MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.id = 'evento-dialog-fullscreen';
        // FULLSCREEN REAL
        dialogConfig.width = '100vw';
        dialogConfig.height = '100vh';
        dialogConfig.maxWidth = '100vw';
        dialogConfig.panelClass = 'fullscreen-dialog';
        dialogConfig.data = data;
        this.eventoDialog
            .open(evento_dialog_component_1.EventoDialogComponent, dialogConfig)
            .beforeClosed()
            .subscribe(function (result) {
            if (result === null || result === void 0 ? void 0 : result.processar) {
                switch (opcao) {
                    case cadastro_acoes_1.CadastroAcoes.Inclusao:
                        _this.eventos.push(result.evento);
                        break;
                    case cadastro_acoes_1.CadastroAcoes.Edicao:
                        if (i >= 0)
                            _this.eventos[i] = result.evento;
                        break;
                    case cadastro_acoes_1.CadastroAcoes.Exclusao:
                        if (result.indice >= 0) {
                            _this.eventos.splice(result.indice, 1);
                        }
                        break;
                }
            }
        });
    };
    CrudEventoComponent.prototype.alteraSituacao = function (opcao, evento) {
        var _this = this;
        var config = {};
        var situacao = '0';
        if ((this.getAcoes().Liberar == opcao) && (this.globalService.getUsuario().grupo > 3 && this.globalService.getUsuario().grupo < 99)) {
            alert("opcao = " + opcao + " Grupo = " + this.globalService.getUsuario().grupo);
            this.appSnackBar.openFailureSnackBar("Somente Master/Adm Pode Usar Esta Função!", "OK");
            return;
        }
        switch (opcao) {
            case this.getAcoes().Liberar:
                config = {
                    title: 'Liberação De Evento',
                    message: "Deseja Realmente Liberar Para Importa\u00E7\u00E3o Este Evento ?",
                    icon: 'warning',
                    iconColor: 'warn',
                    confirmText: 'Liberar',
                    cancelText: 'Cancelar'
                };
                situacao = '1';
                break;
            case this.getAcoes().Standby:
                config = {
                    title: 'StandBy',
                    message: "Deseja Realmente Colocar Evento Em StandBy ?",
                    icon: 'warning',
                    iconColor: 'warn',
                    confirmText: 'StandBy',
                    cancelText: 'Cancelar'
                };
                situacao = '2';
                break;
            case this.getAcoes().Ativar:
                config = {
                    title: 'Ativar O Evento',
                    message: "Deseja Realmente Ativar O Evento ?",
                    icon: 'warning',
                    iconColor: 'warn',
                    confirmText: 'Ativar',
                    cancelText: 'Cancelar'
                };
                situacao = '3';
                break;
            case this.getAcoes().Encerrar:
                config = {
                    title: 'Encerrar O Evento',
                    message: "Deseja Realmente Encerrar O Evento ?",
                    icon: 'warning',
                    iconColor: 'warn',
                    confirmText: 'Encerrar',
                    cancelText: 'Cancelar'
                };
                situacao = '4';
                break;
            default:
                break;
        }
        this.confirmDialog.open(config).subscribe(function (result) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (result) {
                    evento.user_update = this.globalService.getUsuario().id;
                    evento.status = situacao;
                    this.inscricaoSituacao = this.eventoSrv.eventoUpdate(evento).subscribe({
                        next: function (data) {
                            _this.appSnackBar.openSuccessSnackBar("Situa\u00E7\u00E3o Do Evento Alterada !", 'OK');
                            evento.status = situacao;
                        },
                        error: function (error) {
                            _this.appSnackBar.openFailureSnackBar("Erro Na Altera\u00E7\u00E3o " + error.error.tabela + " - " + error.error.erro + " - " + error.error.message, 'OK');
                        }
                    });
                }
                return [2 /*return*/];
            });
        }); });
    };
    __decorate([
        core_1.ViewChild(scrolling_1.CdkVirtualScrollViewport)
    ], CrudEventoComponent.prototype, "viewPort");
    CrudEventoComponent = __decorate([
        core_1.Component({
            selector: 'app-crud-evento',
            templateUrl: './crud-evento.component.html',
            styleUrl: './crud-evento.component.scss'
        })
    ], CrudEventoComponent);
    return CrudEventoComponent;
}());
exports.CrudEventoComponent = CrudEventoComponent;
