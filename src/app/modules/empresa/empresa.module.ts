import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmpresaRoutingModule } from './empresa-routing.module';
import { CrudEmpresaComponent } from './crud-empresa/crud-empresa.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { EmpresaDialogComponent } from './crud-empresa/empresa-dialog/empresa-dialog.component';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MaterialModule } from '../../../material/material.module';

@NgModule({
  declarations: [CrudEmpresaComponent, EmpresaDialogComponent],
  imports: [
    CommonModule,
    EmpresaRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
})
export class EmpresaModule {}
