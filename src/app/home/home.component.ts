
import { Component, EventEmitter, PipeTransform } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventoModel } from '../models/evento-model';
import { ParametroEvento01 } from '../parametros/parametro-evento01';
import { EventoService } from '../services/evento.service';
import { EventoComplementarService } from '../services/eventoComplementar.service';
import { GlobalService } from '../services/global.service';
import { AppSnackbar } from '../shared/classes/app-snackbar';
import { FirstNamePipe } from '../shared/pipes/first-name.pipe';

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

  /** true quando o usuário não tem nenhum evento liberado (ativo) para ver no dashboard */
  semEvento:boolean = false;

  isLogado:boolean = false;



  constructor(
    private globalService: GlobalService,
    private eventoComplementarSrv:EventoComplementarService,
    private eventoSrv:EventoService,
    private breakpoint: BreakpointObserver,
    private router: Router,
    private firstNamePipe:FirstNamePipe,
    private route: ActivatedRoute,
    private appSnackBar: AppSnackbar,
    private formBuilder: FormBuilder
  ) {
    console.log("estou iniciando o home");

    this.breakpoint.observe([Breakpoints.Handset]).subscribe((result) => {
      this.isMobile = result.matches;
    });

    this.formulario = formBuilder.group({
      id_evento: [{ value: '' }],
    });
  }


  get isOperador(): boolean {
  return this.globalService.getUsuario().grupo === 4;
}

get isComum(): boolean {
  return this.globalService.getUsuario().grupo !== 4;
}



  ngOnInit() {
  this.globalService.logado$.subscribe(show => {
    this.isLogado = show;
    if (show) {
      this.getEventos();
    }
  });
}


  ngOnDestroy() {
    this.inscricaoEvento?.unsubscribe();
  }


  onHome(){

  }


  getEventos() {

    // O servidor decide o que o usuário vê: operador = só os eventos ativos em que está vinculado
    // (usuarios_eventos); demais usuários = todos os eventos ativos.
    this.inscricaoEvento = this.eventoComplementarSrv
      .eventosDashboard()
      .subscribe({
        next: (data: EventoModel[]) => {
          this.lsEventos = data ?? [];
          if (this.lsEventos.length === 0) {
            this.nenhumEvento();
            return;
          }
          this.semEvento = false;
          this.eventoPrincipal = this.lsEventos[0];
          this.setValue();
          this.globalService.setChangeData(this.eventoPrincipal);
        },
        error: (error: any) => {
          this.nenhumEvento();
        },
      });
  }


  private nenhumEvento() {
    this.lsEventos = [];
    this.semEvento = true;
    this.eventoPrincipal = new EventoModel();
    this.globalService.setChangeData(this.eventoPrincipal);
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

  getUsuarioGrupo():number{
    return this.globalService.getUsuario().grupo;
  }
}
