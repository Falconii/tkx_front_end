import { EmpresaModel } from "../../../../models/empresa-model";
import { CadastroAcoes } from "../../../../shared/classes/cadastro-acoes";

export class EmpresaDialogData {
 public processar: boolean = false;
  public opcao: CadastroAcoes = CadastroAcoes.Consulta;
  public empresa: EmpresaModel = new EmpresaModel();
}
