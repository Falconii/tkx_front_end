import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlePaginas } from '../../classes/controle-paginas';

@Component({
  selector: 'app-navegator',
  templateUrl: './shared-navegator.component.html',
  styleUrls: ['./shared-navegator.component.scss'],
})
export class SharedNavegatorComponent implements OnInit {
  @Input('controle') controlePaginas!: ControlePaginas;
  @Input('show_registros') show_registro: boolean = true;

  @Output('changePage') change = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  getAtual(): string {
    return `${this.controlePaginas.getPaginalAtual()}/${this.controlePaginas.getTotalPaginas()}`;
  }

  firstPage() {
    this.controlePaginas.goFirst();
    this.change.emit('');
  }

  lastPage() {
    this.controlePaginas.goLast();
    this.change.emit('');
  }

  forwardPage() {
    this.controlePaginas.forwardPage();
    this.change.emit('');
  }

  nextPage() {
    this.controlePaginas.nextPage();
    this.change.emit('');
  }

  get pageDisplay(): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    if (this.controlePaginas.getTotalRegistros() == 0) {
      return 'Pesquisa Em Branco!';
    } else {
      const totalRegistros: string = this.show_registro
        ? ` - ${this.controlePaginas.getTotalRegistros()}`
        : ``;
      return `${pad(this.controlePaginas.getPaginalAtual())}/${pad(this.controlePaginas.getTotalPaginas())}${totalRegistros}`;
    }
  }
}
