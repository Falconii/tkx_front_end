"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DashboardComponent = void 0;
var core_1 = require("@angular/core");
var layout_1 = require("@angular/cdk/layout");
var evento_model_1 = require("../../../models/evento-model");
var DashboardComponent = /** @class */ (function () {
    function DashboardComponent(globalService, eventoComplementarSrv, breakpoint, decimalPipe, firstNamePipe, route, appSnackBar) {
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
    DashboardComponent.prototype.ngOnInit = function () {
        var _this = this;
        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(function () {
            google.charts.setOnLoadCallback(function () {
                _this.chartsLoaded = true;
            });
        });
        this.atualizar();
    };
    DashboardComponent.prototype.ngOnDestroy = function () {
        var _a, _b;
        (_a = this.inscricaoResumoOperador) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        (_b = this.inscricaoCategoria) === null || _b === void 0 ? void 0 : _b.unsubscribe();
    };
    DashboardComponent.prototype.onHome = function () {
    };
    DashboardComponent.prototype.atualizar = function () {
        this.getResumoOperadores();
        this.getResumoCategorias();
    };
    DashboardComponent.prototype.getColuna = function () {
        return this.isMobile ? '1' : '2';
    };
    DashboardComponent.prototype.getResumoOperadores = function () {
        var _this = this;
        if (this.eventoPrincipal.id == 0) {
            return;
        }
        this.inscricaoResumoOperador = this.eventoComplementarSrv.resumoOPerador(this.eventoPrincipal.id)
            .subscribe({
            next: function (data) {
                _this.lsOperadores = data;
                console.log("lsOperadores", _this.lsOperadores);
                if (_this.chartsLoaded) {
                    _this.buidChartOperadores();
                }
            },
            error: function (error) {
                console.log(error);
                _this.lsOperadores = [];
            }
        });
    };
    DashboardComponent.prototype.getResumoCategorias = function () {
        var _this = this;
        if (this.eventoPrincipal.id == 0) {
            return;
        }
        this.inscricaoResumoOperador = this.eventoComplementarSrv.resumoCategoria(this.eventoPrincipal.id)
            .subscribe({
            next: function (data) {
                _this.lsCategorias = data;
                _this.buidChartCategorias();
            },
            error: function (error) {
                console.log(error);
                _this.lsCategorias = [];
            }
        });
    };
    DashboardComponent.prototype.gerarCoresAleatorias = function (qtd) {
        return Array.from({ length: qtd }, function () {
            return '#' + Math.floor(Math.random() * 16777215)
                .toString(16)
                .padStart(6, '0');
        } // garante 6 dígitos
        );
    };
    DashboardComponent.prototype.onChangeParametros = function () {
        this.getResumoCategorias();
        this.getResumoOperadores();
    };
    DashboardComponent.prototype.buidChartCategorias = function () {
        var _this = this;
        var func = function (chart) {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Categoria');
            data.addColumn('number', 'Total');
            var linhas = _this.lsCategorias.map(function (x) { return [x.categoria_descricao + " - " + x.total, x.total]; });
            data.addRows(linhas);
            var totalParticipantes = _this.lsCategorias
                .reduce(function (acc, x) { return acc + x.total; }, 0);
            var cores = _this.gerarCoresAleatorias(_this.lsCategorias.length);
            var options = {
                title: "Resumo Por Categoria - Total: " + _this.decimalPipe.transform(totalParticipantes, '1.0-0'),
                width: _this.larguraGrafico,
                height: 400,
                titleTextStyle: {
                    fontSize: 14,
                    bold: true
                },
                colors: cores,
                chartArea: {
                    width: '90%',
                    height: '80%',
                    top: 20,
                    left: 5
                },
                legend: {
                    position: 'left',
                    alignment: 'end',
                    textStyle: {
                        fontSize: 10
                    }
                },
                pieSliceTextStyle: {
                    fontSize: 11,
                    color: '#fff'
                },
                is3D: true
            };
            chart().draw(data, options);
        };
        var chart = function () {
            return new google.visualization.PieChart(document.getElementById('chart_categorias'));
        };
        google.charts.setOnLoadCallback(function () { return func(chart); });
    };
    DashboardComponent.prototype.buidChartOperadores = function () {
        var _this = this;
        var func = function (chart) {
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Operador');
            data.addColumn('number', 'Total');
            var linhas = _this.lsOperadores.map(function (x) { return [_this.firstNamePipe.transform(x.razao) + " - " + x.total, x.total]; });
            data.addRows(linhas);
            var totalParticipantes = _this.lsOperadores
                .reduce(function (acc, x) { return acc + x.total; }, 0);
            var cores = _this.gerarCoresAleatorias(_this.lsOperadores.length);
            var options = {
                title: "Resumo Por Operador - Total: " + _this.decimalPipe.transform(totalParticipantes, '1.0-0'),
                width: _this.larguraGrafico,
                height: 350,
                titleTextStyle: {
                    fontSize: 14,
                    bold: true
                },
                colors: cores,
                chartArea: {
                    width: '100%',
                    height: '100%',
                    top: 20,
                    bottom: 20
                },
                legend: {
                    position: 'right',
                    textStyle: {
                        fontSize: 11
                    }
                },
                pieSliceTextStyle: {
                    fontSize: 11,
                    color: '#fff'
                },
                pieResidueSliceLabel: 'Outros',
                pieResidueSliceVisibilityThreshold: 0,
                is3D: true
            };
            chart().draw(data, options);
        };
        var chart = function () {
            return new google.visualization.PieChart(document.getElementById('chart_operadores'));
        };
        google.charts.setOnLoadCallback(function () { return func(chart); });
    };
    __decorate([
        core_1.Input('EVENTO_PRINCIPAL')
    ], DashboardComponent.prototype, "eventoPrincipal");
    DashboardComponent = __decorate([
        core_1.Component({
            selector: 'dashboard',
            templateUrl: './dashboard.component.html',
            styleUrls: ['./dashboard.component.css']
        })
    ], DashboardComponent);
    return DashboardComponent;
}());
exports.DashboardComponent = DashboardComponent;
