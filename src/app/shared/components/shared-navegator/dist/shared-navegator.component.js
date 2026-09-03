"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SharedNavegatorComponent = void 0;
var core_1 = require("@angular/core");
var SharedNavegatorComponent = /** @class */ (function () {
    function SharedNavegatorComponent() {
        this.change = new core_1.EventEmitter();
    }
    SharedNavegatorComponent.prototype.ngOnInit = function () { };
    SharedNavegatorComponent.prototype.getAtual = function () {
        return this.controlePaginas.getPaginalAtual() + "/" + this.controlePaginas.getTotalPaginas();
    };
    SharedNavegatorComponent.prototype.firstPage = function () {
        this.controlePaginas.goFirst();
        this.change.emit('');
    };
    SharedNavegatorComponent.prototype.lastPage = function () {
        this.controlePaginas.goLast();
        this.change.emit('');
    };
    SharedNavegatorComponent.prototype.forwardPage = function () {
        this.controlePaginas.forwardPage();
        this.change.emit('');
    };
    SharedNavegatorComponent.prototype.nextPage = function () {
        this.controlePaginas.nextPage();
        this.change.emit('');
    };
    Object.defineProperty(SharedNavegatorComponent.prototype, "pageDisplay", {
        get: function () {
            var pad = function (n) { return n.toString().padStart(2, '0'); };
            if (this.controlePaginas.getTotalRegistros() == 0) {
                return 'Pesquisa Em Branco!';
            }
            else {
                return pad(this.controlePaginas.getPaginalAtual()) + "/" + pad(this.controlePaginas.getTotalPaginas()) + " - " + this.controlePaginas.getTotalRegistros();
            }
        },
        enumerable: false,
        configurable: true
    });
    __decorate([
        core_1.Input('controle')
    ], SharedNavegatorComponent.prototype, "controlePaginas");
    __decorate([
        core_1.Output('changePage')
    ], SharedNavegatorComponent.prototype, "change");
    SharedNavegatorComponent = __decorate([
        core_1.Component({
            selector: 'app-navegator',
            templateUrl: './shared-navegator.component.html',
            styleUrls: ['./shared-navegator.component.scss']
        })
    ], SharedNavegatorComponent);
    return SharedNavegatorComponent;
}());
exports.SharedNavegatorComponent = SharedNavegatorComponent;
