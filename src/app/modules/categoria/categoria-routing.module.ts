import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudCategoriaComponent } from './crud-categoria/crud-categoria.component';

const routes: Routes = [
  { path: '', redirectTo: 'categorias', pathMatch: 'full' },
  { path: 'categorias', component: CrudCategoriaComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriaRoutingModule {}
