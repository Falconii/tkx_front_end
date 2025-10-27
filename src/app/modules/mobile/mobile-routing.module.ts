import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MobileKitComponent } from './mobile-kit/mobile-kit.component';

const routes: Routes = [
  { path: '', redirectTo: 'mobile', pathMatch: 'full' },
  { path: 'mobile', component: MobileKitComponent },];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MobileRoutingModule { }
