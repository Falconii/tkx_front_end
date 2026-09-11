"use strict";
exports.__esModule = true;
exports.EntregaparticipanteModel = void 0;
var entregav2_model_1 = require("./entregav2-model");
var participantev2_model_1 = require("./participantev2-model");
var EntregaparticipanteModel = /** @class */ (function () {
    function EntregaparticipanteModel() {
        this.Entregav2 = new entregav2_model_1.Entregav2Model();
        this.Participantev2 = new participantev2_model_1.Participantev2Model();
    }
    return EntregaparticipanteModel;
}());
exports.EntregaparticipanteModel = EntregaparticipanteModel;
