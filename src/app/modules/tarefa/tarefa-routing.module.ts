import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudTarefaComponent } from './crud-tarefa/crud-tarefa.component';

const routes: Routes = [
  { path: '', redirectTo: 'tarefas', pathMatch: 'full' },
  { path: 'tarefas', component: CrudTarefaComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TarefaRoutingModule {}
