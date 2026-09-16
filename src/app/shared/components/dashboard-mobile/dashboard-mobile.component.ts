import { Component, Input } from '@angular/core';
import { ResumoOperadorModel } from '../../../models/resumo-operador-model';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { EventoModel } from '../../../models/evento-model';
import { ResumoCategoriaModel } from '../../../models/resumo-categoria-model';
import { GlobalService } from '../../../services/global.service';
import { AppSnackbar } from '../../classes/app-snackbar';
import { FirstNamePipe } from '../../pipes/first-name.pipe';
import { Subscription } from 'rxjs';
import { EventoComplementarService } from '../../../services/eventoComplementar.service';
import { EventoResumoModel } from '../../../models/evento-resumo-model';


declare var google: any;

@Component({
  selector: 'dashboard-mobile',
  templateUrl: './dashboard-mobile.component.html',
  styleUrls: ['./dashboard-mobile.component.css']
})


export class DashboardMobileComponent {

   @Input('EVENTO_PRINCIPAL') eventoPrincipal: EventoModel = new EventoModel();


    inscricaoResumoOperador!: Subscription;


    inscricaoCategoria!: Subscription;


    lsOperadores:ResumoOperadorModel[] = [];

    lsCategorias:ResumoCategoriaModel[] = [];

    isMobile: boolean = false;

    chartsLoaded:boolean = false;

    lsEventos: EventoModel[] = [];

    lsEventosResumos:EventoResumoModel[] = []

    larguraGrafico:number = 450;


  constructor(
      private globalService: GlobalService,
      private eventoComplementarSrv:EventoComplementarService,
      private breakpoint: BreakpointObserver,
      private decimalPipe: DecimalPipe,
      private firstNamePipe:FirstNamePipe,
      private route: ActivatedRoute,
      private appSnackBar: AppSnackbar,
    ) {
      this.breakpoint.observe([Breakpoints.Handset]).subscribe((result) => {
        this.isMobile = result.matches;
        if (this.isMobile) {
          this.larguraGrafico = 290;
        } else {
          this.larguraGrafico = 450;
        }
      });

    this.globalService.changeData.subscribe((evento) => {
      this.eventoPrincipal = evento;
      this.atualizar();
    });

    }

    ngOnInit() {



        this.atualizar();

      }


    ngOnDestroy() {
        this.inscricaoResumoOperador?.unsubscribe();
        this.inscricaoCategoria?.unsubscribe();
      }


    onHome(){

      }

    atualizar(){
        this.lsEventosResumos = [];
        this.lsEventosResumos.push(new EventoResumoModel('Participantes:',this.eventoPrincipal.qtd_participantes));
        this.lsEventosResumos.push(new EventoResumoModel('Kits:',this.eventoPrincipal.qtd_kits));
        this.lsEventosResumos.push(new EventoResumoModel('Saldo:',this.eventoPrincipal.qtd_participantes-this.eventoPrincipal.qtd_kits));
        this.getResumoOperadores();
        this.getResumoCategorias();
      }



    getColuna():string {
        return this.isMobile ?  '1' :  '2';
      }



    getResumoOperadores() {

        if (this.eventoPrincipal.id == 0){
          return;
        }

        this.inscricaoResumoOperador = this.eventoComplementarSrv.resumoOPerador(this.eventoPrincipal.id)
          .subscribe({
            next: (data: any) => {
                this.lsOperadores = data;
            },
            error: (error: any) => {
              console.log(error);
              this.lsOperadores= [];
            },
          });
      }

    getResumoCategorias() {

      if (this.eventoPrincipal.id == 0) {
        return;
      }


      this.inscricaoResumoOperador = this.eventoComplementarSrv.resumoCategoria(this.eventoPrincipal.id)
        .subscribe({
          next: (data: any) => {
            this.lsCategorias = data;
          },
          error: (error: any) => {
            console.log(error);
            this.lsCategorias = [];
          },
        });
    }

    private gerarCoresAleatorias(qtd: number): string[] {
      return Array.from({ length: qtd }, () =>
        '#' + Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, '0')   // garante 6 dígitos
      );
    }

  onChangeParametros(){
    this.getResumoCategorias();
    this.getResumoOperadores();
  }





}
