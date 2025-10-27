import { MobileModule } from './modules/mobile/mobile.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MobileKitComponent } from './modules/mobile/mobile-kit/mobile-kit.component';
import { HomeComponent } from './modules/home/home/home.component';

const routes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'mobile',
    loadChildren: () =>
      import('./modules/mobile/mobile.module').then((m) => m.MobileModule),
  },
  {
    path: '**',
    redirectTo: 'home',
  },];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
