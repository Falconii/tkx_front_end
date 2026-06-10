import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventoRoutingModule } from './evento-routing.module';
import { EventoDialogComponent } from './evento-dialog/evento-dialog.component';
import { CrudEventoComponent } from './crud-evento/crud-evento.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { MaterialModule } from '../../../material/material.module';
import { SharedModule } from '../../shared/shared.module';
import { LiberaEventoComponent } from './libera-evento/libera-evento.component';
import { A11yModule } from "@angular/cdk/a11y";

@NgModule({
  declarations: [EventoDialogComponent, CrudEventoComponent, LiberaEventoComponent],
  imports: [
    CommonModule,
    EventoRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxMaskDirective,
    NgxMaskPipe,
    A11yModule
],
})
export class EventoModule {}
