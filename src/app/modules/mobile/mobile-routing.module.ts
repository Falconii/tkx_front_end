import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MobileKitComponent } from './mobile-kit/mobile-kit.component';
import { InscritoComponent } from './inscrito/inscrito.component';

const routes: Routes = [
  { path: '', redirectTo: 'mobile', pathMatch: 'full' },
  { path: 'mobile', component: MobileKitComponent },
  { path: 'novoinscrito', component: InscritoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MobileRoutingModule {}
