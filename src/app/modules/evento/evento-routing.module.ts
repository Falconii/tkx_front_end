import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudEventoComponent } from './crud-evento/crud-evento.component';

const routes: Routes = [
  { path: '', redirectTo: 'eventos', pathMatch: 'full' },
  { path: 'eventos', component: CrudEventoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventoRoutingModule {}
