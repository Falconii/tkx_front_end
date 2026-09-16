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
var tipo_pesquisa_1 = require("../../../shared/classes/tipo-pesquisa");
var cadastro_acoes_1 = require("../../../shared/classes/cadastro-acoes");
var usuario_model_1 = require("../../../models/usuario-model");
var evento_model_1 = require("../../../models/evento-model");
var parametro_evento01_1 = require("../../../parametros/parametro-evento01");
var parametro_participantev201_1 = require("../../../parametros/parametro-participantev201");
var entrega_v2_dialog_data_1 = require("../entrega-dialog/entrega-v2-dialog-data");
var layout_1 = require("@angular/cdk/layout");
var MobileKitComponent = /** @class */ (function () {
    function MobileKitComponent(appSnackBar, globalService, eventoSrv, participanteSrv, localStorageSrv, route, router, kitEntrega, breakpoint) {
        this.appSnackBar = appSnackBar;
        this.globalService = globalService;
        this.eventoSrv = eventoSrv;
        this.participanteSrv = participanteSrv;
        this.localStorageSrv = localStorageSrv;
        this.route = route;
        this.router = router;
        this.kitEntrega = kitEntrega;
        this.breakpoint = breakpoint;
        this.tamPagina = 50;
        this.parametroPesquisa = new filtro_entrega_kit_model_1.FiltroEntregaKitModel();
        this.participantes = [];
        this.evento = new evento_model_1.EventoModel();
        this.isMobile = false;
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
        var _a, _b;
        (_a = this.inscricaoParticipantes) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        (_b = this.inscricaoEventoAtivo) === null || _b === void 0 ? void 0 : _b.unsubscribe();
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
                alert(_this.participantes[data.index].entrega_tam_camisa);
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
