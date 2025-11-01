import { MobileModule } from './modules/mobile/mobile.module';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MaterialModule } from '../material/material.module';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GlobalService } from './services/global.service';
import { DadosService } from './services/dados.service';
import { HttpClientModule } from '@angular/common/http';
import { httpInterceptorProviders } from './interceptor';





registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    MobileModule,
    HttpClientModule


  ],
  providers: [
    GlobalService,
    DadosService,
    provideAnimationsAsync(),
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: LOCALE_ID, useValue: 'pt' },
     httpInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
