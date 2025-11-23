import { GrupousuarioModel } from "../../../../models/grupousuario-model";
import { CadastroAcoes } from "../../../../shared/classes/cadastro-acoes";

export class GrupoUsuarioDialogData {
 public processar: boolean = false;
  public opcao: CadastroAcoes = CadastroAcoes.Consulta;
  public grupoUsuario:GrupousuarioModel = new GrupousuarioModel();
}
