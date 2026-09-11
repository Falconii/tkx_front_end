import { GlobalService } from './../../../services/global.service';
import { FirstNamePipe } from './../../../shared/pipes/first-name.pipe';
import { Component, EventEmitter, PipeTransform } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ActivatedRoute, Router } from '@angular/router';
import { ResumoOperadorModel } from '../../../models/resumo-operador-model';
import { ResumoCategoriaModel } from '../../../models/resumo-categoria-model';
import { Subscription } from 'rxjs';
import { AppSnackbar } from '../../../shared/classes/app-snackbar';
import { ControlePaginas } from '../../../shared/classes/controle-paginas';
import { TipoOperacao } from '../../../shared/classes/tipo-operacao';
import { EventoComplementarService } from '../../../services/eventoComplementar.service';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventoModel } from '../../../models/evento-model';
import { ParametroEvento01 } from '../../../parametros/parametro-evento01';
import { EventoService } from '../../../services/evento.service';

declare var google: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})

export class HomeComponent {


  changeData = new EventEmitter<boolean>();

  formulario: FormGroup;

  inscricaoEvento!: Subscription;
  isMobile: boolean = false;

  chartsLoaded:boolean = false;

  lsEventos: EventoModel[] = [];

  eventoPrincipal:EventoModel = new EventoModel();

  isLogado:boolean = false;


  constructor(
    private globalService: GlobalService,
    private eventoComplementarSrv:EventoComplementarService,
    private eventoSrv:EventoService,
    private breakpoint: BreakpointObserver,
    private router: Router,
    private decimalPipe: DecimalPipe,
    private firstNamePipe:FirstNamePipe,
    private route: ActivatedRoute,
    private appSnackBar: AppSnackbar,
    private formBuilder: FormBuilder
  ) {
    console.log("estou iniciando o home");
    this.formulario = formBuilder.group({
      id_evento: [{ value: '' }],
    });
  }

  ngOnInit() {
  console.log("estou no init do home",this.globalService.getUsuario());
  this.globalService.logado$.subscribe(show => {
    this.isLogado = show;
    console.log("Logado!", show, this.globalService.getUsuario());

   /*  if (show) {
      this.getEventos();
    } */
  });
}


  ngOnDestroy() {
    this.inscricaoEvento?.unsubscribe();
  }


  onHome(){

  }


  getEventos() {

    let par = new ParametroEvento01();

    par.id_empresa = this.globalService.getEmpresa().id;

    par.status = '3';

    par.pagina = 1;

    this.inscricaoEvento = this.eventoSrv
      .getEventosParametro_01(par)
      .subscribe({
        next: (data: any) => {
          this.lsEventos = data;
          this.eventoPrincipal = this.lsEventos[0];
          this.setValue();
          this.globalService.setChangeData(this.eventoPrincipal);
        },
        error: (error: any) => {
          this.lsEventos = [];
        },
      });
  }


  onChangeParametros(){
  this.eventoPrincipal = this.lsEventos.find(x => x.id == this.formulario.value.id_evento) as EventoModel;
  this.setValue();
  this.globalService.setChangeData(this.eventoPrincipal);
}


setValue() {
  this.formulario.setValue({
    id_evento: this.eventoPrincipal.id}
  );
}

  atualizar(){
    this.getEventos()
  };



  getUsuario():string{
    return this.globalService.getUsuario().razao;
  }
}
