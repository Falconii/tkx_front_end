import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuarioEventoRoutingModule } from './usuario-evento-routing.module';
import { CrudUsuarioEventoComponent } from './crud-usuario-evento/crud-usuario-evento.component';
import { MaterialModule } from '../../../material/material.module';
import { SharedModule } from '../../shared/shared.module';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { EditUsuarioEventoComponent } from './edit-usuario-evento/edit-usuario-evento.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    CrudUsuarioEventoComponent,
    EditUsuarioEventoComponent
  ],
  imports: [
    CommonModule,
    UsuarioEventoRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ]
})
export class UsuarioEventoModule { }
