import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../../../material/material.module';
import { SharedModule } from '../../shared/shared.module';
import { CategoriaRoutingModule } from './categoria-routing.module';
import { CrudCategoriaComponent } from './crud-categoria/crud-categoria.component';
import { CategoriaDialogComponent } from './categoria-dialog/categoria-dialog.component';

@NgModule({
  declarations: [CrudCategoriaComponent, CategoriaDialogComponent],
  imports: [
    CommonModule,
    CategoriaRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class CategoriaModule {}
