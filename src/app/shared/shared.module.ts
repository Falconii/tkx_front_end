import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { MaterialModule } from '../../material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CnpjCpfPipe } from './pipes/cnpj-cpf.pipe';
import { filter } from 'rxjs';
import { FiltroEntregaKitComponent } from './components/filtro-entrega-kit/filtro-entrega-kit.component';
import { BarraAcoesComponent } from './components/barra-acoes/barra-acoes.component';
import { SimNaoPipe } from './pipes/sim-nao.pipe';
import { FirstNamePipe } from './pipes/first-name.pipe';
import { TruncatePipe } from './pipes/truncate-pipe.pipe';
import { ZeroFillPipe } from './pipes/zero-full.pipe';
import { DownloadDialogComponent } from './components/download-dialog/download-dialog.component';
import { EmailDialogComponent } from './components/email-dialog/email-dialog.component';
import { FormularioFiltroEmpresaComponent } from './components/formulario-filtro-empresa/formulario-filtro-empresa.component';
import { FormularioFiltroGrupousuarioComponent } from './components/formulario-filtro-grupousuario/formulario-filtro-grupousuario.component';
import { SharedNavegatorComponent } from './components/shared-navegator/shared-navegator.component';
import { ControlePaginas } from './classes/controle-paginas';
import { FormularioFiltroUsuarioComponent } from './components/formulario-filtro-usuario/formulario-filtro-usuario.component';
import { FormularioFiltroEventoComponent } from './components/formulario-filtro-evento/formulario-filtro-evento.component';
import { FormularioFiltroInscritoComponent } from './components/formulario-filtro-inscrito/formulario-filtro-inscrito.component';

@NgModule({
  declarations: [
    FiltroEntregaKitComponent,
    CnpjCpfPipe,
    BarraAcoesComponent,
    SharedNavegatorComponent,
    EmailDialogComponent,
    DownloadDialogComponent,
    SimNaoPipe,
    ZeroFillPipe,
    TruncatePipe,
    FirstNamePipe,
    FormularioFiltroEmpresaComponent,
    FormularioFiltroGrupousuarioComponent,
    FormularioFiltroUsuarioComponent,
    FormularioFiltroEventoComponent,
    FormularioFiltroInscritoComponent,
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    FiltroEntregaKitComponent,
    BarraAcoesComponent,
    CnpjCpfPipe,
    SimNaoPipe,
    ZeroFillPipe,
    TruncatePipe,
    FirstNamePipe,
    SharedNavegatorComponent,
    FormularioFiltroEmpresaComponent,
    FormularioFiltroGrupousuarioComponent,
    FormularioFiltroUsuarioComponent,
    FormularioFiltroEventoComponent,
  ],
})
export class SharedModule {}
