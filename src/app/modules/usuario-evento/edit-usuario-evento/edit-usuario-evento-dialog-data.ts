import { Usuario_EventoModel } from "../../../models/usuario_evento-model";
import { CadastroAcoes } from "../../../shared/classes/cadastro-acoes";

export class EditUsuarioEventoDialogData {
  public acao:CadastroAcoes = CadastroAcoes.None;
  public usuario:Usuario_EventoModel=new Usuario_EventoModel();
  public result:boolean = false;
}
