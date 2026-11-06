import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../../../material/material.module';
import { SharedModule } from '../../shared/shared.module';
import { TarefaRoutingModule } from './tarefa-routing.module';
import { CrudTarefaComponent } from './crud-tarefa/crud-tarefa.component';

@NgModule({
  declarations: [CrudTarefaComponent],
  imports: [
    CommonModule,
    TarefaRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class TarefaModule {}
