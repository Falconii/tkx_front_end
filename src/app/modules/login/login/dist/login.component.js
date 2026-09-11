"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.LoginComponent = void 0;
var empresa_model_1 = require("./../../../models/empresa-model");
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var usuario_model_1 = require("../../../models/usuario-model");
var util_1 = require("../../../shared/classes/util");
var payload_model_1 = require("../../../models/payload-model");
var layout_1 = require("@angular/cdk/layout");
var parametro_evento01_1 = require("../../../parametros/parametro-evento01");
var evento_model_1 = require("../../../models/evento-model");
var usuario_troca_senha_dialog_component_1 = require("../../usuario/usuario-troca-senha-dialog/usuario-troca-senha-dialog.component");
var usuariotrocasenhadata_1 = require("../../usuario/usuario-troca-senha-dialog/usuariotrocasenhadata");
var cadastro_acoes_1 = require("../../../shared/classes/cadastro-acoes");
var validator_Cnpj_Cpf_1 = require("../../../shared/Validators/validator-Cnpj-Cpf");
var LoginComponent = /** @class */ (function () {
    function LoginComponent(formBuilder, globalService, usuariosService, empresasServices, localStorageSrv, loginSrv, eventoSrv, router, matDialog, appSnackBar, breakpoint, confirmDialog, usuarioTrocaSenha) {
        var _this = this;
        this.formBuilder = formBuilder;
        this.globalService = globalService;
        this.usuariosService = usuariosService;
        this.empresasServices = empresasServices;
        this.localStorageSrv = localStorageSrv;
        this.loginSrv = loginSrv;
        this.eventoSrv = eventoSrv;
        this.router = router;
        this.matDialog = matDialog;
        this.appSnackBar = appSnackBar;
        this.breakpoint = breakpoint;
        this.confirmDialog = confirmDialog;
        this.usuarioTrocaSenha = usuarioTrocaSenha;
        this.empresa = new empresa_model_1.EmpresaModel();
        this.usuario = new usuario_model_1.UsuarioModel();
        this.isMobile = false;
        this.evento = new evento_model_1.EventoModel();
        this.formulario = this.formulario = formBuilder.group({
            cnpj_cpf: [{ value: '' }, [validator_Cnpj_Cpf_1.ValidatorCnpjCpf(true)]],
            senha: [{ value: '' }]
        });
        // Detecta mobile automaticamente
        this.breakpoint.observe([layout_1.Breakpoints.Handset]).subscribe(function (result) {
            _this.isMobile = result.matches;
        });
    }
    LoginComponent.prototype.ngOnInit = function () {
        this.setValue();
        this.getValoresIniciais();
    };
    LoginComponent.prototype.ngOnDestroy = function () {
        var _a, _b, _c, _d, _e;
        (_a = this.inscricaoUsuario) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        (_b = this.inscricaoEmpresa) === null || _b === void 0 ? void 0 : _b.unsubscribe();
        (_c = this.inscricaoLogin) === null || _c === void 0 ? void 0 : _c.unsubscribe();
        (_d = this.inscricaoEvento) === null || _d === void 0 ? void 0 : _d.unsubscribe();
        (_e = this.inscricaoReset) === null || _e === void 0 ? void 0 : _e.unsubscribe();
    };
    LoginComponent.prototype.setValue = function () {
        this.formulario.setValue({
            cnpj_cpf: this.globalService.getUsuario().cnpj_cpf,
            senha: ''
        });
    };
    LoginComponent.prototype.setValueNoParam = function () {
        this.formulario.setValue({
            cnpj_cpf: '',
            senha: ''
        });
    };
    LoginComponent.prototype.getValoresIniciais = function () {
        var token = this.localStorageSrv.getString('Token');
        if (token) {
            var payload = this.getPayloadData(token);
            if (payload) {
                if (payload.id_empresa && payload.id_usuario) {
                    this.getEmpresa(payload.id_empresa, payload.id_usuario);
                }
            }
        }
        else {
            this.globalService.setOnSubmit(false);
        }
    };
    LoginComponent.prototype.getEmpresa = function (id_empresa, id_usuario) {
        var _this = this;
        this.inscricaoEmpresa = this.empresasServices
            .getEmpresa(id_empresa)
            .subscribe({
            next: function (data) {
                _this.globalService.setOnSubmit(false);
                _this.globalService.setEmpresa(data);
                _this.getUsuario(id_empresa, id_usuario);
            },
            error: function (error) {
                _this.globalService.setOnSubmit(false);
                _this.appSnackBar.openFailureSnackBar("Problemas Com A Empresa " + util_1.messageError(error), 'OK');
            }
        });
    };
    LoginComponent.prototype.getUsuario = function (id_empresa, id_usuario) {
        var _this = this;
        this.inscricaoUsuario = this.usuariosService
            .getUsuario(id_empresa, id_usuario)
            .subscribe({
            next: function (data) {
                _this.globalService.setUsuario(data);
                _this.globalService.setLogado(true);
                _this.globalService.setLogadoTeste(true);
                if (data.trocarsenha == "S") {
                    _this.onAlterarSenha();
                }
            },
            error: function (error) {
                _this.globalService.setOnSubmit(false);
                _this.appSnackBar.openFailureSnackBar("Problemas Com O Usu\u00E1rio " + util_1.messageError(error), 'OK');
                _this.globalService.setUsuario(new usuario_model_1.UsuarioModel());
                _this.globalService.setLogado(false);
                _this.globalService.setLogadoTeste(false);
            }
        });
    };
    LoginComponent.prototype.getLoginbycpf = function (id_empresa, cnpj_cpf, senha) {
        var _this = this;
        var par = {
            id_empresa: id_empresa,
            cnpj_cpf: cnpj_cpf,
            password: senha
        };
        this.inscricaoLogin = this.loginSrv.loginByCnpjCpf(par).subscribe({
            next: function (data) {
                _this.localStorageSrv.setString('Token', data.accessToken);
                _this.getEmpresa(id_empresa, data.id);
            },
            error: function (error) {
                _this.globalService.setOnSubmit(false);
                _this.appSnackBar.openFailureSnackBar("Acesso N\u00E3o Autorizado", 'OK');
            }
        });
    };
    LoginComponent.prototype.onValidar = function () {
        if (this.formulario.valid) {
            if (this.globalService.getEmpresa().id <= 0) {
                var empresa = new empresa_model_1.EmpresaModel();
                empresa.id = 1;
                this.globalService.setEmpresa(empresa);
            }
            this.globalService.setOnSubmit(true);
            var cnpj_cpf = this.formulario.value.cnpj_cpf;
            var senha = this.formulario.value.senha;
            this.getLoginbycpf(this.globalService.getEmpresa().id, cnpj_cpf, senha);
        }
        else {
            this.formulario.markAllAsTouched();
            this.appSnackBar.openSuccessSnackBar("Formul\u00E1rio Com Campos Inv\u00E1lidos.", 'OK');
        }
    };
    LoginComponent.prototype.onCancelar = function () {
        this.router.navigate(['/']);
    };
    LoginComponent.prototype.onSair = function () {
        this.globalService.setLogado(false);
        this.globalService.setUsuario(new usuario_model_1.UsuarioModel());
        this.localStorageSrv.removeItem('Token');
        this.router.navigate(['/']);
    };
    LoginComponent.prototype.getEvento = function (id_empresa) {
        var _this = this;
        if (id_empresa === void 0) { id_empresa = 1; }
        var par = new parametro_evento01_1.ParametroEvento01();
        par.id_empresa = this.globalService.getEmpresa().id;
        par.status = '1';
        par.contador = 'N';
        this.inscricaoEvento = this.eventoSrv
            .getEventosParametro_01(par)
            .subscribe({
            next: function (data) {
            },
            error: function (error) {
                _this.appSnackBar.openFailureSnackBar("Nenhum Evento Encontrado! " + util_1.messageError(error), 'OK');
            }
        });
    };
    LoginComponent.prototype.onEsqueceu = function () {
        var _this = this;
        var cpf = this.formulario.value.cnpj_cpf;
        this.confirmDialog
            .open({
            title: 'Resetar Senha',
            message: "Deseja Realmente Resetar A Senha",
            icon: 'warning',
            iconColor: 'warn',
            confirmText: 'Resetar',
            cancelText: 'Cancelar'
        })
            .subscribe(function (result) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (result) {
                    this.resetar(1, cpf);
                }
                return [2 /*return*/];
            });
        }); });
    };
    LoginComponent.prototype.getPayloadData = function (token) {
        try {
            var payloadBase64 = token.split('.')[1];
            var payloadJson = atob(payloadBase64);
            var payload = JSON.parse(payloadJson);
            var retorno = new payload_model_1.PayLoadModel();
            retorno.id_empresa = payload.id_empresa;
            retorno.id_usuario = payload.id_usuario;
            return retorno;
        }
        catch (error) {
            return null;
        }
    };
    LoginComponent.prototype.resetar = function (id_empresa, cpf) {
        var _this = this;
        var par = {
            id_empresa: id_empresa,
            cpf: cpf
        };
        this.inscricaoReset = this.loginSrv.esqueceuSenhaCpf(par).subscribe({
            next: function (data) {
                _this.appSnackBar.openSuccessSnackBar(data.message, 'OK');
            },
            error: function (error) {
                _this.appSnackBar.openFailureSnackBar("Falha Na Gera\u00E7\u00E3o Do Email", 'OK');
            }
        });
    };
    LoginComponent.prototype.onAlterarSenha = function () {
        this.openTrocaSenhaDialog(cadastro_acoes_1.CadastroAcoes.Edicao, this.globalService.getUsuario());
    };
    LoginComponent.prototype.openTrocaSenhaDialog = function (opcao, usuario) {
        var _this = this;
        if (opcao === void 0) { opcao = cadastro_acoes_1.CadastroAcoes.Edicao; }
        var data = new usuariotrocasenhadata_1.Usuariotrocasenhadata();
        if (usuario == null) {
            return;
        }
        data.opcao = opcao;
        data.processar = false;
        data.usuario = usuario;
        var dialogConfig = new dialog_1.MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.id = 'crud-usuario';
        dialogConfig.width = '60vw';
        dialogConfig.height = '65vh';
        dialogConfig.disableClose = true;
        dialogConfig.data = data;
        var modalDialog = this.usuarioTrocaSenha
            .open(usuario_troca_senha_dialog_component_1.UsuarioTrocaSenhaDialogComponent, dialogConfig)
            .beforeClosed()
            .subscribe(function (data) {
            if (data === null || data === void 0 ? void 0 : data.trocasenha) {
                _this.globalService.usuario.trocarsenha = 'N';
                _this.appSnackBar.openSuccessSnackBar("Senha Atualizada Com Sucesso !", 'OK');
            }
            if (data === null || data === void 0 ? void 0 : data.cancelar) {
                _this.appSnackBar.openWarningnackBar("Opera\u00E7\u00E3o Cancelada Pelo Usu\u00E1rio.", 'OK');
            }
        });
    };
    LoginComponent = __decorate([
        core_1.Component({
            selector: 'app-login',
            templateUrl: './login.component.html',
            styleUrl: './login.component.css'
        })
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
