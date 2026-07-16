import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material/material.module';
import { SharedModule } from '../../shared/shared.module';
import { LoginDesktopComponent } from './login-desktop/login-desktop.component';
import { LoginMobileComponent } from './login-mobile/login-mobile.component';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { A11yModule } from '@angular/cdk/a11y';


@NgModule({
  declarations: [
    LoginComponent,
    LoginDesktopComponent,
    LoginMobileComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxMaskDirective,
    NgxMaskPipe,
    A11yModule,
  ]
})
export class LoginModule { }
