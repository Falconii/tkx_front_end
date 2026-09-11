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
exports.CrudUsuarioComponent = void 0;
var UsuarioDialogData_1 = require("./../usuario-dialog/UsuarioDialogData");
var core_1 = require("@angular/core");
var usuario_model_1 = require("../../../models/usuario-model");
var controle_paginas_1 = require("../../../shared/classes/controle-paginas");
var util_1 = require("../../../shared/classes/util");
var cadastro_acoes_1 = require("../../../shared/classes/cadastro-acoes");
var scrolling_1 = require("@angular/cdk/scrolling");
var parametro_model_1 = require("../../../models/parametro-model");
var tipo_operacao_1 = require("../../../shared/classes/tipo-operacao");
var parametro_usuario01_1 = require("../../../parametros/parametro-usuario01");
var atualiza_parametro_usuario01_1 = require("../../../shared/classes/atualiza-parametro-usuario01");
var dialog_1 = require("@angular/material/dialog");
var usuario_dialog_component_1 = require("../usuario-dialog/usuario-dialog.component");
var util_2 = require("../../../shared/classes/util");
var empresa_model_1 = require("../../../models/empresa-model");
var CrudUsuarioComponent = /** @class */ (function () {
    function CrudUsuarioComponent(globalService, usuarioSrv, loginSrv, route, router, appSnackBar, usuarioDialog, confirmDialog, localStorageSrv) {
        this.globalService = globalService;
        this.usuarioSrv = usuarioSrv;
        this.loginSrv = loginSrv;
        this.route = route;
        this.router = router;
        this.appSnackBar = appSnackBar;
        this.usuarioDialog = usuarioDialog;
        this.confirmDialog = confirmDialog;
        this.localStorageSrv = localStorageSrv;
        this.usuarios = [];
        this.controlePaginas = new controle_paginas_1.ControlePaginas(0, 0);
        this.tamPagina = 50;
        this.retorno = false;
        this.parametro = new parametro_model_1.ParametroModel();
        this.hide = false;
    }
    CrudUsuarioComponent.prototype.ngOnInit = function () {
        this.globalService.setLogadoTeste(true);
    };
    CrudUsuarioComponent.prototype.ngOnDestroy = function () {
        var _a, _b, _c, _d;
        (_a = this.inscricaoUsuario) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        (_b = this.inscricaoLogOut) === null || _b === void 0 ? void 0 : _b.unsubscribe();
        (_c = this.inscricaoIniciarSenha) === null || _c === void 0 ? void 0 : _c.unsubscribe();
        (_d = this.inscricaoSituacao) === null || _d === void 0 ? void 0 : _d.unsubscribe();
    };
    CrudUsuarioComponent.prototype.escolha = function (opcao, i, usuario) {
        if (opcao == cadastro_acoes_1.CadastroAcoes.Zerar_Senha && usuario) {
            this.onZerarSenha(i, usuario);
            return;
        }
        if (opcao == cadastro_acoes_1.CadastroAcoes.Ativar_Inativar && usuario) {
            this.onTrocaSituacao(usuario);
            return;
        }
        this.openUsuarioDialog(opcao, i, usuario);
    };
    CrudUsuarioComponent.prototype.onZerarSenha = function (i, usuario) {
        var _this = this;
        this.confirmDialog
            .open({
            title: 'Zerar Senha',
            message: "Deseja Realmente Zerar A Senha ?",
            icon: 'warning',
            iconColor: 'warn',
            confirmText: 'Zerar',
            cancelText: 'Cancelar'
        })
            .subscribe(function (result) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (result) {
                    this.trocarSenha(usuario);
                }
                return [2 /*return*/];
            });
        }); });
    };
    CrudUsuarioComponent.prototype.onHome = function () {
        this.router.navigate(['']);
    };
    CrudUsuarioComponent.prototype.getAcoes = function () {
        return cadastro_acoes_1.CadastroAcoes;
    };
    CrudUsuarioComponent.prototype.getUsuarios = function (tipoOperacao) {
        var _this = this;
        if (tipoOperacao === void 0) { tipoOperacao = tipo_operacao_1.TipoOperacao.Pesquisa; }
        var par = new parametro_usuario01_1.ParametroUsuario01();
        par.id_empresa = this.globalService.getEmpresa().id;
        par = atualiza_parametro_usuario01_1.AtualizaParametroUsuario01(par, this.parametro.getParametro());
        if (tipoOperacao == tipo_operacao_1.TipoOperacao.Contador) {
            par.contador = 'S';
        }
        else {
            par.pagina = this.controlePaginas.getPaginalAtual();
            par.tamPagina = this.controlePaginas.getTamPagina();
        }
        console.log('Paramentros de Consulta:', par);
        this.inscricaoUsuario = this.usuarioSrv
            .getUsuariosParametro_01(par)
            .subscribe({
            next: function (data) {
                if (tipoOperacao == tipo_operacao_1.TipoOperacao.Pesquisa) {
                    _this.usuarios = data;
                }
                else {
                    _this.controlePaginas = new controle_paginas_1.ControlePaginas(_this.tamPagina, data.total == 0 ? 1 : data.total);
                    _this.getUsuarios();
                }
            },
            error: function (error) {
                console.log(error);
                _this.usuarios = [];
                _this.controlePaginas = new controle_paginas_1.ControlePaginas(_this.tamPagina, 0);
            }
        });
    };
    CrudUsuarioComponent.prototype.getTexto = function () {
        return util_1.MensagensBotoes;
    };
    CrudUsuarioComponent.prototype.onChangePage = function () {
        this.getUsuarios();
    };
    CrudUsuarioComponent.prototype.onChangeHide = function (hide) {
        this.hide = hide;
    };
    CrudUsuarioComponent.prototype.onChangeParametros = function (param) {
        this.parametro = param;
        console.log('Paramentro de Pesquisa', this.parametro);
        this.getUsuarios(tipo_operacao_1.TipoOperacao.Contador);
    };
    CrudUsuarioComponent.prototype.openUsuarioDialog = function (opcao, i, usuario) {
        var _this = this;
        if (opcao === void 0) { opcao = cadastro_acoes_1.CadastroAcoes.Consulta; }
        var data = new UsuarioDialogData_1.UsuarioDialogData();
        if (usuario == null) {
            usuario = new usuario_model_1.UsuarioModel();
            usuario.id_empresa = this.globalService.getEmpresa().id;
            usuario.cadastr = util_2.DataDDMMYYYY(new Date());
            usuario.trocarsenha = 'S';
        }
        data.opcao = opcao;
        data.processar = false;
        data.usuario = usuario;
        console.log('Ação:', opcao, data.usuario);
        var dialogConfig = new dialog_1.MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.id = 'crud-usuario';
        dialogConfig.width = '80vw';
        dialogConfig.height = '90vh';
        dialogConfig.disableClose = true;
        dialogConfig.panelClass = 'dialog-font-small';
        dialogConfig.data = data;
        var modalDialog = this.usuarioDialog
            .open(usuario_dialog_component_1.UsuarioDialogComponent, dialogConfig)
            .beforeClosed()
            .subscribe(function (data) {
            if (data === null || data === void 0 ? void 0 : data.processar) {
                switch (opcao) {
                    case cadastro_acoes_1.CadastroAcoes.Inclusao:
                        _this.usuarios.push(data.usuario);
                        break;
                    case cadastro_acoes_1.CadastroAcoes.Edicao:
                        if (usuario.id == _this.globalService.getUsuario().id) {
                            _this.logOutUsuario();
                        }
                        else {
                            if (i >= 0) {
                                _this.usuarios[i] = data.usuario;
                            }
                        }
                        break;
                    case cadastro_acoes_1.CadastroAcoes.Exclusao:
                        if (usuario.id == _this.globalService.getUsuario().id) {
                            _this.logOutUsuario();
                        }
                        else {
                            _this.usuarios.splice(i, 1);
                        }
                        break;
                    default:
                        break;
                }
            }
            else {
            }
        });
    };
    CrudUsuarioComponent.prototype.trocarSenha = function (usuario) {
        var _this = this;
        var par = {
            id_empresa: usuario.id_empresa,
            id_usuario: usuario.id
        };
        this.inscricaoUsuario = this.loginSrv.zerarSenha(par).subscribe({
            next: function (data) {
                if (usuario.id == _this.globalService.getUsuario().id) {
                    _this.logOutUsuario();
                }
                else {
                    _this.appSnackBar.openSuccessSnackBar('Senha Resetada Com Sucesso!', 'OK');
                }
            },
            error: function (error) {
                console.log('ERRO: ', error);
                _this.appSnackBar.openFailureSnackBar('Falha Na Reciclagem Da Senha!', 'OK');
            }
        });
    };
    CrudUsuarioComponent.prototype.Ativar_Inativar = function (usuario) {
        var _this = this;
        usuario.ativo = usuario.ativo == 'S' ? 'N' : 'S';
        this.inscricaoSituacao = this.usuarioSrv
            .usuarioUpdateAtivo(usuario)
            .subscribe({
            next: function (data) {
                _this.appSnackBar.openSuccessSnackBar('Usuário Alterado Com Sucesso!', 'OK');
            },
            error: function (error) {
                console.log('ERRO: ', error);
                _this.appSnackBar.openFailureSnackBar('Falha Na Atualização Do Usuario!', 'OK');
            }
        });
    };
    CrudUsuarioComponent.prototype.logOutUsuario = function () {
        var _this = this;
        this.inscricaoLogOut = this.usuarioSrv.logout().subscribe({
            next: function (any) {
                _this.localStorageSrv.clear();
                _this.globalService.setLogado(false);
                _this.globalService.setUsuario(new usuario_model_1.UsuarioModel());
                _this.globalService.setEmpresa(new empresa_model_1.EmpresaModel());
                _this.router.navigate(['/login']);
            },
            error: function (error) {
                _this.appSnackBar.openFailureSnackBar("Problemas Com O Usu\u00E1rio " + util_1.messageError(error), 'OK');
                _this.localStorageSrv.clear();
                _this.globalService.setLogado(false);
                _this.globalService.setUsuario(new usuario_model_1.UsuarioModel());
                _this.globalService.setEmpresa(new empresa_model_1.EmpresaModel());
                _this.router.navigate(['/login']);
            }
        });
    };
    CrudUsuarioComponent.prototype.onTrocaSituacao = function (usuario) {
        var _this = this;
        var msg = usuario.ativo == 'S'
            ? 'Deseja Realmente Inativar O Usuário ?'
            : 'Deseja Realmente Ativar O Usuário ?';
        this.confirmDialog
            .open({
            title: 'Troca De Situação',
            message: msg,
            icon: 'warning',
            iconColor: 'warn',
            confirmText: "Sim",
            cancelText: 'Cancelar'
        })
            .subscribe(function (result) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (result) {
                    this.Ativar_Inativar(usuario);
                }
                return [2 /*return*/];
            });
        }); });
    };
    __decorate([
        core_1.ViewChild(scrolling_1.CdkVirtualScrollViewport)
    ], CrudUsuarioComponent.prototype, "viewPort");
    CrudUsuarioComponent = __decorate([
        core_1.Component({
            selector: 'app-crud-usuario',
            templateUrl: './crud-usuario.component.html',
            styleUrl: './crud-usuario.component.scss',
            encapsulation: core_1.ViewEncapsulation.None
        })
    ], CrudUsuarioComponent);
    return CrudUsuarioComponent;
}());
exports.CrudUsuarioComponent = CrudUsuarioComponent;
