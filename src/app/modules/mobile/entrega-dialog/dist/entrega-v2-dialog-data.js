"use strict";
exports.__esModule = true;
exports.EntregaV2DialogData = void 0;
var entregav2_model_1 = require("../../../models/entregav2-model");
var participantev2_model_1 = require("../../../models/participantev2-model");
var EntregaV2DialogData = /** @class */ (function () {
    function EntregaV2DialogData() {
        this.processar = false;
        this.participantev2 = new participantev2_model_1.Participantev2Model();
        this.entregav2 = new entregav2_model_1.Entregav2Model();
    }
    return EntregaV2DialogData;
}());
exports.EntregaV2DialogData = EntregaV2DialogData;
