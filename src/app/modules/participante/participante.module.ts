import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParticipanteRoutingModule } from './participante-routing.module';
import { CrudParticipanteComponent } from './crud-participante/crud-participante.component';


@NgModule({
  declarations: [
    CrudParticipanteComponent
  ],
  imports: [
    CommonModule,
    ParticipanteRoutingModule
  ]
})
export class ParticipanteModule { }
