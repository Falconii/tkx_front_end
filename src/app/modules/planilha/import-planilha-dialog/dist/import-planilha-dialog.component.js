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
exports.__esModule = true;
exports.ImportPlanilhaDialogComponent = void 0;
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var forms_1 = require("@angular/forms");
var parametro_evento01_1 = require("../../../parametros/parametro-evento01");
var util_1 = require("../../../shared/classes/util");
var http_1 = require("@angular/common/http");
var parametro_check01_1 = require("../../../parametros/parametro-check01");
var ImportPlanilhaDialogComponent = /** @class */ (function () {
    function ImportPlanilhaDialogComponent(eventoSrv, globalService, importacaoSrv, cabPlanilhaSrv, data, dialogRef, formBuilder, router, appSnackBar) {
        var _this = this;
        this.eventoSrv = eventoSrv;
        this.globalService = globalService;
        this.importacaoSrv = importacaoSrv;
        this.cabPlanilhaSrv = cabPlanilhaSrv;
        this.data = data;
        this.dialogRef = dialogRef;
        this.formBuilder = formBuilder;
        this.router = router;
        this.appSnackBar = appSnackBar;
        this.acao = 'Sem Definição';
        this.labelCadastro = '';
        this.selectedFile = null;
        this.lsEventos = [];
        this.progress = 0;
        this.linhas_processadas = 0;
        this.total_linhas = 0;
        this.total_linhas_erro = 0;
        this.status = 0;
        /*
          1- Não iniciado
          2- upload
          3- Aguardndo processamnento
          4- fim
            */
        this.showSpin = false;
        this.tentativaAtual = 0;
        this.globalService.showSpin$.subscribe(function (show) {
            _this.showSpin = show;
        });
        this.formulario = formBuilder.group({
            id_evento: [{ value: '' }, [forms_1.Validators.required]],
            caminho: [{ value: '' }, [forms_1.Validators.required]]
        });
        this.setNoParam();
    }
    ImportPlanilhaDialogComponent.prototype.ngOnInit = function () {
        this.getEventos();
    };
    ImportPlanilhaDialogComponent.prototype.ngOnDestroy = function () {
        var _a, _b, _c;
        (_a = this.inscricaoEventos) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        (_b = this.inscricaoAcao) === null || _b === void 0 ? void 0 : _b.unsubscribe();
        (_c = this.inscricaoStatus) === null || _c === void 0 ? void 0 : _c.unsubscribe();
    };
    ImportPlanilhaDialogComponent.prototype.getEventos = function () {
        var _this = this;
        var par = new parametro_evento01_1.ParametroEvento01();
        par.id_empresa = this.globalService.getEmpresa().id;
        par.status = '1';
        ((par.contador = 'N'), (par.tamPagina = 0));
        this.inscricaoEventos = this.eventoSrv
            .getEventosParametro_01(par)
            .subscribe({
            next: function (data) {
                _this.lsEventos = data;
            },
            error: function (error) {
                if (error.status && error.status == 401) {
                    _this.appSnackBar.openFailureSnackBar('Ação Não Autorizada', 'OK');
                    return;
                }
                if (error.status && error.status == 409) {
                    _this.lsEventos = [];
                }
                else {
                    _this.lsEventos = [];
                    _this.appSnackBar.openFailureSnackBar("Pesquisa Nos Participantes " + util_1.messageError(error), 'OK');
                }
            }
        });
    };
    ImportPlanilhaDialogComponent.prototype.setValue = function (path) {
        if (path === void 0) { path = ''; }
        this.formulario.setValue({
            id_evento: this.lsEventos[0].id,
            caminho: path
        });
    };
    ImportPlanilhaDialogComponent.prototype.setNoParam = function () {
        this.formulario.setValue({
            id_evento: '',
            caminho: ''
        });
    };
    ImportPlanilhaDialogComponent.prototype.onUpload = function () {
        if (this.formulario.valid) {
            this.upload();
        }
        else {
            this.formulario.markAllAsTouched();
            this.appSnackBar.openSuccessSnackBar("Formul\u00E1rio Com Campos Inv\u00E1lidos.", 'OK');
        }
    };
    ImportPlanilhaDialogComponent.prototype.closeModal = function () {
        if (this.status == 1 || this.status == 2) {
            this.appSnackBar.openWarningnackBar('Processamento Em Andamento, Aguarde Terminar Para Fechar!', 'OK');
            return;
        }
        this.dialogRef.close(this.data);
    };
    ImportPlanilhaDialogComponent.prototype.onFileSelected = function (event) {
        var _a;
        this.selectedFile = event.target.files[0];
        this.formulario.patchValue({ caminho: (_a = this.selectedFile) === null || _a === void 0 ? void 0 : _a.name });
    };
    ImportPlanilhaDialogComponent.prototype.onExecucao = function () {
        this.onUpload();
    };
    ImportPlanilhaDialogComponent.prototype.onCancelar = function () {
        if (this.status == 1 || this.status == 2) {
            this.appSnackBar.openWarningnackBar('Processamento Em Andamento, Aguarde Terminar Para Cancelar!', 'OK');
            return;
        }
        this.data.processar = false;
        this.dialogRef.close(this.data);
    };
    ImportPlanilhaDialogComponent.prototype.upload = function () {
        var _this = this;
        if (!this.selectedFile)
            return;
        this.status = 1;
        var key = 0;
        var id_evento = 0;
        key = parseInt(this.formulario.value.id_evento);
        if (isNaN(key)) {
            this.appSnackBar.openFailureSnackBar('Código Do Evento Inválido!', 'OK');
            return;
        }
        else {
            id_evento = key;
        }
        this.importacaoSrv.uploadPlanilha(id_evento, this.selectedFile).subscribe({
            next: function (event) {
                var _a;
                if (event.type === http_1.HttpEventType.UploadProgress) {
                    _this.progress = Math.round((100 * event.loaded) / event.total);
                }
                else if (event.type === http_1.HttpEventType.Response) {
                    _this.progress = 0;
                    _this.appSnackBar.openSuccessSnackBar('Planilha Importada com Sucesso!', 'OK');
                    if ((_a = _this.selectedFile) === null || _a === void 0 ? void 0 : _a.name) {
                        _this.status = 2;
                        _this.checkPlanilha(id_evento, _this.selectedFile.name);
                    }
                }
            },
            error: function (error) {
                var _a, _b, _c, _d, _e, _f;
                _this.status = 3;
                _this.appSnackBar.openFailureSnackBar("Erro No UpLoad " + ((_b = (_a = error.error) === null || _a === void 0 ? void 0 : _a.tabela) !== null && _b !== void 0 ? _b : '') + " - " + ((_d = (_c = error.error) === null || _c === void 0 ? void 0 : _c.erro) !== null && _d !== void 0 ? _d : '') + " - " + ((_f = (_e = error.error) === null || _e === void 0 ? void 0 : _e.message) !== null && _f !== void 0 ? _f : ''), 'OK');
                _this.progress = 0;
                _this.selectedFile = null;
                _this.formulario.patchValue({ caminho: '' });
            }
        });
    };
    /* rotina antiga
    verificaStatus(id_empresa: number, id_evento: number, fileName: string) {
      this.inscricaoStatus = this.cabPlanilhaSrv
        .verificarStatus(id_empresa, id_evento, fileName)
        .subscribe({
          next: (ret) => {
  
            this.tentativaAtual = ret.tentativa;
            if (ret.lista.length > 0) {
              this.total_linhas = ret.lista[0].total_linhas;
              this.total_linhas_erro = ret.lista[0].total_linhas_erro;
              this.selectedFile = null;
              this.formulario.patchValue({ caminho: '' });
              this.inscricaoStatus.unsubscribe();
              this.status = 3;
              this.data.processar = true;
            }
          },
  
          error: (err) => {
            if (this.inscricaoStatus) {
              this.inscricaoStatus.unsubscribe();
            }
            this.status = 3;
          },
  
          complete: () => {
            this.appSnackBar.openFailureSnackBar(
              'Processando Terminou Com Falha!',
              'OK',
            );
            this.status = 3;
          },
        });
    }
        */
    ImportPlanilhaDialogComponent.prototype.checkPlanilha = function (id_evento, fileName) {
        var _this = this;
        console.log("checkFile: ", fileName);
        var par = new parametro_check01_1.ParametroCheckFile01();
        par.id_evento = id_evento;
        par.fileName = fileName;
        var tentativa = 0;
        par.maxTentativas = 40;
        var interval = setInterval(function () {
            tentativa++;
            par.tentativa = tentativa;
            _this.tentativaAtual = tentativa;
            _this.tentativaAtual = par.tentativa;
            try {
                _this.inscricaoStatus = _this.importacaoSrv
                    .checkFile(par)
                    .subscribe({
                    next: function (ret) {
                        if (ret.status === 'ready') {
                            _this.status = 2;
                            clearInterval(interval);
                            _this.total_linhas = ret.total_linhas;
                            _this.total_linhas_erro = ret.total_linhas_erro;
                            _this.selectedFile = null;
                            _this.formulario.patchValue({ caminho: '' });
                            _this.inscricaoStatus.unsubscribe();
                            _this.status = 3;
                            _this.data.processar = true;
                        }
                        if (ret.status === 'failed') {
                            _this.showSpin = false;
                            _this.status = 2;
                            clearInterval(interval);
                            _this.appSnackBar.openFailureSnackBar("Falha ao gerar o arquivo!", "OK");
                        }
                        if (ret.status === 'exceeded') {
                            _this.showSpin = false;
                            _this.status = 2;
                            clearInterval(interval);
                            _this.appSnackBar.openFailureSnackBar("Excedido O Nro De Tentativas. Peças Novamente!", "OK");
                        }
                    },
                    error: function (error) {
                        _this.showSpin = false;
                        _this.status = 2;
                        _this.appSnackBar.openFailureSnackBar("Erro:" + error.message, "OK");
                        clearInterval(interval);
                    }
                });
            }
            catch (error) {
                _this.showSpin = false;
                _this.status = 2;
                _this.appSnackBar.openFailureSnackBar("Erro Na Validação Do Arquivo!", "OK");
                clearInterval(interval);
            }
            if (tentativa >= par.maxTentativas) {
                _this.showSpin = false;
                _this.status = 2;
                clearInterval(interval);
                _this.appSnackBar.openFailureSnackBar("Excedido O Nro De Tentativas. Peças Novamente!", "OK");
            }
        }, 5000);
    };
    ImportPlanilhaDialogComponent.prototype.NoValidtouchedOrDirty = function (campo) {
        var _a, _b, _c;
        if (!((_a = this.formulario.get(campo)) === null || _a === void 0 ? void 0 : _a.valid) &&
            (((_b = this.formulario.get(campo)) === null || _b === void 0 ? void 0 : _b.touched) || ((_c = this.formulario.get(campo)) === null || _c === void 0 ? void 0 : _c.dirty))) {
            return true;
        }
        return false;
    };
    ImportPlanilhaDialogComponent.prototype.getMensafield = function (field) {
        var _a, _b;
        return (_b = (_a = this.formulario.get(field)) === null || _a === void 0 ? void 0 : _a.errors) === null || _b === void 0 ? void 0 : _b['message'];
    };
    ImportPlanilhaDialogComponent.prototype.getMessageProgress = function () {
        if (this.status == 1) {
            if (this.progress < 100) {
                return "Enviando... " + this.progress + "%";
            }
            else {
                return "Preparando Tabela Para Processamento...Aguarde!";
            }
        }
        else {
            return "UPLOAD Completo, Aguardando Processamento...(" + (this.tentativaAtual + 1) + "/40) ";
        }
    };
    ImportPlanilhaDialogComponent.prototype.getMessageStatus = function () {
        if (this.status == 1) {
            return 'Enviando Planilha';
        }
        else if (this.status == 2) {
            return 'Aguardando Processamento';
        }
        else {
            return '';
        }
    };
    ImportPlanilhaDialogComponent.prototype.showUploadButton = function () {
        return (!(this.status == 1) && !(this.status == 2));
    };
    ImportPlanilhaDialogComponent = __decorate([
        core_1.Component({
            selector: 'app-import-planilha-dialog',
            templateUrl: './import-planilha-dialog.component.html',
            styleUrl: './import-planilha-dialog.component.css'
        }),
        __param(4, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], ImportPlanilhaDialogComponent);
    return ImportPlanilhaDialogComponent;
}());
exports.ImportPlanilhaDialogComponent = ImportPlanilhaDialogComponent;
