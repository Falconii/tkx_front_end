import { Component, Inject } from '@angular/core';
import { CadastroAcoes } from '../../../shared/classes/cadastro-acoes';
import { Subscription } from 'rxjs';
import { CategoriaService } from '../../../services/categoria.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { EventoService } from '../../../services/evento.service';
import { GlobalService } from '../../../services/global.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppSnackbar } from '../../../shared/classes/app-snackbar';
import { ValidatorStringLen } from '../../../shared/Validators/validator-string-len';
import { ParticipanteV2DialogData } from './participantev2-dialog-data';
import { Participantev2Service } from '../../../services/participantev2.service';
import { Participantev2Model } from '../../../models/participantev2-model';
import { EventoModel } from '../../../models/evento-model';
import { CategoriaModel } from '../../../models/categoria-model';
import { TipoOperacao } from '../../../shared/classes/tipo-operacao';
import { ParametroEvento01 } from '../../../parametros/parametro-evento01';
import { SimNao } from '../../../shared/classes/sim-nao';
import { ParametroCategoria01 } from '../../../parametros/parametro-categoria01';
import { ValidatorDate } from '../../../shared/Validators/validator-date';
import { ValidatorCheckBox } from '../../../shared/Validators/validator-Check-Box';
import { ValidatorDoubleNumber } from '../../../shared/Validators/validator-Double-Number';
import { ValidadorInterger } from '../../../shared/Validators/validador-Interger';

@Component({
  selector: 'app-participantev2-dialog',
  templateUrl: './participantev2-dialog.component.html',
  styleUrl: './participantev2-dialog.component.scss',
})
export class Participantev2DialogComponent {
  formulario: FormGroup;

  erro: any;

  acao: string = 'Sem Definição';

  idAcao: number = CadastroAcoes.Inclusao;

  readOnly: boolean = true;

  inscricaoEvento!: Subscription;
  inscricaoCategoria!: Subscription;
  inscricaoAcao!: Subscription;
  inscricaoGetParticipante!: Subscription;
  inscricaoShowSpin!: Subscription;

  labelCadastro: string = '';

  eventos: EventoModel[] = [];

  categorias: CategoriaModel[] = [];

  showSpin: boolean = false;

  lsSexos: SimNao[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private categoriaSrv: CategoriaService,
    private eventoSrv: EventoService,
    private participanteSrv: Participantev2Service,
    private globalService: GlobalService,
    private appSnackBar: AppSnackbar,
    @Inject(MAT_DIALOG_DATA) public data: ParticipanteV2DialogData,
    private dialogRef: MatDialogRef<Participantev2DialogComponent>,
  ) {
    this.formulario = formBuilder.group({
      id: [{ value: '' }],
      id_evento: [{ value: '' }, [ValidatorCheckBox(1, 6, true)]],
      id_categoria: [{ value: '' }, [ValidatorCheckBox(1, 6, true)]],
      inscricao: [{ value: '' }, [ValidadorInterger(true)]],
      nro_peito: [{ value: '' }, [ValidadorInterger(true)]],
      cnpj_cpf: [{ value: '' }, [ValidatorStringLen(3, 14, true)]],
      nome: [{ value: '' }, [ValidatorStringLen(3, 60, true)]],
      sexo: [{ value: '' }, [ValidatorStringLen(1, 1, true)]],
      data_nasc: [{ value: '' }, [ValidatorDate(true)]],
    });
    this.globalService.showSpin$.subscribe((show) => {
      this.showSpin = show;
    });
  }
  ngOnInit(): void {
    this.lsSexos = this.globalService.getLsSexo();
    this.idAcao = this.data.opcao;
    this.setAcao(this.data.opcao);
    this.setValueNoParam();
    this.getEventos();
  }

  ngOnDestroy(): void {
    this.inscricaoAcao?.unsubscribe();
    this.inscricaoCategoria?.unsubscribe();
    this.inscricaoEvento?.unsubscribe();
    this.inscricaoGetParticipante?.unsubscribe();
    this.inscricaoShowSpin?.unsubscribe();
  }

  get idEventoControl(): FormControl {
    return this.formulario.get('id_evento') as FormControl;
  }

  get idCategoriaControl(): FormControl {
    return this.formulario.get('id_categoria') as FormControl;
  }

  get sexoControl(): FormControl {
    return this.formulario.get('sexo') as FormControl;
  }

  actionFunction() {
    if (this.formulario.valid) {
      this.executaAcao();
    } else {
      this.formulario.markAllAsTouched();
      this.appSnackBar.openSuccessSnackBar(
        `Formulário Com Campos Inválidos.`,
        'OK',
      );
    }
  }

  closeModal() {
    this.data.processar = true;
    this.dialogRef.close(this.data);
  }

  setValue() {
    this.formulario.setValue({
      id_evento: this.data.participante.id_evento,
      id_categoria: this.data.participante.id_categoria,
      id: this.data.participante.id,
      inscricao: this.data.participante.inscricao,
      nro_peito: this.data.participante.nro_peito,

      cnpj_cpf: this.data.participante.cnpj_cpf,
      nome: this.data.participante.nome,
      sexo: this.data.participante.sexo,
      data_nasc: this.data.participante.data_nasc,
    });
  }

  setValueNoParam() {
    this.formulario.setValue({
      id_evento: '',
      id_categoria: '',
      id: '',
      inscricao: '',
      nro_peito: '',
      cnpj_cpf: '',
      nome: '',
      sexo: '',
      data_nasc: '',
    });
  }

  getLabelCancel() {
    if (this.idAcao == CadastroAcoes.Consulta) {
      return 'Voltar';
    } else {
      return 'Cancelar';
    }
  }

  setAcao(op: number) {
    switch (+op) {
      case CadastroAcoes.Inclusao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Participante - Inclusão.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Edicao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Participante - Alteração.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Consulta:
        this.acao = 'Voltar';
        this.labelCadastro = 'Participante - Consulta.';
        this.readOnly = true;
        break;
      case CadastroAcoes.Exclusao:
        this.acao = 'Excluir';
        this.labelCadastro = 'Participante - Exclusão.';
        this.readOnly = true;
        break;
      case CadastroAcoes.Atualizacao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Participante - Atualização';
        this.readOnly = false;
        break;
      default:
        break;
    }
  }

  onCancel() {
    this.data.processar = false;
    this.closeModal();
  }

  disabledSubmit() {
    if (this.showSpin) {
      return true;
    }
    if (this.idAcao == this.getAcoes().Edicao && this.formulario.pristine) {
      return false;
    }
    if (this.idAcao == this.getAcoes().Exclusao) {
      false;
    }
    if (this.idAcao == this.getAcoes().Consulta) {
      return true;
    } else {
      return !this.formulario.valid;
    }
  }

  onSubmit() {
    if (this.formulario.valid) {
      this.executaAcao();
    } else {
      this.formulario.markAllAsTouched();
      this.formulario.updateValueAndValidity();
      this.appSnackBar.openSuccessSnackBar(
        `Formulário Com Campos Inválidos.`,
        'OK',
      );
    }
  }

  executaAcao() {
    this.data.participante.id_evento = this.formulario.get('id_evento')?.value;
    this.data.participante.id = this.formulario.get('id')?.value;
    this.data.participante.inscricao = this.formulario.get('inscricao')?.value;
    this.data.participante.nro_peito = this.formulario.get('nro_peito')?.value;
    this.data.participante.id_categoria =
      this.formulario.get('id_categoria')?.value;
    this.data.participante.cnpj_cpf = this.formulario.get('cnpj_cpf')?.value;
    this.data.participante.nome = this.formulario
      .get('nome')
      ?.value.toString()
      .toUpperCase();
    this.data.participante.sexo = this.formulario
      .get('sexo')
      ?.value.toString()
      .toUpperCase();
    this.data.participante.data_nasc = this.formulario.get('data_nasc')?.value;
    switch (+this.idAcao) {
      case CadastroAcoes.Inclusao:
        this.data.participante.user_insert = this.globalService.getUsuario().id;
        this.inscricaoAcao = this.participanteSrv
          .participantev2Insert(this.data.participante)
          .subscribe({
            next: (data: any) => {
              this.appSnackBar.openSuccessSnackBar(
                `Participante Incluido Com Sucesso !`,
                'OK',
              );
              this.data.participante = data;
              this.getParticipante(this.data.participante);
            },
            error: (error: any) => {
              console.log('error =>', error);
              this.appSnackBar.openFailureSnackBar(
                `Erro Na Inclusão ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
                'OK',
              );
            },
          });
        break;
      case CadastroAcoes.Edicao:
        this.data.participante.user_update = this.globalService.getUsuario().id;
        this.inscricaoAcao = this.participanteSrv
          .participantev2Update(this.data.participante)
          .subscribe({
            next: (data: any) => {
              this.appSnackBar.openSuccessSnackBar(
                `Participante Alterado Com Sucesso !`,
                'OK',
              );
              this.data.participante = data;

              this.getParticipante(this.data.participante);
            },
            error: (error: any) => {
              this.appSnackBar.openFailureSnackBar(
                `Erro Na Alteração ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
                'OK',
              );
            },
          });
        break;
      case CadastroAcoes.Exclusao:
        this.inscricaoAcao = this.participanteSrv
          .participantev2Delete(
            this.data.participante.id_empresa,
            this.data.participante.id_evento,
            this.data.participante.id,
          )
          .subscribe({
            next: (data: any) => {
              this.appSnackBar.openSuccessSnackBar(
                `Participante Excluido Com Sucesso !`,
                'OK',
              );
              this.data.participante = data;
              this.closeModal();
            },
            error: (error: any) => {
              this.appSnackBar.openFailureSnackBar(
                `Erro Na Exclusão ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
                'OK',
              );
            },
          });
        break;
      default:
        break;
    }
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

  setEmailReadOnly() {
    if (this.idAcao == 5) {
      return true;
    }
    return this.readOnly;
  }

  getCategorias(tipoOperacao: TipoOperacao = TipoOperacao.Pesquisa) {
    let par = new ParametroEvento01();

    par.id_empresa = this.globalService.getEmpresa().id;

    par.orderby = '000001';

    if (tipoOperacao == TipoOperacao.Contador) {
      par.contador = 'S';
    } else {
      par.pagina = 0;
      par.tamPagina = 50;
    }
    this.inscricaoCategoria = this.categoriaSrv
      .getCategoriasParametro_01(par)
      .subscribe({
        next: (data: any) => {
          if (tipoOperacao == TipoOperacao.Pesquisa) {
            this.categorias = data;
            this.setValue();
          } else {
            this.getCategorias();
          }
        },
        error: (error: any) => {
          this.categorias = [];
          this.appSnackBar.openFailureSnackBar(
            'Falha Na Tabela De Categorias',
            'OK',
          );
        },
      });
  }

  getEventos(tipoOperacao: TipoOperacao = TipoOperacao.Pesquisa) {
    let par = new ParametroEvento01();

    par.id_empresa = this.globalService.getEmpresa().id;

    par.orderby = '000001';

    if (tipoOperacao == TipoOperacao.Contador) {
      par.contador = 'S';
    } else {
      par.pagina = 0;
      par.tamPagina = 50;
    }

    if (this.idAcao == this.getAcoes().Inclusao) {
      //par.status = '3';
    }
    console.log('Paramentros de Consulta:', par);
    this.inscricaoEvento = this.eventoSrv
      .getEventosParametro_01(par)
      .subscribe({
        next: (data: any) => {
          if (tipoOperacao == TipoOperacao.Pesquisa) {
            this.eventos = data;
            this.getCategorias();
          } else {
            this.getEventos();
          }
        },
        error: (error: any) => {
          console.log(error);
          this.eventos = [];
          this.appSnackBar.openFailureSnackBar(
            'Falha Na Tabela De Eventos',
            'OK',
          );
        },
      });
  }

  getParticipante(participante: Participantev2Model) {
    this.inscricaoGetParticipante = this.participanteSrv
      .getParticipantev2(
        participante.id_empresa!,
        participante.id_evento,
        participante.id,
      )
      .subscribe({
        next: (data: Participantev2Model) => {
          this.data.participante = data;
          this.closeModal();
        },
        error: (error: any) => {
          this.appSnackBar.openFailureSnackBar(
            `Problemas na Consulta Do Participante '`,
            'OK',
          );
          this.closeModal;
        },
      });
  }

  readOnlyChave(): boolean {
    if (this.idAcao == CadastroAcoes.Inclusao) {
      return false;
    }
    return true;
  }

  isReadOnly(): boolean {
    return (
      this.idAcao === this.getAcoes().Consulta ||
      this.idAcao === this.getAcoes().Exclusao
    );
  }

  simularApi<T>(retorno: T, tempoMs: number = 1500): Promise<T> {
    this.globalService.setSpin(true);

    return new Promise((resolve) => {
      setTimeout(() => {
        this.globalService.setSpin(false);
        resolve(retorno);
      }, tempoMs);
    });
  }
}
