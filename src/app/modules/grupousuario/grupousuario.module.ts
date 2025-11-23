import { MaterialModule } from './../../../material/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrupousuarioRoutingModule } from './grupousuario-routing.module';
import { CrudGrupousuarioComponent } from './crud-grupousuario/crud-grupousuario.component';
import { GrupousuarioDialogComponent } from './crud-grupousuario/grupousuario-dialog/grupousuario-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    CrudGrupousuarioComponent,
    GrupousuarioDialogComponent
  ],
  imports: [
    CommonModule,
    GrupousuarioRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxMaskDirective,
    NgxMaskPipe,
    SharedModule
  ]
})
export class GrupousuarioModule { }
