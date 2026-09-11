"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.GlobalService = void 0;
var core_1 = require("@angular/core");
var usuario_model_1 = require("../models/usuario-model");
var empresa_model_1 = require("../models/empresa-model");
var sim_nao_1 = require("../shared/classes/sim-nao");
var evento_model_1 = require("../models/evento-model");
var BehaviorSubject_1 = require("rxjs/internal/BehaviorSubject");
var GlobalService = /** @class */ (function () {
    function GlobalService(usuarioService, router) {
        this.usuarioService = usuarioService;
        this.router = router;
        this.evento = new evento_model_1.EventoModel();
        this.evento_situacoes = [];
        this.planilha_situacoes = [];
        this.detalhe_situacoes = [];
        this.lsSexos = [];
        this.logado = false;
        this.showSpin = false;
        this.logadoSubject = new BehaviorSubject_1.BehaviorSubject(false);
        this.logado$ = this.logadoSubject.asObservable();
        this.shomMenuEmitter = new core_1.EventEmitter();
        this.showEmpresaEmitter = new core_1.EventEmitter();
        this.showUsuarioEmitter = new core_1.EventEmitter();
        this.isMobileEmitter = new core_1.EventEmitter();
        this.onSubmit = new core_1.EventEmitter();
        this.changePassWordEmitter = new core_1.EventEmitter();
        this.changeData = new core_1.EventEmitter();
        this.showSpinSubject = new BehaviorSubject_1.BehaviorSubject(false);
        // Observable público para os componentes assinarem
        this.showSpin$ = this.showSpinSubject.asObservable();
        this.usuario = new usuario_model_1.UsuarioModel();
        this.logado = false;
        this.empresa = new empresa_model_1.EmpresaModel();
        this.empresa.id = 1;
        this.logado = false;
        this.evento_situacoes = [
            new sim_nao_1.SimNao('0', 'Aguardando Liberação'),
            new sim_nao_1.SimNao('1', 'Aguardando Importação'),
            new sim_nao_1.SimNao('2', 'StandBy'),
            new sim_nao_1.SimNao('3', 'Ativo'),
            new sim_nao_1.SimNao('4', 'Encerrado'),
        ];
        this.planilha_situacoes = [
            new sim_nao_1.SimNao('1', 'Importada'),
            new sim_nao_1.SimNao('2', 'Processada'),
            new sim_nao_1.SimNao('9', 'Processamento Não Finalizada')
        ];
        this.detalhe_situacoes = [
            new sim_nao_1.SimNao('0', 'Importado'),
            new sim_nao_1.SimNao("2", "Processado"),
            new sim_nao_1.SimNao('3', 'Erro Na Planilha CVS'),
            new sim_nao_1.SimNao('9', 'Erro De Informação'),
        ];
        this.lsSexos = [
            { sigla: 'M', descricao: 'MASCULINO' },
            { sigla: 'F', descricao: 'FEMININO' },
            { sigla: 'O', descricao: 'OUTROS' },
        ];
        this.evento.id_empresa = 1;
        this.evento.id = 6;
        this.evento.descricao = 'ESPORTE E MOVIMENTO';
        this.evento.status = '1';
    }
    //setMobile(value: boolean) {
    //  this.isMobileEmitter.emit(value);
    // }
    GlobalService.prototype.getEmpresa = function () {
        return this.empresa;
    };
    GlobalService.prototype.setEmpresa = function (emp) {
        this.empresa = emp;
    };
    GlobalService.prototype.getUsuario = function () {
        return this.usuario;
    };
    GlobalService.prototype.setUsuario = function (user) {
        this.usuario = user;
    };
    GlobalService.prototype.getEvento = function () {
        return this.evento;
    };
    GlobalService.prototype.setTrocaUsuario = function () {
        this.showUsuarioEmitter.emit();
    };
    GlobalService.prototype.setLogado = function (value) {
        this.shomMenuEmitter.emit(value);
        this.logado = value;
        this.router.navigate(['/']);
    };
    GlobalService.prototype.setLogadoTeste = function (value) {
        console.log("enviando logado teste ", value);
        this.logadoSubject.next(value);
        this.logado = true;
    };
    GlobalService.prototype.getLogado = function () {
        if (this.usuario.id == 0) {
            return false;
        }
        else {
            return true;
        }
    };
    GlobalService.prototype.setChangeData = function (value) {
        this.changeData.emit(value);
    };
    GlobalService.prototype.setSpin = function (value) {
        var _this = this;
        Promise.resolve().then(function () {
            _this.showSpinSubject.next(value);
        });
    };
    GlobalService.prototype.getSpin = function () {
        return this.showSpinSubject.value;
    };
    GlobalService.prototype.getSituacoesEvento = function () {
        return this.evento_situacoes;
    };
    GlobalService.prototype.getSituacoesEventoByCodigo = function (value) {
        var idx = this.evento_situacoes.findIndex(function (situacao) { return situacao.sigla === value; });
        if (idx >= 0 && idx < this.evento_situacoes.length) {
            return this.evento_situacoes[idx];
        }
        else {
            return new sim_nao_1.SimNao('', '');
        }
    };
    GlobalService.prototype.getLsSexo = function () {
        return this.lsSexos;
    };
    GlobalService.prototype.getSexoBySigla = function (value) {
        var idx = this.lsSexos.findIndex(function (sexo) { return sexo.sigla === value; });
        if (idx >= 0 && idx < this.lsSexos.length) {
            return this.lsSexos[idx];
        }
        else {
            return new sim_nao_1.SimNao('', '');
        }
    };
    GlobalService.prototype.getPlanilha_situacoes = function () {
        return this.planilha_situacoes;
    };
    GlobalService.prototype.getPlanilha_situacoesBySigla = function (value) {
        var idx = this.planilha_situacoes.findIndex(function (plan) { return plan.sigla === value; });
        if (idx >= 0 && idx < this.planilha_situacoes.length) {
            return this.planilha_situacoes[idx];
        }
        else {
            return new sim_nao_1.SimNao('', '');
        }
    };
    GlobalService.prototype.getDetalhe_situacoes = function () {
        return this.detalhe_situacoes;
    };
    GlobalService.prototype.getDetalhe_situacoesBySigla = function (value) {
        var idx = this.detalhe_situacoes.findIndex(function (plan) { return plan.sigla === value; });
        if (idx >= 0 && idx < this.detalhe_situacoes.length) {
            return this.detalhe_situacoes[idx];
        }
        else {
            return new sim_nao_1.SimNao('', '');
        }
    };
    GlobalService.prototype.setChangePassWord = function () {
        this.changePassWordEmitter.emit();
    };
    GlobalService.prototype.setOnSubmit = function (value) {
        this.onSubmit.emit(value);
    };
    GlobalService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], GlobalService);
    return GlobalService;
}());
exports.GlobalService = GlobalService;
