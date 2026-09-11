"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppComponent = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var usuario_model_1 = require("./models/usuario-model");
var util_1 = require("./shared/classes/util");
var empresa_model_1 = require("./models/empresa-model");
var payload_model_1 = require("./models/payload-model");
var layout_1 = require("@angular/cdk/layout");
var cadastro_acoes_1 = require("./shared/classes/cadastro-acoes");
var usuariotrocasenhadata_1 = require("./modules/usuario/usuario-troca-senha-dialog/usuariotrocasenhadata");
var usuario_troca_senha_dialog_component_1 = require("./modules/usuario/usuario-troca-senha-dialog/usuario-troca-senha-dialog.component");
var dialog_1 = require("@angular/material/dialog");
var usuario_dialog_component_1 = require("./modules/usuario/usuario-dialog/usuario-dialog.component");
var UsuarioDialogData_1 = require("./modules/usuario/usuario-dialog/UsuarioDialogData");
var parametro_evento01_1 = require("./parametros/parametro-evento01");
var AppComponent = /** @class */ (function () {
    function AppComponent(globalService, router, localStorageSrv, loginSrv, appSnackBar, empresaService, usuarioService, titleService, breakpoint, eventoSrv, usuarioDialog, usuarioTrocaSenha) {
        var _this = this;
        this.globalService = globalService;
        this.router = router;
        this.localStorageSrv = localStorageSrv;
        this.loginSrv = loginSrv;
        this.appSnackBar = appSnackBar;
        this.empresaService = empresaService;
        this.usuarioService = usuarioService;
        this.titleService = titleService;
        this.breakpoint = breakpoint;
        this.eventoSrv = eventoSrv;
        this.usuarioDialog = usuarioDialog;
        this.usuarioTrocaSenha = usuarioTrocaSenha;
        this.title = 'tkx_frontend';
        this.showMenu = true;
        this.isMobile = false;
        // 🔹 2. Objeto de controle do menu
        this.open = {
            cadastros: false,
            eventos: false,
            processamento: false,
            kits: false,
            sobre: false
        };
        // 🔹 3. Estrutura do menu
        this.menu = [
            {
                key: 'cadastros',
                label: 'Cadastros',
                links: [
                    { label: 'Empresas', route: 'empresas' },
                    { label: 'Usuários', route: 'usuarios' },
                    { label: 'Grupos de Usuários', route: 'grupos' },
                    { label: 'Categorias', route: 'cadastro_padrao' },
                    { label: 'Operadores', route: 'usuarios_eventos' },
                ],
                children: []
            },
            {
                key: 'eventos',
                label: 'Eventos',
                links: [
                    { label: 'Eventos', route: 'eventos' },
                    { label: 'Participantes', route: 'participantesv2' },
                ],
                children: [
                    {
                        key: 'processamento',
                        label: 'Processamento',
                        links: [
                            { label: 'Planilhas', route: 'planilhas' },
                        ]
                    },
                ]
            },
            {
                key: 'kits',
                label: 'Kits',
                links: [{ label: 'Entrega De Kits', route: 'mobile' }],
                children: []
            },
            {
                key: 'sobre',
                label: 'Sobre',
                links: [{ label: 'Parâmetros do Sistema', route: 'param' }],
                children: []
            },
        ];
        this.valoresIniciaisCarregados = false;
        this.router.events.subscribe(function (event) {
            if (event instanceof router_1.NavigationEnd) {
                _this.inicializacao(event.urlAfterRedirects);
            }
        });
        this.breakpoint.observe([layout_1.Breakpoints.Handset]).subscribe(function (result) {
            _this.isMobile = result.matches;
        });
    }
    AppComponent.prototype.inicializacao = function (rota) {
        var _this = this;
        // ROTAS PÚBLICAS — NÃO RODAR FLUXO NORMAL
        var rotasPublicas = ['/redefine_senha', '/login', '/recuperar_senha', '/liberaevento'];
        if (rotasPublicas.some(function (r) { return rota.startsWith(r); })) {
            this.showMenu = false;
            return; // <-- ESSENCIAL
        }
        this.titleService.setTitle('Conciliador');
        this.globalService.shomMenuEmitter.subscribe(function (show) {
            _this.showMenu = show;
        });
        this.globalService.changePassWordEmitter.subscribe(function (change) {
            _this.openTrocaSenhaDialog(cadastro_acoes_1.CadastroAcoes.Edicao, _this.globalService.getUsuario());
        });
        var token = this.localStorageSrv.getString('Token');
        if (!token) {
            this.globalService.setLogado(false);
            this.onLogin();
            return;
        }
        else {
            // 👉 Só carrega valores iniciais uma vez
            if (!this.valoresIniciaisCarregados) {
                this.valoresIniciaisCarregados = true;
                this.getValoresIniciais();
            }
        }
    };
    AppComponent.prototype.ngOnDestroy = function () {
        var _a, _b, _c, _d, _e;
        (_a = this.inscricaoLogin) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        (_b = this.inscricaoUsuario) === null || _b === void 0 ? void 0 : _b.unsubscribe();
        (_c = this.inscricaoEmpresa) === null || _c === void 0 ? void 0 : _c.unsubscribe();
        (_d = this.inscricaoLogOut) === null || _d === void 0 ? void 0 : _d.unsubscribe();
        (_e = this.inscricaoEvento) === null || _e === void 0 ? void 0 : _e.unsubscribe();
    };
    AppComponent.prototype.onLogin = function () {
        this.router.navigate(['/login']);
    };
    AppComponent.prototype.onHome = function () {
        this.router.navigate(['/home']);
    };
    AppComponent.prototype.getUsuarioNome = function () {
        return this.globalService.getUsuario();
    };
    AppComponent.prototype.getValoresIniciais = function () {
        var token = this.localStorageSrv.getString('Token');
        if (token) {
            var payload = this.getPayloadData(token);
            if (payload) {
                if (payload.id_empresa && payload.id_usuario) {
                    this.getEmpresa(payload.id_empresa, payload.id_usuario);
                }
            }
        }
    };
    AppComponent.prototype.getEmpresa = function (id_empresa, id_usuario) {
        var _this = this;
        this.inscricaoEmpresa = this.empresaService
            .getEmpresa(id_empresa)
            .subscribe({
            next: function (data) {
                _this.globalService.setEmpresa(data);
                _this.getUsuario(id_empresa, id_usuario);
            },
            error: function (error) {
                if (error.status && error.status == 401) {
                    _this.localStorageSrv.clear();
                }
                else {
                    _this.appSnackBar.openFailureSnackBar("Problemas Com A Empresa " + util_1.messageError(error), 'OK');
                }
            }
        });
    };
    AppComponent.prototype.getUsuario = function (id_empresa, id_usuario) {
        var _this = this;
        this.inscricaoUsuario = this.usuarioService
            .getUsuario(id_empresa, id_usuario)
            .subscribe({
            next: function (data) {
                _this.globalService.setUsuario(data);
                _this.globalService.setLogado(true);
                console.log("indo para o home", _this.globalService.getLogado());
                _this.onHome();
                _this.globalService.setLogadoTeste(true);
            },
            error: function (error) {
                if (error.status && error.status == 401) {
                    _this.localStorageSrv.clear();
                    _this.appSnackBar.openFailureSnackBar("A\u00E7\u00E3o N\u00E3o Autorizada!", 'OK');
                }
                else {
                    _this.appSnackBar.openFailureSnackBar("Problemas Com O Usu\u00E1rio -- APP " + util_1.messageError(error), 'OK');
                }
                _this.globalService.setUsuario(new usuario_model_1.UsuarioModel());
                _this.globalService.setLogado(false);
            }
        });
    };
    AppComponent.prototype.getPayloadData = function (token) {
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
            console.error('Erro ao decodificar o token:', error);
            return null;
        }
    };
    AppComponent.prototype.openUsuarioDialog = function (opcao, usuario) {
        var _this = this;
        if (opcao === void 0) { opcao = cadastro_acoes_1.CadastroAcoes.Edicao; }
        var data = new UsuarioDialogData_1.UsuarioDialogData();
        if (usuario == null) {
            return;
        }
        data.opcao = opcao;
        data.processar = false;
        data.usuario = usuario;
        console.log('Ação:', opcao, data.usuario);
        var dialogConfig = new dialog_1.MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.id = 'crud-usuario';
        dialogConfig.width = '90vw';
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
                    case cadastro_acoes_1.CadastroAcoes.Edicao:
                        _this.globalService.setUsuario(data.usuario);
                        break;
                    default:
                        break;
                }
            }
            else {
            }
        });
    };
    AppComponent.prototype.openTrocaSenhaDialog = function (opcao, usuario) {
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
        dialogConfig.width = '90vw';
        dialogConfig.height = '80vh';
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
    AppComponent.prototype.toggle = function (menu) {
        this.open[menu] = !this.open[menu];
    };
    AppComponent.prototype.onNavigate = function () {
        if (this.isMobile) {
            this.sidenav.close();
        }
    };
    AppComponent.prototype.getEvento = function (id_empresa) {
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
                if (_this.isMobile) {
                    _this.router.navigate(['/mobile']);
                }
            },
            error: function (error) {
                _this.appSnackBar.openFailureSnackBar("Nenhum Evento Encontrado! " + util_1.messageError(error), 'OK');
            }
        });
    };
    AppComponent.prototype.logOutUsuario = function () {
        var _this = this;
        this.inscricaoLogOut = this.usuarioService.logout().subscribe({
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
    AppComponent.prototype.isCliente = function () {
        return this.globalService.getUsuario().grupo_descricao == 'CLIENTE';
    };
    AppComponent.prototype.onSair = function () {
        this.logOutUsuario();
    };
    AppComponent.prototype.onAlterarSenha = function () {
        this.openTrocaSenhaDialog(cadastro_acoes_1.CadastroAcoes.Edicao, this.globalService.getUsuario());
    };
    AppComponent.prototype.onPerfil = function () {
        this.openUsuarioDialog(cadastro_acoes_1.CadastroAcoes.Edicao, this.globalService.getUsuario());
    };
    __decorate([
        core_1.ViewChild('sidenav')
    ], AppComponent.prototype, "sidenav");
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            templateUrl: './app.component.html',
            styleUrls: ['./app.component.css']
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
