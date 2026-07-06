import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MobileKitComponent } from './mobile-kit/mobile-kit.component';
import { InscritoComponent } from './inscrito/inscrito.component';
import { EventoResolver } from '../../resolver/Evento.resolver';

const routes: Routes = [
  { path: '', redirectTo: 'mobile', pathMatch: 'full' },
  {
    path: 'mobile', component: MobileKitComponent, resolve: {
      eventoAtivo: EventoResolver
    } },
  { path: 'novoinscrito', component: InscritoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [
    EventoResolver
  ]
})
export class MobileRoutingModule {}
