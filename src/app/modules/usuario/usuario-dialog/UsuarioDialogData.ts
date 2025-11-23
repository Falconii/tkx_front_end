import { UsuarioModel } from "../../../models/usuario-model";
import { CadastroAcoes } from "../../../shared/classes/cadastro-acoes";

export class UsuarioDialogData {
 public processar: boolean = false;
  public opcao: CadastroAcoes = CadastroAcoes.Consulta;
  public usuario: UsuarioModel = new UsuarioModel();
}
