import { Component, Inject } from '@angular/core';
import { CadastroAcoes } from '../../../shared/classes/cadastro-acoes';
import { Subscription } from 'rxjs';
import { ParametroModel } from '../../../models/parametro-model';
import { GlobalService } from '../../../services/global.service';
import { EditDetalheDialogData } from './edit-detalhe-dialog-data';
import { AppSnackbar } from '../../../shared/classes/app-snackbar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DetplanilhaService } from '../../../services/detPlanilha.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ValidatorStringLen } from '../../../shared/Validators/validator-string-len';
import { ParametroCategoria01 } from '../../../parametros/parametro-categoria01';
import { CategoriaService } from '../../../services/categoria.service';
import { CategoriaModel } from '../../../models/categoria-model';
import { ValidatorCheckBox } from '../../../shared/Validators/validator-Check-Box';
import { ValidadorInterger } from '../../../shared/Validators/validador-Interger';
import { ValidatorDate } from '../../../shared/Validators/validator-date';
import { SimNao } from '../../../shared/classes/sim-nao';
@Component({
  selector: 'app-edit-detalhe-dialog',
  templateUrl: './edit-detalhe-dialog.component.html',
  styleUrl: './edit-detalhe-dialog.component.css'
})
export class EditDetalheDialogComponent {

   formulario: FormGroup;


    erro: any;

    acao: string = 'Sem Definição';

    idAcao: number = CadastroAcoes.None

    readOnly: boolean = true;

    inscricaoAcao!: Subscription;
    inscricaoDetatalhe!: Subscription;
    inscricaoCategoria!: Subscription;

    param: ParametroModel = new ParametroModel();

    lsCategorias:CategoriaModel[] = [];

    labelCadastro: string = '';

    lsSexos: SimNao[] = [];

    lsSitDetalhes: SimNao[] = [];

    showSpin: boolean = false;


    constructor(
        private formBuilder: FormBuilder,
        private globalService: GlobalService,
        private detPlanilhaSrv:DetplanilhaService,
        private categoriaSrv: CategoriaService,
        private appSnackBar: AppSnackbar,
        @Inject(MAT_DIALOG_DATA) public data: EditDetalheDialogData,
        private dialogRef: MatDialogRef<EditDetalheDialogComponent>,
      ) {
      this.formulario = formBuilder.group({
          evento:    [{ value: '', disabled: true }],
          cnpj_cpf: [{ value: ''}, [ValidatorStringLen(3, 14, true)] ],
          nome:      [{ value: '' }, [ValidatorStringLen(3, 60, true)]],
          sexo: [{ value: '' }, [ValidatorStringLen(1, 1, true)] ],
          data_nasc: [{ value: '' }, [ValidatorDate(true)]],
          inscricao: [{ value: '' },[ValidadorInterger(true)]],
          nro_peito: [{ value: '' },[ValidadorInterger(true)]],
          id_categoria: [{ value: '' }, [ValidatorCheckBox(1, 6, true)]],
          status: [{ value: '' }],
          mensagem: [{ value: '' }],
        });
        this.globalService.showSpin$.subscribe((show) => {
            this.showSpin = show;
        });
        this.idAcao = data.idAcao;
        this.setAcao(this.idAcao);
      }

        get idCategoriaControl(): FormControl {
                return this.formulario.get('id_categoria') as FormControl;
              }

        get sexoControl(): FormControl {
          return this.formulario.get('sexo') as FormControl;
        }

        get sitDetalheControl(): FormControl {
          return this.formulario.get('status') as FormControl;
        }



      ngOnInit(): void {
        this.lsSitDetalhes = this.globalService.getDetalhe_situacoes();
        this.lsSexos = this.globalService.getLsSexo();
        this.idAcao = this.data.idAcao;
        this.setAcao(this.data.idAcao);
        this.setNoParam()
        this.getCategorias();
      }

      ngOnDestroy(): void {
        this.inscricaoAcao?.unsubscribe();
        this.inscricaoDetatalhe?.unsubscribe();
        this.inscricaoCategoria?.unsubscribe();
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
    this.data.detPlanilha.cnpj_cpf = this.formulario.value.cnpj_cpf;
    this.data.detPlanilha.nome = this.formulario.value.nome.toUpperCase();
    this.data.detPlanilha.id_categoria = this.formulario.value.id_categoria;
    this.data.detPlanilha.sexo = this.formulario.value.sexo;
    this.data.detPlanilha.inscricao = this.formulario.value.inscricao;
    this.data.detPlanilha.nro_peito = this.formulario.value.nro_peito;
    this.data.detPlanilha.cnpj_cpf = this.formulario.value.cnpj_cpf;
    this.data.detPlanilha.data_nasc = this.formulario.value.data_nasc;
    this.data.detPlanilha.status = 0;
    this.data.detPlanilha.mensagem_erro = "";
    switch (+this.idAcao) {
      case CadastroAcoes.Inclusao:
        this.data.detPlanilha.user_insert = this.globalService.getUsuario().id;
        this.inscricaoAcao= this.detPlanilhaSrv
          .detPlanilhaInsert(this.data.detPlanilha)
          .subscribe({
            next: (data: any) => {
              this.appSnackBar.openSuccessSnackBar(
                `Participante Incluido Com Sucesso !`,
                'OK',
              );
              this.data.detPlanilha = data;
              this.getDetalhe();
              this.data.result = true;
              this.closeModal()
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
        this.data.detPlanilha.user_update = this.globalService.getUsuario().id;
        this.inscricaoAcao = this.detPlanilhaSrv
          .detPlanilhaUpdate(this.data.detPlanilha)
          .subscribe({
            next: (data: any) => {
              this.appSnackBar.openSuccessSnackBar(
                `Participante Alterado Com Sucesso !`,
                'OK',
              );
              this.data.detPlanilha = data;
              this.getDetalhe();
              this.data.result = true;
              this.closeModal();
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
        this.inscricaoAcao = this.detPlanilhaSrv
          .detPlanilhaDelete(this.data.detPlanilha.id_empresa, this.data.detPlanilha.id_evento,this.data.detPlanilha.id_cabec,this.data.detPlanilha.nro_peito)
          .subscribe({
            next: (data: any) => {
              this.appSnackBar.openSuccessSnackBar(
                `Participante Excluido Com Sucesso !`,
                'OK',
              );
              this.data.result = true;
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

  setAcao(op: number) {
    switch (+op) {
      case CadastroAcoes.Inclusao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Participante - Inclusão.';
        break;
      case CadastroAcoes.Edicao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Participante - Alteração.';
        break;
      case CadastroAcoes.Consulta:
        this.acao = 'Voltar';
        this.labelCadastro = 'Participante - Consulta.';
        break;
      case CadastroAcoes.Exclusao:
        this.acao = 'Excluir';
        this.labelCadastro = 'Participante - Exclusão.';
        break;
      case CadastroAcoes.Atualizacao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Participante - Atualização';
        break;
      default:
        break;
    }
  }


  getCategorias() {

    const par = new ParametroCategoria01();

    par.id_empresa = this.globalService.getEmpresa().id;
    par.orderby = '000001';
    par.contador = 'N';
    par.pagina = 0;

    this.inscricaoCategoria = this.categoriaSrv
      .getCategoriasParametro_01(par)
      .subscribe({
        next: (data: any) => {
          this.lsCategorias = data;
          if (this.idAcao == CadastroAcoes.Inclusao){
            this.setValue();
          } else {
            this.getDetalhe();
          }
        },
        error: (error: any) => {

          this.appSnackBar.openFailureSnackBar("Cadastro De Categorias Não Encontrado!", "OK");

          this.data.result = false;

          this.closeModal();
        },
      });
  }


  getDetalhe() {

      this.inscricaoDetatalhe = this.detPlanilhaSrv
        .getDetplanilha(this.data.detPlanilha.id_empresa, this.data.detPlanilha.id_evento, this.data.detPlanilha.id_cabec, this.data.detPlanilha.nro_peito)
        .subscribe({
          next: (data: any) => {
                this.data.detPlanilha = data;
                this.setValue();
          },
          error: (error: any) => {
              this.appSnackBar.openFailureSnackBar("Participante Da Planilha Não Encontrado!","OK");

            this.data.result = false;

            this.closeModal();
          },
        });
  }

  onCancel(){
      this.data.result = false;
      this.closeModal();
  }

  closeModal() {
      this.dialogRef.close(this.data);
    }


  setValue() {
    this.formulario.setValue({
      evento: this.data.detPlanilha.evento_descricao,
      cnpj_cpf: this.data.detPlanilha.cnpj_cpf,
      nome: this.data.detPlanilha.nome,
      sexo: this.data.detPlanilha.sexo,
      data_nasc: this.data.detPlanilha.data_nasc,
      inscricao: this.data.detPlanilha.inscricao,
      nro_peito: this.data.detPlanilha.nro_peito,
      id_categoria: this.data.detPlanilha.id_categoria,
      status: this.data.detPlanilha.status,
      mensagem: this.data.detPlanilha.mensagem_erro
    });
  }

  setNoParam() {
    this.formulario.setValue({
      evento: this.data.detPlanilha.evento_descricao,
      cnpj_cpf: "",
      nome: "",
      sexo: "",
      data_nasc: "",
      inscricao: "",
      nro_peito: "",
      id_categoria: "",
      status: "",
      mensagem: ""
    });
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

  isReadOnly(): boolean {
    return (
      this.idAcao === CadastroAcoes.Consulta ||
      this.idAcao === CadastroAcoes.Exclusao
    );


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


  getAcoes() {
    return CadastroAcoes;
  }


  getLabelCancel() {
    if (this.idAcao == CadastroAcoes.Consulta) {
      return 'Voltar';
    } else {
      return 'Cancelar';
    }
  }


}
