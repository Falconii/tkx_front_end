import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Participantev2RoutingModule } from './participantev2-routing.module';
import { CrudParticipantev2Component } from './crud-participantev2/crud-participantev2.component';
import { MaterialModule } from '../../../material/material.module';
import { SharedModule } from '../../shared/shared.module';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Participantev2DialogComponent } from './participantev2-dialog/participantev2-dialog.component';
import { A11yModule } from '@angular/cdk/a11y';

@NgModule({
  declarations: [CrudParticipantev2Component, Participantev2DialogComponent],
  imports: [
    CommonModule,
    Participantev2RoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxMaskDirective,
    NgxMaskPipe,
    A11yModule,
  ],
})
export class Participantev2Module {}
