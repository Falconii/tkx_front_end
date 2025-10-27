import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MobileRoutingModule } from './mobile-routing.module';
import { MobileKitComponent } from './mobile-kit/mobile-kit.component';
import { MaterialModule } from '../../../material/material.module';
import { SharedModule } from '../../shared/shared.module';
import { EntregaDialogComponent } from './entrega-dialog/entrega-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MobileKitComponent,
    EntregaDialogComponent
  ],
  imports: [
    CommonModule,
    MobileRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    MobileKitComponent
  ],
})
export class MobileModule { }
