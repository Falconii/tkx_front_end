"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppRoutingModule = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var secure_guard_1 = require("./guards/secure.guard");
var libera_evento_component_1 = require("./modules/evento/libera-evento/libera-evento.component");
var redefine_senha_component_1 = require("./modules/usuario/redefine-senha/redefine-senha.component");
var home_component_1 = require("./home/home.component");
var routes = [
    { path: 'redefine_senha', component: redefine_senha_component_1.RedefineSenhaComponent },
    { path: 'liberaevento', component: libera_evento_component_1.LiberaEventoComponent },
    { path: 'home', component: home_component_1.HomeComponent },
    {
        path: 'mobile',
        loadChildren: function () {
            return Promise.resolve().then(function () { return require('./modules/mobile/mobile.module'); }).then(function (m) { return m.MobileModule; });
        },
        canActivate: [secure_guard_1.SecureGuard]
    },
    {
        path: 'login',
        loadChildren: function () {
            return Promise.resolve().then(function () { return require('./modules/login/login.module'); }).then(function (m) { return m.LoginModule; });
        }
    },
    {
        path: 'empresas',
        loadChildren: function () {
            return Promise.resolve().then(function () { return require('./modules/empresa/empresa.module'); }).then(function (m) { return m.EmpresaModule; });
        }
    },
    {
        path: 'usuarios',
        loadChildren: function () {
            return Promise.resolve().then(function () { return require('./modules/usuario/usuario.module'); }).then(function (m) { return m.UsuarioModule; });
        }
    },
    {
        path: 'usuarios_eventos',
        loadChildren: function () {
            return Promise.resolve().then(function () { return require('./modules/usuario-evento/usuario-evento.module'); }).then(function (m) { return m.UsuarioEventoModule; });
        }
    },
    {
        path: 'grupos',
        loadChildren: function () {
            return Promise.resolve().then(function () { return require('./modules/grupousuario/grupousuario.module'); }).then(function (m) { return m.GrupousuarioModule; });
        }
    },
    {
        path: 'eventos',
        loadChildren: function () {
            return Promise.resolve().then(function () { return require('./modules/evento/evento.module'); }).then(function (m) { return m.EventoModule; });
        }
    },
    {
        path: 'participantesv2',
        loadChildren: function () {
            return Promise.resolve().then(function () { return require('./modules/participantev2/participantev2.module'); }).then(function (m) { return m.Participantev2Module; });
        }
    },
    {
        path: 'planilhas',
        loadChildren: function () {
            return Promise.resolve().then(function () { return require('./modules/planilha/planilha.module'); }).then(function (m) { return m.PlanilhaModule; });
        }
    },
    {
        path: 'tela01',
        loadChildren: function () {
            return Promise.resolve().then(function () { return require('./modules/mobile-v02/mobile-v02.module'); }).then(function (m) { return m.MobileV02Module; });
        }
    },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    {
        path: '**',
        redirectTo: 'home'
    },
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forRoot(routes)],
            exports: [router_1.RouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
exports.AppRoutingModule = AppRoutingModule;
