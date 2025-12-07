import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MobileV02RoutingModule } from './mobile-v02-routing.module';
import { Tela01Component } from './tela01/tela01.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material/material.module';

@NgModule({
  declarations: [Tela01Component],
  imports: [
    CommonModule,
    MobileV02RoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class MobileV02Module {}
