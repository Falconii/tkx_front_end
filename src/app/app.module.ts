import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MaterialModule } from '../material/material.module';
import { DecimalPipe, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GlobalService } from './services/global.service';
import { HttpClientModule } from '@angular/common/http';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { httpInterceptorProviders } from './interceptor';
import { SimNaoPipe } from './shared/pipes/sim-nao.pipe';
import { SharedModule } from './shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FirstNamePipe } from './shared/pipes/first-name.pipe';
import { HomeComponent } from './home/home.component';

registerLocaleData(localePt);

@NgModule({
  declarations: [AppComponent, HomeComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    SharedModule,
  ],
  providers: [
    GlobalService,
    provideAnimationsAsync(),
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: LOCALE_ID, useValue: 'pt' },
    httpInterceptorProviders,
    provideNgxMask({
      dropSpecialCharacters: true,
      validation: true,
      thousandSeparator: '.',
      decimalMarker: ',',
    }),
    SimNaoPipe,
    FirstNamePipe,
    DecimalPipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
