"use strict";
exports.__esModule = true;
exports.ParametroModel = void 0;
var ParametroModel = /** @class */ (function () {
    function ParametroModel() {
        this.id_empresa = 0;
        this.modulo = '';
        this.assinatura = '';
        this.id_usuario = 0;
        this.parametro = '';
        this.user_insert = 0;
        this.user_update = 0;
    }
    ParametroModel.prototype.load = function (param) {
        this.id_empresa = param.id_empresa;
        this.modulo = param.modulo;
        this.assinatura = param.assinatura;
        this.id_usuario = param.id_usuario;
        this.parametro = param.parametro;
        this.user_insert = param.user_insert;
        this.user_update = param.user_update;
    };
    ParametroModel.prototype.getParametro = function () {
        try {
            var retorno = JSON.parse(this.parametro);
            return retorno;
        }
        catch (error) {
            var retorno = JSON.parse("{\"mensagem\":" + error + "}");
            return retorno;
        }
    };
    ParametroModel.prototype.setParametro = function (value) {
        this.parametro = JSON.stringify(value);
    };
    return ParametroModel;
}());
exports.ParametroModel = ParametroModel;
