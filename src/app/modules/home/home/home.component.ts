import { FirstNamePipe } from './../../../shared/pipes/first-name.pipe';
import { Component, PipeTransform } from '@angular/core';
import { GlobalService } from '../../../services/global.service';
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


  formulario: FormGroup;

  inscricaoResumoOperador!: Subscription;

  inscricaoEvento!: Subscription;

  inscricaoCategoria!: Subscription;


  lsOperadores:ResumoOperadorModel[] = [];
  lsCategorias:ResumoCategoriaModel[] = [];
  isMobile: boolean = false;

  chartsLoaded:boolean = false;

  lsEventos: EventoModel[] = [];

  eventoPrincipal:number = 0;

  larguraGrafico:number = 450;

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
    this.breakpoint.observe([Breakpoints.Handset]).subscribe((result) => {
      this.isMobile = result.matches;
      if (this.isMobile) {
        this.larguraGrafico = 290;
      } else {
        this.larguraGrafico = 450;
      }
    });

    this.formulario = formBuilder.group({
      id_evento: [{ value: '' }],
    });
  }

  ngOnInit() {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(() => {
      google.charts.setOnLoadCallback(() => {
        this.chartsLoaded = true;
      });
    });
    this.getEventos();
  }


  ngOnDestroy() {
    this.inscricaoEvento?.unsubscribe();
    this.inscricaoResumoOperador?.unsubscribe();
    this.inscricaoCategoria?.unsubscribe();
  }


  onHome(){

  }

  atualizar(){
    this.getResumoOperadores();
    this.getResumoCategorias();
  }




  getColuna():string {
    return this.isMobile ?  '1' :  '2';
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
          this.eventoPrincipal = this.lsEventos[0].id;
          this.setValue();
          this.getResumoOperadores();
          this.getResumoCategorias();
        },
        error: (error: any) => {
          this.lsEventos = [];
        },
      });
  }

  getResumoOperadores() {

    if (this.eventoPrincipal == 0){
      return;
    }

    this.inscricaoResumoOperador = this.eventoComplementarSrv.resumoOPerador(this.eventoPrincipal)
      .subscribe({
        next: (data: any) => {
            this.lsOperadores = data;
            console.log("lsOperadores",this.lsOperadores);
            if (this.chartsLoaded) {
              this.buidChartOperadores();
            }
        },
        error: (error: any) => {
          console.log(error);
          this.lsOperadores= [];
        },
      });
  }

  getResumoCategorias() {

    if (this.eventoPrincipal == 0) {
      return;
    }


    this.inscricaoResumoOperador = this.eventoComplementarSrv.resumoCategoria(this.eventoPrincipal)
      .subscribe({
        next: (data: any) => {
          this.lsCategorias = data;
          this.buidChartCategorias();
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
  this.eventoPrincipal = this.formulario.get('id_evento')?.value;
  this.setValue();
  this.getResumoCategorias();
  this.getResumoOperadores();
}


setValue() {
  this.formulario.setValue({
    id_evento: this.eventoPrincipal});
}

buidChartCategorias() {
  const func = (chart: any) => {

    const data = new google.visualization.DataTable();
    data.addColumn('string', 'Categoria');
    data.addColumn('number', 'Total');

    const linhas = this.lsCategorias.map(x => [`${x.categoria_descricao} - ${x.total}`, x.total]);
    data.addRows(linhas);

    const totalParticipantes = this.lsCategorias
      .reduce((acc, x) => acc + x.total, 0);

    const cores = this.gerarCoresAleatorias(this.lsCategorias.length);

    const options = {
      title: `Resumo Por Categoria - Total: ${this.decimalPipe.transform(totalParticipantes, '1.0-0')}`,
      width:  this.larguraGrafico,
      height: 400,

      titleTextStyle: {
        fontSize: 14,        // título menor
        bold: true,
      },

      colors: cores,

      chartArea: {
        width: '90%',
        height: '80%',
        top: 20,             // diminui espaço acima
        left: 5,          // diminui espaço abaixo
      },

      legend: {
        position: 'left',
        alignment: 'end',
        textStyle: {
          fontSize: 10,
        }
      },

      pieSliceTextStyle: {
        fontSize: 11,        // texto dentro das fatias menor
        color: '#fff',       // melhora contraste
      },

      is3D: true,
    };
    chart().draw(data, options);
  };

  const chart = () =>
    new google.visualization.PieChart(document.getElementById('chart_categorias'));

  google.charts.setOnLoadCallback(() => func(chart));
}

  buidChartOperadores() {
    const func = (chart: any) => {

      const data = new google.visualization.DataTable();
      data.addColumn('string', 'Operador');
      data.addColumn('number', 'Total');

      const linhas = this.lsOperadores.map(x => [`${this.firstNamePipe.transform(x.razao)} - ${x.total}`, x.total]);

      data.addRows(linhas);

      const totalParticipantes = this.lsOperadores
        .reduce((acc, x) => acc + x.total, 0);

      const cores = this.gerarCoresAleatorias(this.lsOperadores.length);

      const options = {
        title: `Resumo Por Operador - Total: ${this.decimalPipe.transform(totalParticipantes, '1.0-0')}`,
        width: this.larguraGrafico,
        height: 350,

        titleTextStyle: {
          fontSize: 14,        // título menor
          bold: true,
        },

        colors: cores,

        chartArea: {
          width: '100%',
          height: '100%',
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
      new google.visualization.PieChart(document.getElementById('chart_operadores'));

    google.charts.setOnLoadCallback(() => func(chart));
  }



}
