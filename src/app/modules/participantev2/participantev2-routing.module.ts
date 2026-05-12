import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudParticipantev2Component } from './crud-participantev2/crud-participantev2.component';

const routes: Routes = [
  { path: '', redirectTo: 'participantesv2', pathMatch: 'full' },
  { path: 'participantesv2', component: CrudParticipantev2Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Participantev2RoutingModule {}
