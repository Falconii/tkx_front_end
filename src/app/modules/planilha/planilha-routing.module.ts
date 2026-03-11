import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudPlanilhaComponent } from './crud-planilha/crud-planilha.component';

const routes: Routes = [
  { path: '', redirectTo: 'planilhas', pathMatch: 'full' },
  { path: 'planilhas', component: CrudPlanilhaComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlanilhaRoutingModule {}
