import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { UsuarioRoutingModule } from './usuario-routing.module';
import { CrudUsuarioComponent } from './crud-usuario/crud-usuario.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material/material.module';
import { UsuarioDialogComponent } from './usuario-dialog/usuario-dialog.component';


@NgModule({
  declarations: [
    CrudUsuarioComponent,
    UsuarioDialogComponent,
  ],
  imports: [
    CommonModule,
    UsuarioRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxMaskDirective,
    NgxMaskPipe,

  ]
})
export class UsuarioModule { }
