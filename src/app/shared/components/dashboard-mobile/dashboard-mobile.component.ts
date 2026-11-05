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
import { ResumoKitModel } from '../../../models/resumo-kit-model';


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


    inscricaoKit!: Subscription;



    lsOperadores:ResumoOperadorModel[] = [];

    lsCategorias:ResumoCategoriaModel[] = [];

    lsResumosKits:ResumoKitModel[] = [];



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
        this.inscricaoKit?.unsubscribe();
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
        this.getResumoKits();
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

                const total = this.lsOperadores.reduce((acc, kit) => acc + kit.total, 0);
                const operador = new ResumoOperadorModel();
                operador.razao = 'Total Geral';
                operador.total = total;
                this.lsOperadores.push(operador);
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
                const total = this.lsCategorias.reduce((acc, kit) => acc + kit.total, 0);
                const categoria = new ResumoCategoriaModel();
                categoria.categoria_descricao = 'Total Geral';
                categoria.total = total;
                this.lsCategorias.push(categoria);
          },
          error: (error: any) => {
            console.log(error);
            this.lsCategorias = [];
          },
        });
    }


        getResumoKits() {
      if (this.eventoPrincipal.id == 0) {
        return;
      }


      this.inscricaoKit = this.eventoComplementarSrv.resumoKit(this.eventoPrincipal.id)
        .subscribe({
          next: (data: any) => {
              this.lsResumosKits = data;
              const total = this.lsResumosKits.reduce((acc, kit) => acc + kit.total, 0);
              const kit = new ResumoKitModel();
              kit.tam_camisa = 'Total Geral';
              kit.total = total;
              this.lsResumosKits.push(kit);
          },
          error: (error: any) => {
            this.lsResumosKits = [];
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
