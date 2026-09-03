"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SharedModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var shared_routing_module_1 = require("./shared-routing.module");
var material_module_1 = require("../../material/material.module");
var forms_1 = require("@angular/forms");
var cnpj_cpf_pipe_1 = require("./pipes/cnpj-cpf.pipe");
var filtro_entrega_kit_component_1 = require("./components/filtro-entrega-kit/filtro-entrega-kit.component");
var barra_acoes_component_1 = require("./components/barra-acoes/barra-acoes.component");
var sim_nao_pipe_1 = require("./pipes/sim-nao.pipe");
var first_name_pipe_1 = require("./pipes/first-name.pipe");
var truncate_pipe_pipe_1 = require("./pipes/truncate-pipe.pipe");
var zero_full_pipe_1 = require("./pipes/zero-full.pipe");
var download_dialog_component_1 = require("./components/download-dialog/download-dialog.component");
var email_dialog_component_1 = require("./components/email-dialog/email-dialog.component");
var formulario_filtro_empresa_component_1 = require("./components/formulario-filtro-empresa/formulario-filtro-empresa.component");
var formulario_filtro_grupousuario_component_1 = require("./components/formulario-filtro-grupousuario/formulario-filtro-grupousuario.component");
var shared_navegator_component_1 = require("./components/shared-navegator/shared-navegator.component");
var formulario_filtro_usuario_component_1 = require("./components/formulario-filtro-usuario/formulario-filtro-usuario.component");
var formulario_filtro_evento_component_1 = require("./components/formulario-filtro-evento/formulario-filtro-evento.component");
var formulario_filtro_inscrito_component_1 = require("./components/formulario-filtro-inscrito/formulario-filtro-inscrito.component");
var formulario_filtro_cabplanilha_component_1 = require("./components/formulario-filtro-cabplanilha/formulario-filtro-cabplanilha.component");
var confirm_dialog_component_1 = require("./components/confirm-dialog/confirm-dialog.component");
var crud_display_component_1 = require("./components/crud-display/crud-display.component");
var situacao_evento_pipe_1 = require("./pipes/situacao-evento.pipe");
var formulario_filtro_participantev2_component_1 = require("./components/formulario-filtro-participantev2/formulario-filtro-participantev2.component");
var spins_component_1 = require("./spins/spins.component");
var situacao_planilha_pipe_1 = require("./pipes/situacao-planilha.pipe");
var ativo_inativo_pipe_1 = require("./pipes/ativo-inativo.pipe");
var dashboard_component_1 = require("./components/dashboard/dashboard.component");
var formulario_filtro_detplanilha_component_1 = require("./components/formulario-filtro-detplanilha/formulario-filtro-detplanilha.component");
var situacao_det_planilha_pipe_1 = require("./pipes/situacao-det-planilha.pipe");
var sexo_pipe_1 = require("./pipes/sexo.pipe");
var formulario_filtro_usuario_evento_component_1 = require("./components/formulario-filtro-usuario-evento/formulario-filtro-usuario-evento.component");
var dashboard_operacional_component_1 = require("./components/dashboard-operacional/dashboard-operacional.component");
var SharedModule = /** @class */ (function () {
    function SharedModule() {
    }
    SharedModule = __decorate([
        core_1.NgModule({
            declarations: [
                filtro_entrega_kit_component_1.FiltroEntregaKitComponent,
                cnpj_cpf_pipe_1.CnpjCpfPipe,
                barra_acoes_component_1.BarraAcoesComponent,
                shared_navegator_component_1.SharedNavegatorComponent,
                email_dialog_component_1.EmailDialogComponent,
                download_dialog_component_1.DownloadDialogComponent,
                sim_nao_pipe_1.SimNaoPipe,
                zero_full_pipe_1.ZeroFillPipe,
                truncate_pipe_pipe_1.TruncatePipe,
                first_name_pipe_1.FirstNamePipe,
                situacao_evento_pipe_1.SituacaoEventoPipe,
                situacao_planilha_pipe_1.SituacaoPlanilhaPipe,
                ativo_inativo_pipe_1.SituacaoUsuarioPipe,
                situacao_det_planilha_pipe_1.SituacaoDetPlanilhaPipe,
                sexo_pipe_1.SexoPipe,
                formulario_filtro_empresa_component_1.FormularioFiltroEmpresaComponent,
                formulario_filtro_grupousuario_component_1.FormularioFiltroGrupousuarioComponent,
                formulario_filtro_usuario_component_1.FormularioFiltroUsuarioComponent,
                formulario_filtro_evento_component_1.FormularioFiltroEventoComponent,
                formulario_filtro_inscrito_component_1.FormularioFiltroInscritoComponent,
                formulario_filtro_cabplanilha_component_1.FormularioFiltroCabplanilhaComponent,
                formulario_filtro_detplanilha_component_1.FormularioFiltroDetplanilhaComponent,
                formulario_filtro_usuario_evento_component_1.FormularioFiltroUsuarioEventoComponent,
                confirm_dialog_component_1.ConfirmDialogComponent,
                crud_display_component_1.CrudDisplayComponent,
                formulario_filtro_participantev2_component_1.FormularioFiltroParticipantev2Component,
                spins_component_1.SpinsComponent,
                dashboard_component_1.DashboardComponent,
                dashboard_operacional_component_1.DashboardOperacionalComponent,
            ],
            imports: [
                common_1.CommonModule,
                shared_routing_module_1.SharedRoutingModule,
                material_module_1.MaterialModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
            ],
            exports: [
                filtro_entrega_kit_component_1.FiltroEntregaKitComponent,
                barra_acoes_component_1.BarraAcoesComponent,
                cnpj_cpf_pipe_1.CnpjCpfPipe,
                sim_nao_pipe_1.SimNaoPipe,
                zero_full_pipe_1.ZeroFillPipe,
                truncate_pipe_pipe_1.TruncatePipe,
                first_name_pipe_1.FirstNamePipe,
                situacao_evento_pipe_1.SituacaoEventoPipe,
                situacao_planilha_pipe_1.SituacaoPlanilhaPipe,
                ativo_inativo_pipe_1.SituacaoUsuarioPipe,
                situacao_det_planilha_pipe_1.SituacaoDetPlanilhaPipe,
                sexo_pipe_1.SexoPipe,
                shared_navegator_component_1.SharedNavegatorComponent,
                formulario_filtro_empresa_component_1.FormularioFiltroEmpresaComponent,
                formulario_filtro_grupousuario_component_1.FormularioFiltroGrupousuarioComponent,
                formulario_filtro_usuario_component_1.FormularioFiltroUsuarioComponent,
                formulario_filtro_evento_component_1.FormularioFiltroEventoComponent,
                formulario_filtro_cabplanilha_component_1.FormularioFiltroCabplanilhaComponent,
                formulario_filtro_participantev2_component_1.FormularioFiltroParticipantev2Component,
                formulario_filtro_detplanilha_component_1.FormularioFiltroDetplanilhaComponent,
                formulario_filtro_usuario_evento_component_1.FormularioFiltroUsuarioEventoComponent,
                confirm_dialog_component_1.ConfirmDialogComponent,
                crud_display_component_1.CrudDisplayComponent,
                spins_component_1.SpinsComponent,
                dashboard_component_1.DashboardComponent,
                dashboard_operacional_component_1.DashboardOperacionalComponent
            ]
        })
    ], SharedModule);
    return SharedModule;
}());
exports.SharedModule = SharedModule;
