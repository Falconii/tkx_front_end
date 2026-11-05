"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.EventoComplementarService = void 0;
var core_1 = require("@angular/core");
var environment_development_1 = require("../../environments/environment.development");
var EventoComplementarService = /** @class */ (function () {
    function EventoComplementarService(http, cabPlanilhaSrv) {
        this.http = http;
        this.cabPlanilhaSrv = cabPlanilhaSrv;
        this.apiURL = environment_development_1.environment.apiURL;
    }
    EventoComplementarService.prototype.updateStatusEvento = function (params) {
        var url = new URL('evento_complementar/updateStatusEvento', this.apiURL).toString();
        return this.http.put(url, params);
    };
    EventoComplementarService.prototype.resumoCategoria = function (id_evento) {
        var url = new URL('evento_complementar/resumocategoria', this.apiURL).toString();
        return this.http.post(url, { id_evento: id_evento });
    };
    EventoComplementarService.prototype.resumoOPerador = function (id_evento) {
        var url = new URL('evento_complementar/resumooperador', this.apiURL).toString();
        return this.http.post(url, { id_evento: id_evento });
    };
    EventoComplementarService.prototype.resumoKit = function (id_evento) {
        var url = new URL('evento_complementar/resumokit', this.apiURL).toString();
        return this.http.post(url, { id_evento: id_evento });
    };
    EventoComplementarService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], EventoComplementarService);
    return EventoComplementarService;
}());
exports.EventoComplementarService = EventoComplementarService;
