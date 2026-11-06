"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.BarraAcoesComponent = void 0;
var core_1 = require("@angular/core");
var util_1 = require("../../classes/util");
var cadastro_acoes_1 = require("../../classes/cadastro-acoes");
var BarraAcoesComponent = /** @class */ (function () {
    function BarraAcoesComponent() {
        this.consulta = true;
        this.alterar = true;
        this.excluir = true;
        this.kit = false;
        this.processar = false;
        this.barra_resumo_evento = false;
        this.barra = false;
        this.barra_excluir = false;
        this.barra_liberar = false;
        this.barra_ativar = false;
        this.barra_encerrar = false;
        this.barra_zerar_senha = false;
        this.barra_ativo_inativo = false;
        this.barra_standby = false;
        this.changeOpcao = new core_1.EventEmitter();
    }
    BarraAcoesComponent.prototype.ngOnInit = function () { };
    BarraAcoesComponent.prototype.getTexto = function () {
        return util_1.MensagensBotoes;
    };
    BarraAcoesComponent.prototype.getAcoes = function () {
        return cadastro_acoes_1.CadastroAcoes;
    };
    BarraAcoesComponent.prototype.onChangeOpcao = function (op) {
        this.changeOpcao.emit(op);
    };
    __decorate([
        core_1.Input('CONSULTAR')
    ], BarraAcoesComponent.prototype, "consulta");
    __decorate([
        core_1.Input('ALTERAR')
    ], BarraAcoesComponent.prototype, "alterar");
    __decorate([
        core_1.Input('EXCLUIR')
    ], BarraAcoesComponent.prototype, "excluir");
    __decorate([
        core_1.Input('KIT')
    ], BarraAcoesComponent.prototype, "kit");
    __decorate([
        core_1.Input('PROCESSAR')
    ], BarraAcoesComponent.prototype, "processar");
    __decorate([
        core_1.Input('BARRA_RESUMO_EVENTO')
    ], BarraAcoesComponent.prototype, "barra_resumo_evento");
    __decorate([
        core_1.Input('BARRA_VERTICAL')
    ], BarraAcoesComponent.prototype, "barra");
    __decorate([
        core_1.Input('BARRA_EXCLUIR')
    ], BarraAcoesComponent.prototype, "barra_excluir");
    __decorate([
        core_1.Input('BARRA_LIBERAR')
    ], BarraAcoesComponent.prototype, "barra_liberar");
    __decorate([
        core_1.Input('BARRA_ATIVAR')
    ], BarraAcoesComponent.prototype, "barra_ativar");
    __decorate([
        core_1.Input('BARRA_ENCERRAR')
    ], BarraAcoesComponent.prototype, "barra_encerrar");
    __decorate([
        core_1.Input('BARRA_ZERAR_SENHA')
    ], BarraAcoesComponent.prototype, "barra_zerar_senha");
    __decorate([
        core_1.Input('BARRA_ATIVO_INATIVO')
    ], BarraAcoesComponent.prototype, "barra_ativo_inativo");
    __decorate([
        core_1.Input('BARRA_STANDBY')
    ], BarraAcoesComponent.prototype, "barra_standby");
    __decorate([
        core_1.Output('changeOpcao')
    ], BarraAcoesComponent.prototype, "changeOpcao");
    BarraAcoesComponent = __decorate([
        core_1.Component({
            selector: 'barra-acoes',
            templateUrl: './barra-acoes.component.html',
            styleUrls: ['./barra-acoes.component.css']
        })
    ], BarraAcoesComponent);
    return BarraAcoesComponent;
}());
exports.BarraAcoesComponent = BarraAcoesComponent;
