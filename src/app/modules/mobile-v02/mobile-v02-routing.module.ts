import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tela01Component } from './tela01/tela01.component';

const routes: Routes = [
  { path: '', redirectTo: 'tela01', pathMatch: 'full' },
  { path: 'tela01', component: Tela01Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MobileV02RoutingModule {}
