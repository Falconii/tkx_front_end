import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { MaterialModule } from '../../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CnpjCpfPipe } from './pipes/cnpj-cpf.pipe';
import { filter } from 'rxjs';
import { FiltroEntregaKitComponent } from './components/filtro-entrega-kit/filtro-entrega-kit.component';
import { BarraAcoesComponent } from './components/barra-acoes/barra-acoes.component';


@NgModule({
  declarations: [CnpjCpfPipe,FiltroEntregaKitComponent,BarraAcoesComponent],
  imports: [
    CommonModule,
    SharedRoutingModule,
    MaterialModule, FormsModule,
    ReactiveFormsModule,
  ],
  exports: [CnpjCpfPipe,FiltroEntregaKitComponent,BarraAcoesComponent]
})
export class SharedModule { }
