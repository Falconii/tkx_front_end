import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudUsuarioEventoComponent } from './crud-usuario-evento/crud-usuario-evento.component';
import { EventoResolver } from '../../resolver/Evento.resolver';


const routes: Routes = [
  { path: '', redirectTo: 'usuarios_eventos', pathMatch: 'full' },
  { path: 'usuarios_eventos', component: CrudUsuarioEventoComponent,resolve: {
        eventoAtivo: EventoResolver
      } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioEventoRoutingModule { }
