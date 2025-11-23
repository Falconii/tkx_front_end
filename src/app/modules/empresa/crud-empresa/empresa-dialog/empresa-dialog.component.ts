import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CadastroAcoes } from '../../../../shared/classes/cadastro-acoes';
import { EstadoService } from '../../../../shared/classes/EstadoService';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmpresaService } from '../../../../services/empresa.service';
import { GlobalService } from '../../../../services/global.service';
import { AppSnackbar } from '../../../../shared/classes/app-snackbar';
import { ValidatorCep } from '../../../../shared/Validators/validator-cep';
import { ValidatorCnpjCpf } from '../../../../shared/Validators/validator-Cnpj-Cpf';
import { ValidatorDate } from '../../../../shared/Validators/validator-date';
import { ValidatorStringLen } from '../../../../shared/Validators/validator-string-len';
import { EmpresaDialogData } from './EmpresaDialogData';
import { EmpresaModel } from '../../../../models/empresa-model';
import { EstadoModel } from '../../../../shared/classes/EstadoModel';

@Component({
  selector: 'app-empresa-dialog',
  templateUrl: './empresa-dialog.component.html',
  styleUrl: './empresa-dialog.component.scss',
})
export class EmpresaDialogComponent {
  formulario: FormGroup;

  ufs: EstadoModel[] = [];

  erro: any;

  acao: string = 'Sem Definição';

  idAcao: number = CadastroAcoes.Inclusao;

  readOnly: boolean = true;

  inscricaoGetEmpresa!: Subscription;
  inscricaoAcao!: Subscription;

  labelCadastro: string = '';

  estadoSrv: EstadoService = new EstadoService();

  cpfOuCnpjMask: string = '000.000.000-00';

  constructor(
    private formBuilder: FormBuilder,
    private empresaService: EmpresaService,
    private globalService: GlobalService,
    private appSnackBar: AppSnackbar,
    @Inject(MAT_DIALOG_DATA) public data: EmpresaDialogData,
    private dialogRef: MatDialogRef<EmpresaDialogComponent>
  ) {
    console.log('Empresa Dialog Constructor');
    this.formulario = formBuilder.group({
      id: [{ value: '', disabled: true }],
      razao: [{ value: '' }, [ValidatorStringLen(3, 40, true)]],
      cadastr: [{ value: '' }, [ValidatorDate(true)]],
      fantasi: [{ value: '' }, [ValidatorStringLen(3, 40, true)]],
      cnpj_cpf: [{ value: '' }, [ValidatorCnpjCpf(true)]],
      inscri: [{ value: '' }, [ValidatorStringLen(0, 20)]],
      ruaf: [{ value: '' }, [ValidatorStringLen(3, 80, true)]],
      nrof: [{ value: '' }, [ValidatorStringLen(1, 10, true)]],
      complementof: [{ value: '' }, [ValidatorStringLen(0, 30)]],
      bairrof: [{ value: '' }, [ValidatorStringLen(3, 40, true)]],
      cidadef: [{ value: '' }, [ValidatorStringLen(3, 40, true)]],
      uff: [{ value: '' }, [ValidatorStringLen(2, 2, true)]],
      uff_: [{ value: '' }],
      cepf: [{ value: '' }, [ValidatorCep(true)]],
      tel1: [{ value: '' }, [ValidatorStringLen(0, 23, true)]],
      tel2: [{ value: '' }, [ValidatorStringLen(0, 23)]],
      email: [{ value: '' }, [Validators.email, ValidatorStringLen(0, 100)]],
      obs: [{ value: '' }, [ValidatorStringLen(0, 200)]],
    });
    this.formulario.get('cnpj_cpf')?.valueChanges.subscribe((value) => {
      const digits = value?.replace(/\D/g, '') || '';
      this.cpfOuCnpjMask =
        digits.length > 11 ? '00.000.000/0000-00' : '000.000.000-00';
    });
    this.ufs = this.estadoSrv.getEstados();
    alert('teste');
  }

  ngOnInit(): void {
    console.log('Empresa Dialog OnInit');
    this.idAcao = this.data.opcao;
    this.setAcao(this.data.opcao);
    this.setValue();
  }

  ngOnDestroy(): void {
    this.inscricaoGetEmpresa?.unsubscribe();
    this.inscricaoAcao?.unsubscribe();
  }

  actionFunction() {
    if (this.formulario.valid) {
      this.executaAcao();
    } else {
      this.formulario.markAllAsTouched();
      this.appSnackBar.openSuccessSnackBar(
        `Formulário Com Campos Inválidos.`,
        'OK'
      );
    }
  }

  closeModal() {
    this.data.processar = true;
    this.dialogRef.close(this.data);
  }

  setValue() {
    this.formulario.setValue({
      id: this.data.empresa.id,
      razao: this.data.empresa.razao,
      cadastr: this.data.empresa.cadastr,
      cnpj_cpf: this.data.empresa.cnpj_cpf,
      inscri: this.data.empresa.inscri,
      fantasi: this.data.empresa.fantasi,
      ruaf: this.data.empresa.ruaf,
      nrof: this.data.empresa.nrof,
      complementof: this.data.empresa.complementof,
      bairrof: this.data.empresa.bairrof,
      cidadef: this.data.empresa.cidadef,
      uff: this.data.empresa.uff,
      uff_:
        this.idAcao == CadastroAcoes.Consulta ||
        this.idAcao == CadastroAcoes.Exclusao
          ? this.data.empresa.uff
          : '',
      cepf: this.data.empresa.cepf,
      tel1: this.data.empresa.tel1,
      tel2: this.data.empresa.tel2,
      email: this.data.empresa.email,
      obs: this.data.empresa.obs,
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
        this.labelCadastro = 'Empresas - Inclusão.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Edicao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Empresas - Alteração.';
        this.readOnly = false;
        break;
      case CadastroAcoes.Consulta:
        this.acao = 'Voltar';
        this.labelCadastro = 'Empresas - Consulta.';
        this.readOnly = true;
        break;
      case CadastroAcoes.Exclusao:
        this.acao = 'Excluir';
        this.labelCadastro = 'Empresas - Exclusão.';
        this.readOnly = true;
        break;
      case CadastroAcoes.Atualizacao:
        this.acao = 'Gravar';
        this.labelCadastro = 'Empresas - Atualização';
        this.readOnly = false;
        break;
      default:
        break;
    }
  }

  executaAcao() {
    this.data.empresa.cnpj_cpf = this.formulario.value.cnpj_cpf;
    this.data.empresa.razao = this.formulario.value.razao;
    this.data.empresa.fantasi = this.formulario.value.fantasi;
    this.data.empresa.inscri = this.formulario.value.inscri;
    this.data.empresa.cadastr = this.formulario.value.cadastr;
    this.data.empresa.ruaf = this.formulario.value.ruaf;
    this.data.empresa.nrof = this.formulario.value.nrof;
    this.data.empresa.complementof = this.formulario.value.complementof;
    this.data.empresa.bairrof = this.formulario.value.bairrof;
    this.data.empresa.cidadef = this.formulario.value.cidadef;
    this.data.empresa.uff = this.formulario.value.uff;
    this.data.empresa.cepf = this.formulario.value.cepf;
    this.data.empresa.tel1 = this.formulario.value.tel1;
    this.data.empresa.tel2 = this.formulario.value.tel2;
    this.data.empresa.email = this.formulario.value.email;
    this.data.empresa.obs = this.formulario.value.obs;
    //this.usuario.ativo = this.formulario.value.ativo
    switch (+this.idAcao) {
      case CadastroAcoes.Inclusao:
        this.data.empresa.user_insert = this.globalService.getEmpresa().id;
        this.inscricaoAcao = this.empresaService
          .empresaInsert(this.data.empresa)
          .subscribe({
            next: (data: any) => {
              this.appSnackBar.openSuccessSnackBar(
                `Empresa Incluida Com Sucesso !`,
                'OK'
              );
              this.data.empresa = data;
              this.getEmpresa(this.data.empresa);
            },
            error: (error: any) => {
              console.log('error =>', error);
              this.appSnackBar.openFailureSnackBar(
                `Erro Na Inclusão ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
                'OK'
              );
            },
          });
        break;
      case CadastroAcoes.Edicao:
        this.data.empresa.user_update = this.globalService.getEmpresa().id;
        this.inscricaoAcao = this.empresaService
          .empresaUpdate(this.data.empresa)
          .subscribe({
            next: (data: any) => {
              this.appSnackBar.openSuccessSnackBar(
                `Empresa Alterada Com Sucesso !`,
                'OK'
              );
              this.data.empresa = data;

              this.getEmpresa(this.data.empresa);
            },
            error: (error: any) => {
              this.appSnackBar.openFailureSnackBar(
                `Erro Na Alteração ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
                'OK'
              );
            },
          });
        break;
      case CadastroAcoes.Atualizacao:
        this.data.empresa.user_update = this.globalService.getEmpresa().id;
        this.inscricaoAcao = this.empresaService
          .empresaUpdate(this.data.empresa)
          .subscribe({
            next: (data: any) => {
              this.appSnackBar.openSuccessSnackBar(
                `Empresa Alterado Com Sucesso !`,
                'OK'
              );
              this.data.empresa = data;
              this.getEmpresa(this.data.empresa);
            },
            error: (error: any) => {
              this.appSnackBar.openFailureSnackBar(
                `Erro Na Alteração ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
                'OK'
              );
            },
          });
        break;
      case CadastroAcoes.Exclusao:
        this.inscricaoAcao = this.empresaService
          .empresaDelete(this.data.empresa.id)
          .subscribe({
            next: (data: any) => {
              this.appSnackBar.openSuccessSnackBar(
                `Empresa Excluida Com Sucesso !`,
                'OK'
              );
              this.data.empresa = data;
              this.closeModal();
            },
            error: (error: any) => {
              this.appSnackBar.openFailureSnackBar(
                `Erro Na Inclusão ${error.error.tabela} - ${error.error.erro} - ${error.error.message}`,
                'OK'
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

  getEmpresa(empresa: EmpresaModel) {
    this.inscricaoGetEmpresa = this.empresaService
      .getEmpresa(empresa.id!)
      .subscribe({
        next: (data: EmpresaModel) => {
          this.data.empresa = data;
          this.closeModal();
        },
        error: (error: any) => {
          this.appSnackBar.openFailureSnackBar(
            `Problemas na Consulta Da Empresa '`,
            'OK'
          );
          this.closeModal;
        },
      });
  }
}
