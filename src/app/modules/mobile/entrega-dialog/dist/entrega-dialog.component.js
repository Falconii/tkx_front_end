"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.EntregaDialogComponent = void 0;
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var rxjs_1 = require("rxjs");
var util_1 = require("../../../shared/classes/util");
var validator_string_len_1 = require("../../../shared/Validators/validator-string-len");
var scrolling_1 = require("@angular/cdk/scrolling");
var cadastro_acoes_1 = require("../../../shared/classes/cadastro-acoes");
var entregav2_model_1 = require("../../../models/entregav2-model");
var EntregaDialogComponent = /** @class */ (function () {
    function EntregaDialogComponent(formBuilder, appSnackBar, entregaSrv, participanteSrv, entregaComplementarSrv, globalService, dialogRef, confirmDialog, data) {
        var _this = this;
        this.formBuilder = formBuilder;
        this.appSnackBar = appSnackBar;
        this.entregaSrv = entregaSrv;
        this.participanteSrv = participanteSrv;
        this.entregaComplementarSrv = entregaComplementarSrv;
        this.globalService = globalService;
        this.dialogRef = dialogRef;
        this.confirmDialog = confirmDialog;
        this.data = data;
        this.botaoExcluir = false;
        this.acao = cadastro_acoes_1.CadastroAcoes.Consulta;
        this.showSpin = false;
        this.isAtualizado = false;
        this.formulario = formBuilder.group({
            nome_retirada: [{ value: '' }, [validator_string_len_1.ValidatorStringLen(3, 60, true)]],
            rg_retirada: [{ value: '' }, [validator_string_len_1.ValidatorStringLen(3, 11, true)]],
            tam_camisa: [{ value: '' }, [validator_string_len_1.ValidatorStringLen(1, 10, true)]]
        });
        this.globalService.showSpin$.subscribe(function (show) {
            _this.showSpin = show;
        });
    }
    EntregaDialogComponent.prototype.ngOnInit = function () {
        this.setValueNoParam();
        this.getEntrega();
    };
    EntregaDialogComponent.prototype.ngOnDestroy = function () {
        var _a, _b, _c;
        (_a = this.inscricaoEntrega) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        (_b = this.inscricaoAcao) === null || _b === void 0 ? void 0 : _b.unsubscribe();
        (_c = this.inscricaoParticipante) === null || _c === void 0 ? void 0 : _c.unsubscribe();
    };
    EntregaDialogComponent.prototype.getEntrega = function () {
        var _this = this;
        this.inscricaoEntrega = this.entregaSrv
            .getEntregav2(this.data.participantev2.id_empresa, this.data.participantev2.id_evento, this.data.participantev2.id_entrega)
            .pipe(rxjs_1.finalize(function () { return _this.globalService.setSpin(false); }))
            .subscribe({
            next: function (data) {
                _this.botaoExcluir = true;
                _this.data.entregav2 = data;
                _this.acao = cadastro_acoes_1.CadastroAcoes.Edicao;
                console.log('Edicao');
                _this.setValue();
            },
            error: function (error) {
                console.log('Erro: ', error.status);
                if (error.status && error.status == 409) {
                    _this.botaoExcluir = false;
                    var dataAtual = new Date();
                    _this.data.entregav2 = new entregav2_model_1.Entregav2Model();
                    _this.data.entregav2.id_empresa = _this.data.participantev2.id_empresa;
                    _this.data.entregav2.id_evento = _this.data.participantev2.id_evento;
                    _this.data.entregav2.id = 0;
                    _this.data.entregav2.data_retirada = util_1.DataYYYYMMDD(dataAtual);
                    _this.acao = cadastro_acoes_1.CadastroAcoes.Inclusao;
                    console.log('Inclusão');
                    _this.setValue();
                }
                else {
                    _this.appSnackBar.openFailureSnackBar("Erro Na Pesquisa Das Entregas " + util_1.messageError(error), 'OK');
                    _this.closeModal();
                }
            }
        });
    };
    EntregaDialogComponent.prototype.gravar = function () {
        var _this = this;
        if (this.data.entregav2.id == 0) {
            this.data.entregav2.user_insert = this.globalService.getUsuario().id;
        }
        this.data.entregav2.user_update = this.data.entregav2.id > 0 ? this.globalService.getUsuario().id : 0;
        this.inscricaoAcao = this.entregaComplementarSrv.insertentregaparticipante(this.data.participantev2.id, this.data.entregav2)
            .subscribe({
            next: function (data) {
                alert(data.Participantev2.entrega_tam_camisa);
                _this.data.participantev2 = data.Participantev2;
                _this.data.entregav2 = data.Entregav2;
                _this.data.processar = true;
                _this.closeModal();
            },
            error: function (error) {
                _this.appSnackBar.openFailureSnackBar("Erro Na Altera\u00E7\u00E3o " + error.error.tabela + " - " + error.error.erro + " - " + error.error.message, 'OK');
            }
        });
    };
    /*
      insertEntrega() {
        console.log('Fazendo Insert', this.data.entrega);
        this.inscricaoEntrega = this.entregaSrv
          .entregav2Insert(this.data.entrega)
          .pipe(finalize(() => this.globalService.setSpin(false)))
          .subscribe({
            next: (data: Entregav2Model) => {
              this.data.entrega = data;
              this.data.participantev2.id_entrega = data.id;
              this.updateParticipante();
            },
            error: (error: any) => {
              console.log(error);
              this.appSnackBar.openFailureSnackBar(
                `Falha Na Inclusão Da entrega Do Kit ${messageError(error)}`,
                'OK',
              );
            },
          });
      }
    
      updatetEntrega() {
        console.log('Fazendo Update', this.data.entrega);
        this.inscricaoEntrega = this.entregaSrv
          .entregav2Update(this.data.entrega)
          .pipe(finalize(() => this.globalService.setSpin(false)))
          .subscribe({
            next: (data: Entregav2Model) => {
              this.data.entrega = data;
              this.data.participantev2.id_entrega = data.id;
              this.updateParticipante();
            },
            error: (error: any) => {
              console.log(error);
              this.data.entrega = new Entregav2Model();
              this.appSnackBar.openFailureSnackBar(
                `Falha Na Alteração Da entrega Do Kit ${messageError(error)}`,
                'OK',
              );
            },
          });
      }
     */
    EntregaDialogComponent.prototype.deleteEntrega = function () {
        var _this = this;
        this.inscricaoAcao = this.entregaComplementarSrv.deleteentregaparticipante(this.data.participantev2.id, this.data.entregav2)
            .subscribe({
            next: function (data) {
                _this.data.participantev2 = data.Participantev2;
                _this.data.processar = true;
                _this.closeModal();
            },
            error: function (error) {
                _this.appSnackBar.openFailureSnackBar("Erro Na Altera\u00E7\u00E3o " + error.error.tabela + " - " + error.error.erro + " - " + error.error.message, 'OK');
            }
        });
    };
    EntregaDialogComponent.prototype.setValue = function () {
        this.formulario.setValue({
            rg_retirada: this.data.entregav2.rg_retirada,
            nome_retirada: this.data.entregav2.nome_retirada,
            tam_camisa: this.data.entregav2.tam_camisa
        });
        this.isAtualizado = true;
    };
    /* updateParticipante() {
      this.data.participantev2.user_update = this.globalService.getUsuario().id;
      this.inscricaoAcao = this.participanteSrv
        .participantev2Update(this.data.dado)
        .subscribe({
          next: (data: any) => {
            this.getParticipante();
          },
          error: (error: any) => {
            this.appSnackBar.openFailureSnackBar(
              `Erro Na Alteração ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
              'OK',
            );
          },
        });
    } */
    EntregaDialogComponent.prototype.getParticipante = function () {
        var _this = this;
        this.data.participantev2.user_update = this.globalService.getUsuario().id;
        this.inscricaoParticipante = this.participanteSrv
            .getParticipantev2(this.data.participantev2.id_empresa, this.data.participantev2.id_evento, this.data.participantev2.id)
            .subscribe({
            next: function (data) {
                _this.data.participantev2 = data;
                _this.data.processar = true;
                _this.closeModal();
            },
            error: function (error) {
                _this.appSnackBar.openFailureSnackBar("Erro No Lan\u00E7amento Do Kit " + error.error.tabela + " - " + error.error.erro + " - " + error.error.message, 'OK');
            }
        });
    };
    EntregaDialogComponent.prototype.setValueNoParam = function () {
        this.formulario.setValue({
            rg_retirada: '',
            nome_retirada: '',
            tam_camisa: ''
        });
    };
    EntregaDialogComponent.prototype.onSetarOMesmo = function () {
        this.formulario.patchValue({
            rg_retirada: 'O MESMO',
            nome_retirada: 'O MESMO'
        });
    };
    EntregaDialogComponent.prototype.NoValidtouchedOrDirty = function (campo) {
        var _a, _b, _c;
        if (!((_a = this.formulario.get(campo)) === null || _a === void 0 ? void 0 : _a.valid) &&
            (((_b = this.formulario.get(campo)) === null || _b === void 0 ? void 0 : _b.touched) || ((_c = this.formulario.get(campo)) === null || _c === void 0 ? void 0 : _c.dirty))) {
            return true;
        }
        return false;
    };
    EntregaDialogComponent.prototype.getMensafield = function (field) {
        var _a, _b;
        return (_b = (_a = this.formulario.get(field)) === null || _a === void 0 ? void 0 : _a.errors) === null || _b === void 0 ? void 0 : _b['message'];
    };
    EntregaDialogComponent.prototype.hasValue = function (campo) {
        var _a;
        if (((_a = this.formulario.get(campo)) === null || _a === void 0 ? void 0 : _a.value) == '') {
            return false;
        }
        return true;
    };
    EntregaDialogComponent.prototype.closeModal = function () {
        this.dialogRef.close(this.data);
    };
    EntregaDialogComponent.prototype.onProcessar = function () {
        var _a, _b, _c;
        if (this.showSpin) {
            return;
        }
        if (this.formulario.valid) {
            console.log('acao', this.acao);
            this.data.entregav2.rg_retirada = (_a = this.formulario.value) === null || _a === void 0 ? void 0 : _a.rg_retirada.toUpperCase();
            this.data.entregav2.nome_retirada = (_b = this.formulario.value) === null || _b === void 0 ? void 0 : _b.nome_retirada.toUpperCase();
            this.data.entregav2.tam_camisa = (_c = this.formulario.value) === null || _c === void 0 ? void 0 : _c.tam_camisa.toUpperCase();
            this.gravar();
        }
        else {
            this.formulario.markAllAsTouched();
            this.appSnackBar.openSuccessSnackBar("Formul\u00E1rio Com Campos Inv\u00E1lidos.", 'OK');
        }
    };
    EntregaDialogComponent.prototype.onCancelar = function () {
        if (this.showSpin) {
            return;
        }
        this.data.processar = false;
        this.closeModal();
    };
    EntregaDialogComponent.prototype.onExcluir = function () {
        var _this = this;
        if (this.showSpin) {
            return;
        }
        this.confirmDialog
            .open({
            title: 'Exclusão',
            message: "Deseja Realmente Excluir o Kit ?",
            icon: 'warning',
            iconColor: 'warn',
            confirmText: 'Excluir',
            cancelText: 'Cancelar'
        })
            .subscribe(function (result) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (result) {
                    console.log('Vou deletar..');
                    this.deleteEntrega();
                }
                return [2 /*return*/];
            });
        }); });
    };
    EntregaDialogComponent.prototype.scrollAte = function (event) {
        var el = event.target;
        setTimeout(function () {
            el.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 250);
    };
    __decorate([
        core_1.ViewChild(scrolling_1.CdkScrollable)
    ], EntregaDialogComponent.prototype, "scrollable");
    EntregaDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-entrega-dialog',
            templateUrl: './entrega-dialog.component.html',
            styleUrl: './entrega-dialog.component.scss'
        }),
        __param(8, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], EntregaDialogComponent);
    return EntregaDialogComponent;
}());
exports.EntregaDialogComponent = EntregaDialogComponent;
