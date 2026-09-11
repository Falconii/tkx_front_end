"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var app_routing_module_1 = require("./app-routing.module");
var app_component_1 = require("./app.component");
var async_1 = require("@angular/platform-browser/animations/async");
var material_module_1 = require("../material/material.module");
var common_1 = require("@angular/common");
var pt_1 = require("@angular/common/locales/pt");
var core_2 = require("@angular/material/core");
var global_service_1 = require("./services/global.service");
var http_1 = require("@angular/common/http");
var ngx_mask_1 = require("ngx-mask");
var interceptor_1 = require("./interceptor");
var sim_nao_pipe_1 = require("./shared/pipes/sim-nao.pipe");
var shared_module_1 = require("./shared/shared.module");
var forms_1 = require("@angular/forms");
var first_name_pipe_1 = require("./shared/pipes/first-name.pipe");
var home_component_1 = require("./home/home.component");
common_1.registerLocaleData(pt_1["default"]);
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [app_component_1.AppComponent, home_component_1.HomeComponent],
            imports: [
                platform_browser_1.BrowserModule,
                app_routing_module_1.AppRoutingModule,
                material_module_1.MaterialModule,
                http_1.HttpClientModule,
                forms_1.ReactiveFormsModule,
                forms_1.FormsModule,
                ngx_mask_1.NgxMaskDirective,
                ngx_mask_1.NgxMaskPipe,
                shared_module_1.SharedModule,
            ],
            providers: [
                global_service_1.GlobalService,
                async_1.provideAnimationsAsync(),
                { provide: core_2.MAT_DATE_LOCALE, useValue: 'pt-BR' },
                { provide: core_1.LOCALE_ID, useValue: 'pt' },
                interceptor_1.httpInterceptorProviders,
                ngx_mask_1.provideNgxMask({
                    dropSpecialCharacters: true,
                    validation: true,
                    thousandSeparator: '.',
                    decimalMarker: ','
                }),
                sim_nao_pipe_1.SimNaoPipe,
                first_name_pipe_1.FirstNamePipe,
                common_1.DecimalPipe,
            ],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
