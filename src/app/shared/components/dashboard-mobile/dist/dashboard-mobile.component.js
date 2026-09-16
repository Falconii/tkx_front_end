"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DashboardMobileComponent = void 0;
var core_1 = require("@angular/core");
var layout_1 = require("@angular/cdk/layout");
var evento_model_1 = require("../../../models/evento-model");
var evento_resumo_model_1 = require("../../../models/evento-resumo-model");
var DashboardMobileComponent = /** @class */ (function () {
    function DashboardMobileComponent(globalService, eventoComplementarSrv, breakpoint, decimalPipe, firstNamePipe, route, appSnackBar) {
        var _this = this;
        this.globalService = globalService;
        this.eventoComplementarSrv = eventoComplementarSrv;
        this.breakpoint = breakpoint;
        this.decimalPipe = decimalPipe;
        this.firstNamePipe = firstNamePipe;
        this.route = route;
        this.appSnackBar = appSnackBar;
        this.eventoPrincipal = new evento_model_1.EventoModel();
        this.lsOperadores = [];
        this.lsCategorias = [];
        this.isMobile = false;
        this.chartsLoaded = false;
        this.lsEventos = [];
        this.lsEventosResumos = [];
        this.larguraGrafico = 450;
        this.breakpoint.observe([layout_1.Breakpoints.Handset]).subscribe(function (result) {
            _this.isMobile = result.matches;
            if (_this.isMobile) {
                _this.larguraGrafico = 290;
            }
            else {
                _this.larguraGrafico = 450;
            }
        });
        this.globalService.changeData.subscribe(function (evento) {
            _this.eventoPrincipal = evento;
            _this.atualizar();
        });
    }
    DashboardMobileComponent.prototype.ngOnInit = function () {
        this.atualizar();
    };
    DashboardMobileComponent.prototype.ngOnDestroy = function () {
        var _a, _b;
        (_a = this.inscricaoResumoOperador) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        (_b = this.inscricaoCategoria) === null || _b === void 0 ? void 0 : _b.unsubscribe();
    };
    DashboardMobileComponent.prototype.onHome = function () {
    };
    DashboardMobileComponent.prototype.atualizar = function () {
        this.lsEventosResumos = [];
        this.lsEventosResumos.push(new evento_resumo_model_1.EventoResumoModel('Participantes:', this.eventoPrincipal.qtd_participantes));
        this.lsEventosResumos.push(new evento_resumo_model_1.EventoResumoModel('Kits:', this.eventoPrincipal.qtd_kits));
        this.lsEventosResumos.push(new evento_resumo_model_1.EventoResumoModel('Saldo:', this.eventoPrincipal.qtd_participantes - this.eventoPrincipal.qtd_kits));
        this.getResumoOperadores();
        this.getResumoCategorias();
    };
    DashboardMobileComponent.prototype.getColuna = function () {
        return this.isMobile ? '1' : '2';
    };
    DashboardMobileComponent.prototype.getResumoOperadores = function () {
        var _this = this;
        if (this.eventoPrincipal.id == 0) {
            return;
        }
        this.inscricaoResumoOperador = this.eventoComplementarSrv.resumoOPerador(this.eventoPrincipal.id)
            .subscribe({
            next: function (data) {
                _this.lsOperadores = data;
            },
            error: function (error) {
                console.log(error);
                _this.lsOperadores = [];
            }
        });
    };
    DashboardMobileComponent.prototype.getResumoCategorias = function () {
        var _this = this;
        if (this.eventoPrincipal.id == 0) {
            return;
        }
        this.inscricaoResumoOperador = this.eventoComplementarSrv.resumoCategoria(this.eventoPrincipal.id)
            .subscribe({
            next: function (data) {
                _this.lsCategorias = data;
            },
            error: function (error) {
                console.log(error);
                _this.lsCategorias = [];
            }
        });
    };
    DashboardMobileComponent.prototype.gerarCoresAleatorias = function (qtd) {
        return Array.from({ length: qtd }, function () {
            return '#' + Math.floor(Math.random() * 16777215)
                .toString(16)
                .padStart(6, '0');
        } // garante 6 dígitos
        );
    };
    DashboardMobileComponent.prototype.onChangeParametros = function () {
        this.getResumoCategorias();
        this.getResumoOperadores();
    };
    __decorate([
        core_1.Input('EVENTO_PRINCIPAL')
    ], DashboardMobileComponent.prototype, "eventoPrincipal");
    DashboardMobileComponent = __decorate([
        core_1.Component({
            selector: 'dashboard-mobile',
            templateUrl: './dashboard-mobile.component.html',
            styleUrls: ['./dashboard-mobile.component.css']
        })
    ], DashboardMobileComponent);
    return DashboardMobileComponent;
}());
exports.DashboardMobileComponent = DashboardMobileComponent;
