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
    path: 'login',
    loadChildren: () =>
      import('./modules/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'empresas',
    loadChildren: () =>
      import('./modules/empresa/empresa.module').then((m) => m.EmpresaModule),
  },
  {
    path: 'usuarios',
    loadChildren: () =>
      import('./modules/usuario/usuario.module').then((m) => m.UsuarioModule),
  },
  {
    path: 'grupos',
    loadChildren: () =>
      import('./modules/grupousuario/grupousuario.module').then(
        (m) => m.GrupousuarioModule
      ),
  },
  {
    path: 'eventos',
    loadChildren: () =>
      import('./modules/evento/evento.module').then((m) => m.EventoModule),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
