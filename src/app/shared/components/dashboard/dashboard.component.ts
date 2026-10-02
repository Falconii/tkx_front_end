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
import { ResumoKitModel } from '../../../models/resumo-kit-model';


declare var google: any;

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})


export class DashboardComponent {

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

        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(() => {
          google.charts.setOnLoadCallback(() => {
            this.chartsLoaded = true;
          });
        });
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
        this.buidChartEvento();
        this.getResumoOperadores();
        this.getResumoCategorias();
        //this.getResumoKits();
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
                const total = this.lsOperadores.reduce((acc, operador) => acc + operador.total, 0);
                const operador = new ResumoOperadorModel();
                operador.razao = 'Total Geral';
                operador.total = total;
                this.lsOperadores.push(operador);
                if (this.chartsLoaded) {
                    this.buidChartEvento();
                }
            },
            error: (error: any) => {
              this.lsOperadores= [];
                if (this.chartsLoaded) {
                    this.buidChartEvento();
                }
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
                const total = this.lsCategorias.reduce((acc, categoria) => acc + categoria.total, 0);
                const categoria = new ResumoCategoriaModel();
                categoria.categoria_descricao = 'Total Geral';
                categoria.total = total;
                this.lsCategorias.push(categoria);
                if (this.chartsLoaded) {
                    this.buidChartEvento();
                }

          },
          error: (error: any) => {
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




  buidChartEvento() {
    const func = (chart: any) => {

      const data = new google.visualization.DataTable();
      data.addColumn('string', 'Participante');
      data.addColumn('number', 'Total');

      const linhas:any = [];

      linhas.push([`Sem Kits`,this.eventoPrincipal.qtd_participantes - this.eventoPrincipal.qtd_kits]);
      linhas.push([`Com Kits`,this.eventoPrincipal.qtd_kits]);

      data.addRows(linhas);

      const cores = this.gerarCoresAleatorias(2);

      const options = {
        title: `Total Participantes: ${this.decimalPipe.transform(this.eventoPrincipal.qtd_participantes, '1.0-0')}`,
        width: this.larguraGrafico,
        height: 350,

        titleTextStyle: {
          fontSize: 14,        // título menor
          bold: true,
        },

        colors: cores,

        chartArea: {
          width: '90%',
          height: '90%',
          top: 20,             // diminui espaço acima
          bottom: 20,          // diminui espaço abaixo
        },

        legend: {
          position: 'right',
          textStyle: {
            fontSize: 11,      // legenda menor
          }
        },

        pieSliceTextStyle: {
          fontSize: 11,        // texto dentro das fatias menor
          color: '#fff',       // melhora contraste
        },

        pieResidueSliceLabel: 'Outros',
        pieResidueSliceVisibilityThreshold: 0,

        is3D: true,
      };


      chart().draw(data, options);
    };

    const chart = () =>
      new google.visualization.PieChart(document.getElementById('chart_evento'));

    google.charts.setOnLoadCallback(() => func(chart));
  }




}
