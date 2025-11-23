import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudEmpresaComponent } from './crud-empresa/crud-empresa.component';


const routes: Routes = [
  { path: '', redirectTo: 'usuarios', pathMatch: 'full' },
  { path: 'usuarios', component: CrudEmpresaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpresaRoutingModule { }
