"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Entregasv2ComplementarService = void 0;
var core_1 = require("@angular/core");
var environment_development_1 = require("../../environments/environment.development");
var Entregasv2ComplementarService = /** @class */ (function () {
    function Entregasv2ComplementarService(http) {
        this.http = http;
        this.apiURL = environment_development_1.environment.apiURL;
    }
    Entregasv2ComplementarService.prototype.insertentregaparticipante = function (id_participante, entregav2) {
        var url = new URL('entregav2complementar/insertentregaparticipante', this.apiURL).toString();
        return this.http.post(url, { id_participante: id_participante, entregav2: entregav2 });
    };
    Entregasv2ComplementarService.prototype.deleteentregaparticipante = function (id_participante, entregav2) {
        var url = new URL('entregav2complementar/deleteentregaparticipante', this.apiURL).toString();
        return this.http["delete"](url, {
            body: { id_participante: id_participante, entregav2: entregav2 }
        });
    };
    Entregasv2ComplementarService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], Entregasv2ComplementarService);
    return Entregasv2ComplementarService;
}());
exports.Entregasv2ComplementarService = Entregasv2ComplementarService;
