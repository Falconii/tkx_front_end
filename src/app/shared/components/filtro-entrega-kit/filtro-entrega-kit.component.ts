import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  map,
  filter,
  tap,
  take,
  distinctUntilChanged,
  debounceTime,
} from 'rxjs/operators';
import { GlobalService } from '../../../services/global.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FiltroEntregaKitModel } from '../../../models/filtro-entrega-kit-model';
import { hasNonNumeric } from '../../classes/util';
import { TipoPesquisa } from '../../classes/tipo-pesquisa';

@Component({
  selector: 'app-filtro-entrega-kit',
  templateUrl: './filtro-entrega-kit.component.html',
  styleUrls: ['./filtro-entrega-kit.component.css'],
})
export class FiltroEntregaKitComponent implements OnInit {
  @Input('HIDE') hide: boolean = false;
  @Output('changeParametro') change = new EventEmitter<FiltroEntregaKitModel>();

  parametros: FormGroup;

  parametroPesquisa: FiltroEntregaKitModel = new FiltroEntregaKitModel();

  enable_filter: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private globalService: GlobalService,
  ) {
    this.parametros = formBuilder.group({
      kit: [{ value: '' }],
      pesquisa: [{ value: '' }],
    });
    this.parametroPesquisa = new FiltroEntregaKitModel();
    this.parametroPesquisa.pesquisar = '';
    this.parametroPesquisa.pesquisarPor = TipoPesquisa.None;
  }

  ngOnInit(): void {
    this.parametros
      .get('pesquisa')
      ?.valueChanges.pipe(
        map((value) => value.trim()),
        filter((value) => value.length >= 0),
        debounceTime(350),
        distinctUntilChanged(),
      )
      .subscribe((value: string) => {
        this.onChangeParametros();
      });
    this.setValues();
  }

  ngOnDestroy(): void {}

  setValues() {
    this.enable_filter = false;
    this.parametros.setValue({
      kit: this.parametroPesquisa.kit,
      pesquisa: this.parametroPesquisa.pesquisar.toUpperCase() || '',
    });
    this.enable_filter = true;
  }

  setValuesNoParam() {
    this.enable_filter = false;
    this.parametros.setValue({
      kit: false,
      pesquisa: '',
    });
    this.enable_filter = true;
  }

  getParametro() {}

  refreshParametro(start: boolean = true) {
    if (start) {
      this.parametroPesquisa.pesquisar =
        this.parametros.get('pesquisa')?.value || '';
      this.parametroPesquisa.pesquisarPor = this.definirPesquisa();
      this.parametroPesquisa.kit = this.parametros.get('kit')?.value;
    } else {
      this.parametroPesquisa.pesquisar = '';
      this.parametroPesquisa.pesquisarPor = TipoPesquisa.Nome;
      this.parametroPesquisa.kit = false;
    }
    this.setValues();
  }

  onChangeParametros(start: boolean = true) {
    this.refreshParametro(start);
    if (this.enable_filter) {
      this.change.emit(this.parametroPesquisa);
    }
  }

  onHide() {}

  hasValue(campo: string): boolean {
    if (this.parametros.get(campo)?.value == '') {
      return false;
    }
    return true;
  }

  clearValue(campo: string) {
    if (campo == 'pesquisa') {
      this.parametros.patchValue({
        pesquisa: '',
      });
    }
    this.onChangeParametros();
  }

  ChangeValue(campo: string, value: string) {
    if (campo == 'pesquisa')
      this.parametros.patchValue({
        descricao: value,
      });
  }

  NoValidtouchedOrDirty(campo: string): boolean {
    if (
      !this.parametros.get(campo)?.valid &&
      (this.parametros.get(campo)?.touched || this.parametros.get(campo)?.dirty)
    ) {
      return true;
    }
    return false;
  }

  getMensafield(field: string): string {
    return '';
  }

  setCpf(event: MatCheckboxChange) {
    if (event.checked) {
      this.parametros.patchValue({
        cpf: true,
        nome: false,
        peito: false,
        pesquisa: '',
      });
      this.onChangeParametros();
    }
  }

  setNome(event: MatCheckboxChange) {
    if (event.checked) {
      this.parametros.patchValue({
        cpf: false,
        nome: true,
        peito: false,
        pesquisa: '',
      });
      this.onChangeParametros();
    }
  }

  setPeito(event: MatCheckboxChange) {
    if (event.checked) {
      this.parametros.patchValue({
        cpf: false,
        nome: false,
        peito: true,
        pesquisa: '',
      });
      this.onChangeParametros();
    }
  }

  onLimpar(event: MatCheckboxChange) {
    if (event.checked) {
      this.parametros.patchValue({
        dtinicial: '',
        dtfinal: '',
        cleardate: false,
      });
    }
    this.onChangeParametros();
  }

  definirPesquisa(): TipoPesquisa {
    const texto = this.parametros.get('pesquisa')?.value || '';
    if (texto.trim().length == 0) {
      return TipoPesquisa.None;
    }
    const isTexto = hasNonNumeric(texto);
    if (isTexto) {
      return TipoPesquisa.Nome;
    }
    if (texto.trim().length <= 6) {
      return TipoPesquisa.Inscricao;
    }
    return TipoPesquisa.Cpf;
  }
  getTextoTipoPesquisa(
    value: TipoPesquisa = this.parametroPesquisa.pesquisarPor,
  ): string {
    switch (value) {
      case TipoPesquisa.Nome:
        return 'Pelo Nome';

      case TipoPesquisa.Cpf:
        return 'Pelo CPF';

      case TipoPesquisa.Inscricao:
        return 'Pela Incrição';

      default:
        return '';
    }
  }

  onKit(event: MatCheckboxChange) {
    if (event.checked) {
      this.parametros.patchValue({
        kit: event.checked,
      });
    }
    this.onChangeParametros();
  }
}
