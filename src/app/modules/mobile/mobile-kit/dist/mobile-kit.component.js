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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.MobileKitComponent = void 0;
var tipo_operacao_1 = require("./../../../shared/classes/tipo-operacao");
var filtro_entrega_kit_model_1 = require("../../../models/filtro-entrega-kit-model");
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var entrega_dialog_component_1 = require("../entrega-dialog/entrega-dialog.component");
var controle_paginas_1 = require("../../../shared/classes/controle-paginas");
var util_1 = require("../../../shared/classes/util");
var rxjs_1 = require("rxjs");
var tipo_pesquisa_1 = require("../../../shared/classes/tipo-pesquisa");
var cadastro_acoes_1 = require("../../../shared/classes/cadastro-acoes");
var usuario_model_1 = require("../../../models/usuario-model");
var evento_model_1 = require("../../../models/evento-model");
var parametro_evento01_1 = require("../../../parametros/parametro-evento01");
var parametro_participantev201_1 = require("../../../parametros/parametro-participantev201");
var entrega_v2_dialog_data_1 = require("../entrega-dialog/entrega-v2-dialog-data");
var layout_1 = require("@angular/cdk/layout");
var entregav2_model_1 = require("../../../models/entregav2-model");
var MobileKitComponent = /** @class */ (function () {
    function MobileKitComponent(appSnackBar, globalService, eventoSrv, participanteSrv, localStorageSrv, route, router, kitEntrega, breakpoint, confirmDialog, entregaComplementarSrv, entregaSrv) {
        this.appSnackBar = appSnackBar;
        this.globalService = globalService;
        this.eventoSrv = eventoSrv;
        this.participanteSrv = participanteSrv;
        this.localStorageSrv = localStorageSrv;
        this.route = route;
        this.router = router;
        this.kitEntrega = kitEntrega;
        this.breakpoint = breakpoint;
        this.confirmDialog = confirmDialog;
        this.entregaComplementarSrv = entregaComplementarSrv;
        this.entregaSrv = entregaSrv;
        this.tamPagina = 50;
        this.parametroPesquisa = new filtro_entrega_kit_model_1.FiltroEntregaKitModel();
        this.participantes = [];
        this.evento = new evento_model_1.EventoModel();
        this.isMobile = false;
        this.entregav2 = new entregav2_model_1.Entregav2Model();
        this.controlePaginas = new controle_paginas_1.ControlePaginas(0, 0);
        this.controlePaginas = new controle_paginas_1.ControlePaginas(this.tamPagina, 0);
    }
    MobileKitComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.breakpoint.observe([layout_1.Breakpoints.Handset]).subscribe(function (result) {
            _this.isMobile = result.matches;
        });
        var data = this.route.snapshot.data['eventoAtivo'];
        this.evento = data.length > 0 ? data[0] : new evento_model_1.EventoModel();
        if (this.evento.id == 0 && !this.isMobile) {
            this.onHome();
        }
        this.getParticipantes(tipo_operacao_1.TipoOperacao.Contador);
    };
    MobileKitComponent.prototype.ngOnDestroy = function () {
        var _a, _b, _c, _d;
        (_a = this.inscricaoParticipantes) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        (_b = this.inscricaoEventoAtivo) === null || _b === void 0 ? void 0 : _b.unsubscribe();
        (_c = this.inscricaoDelete) === null || _c === void 0 ? void 0 : _c.unsubscribe();
        (_d = this.inscricaoEntrega) === null || _d === void 0 ? void 0 : _d.unsubscribe();
    };
    MobileKitComponent.prototype.getParticipantes = function (tipoOperacao) {
        var _this = this;
        if (tipoOperacao === void 0) { tipoOperacao = tipo_operacao_1.TipoOperacao.Pesquisa; }
        if (!this.evento.id_empresa || this.evento.id == 0) {
            return;
        }
        var key = 0;
        var inscricao = 0;
        var nro_peito = 0;
        key = parseInt(this.parametroPesquisa.pesquisar);
        if (isNaN(key)) {
            inscricao = 0;
        }
        else {
            inscricao = key;
        }
        if (isNaN(key)) {
            nro_peito = 0;
        }
        else {
            nro_peito = key;
        }
        var par = new parametro_participantev201_1.ParametroParticipantev201();
        par.id_empresa = this.globalService.getEmpresa().id;
        par.id_evento = this.evento.id;
        par.kit = this.parametroPesquisa.kit;
        switch (this.parametroPesquisa.pesquisarPor) {
            case tipo_pesquisa_1.TipoPesquisa.Nome:
                par.nome = this.parametroPesquisa.pesquisar;
                break;
            case tipo_pesquisa_1.TipoPesquisa.Cpf:
                par.cnpj_cpf = this.parametroPesquisa.pesquisar;
                break;
            case tipo_pesquisa_1.TipoPesquisa.Inscricao:
                par.inscricao = inscricao;
                break;
            case tipo_pesquisa_1.TipoPesquisa.Nro_Peito:
                par.nro_peito = nro_peito;
                break;
        }
        par.orderby = '000003';
        if (tipoOperacao == tipo_operacao_1.TipoOperacao.Contador) {
            par.contador = 'S';
        }
        else {
            par.pagina = this.controlePaginas.getPaginalAtual();
            par.tamPagina = this.controlePaginas.getTamPagina();
        }
        console.log('Parâmetros Enviados', par);
        this.inscricaoParticipantes = this.participanteSrv
            .getParticipantesv2Parametro_01(par)
            .subscribe({
            next: function (data) {
                if (tipoOperacao == tipo_operacao_1.TipoOperacao.Pesquisa) {
                    _this.participantes = data;
                    console.log('Participantes Encontrados:', _this.participantes);
                }
                else {
                    _this.controlePaginas = new controle_paginas_1.ControlePaginas(_this.tamPagina, data.total == 0 ? 1 : data.total);
                    console.log('Controle de Páginas Atualizado:', _this.controlePaginas);
                    _this.getParticipantes();
                }
            },
            error: function (error) {
                if (error.status && error.status == 401) {
                    _this.localStorageSrv.clear();
                    _this.appSnackBar.openFailureSnackBar('Ação Não Autorizada', 'OK');
                    return;
                }
                if (error.status && error.status == 409) {
                    _this.participantes = [];
                }
                else {
                    _this.participantes = [];
                    _this.appSnackBar.openFailureSnackBar("Pesquisa Nos Participantes " + util_1.messageError(error), 'OK');
                }
            }
        });
    };
    MobileKitComponent.prototype.getEventoAtivo = function () {
        var _this = this;
        var par = new parametro_evento01_1.ParametroEvento01();
        par.id_empresa = this.globalService.getEmpresa().id;
        par.status = '3';
        par.orderby = '000001';
        this.inscricaoEventoAtivo = this.eventoSrv
            .getEventosParametro_01(par)
            .subscribe({
            next: function (data) {
                if (data.length > 0) {
                    _this.evento = data[0];
                }
                else {
                    _this.evento = new evento_model_1.EventoModel();
                }
            },
            error: function (error) {
                if (error.status && error.status == 401) {
                    _this.localStorageSrv.clear();
                    _this.appSnackBar.openFailureSnackBar('Ação Não Autoizada', 'OK');
                    return;
                }
                else {
                    if (error.status && error.status == 409) {
                        _this.appSnackBar.openFailureSnackBar('Nenhum Evento Ativo Encontrado Para Pesquisa Dos Participantes!', 'OK');
                    }
                    else {
                        _this.appSnackBar.openFailureSnackBar("Erro Na Pesquisa Dos Eventos " + util_1.messageError(error), 'OK');
                    }
                }
            }
        });
    };
    MobileKitComponent.prototype.onChangeParametro = function (filtro) {
        this.parametroPesquisa = filtro;
        this.getParticipantes(tipo_operacao_1.TipoOperacao.Contador);
    };
    MobileKitComponent.prototype.onChangePage = function () {
        this.getParticipantes();
    };
    MobileKitComponent.prototype.escolha = function (op, dado, index) {
        if (op == cadastro_acoes_1.CadastroAcoes.Exclusao) {
            this.onExcluir(dado, index);
        }
        if (op == cadastro_acoes_1.CadastroAcoes.Kit) {
            this.openKitDialog(dado, index);
        }
    };
    MobileKitComponent.prototype.novoInscrito = function () {
        this.router.navigate(['mobile/novoinscrito/']);
    };
    MobileKitComponent.prototype.onSair = function () {
        this.globalService.setLogado(false);
        this.globalService.setUsuario(new usuario_model_1.UsuarioModel());
        this.localStorageSrv.removeItem('Token');
        this.router.navigate(['/login']);
    };
    MobileKitComponent.prototype.onHome = function () {
        this.router.navigate(['/home']);
    };
    MobileKitComponent.prototype.openKitDialog = function (participantev2, index) {
        var _this = this;
        var data = new entrega_v2_dialog_data_1.EntregaV2DialogData();
        data.participantev2 = __assign({}, participantev2); // ← cópia
        data.index = index;
        var dialogConfig = new dialog_1.MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.id = 'trocar';
        dialogConfig.width = '700px';
        dialogConfig.autoFocus = true;
        dialogConfig.data = data;
        var modalDialog = this.kitEntrega
            .open(entrega_dialog_component_1.EntregaDialogComponent, dialogConfig)
            .beforeClosed()
            .subscribe(function (data) {
            if (data.processar) {
                _this.participantes = __spreadArrays(_this.participantes.slice(0, data.index), [__assign({}, data.participantev2)], _this.participantes.slice(data.index + 1));
            }
        });
    };
    MobileKitComponent.prototype.onExcluir = function (participantev2, index) {
        var _this = this;
        this.confirmDialog
            .open({
            title: 'Exclusão',
            message: "Deseja Realmente Excluir o Kit ?",
            icon: 'warning',
            iconColor: 'warn',
            confirmText: 'Excluir',
            cancelText: 'Cancelar'
        })
            .subscribe(function (result) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (result) {
                    this.getEntrega(participantev2, index);
                }
                return [2 /*return*/];
            });
        }); });
    };
    MobileKitComponent.prototype.deleteEntrega = function (participantev2, entregav2, index) {
        var _this = this;
        this.inscricaoDelete = this.entregaComplementarSrv.deleteentregaparticipante(participantev2.id, entregav2)
            .subscribe({
            next: function (data) {
                _this.participantes[index] = data.Participantev2;
            },
            error: function (error) {
                _this.appSnackBar.openFailureSnackBar("Erro Na Exclus\u00E3o Do Kit " + error.error.tabela + " - " + error.error.erro + " - " + error.error.message, 'OK');
            }
        });
    };
    MobileKitComponent.prototype.getEntrega = function (participantev2, index) {
        var _this = this;
        this.inscricaoEntrega = this.entregaSrv
            .getEntregav2(participantev2.id_empresa, participantev2.id_evento, participantev2.id_entrega)
            .pipe(rxjs_1.finalize(function () { return _this.globalService.setSpin(false); }))
            .subscribe({
            next: function (data) {
                _this.deleteEntrega(participantev2, data, index);
            },
            error: function (error) {
                console.log('Erro: ', error.status);
                if (error.status && error.status == 409) {
                    _this.appSnackBar.openFailureSnackBar("Kit N\u00E3o Encontrado!", 'OK');
                }
                else {
                    _this.appSnackBar.openFailureSnackBar("Erro Na Pesquisa Dos Kits " + util_1.messageError(error), 'OK');
                }
            }
        });
    };
    MobileKitComponent = __decorate([
        core_1.Component({
            selector: 'app-mobile-kit',
            templateUrl: './mobile-kit.component.html',
            styleUrl: './mobile-kit.component.css'
        })
    ], MobileKitComponent);
    return MobileKitComponent;
}());
exports.MobileKitComponent = MobileKitComponent;
