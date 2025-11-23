import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudGrupousuarioComponent } from './crud-grupousuario/crud-grupousuario.component';


const routes: Routes = [
  { path: '', redirectTo: 'grupos', pathMatch: 'full' },
  { path: 'grupos', component: CrudGrupousuarioComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GrupousuarioRoutingModule { }
