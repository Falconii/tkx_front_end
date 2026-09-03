"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FiltroEntregaKitComponent = void 0;
var operators_1 = require("rxjs/operators");
var core_1 = require("@angular/core");
var filtro_entrega_kit_model_1 = require("../../../models/filtro-entrega-kit-model");
var util_1 = require("../../classes/util");
var tipo_pesquisa_1 = require("../../classes/tipo-pesquisa");
var layout_1 = require("@angular/cdk/layout");
var FiltroEntregaKitComponent = /** @class */ (function () {
    function FiltroEntregaKitComponent(formBuilder, globalService, breakpoint) {
        this.formBuilder = formBuilder;
        this.globalService = globalService;
        this.breakpoint = breakpoint;
        this.hide = false;
        this.change = new core_1.EventEmitter();
        this.onhome = new core_1.EventEmitter();
        this.onsair = new core_1.EventEmitter();
        this.onatualizar = new core_1.EventEmitter();
        this.changeHide = new core_1.EventEmitter();
        this.changePage = new core_1.EventEmitter();
        this.parametroPesquisa = new filtro_entrega_kit_model_1.FiltroEntregaKitModel();
        this.enable_filter = true;
        this.isMobile = false;
        this.parametros = formBuilder.group({
            kit: [{ value: '' }],
            pesquisa: [{ value: '' }]
        });
        this.parametroPesquisa = new filtro_entrega_kit_model_1.FiltroEntregaKitModel();
        this.parametroPesquisa.pesquisar = '';
        this.parametroPesquisa.pesquisarPor = tipo_pesquisa_1.TipoPesquisa.None;
    }
    FiltroEntregaKitComponent.prototype.ngOnInit = function () {
        var _this = this;
        var _a;
        this.breakpoint.observe([layout_1.Breakpoints.Handset]).subscribe(function (result) {
            _this.isMobile = result.matches;
        });
        (_a = this.parametros
            .get('pesquisa')) === null || _a === void 0 ? void 0 : _a.valueChanges.pipe(operators_1.map(function (value) { return value.trim(); }), operators_1.filter(function (value) { return value.length >= 0; }), operators_1.debounceTime(350), operators_1.distinctUntilChanged()).subscribe(function (value) {
            _this.onChangeParametros();
        });
        this.setValues();
    };
    FiltroEntregaKitComponent.prototype.ngOnDestroy = function () { };
    FiltroEntregaKitComponent.prototype.setValues = function () {
        this.enable_filter = false;
        this.parametros.setValue({
            kit: this.parametroPesquisa.kit,
            pesquisa: this.parametroPesquisa.pesquisar.toUpperCase() || ''
        });
        this.enable_filter = true;
    };
    FiltroEntregaKitComponent.prototype.setValuesNoParam = function () {
        this.enable_filter = false;
        this.parametros.setValue({
            kit: false,
            pesquisa: ''
        });
        this.enable_filter = true;
    };
    FiltroEntregaKitComponent.prototype.getParametro = function () { };
    FiltroEntregaKitComponent.prototype.refreshParametro = function (start) {
        var _a, _b;
        if (start === void 0) { start = true; }
        if (start) {
            this.parametroPesquisa.pesquisar =
                ((_a = this.parametros.get('pesquisa')) === null || _a === void 0 ? void 0 : _a.value) || '';
            this.parametroPesquisa.pesquisarPor = this.definirPesquisa();
            this.parametroPesquisa.kit = (_b = this.parametros.get('kit')) === null || _b === void 0 ? void 0 : _b.value;
        }
        else {
            this.parametroPesquisa.pesquisar = '';
            this.parametroPesquisa.pesquisarPor = tipo_pesquisa_1.TipoPesquisa.Nome;
            this.parametroPesquisa.kit = false;
        }
        this.setValues();
    };
    FiltroEntregaKitComponent.prototype.onChangeParametros = function (start) {
        if (start === void 0) { start = true; }
        this.refreshParametro(start);
        if (this.enable_filter) {
            this.change.emit(this.parametroPesquisa);
        }
    };
    FiltroEntregaKitComponent.prototype.onHide = function () { };
    FiltroEntregaKitComponent.prototype.hasValue = function (campo) {
        var _a;
        if (((_a = this.parametros.get(campo)) === null || _a === void 0 ? void 0 : _a.value) == '') {
            return false;
        }
        return true;
    };
    FiltroEntregaKitComponent.prototype.clearValue = function (campo) {
        if (campo == 'pesquisa') {
            this.parametros.patchValue({
                pesquisa: ''
            });
        }
        this.onChangeParametros();
    };
    FiltroEntregaKitComponent.prototype.ChangeValue = function (campo, value) {
        if (campo == 'pesquisa')
            this.parametros.patchValue({
                descricao: value
            });
    };
    FiltroEntregaKitComponent.prototype.NoValidtouchedOrDirty = function (campo) {
        var _a, _b, _c;
        if (!((_a = this.parametros.get(campo)) === null || _a === void 0 ? void 0 : _a.valid) &&
            (((_b = this.parametros.get(campo)) === null || _b === void 0 ? void 0 : _b.touched) || ((_c = this.parametros.get(campo)) === null || _c === void 0 ? void 0 : _c.dirty))) {
            return true;
        }
        return false;
    };
    FiltroEntregaKitComponent.prototype.getMensafield = function (field) {
        return '';
    };
    FiltroEntregaKitComponent.prototype.setCpf = function (event) {
        if (event.checked) {
            this.parametros.patchValue({
                cpf: true,
                nome: false,
                peito: false,
                pesquisa: ''
            });
            this.onChangeParametros();
        }
    };
    FiltroEntregaKitComponent.prototype.setNome = function (event) {
        if (event.checked) {
            this.parametros.patchValue({
                cpf: false,
                nome: true,
                peito: false,
                pesquisa: ''
            });
            this.onChangeParametros();
        }
    };
    FiltroEntregaKitComponent.prototype.setPeito = function (event) {
        if (event.checked) {
            this.parametros.patchValue({
                cpf: false,
                nome: false,
                peito: true,
                pesquisa: ''
            });
            this.onChangeParametros();
        }
    };
    FiltroEntregaKitComponent.prototype.onLimpar = function (event) {
        if (event.checked) {
            this.parametros.patchValue({
                dtinicial: '',
                dtfinal: '',
                cleardate: false
            });
        }
        this.onChangeParametros();
    };
    FiltroEntregaKitComponent.prototype.definirPesquisa = function () {
        var _a;
        var texto = ((_a = this.parametros.get('pesquisa')) === null || _a === void 0 ? void 0 : _a.value) || '';
        if (texto.trim().length == 0) {
            return tipo_pesquisa_1.TipoPesquisa.None;
        }
        var isTexto = util_1.hasNonNumeric(texto);
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
    FiltroEntregaKitComponent.prototype.getTextoTipoPesquisa = function (value) {
        if (value === void 0) { value = this.parametroPesquisa.pesquisarPor; }
        switch (value) {
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
    FiltroEntregaKitComponent.prototype.onKit = function (event) {
        if (event.checked) {
            this.parametros.patchValue({
                kit: event.checked
            });
        }
        this.onChangeParametros();
    };
    FiltroEntregaKitComponent.prototype.onHome = function () {
        this.onhome.emit();
    };
    FiltroEntregaKitComponent.prototype.onSair = function () {
        this.onsair.emit();
    };
    FiltroEntregaKitComponent.prototype.onAtualizar = function () {
        this.onatualizar.emit();
    };
    FiltroEntregaKitComponent.prototype.onChangePage = function () {
        this.changePage.emit();
    };
    __decorate([
        core_1.Input('HIDE')
    ], FiltroEntregaKitComponent.prototype, "hide");
    __decorate([
        core_1.Input('controle')
    ], FiltroEntregaKitComponent.prototype, "controlePaginas");
    __decorate([
        core_1.Output('changeParametro')
    ], FiltroEntregaKitComponent.prototype, "change");
    __decorate([
        core_1.Output('onHome')
    ], FiltroEntregaKitComponent.prototype, "onhome");
    __decorate([
        core_1.Output('onSair')
    ], FiltroEntregaKitComponent.prototype, "onsair");
    __decorate([
        core_1.Output('onAtualizar')
    ], FiltroEntregaKitComponent.prototype, "onatualizar");
    __decorate([
        core_1.Output('changeHide')
    ], FiltroEntregaKitComponent.prototype, "changeHide");
    __decorate([
        core_1.Output('changePage')
    ], FiltroEntregaKitComponent.prototype, "changePage");
    FiltroEntregaKitComponent = __decorate([
        core_1.Component({
            selector: 'app-filtro-entrega-kit',
            templateUrl: './filtro-entrega-kit.component.html',
            styleUrls: ['./filtro-entrega-kit.component.css']
        })
    ], FiltroEntregaKitComponent);
    return FiltroEntregaKitComponent;
}());
exports.FiltroEntregaKitComponent = FiltroEntregaKitComponent;
