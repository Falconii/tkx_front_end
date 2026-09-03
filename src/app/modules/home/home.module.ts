import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { A11yModule } from '@angular/cdk/a11y';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { GlobalService } from '../../services/global.service';
import { LocalStorageService } from '../../services/localStorage.service';
import { FirstNamePipe } from '../../shared/pipes/first-name.pipe';
import { SimNaoPipe } from '../../shared/pipes/sim-nao.pipe';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    A11yModule,
  ],
  exports: [
    HomeComponent],
  providers: [
    DatePipe,
    DecimalPipe,
    SimNaoPipe,
    FirstNamePipe,
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: LOCALE_ID, useValue: 'pt' },
    GlobalService,
    LocalStorageService,
  ],
})
export class HomeModule { }
