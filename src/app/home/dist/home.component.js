"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HomeComponent = void 0;
var core_1 = require("@angular/core");
var evento_model_1 = require("../models/evento-model");
var parametro_evento01_1 = require("../parametros/parametro-evento01");
var HomeComponent = /** @class */ (function () {
    function HomeComponent(globalService, eventoComplementarSrv, eventoSrv, breakpoint, router, firstNamePipe, route, appSnackBar, formBuilder) {
        this.globalService = globalService;
        this.eventoComplementarSrv = eventoComplementarSrv;
        this.eventoSrv = eventoSrv;
        this.breakpoint = breakpoint;
        this.router = router;
        this.firstNamePipe = firstNamePipe;
        this.route = route;
        this.appSnackBar = appSnackBar;
        this.formBuilder = formBuilder;
        this.changeData = new core_1.EventEmitter();
        this.isMobile = false;
        this.chartsLoaded = false;
        this.lsEventos = [];
        this.eventoPrincipal = new evento_model_1.EventoModel();
        this.isLogado = false;
        console.log("estou iniciando o home");
        this.formulario = formBuilder.group({
            id_evento: [{ value: '' }]
        });
    }
    HomeComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.globalService.logado$.subscribe(function (show) {
            _this.isLogado = show;
            if (show) {
                _this.getEventos();
            }
        });
    };
    HomeComponent.prototype.ngOnDestroy = function () {
        var _a;
        (_a = this.inscricaoEvento) === null || _a === void 0 ? void 0 : _a.unsubscribe();
    };
    HomeComponent.prototype.onHome = function () {
    };
    HomeComponent.prototype.getEventos = function () {
        var _this = this;
        var par = new parametro_evento01_1.ParametroEvento01();
        par.id_empresa = this.globalService.getEmpresa().id;
        par.status = '3';
        par.pagina = 1;
        this.inscricaoEvento = this.eventoSrv
            .getEventosParametro_01(par)
            .subscribe({
            next: function (data) {
                _this.lsEventos = data;
                _this.eventoPrincipal = _this.lsEventos[0];
                _this.setValue();
                _this.globalService.setChangeData(_this.eventoPrincipal);
            },
            error: function (error) {
                _this.lsEventos = [];
            }
        });
    };
    HomeComponent.prototype.onChangeParametros = function () {
        var _this = this;
        this.eventoPrincipal = this.lsEventos.find(function (x) { return x.id == _this.formulario.value.id_evento; });
        this.setValue();
        this.globalService.setChangeData(this.eventoPrincipal);
    };
    HomeComponent.prototype.setValue = function () {
        this.formulario.setValue({
            id_evento: this.eventoPrincipal.id
        });
    };
    HomeComponent.prototype.atualizar = function () {
        this.getEventos();
    };
    ;
    HomeComponent.prototype.getUsuario = function () {
        return this.globalService.getUsuario().razao;
    };
    HomeComponent = __decorate([
        core_1.Component({
            selector: 'app-home',
            templateUrl: './home.component.html',
            styleUrl: './home.component.css'
        })
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
