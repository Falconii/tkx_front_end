import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanilhaRoutingModule } from './planilha-routing.module';
import { CrudPlanilhaComponent } from './crud-planilha/crud-planilha.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MaterialModule } from '../../../material/material.module';
import { SharedModule } from '../../shared/shared.module';
import { ImportPlanilhaDialogComponent } from './import-planilha-dialog/import-planilha-dialog.component';
import { ProcessaPlanilhaDialogComponent } from './processa-planilha-dialog/processa-planilha-dialog.component';

@NgModule({
  declarations: [CrudPlanilhaComponent, ImportPlanilhaDialogComponent, ProcessaPlanilhaDialogComponent],
  imports: [
    CommonModule,
    PlanilhaRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
})
export class PlanilhaModule {}
