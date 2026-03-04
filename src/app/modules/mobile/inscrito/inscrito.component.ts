import { CategoriaService } from './../../../services/categoria.service';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize, Subscription } from 'rxjs';
import { CadastroAcoes } from '../../../shared/classes/cadastro-acoes';
import { InscritoModel } from '../../../models/inscrito-model';
import { ParticipanteModel } from '../../../models/participante-model';
import { AppSnackbar } from '../../../shared/classes/app-snackbar';
import { GlobalService } from '../../../services/global.service';
import { InscritoService } from '../../../services/inscrito.service';
import { ParticipanteService } from '../../../services/participante.service';
import { ValidatorStringLen } from '../../../shared/Validators/validator-string-len';
import { SimNao } from '../../../shared/classes/sim-nao';
import { CategoriaModel } from '../../../models/categoria-model';
import { ParametroCategoria01 } from '../../../parametros/parametro-categoria01';
import { messageError } from '../../../shared/classes/util';
import { ValidatorDate } from '../../../shared/Validators/validator-date';
import { ValidatorDoubleNumber } from '../../../shared/Validators/validator-Double-Number';

@Component({
  selector: 'app-inscrito',
  templateUrl: './inscrito.component.html',
  styleUrl: './inscrito.component.css',

  encapsulation: ViewEncapsulation.None,
})
export class InscritoComponent {
  @ViewChild(CdkScrollable) scrollable!: CdkScrollable;

  formulario!: FormGroup;

  inscricaoInscrito!: Subscription;

  inscricaoParticipante!: Subscription;

  inscricaoCategoria!: Subscription;

  acao: CadastroAcoes = CadastroAcoes.Inclusao;

  inscrito: InscritoModel = new InscritoModel();

  participante: ParticipanteModel = new ParticipanteModel();

  categorias: CategoriaModel[] = [];

  sexo: SimNao[] = [
    { sigla: 'M', descricao: 'Masculino' },
    { sigla: 'F', descricao: 'Feminino' },
    { sigla: 'O', descricao: 'Outros' },
  ];

  respostas: SimNao[] = [
    { sigla: 'S', descricao: 'Sim' },
    { sigla: 'N', descricao: 'Não' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private appSnackBar: AppSnackbar,
    private inscritoSrv: InscritoService,
    private participanteSrv: ParticipanteService,
    private categoriaSrv: CategoriaService,
    private globalService: GlobalService,
  ) {
    this.formulario = formBuilder.group({
      cnpj_cpf: [{ value: '' }, [ValidatorStringLen(1, 14, true)]],
      nome: [{ value: '' }, [ValidatorStringLen(3, 60, true)]],
      data_nasc: [{ value: '' }, [ValidatorDate(true)]],
      estrangeiro: [{ value: '' }, [ValidatorStringLen(1, 1, true)]],
      sexo: [{ value: '' }, [ValidatorStringLen(1, 1, true)]],
      inscricao: [{ value: '' }, [ValidatorDoubleNumber(true)]],
      nro_peito: [{ value: '' }, [Validators.min(1)]],
      id_categoria: [{ value: '' }, [Validators.min(1)]],
    });
  }

  ngOnInit() {
    this.inscrito = new InscritoModel();

    this.participante = new ParticipanteModel();

    this.setNoParam();

    this.getCategorias();
  }

  ngOnDestroy(): void {
    this.inscricaoInscrito?.unsubscribe();
    this.inscricaoParticipante?.unsubscribe();
  }

  setNoParam() {
    this.formulario.setValue({
      cnpj_cpf: '',
      nome: '',
      data_nasc: '',
      estrangeiro: '',
      sexo: '',
      inscricao: '',
      nro_peito: '',
      id_categoria: '',
    });
  }

  getCategorias() {
    let par: ParametroCategoria01 = new ParametroCategoria01();

    par.id_empresa = this.globalService.getEmpresa().id;

    par.tamPagina = 0;

    par.orderby = '000001';

    this.inscricaoCategoria = this.categoriaSrv
      .getCategoriasParametro_01(par)
      .pipe(finalize(() => this.globalService.setSpin(false)))
      .subscribe({
        next: (data: CategoriaModel[]) => {
          this.categorias = data;
        },
        error: (error: any) => {
          if (error.status && error.status == 401) {
            this.appSnackBar.openFailureSnackBar('Ação Não Autorizada', 'OK');
            return;
          }
          if (error.status && error.status == 409) {
            this.categorias = [];
          } else {
            this.categorias = [];
            this.appSnackBar.openFailureSnackBar(
              `Pesquisa Nas Categorias ${messageError(error)}`,
              'OK',
            );
          }
        },
      });
  }

  getAcoes() {
    return CadastroAcoes;
  }

  NoValidtouchedOrDirty(campo: string): boolean {
    if (
      !this.formulario.get(campo)?.valid &&
      (this.formulario.get(campo)?.touched || this.formulario.get(campo)?.dirty)
    ) {
      return true;
    }
    return false;
  }

  getMensafield(field: string): string {
    return this.formulario.get(field)?.errors?.['message'];
  }
}
