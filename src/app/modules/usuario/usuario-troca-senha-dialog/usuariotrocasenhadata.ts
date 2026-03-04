import { UsuarioModel } from '../../../models/usuario-model';
import { CadastroAcoes } from '../../../shared/classes/cadastro-acoes';

export class Usuariotrocasenhadata {
  public processar: boolean = false;
  public trocasenha: boolean = false;
  public erro: boolean = false;
  public cancelar: boolean = false;
  public opcao: CadastroAcoes = CadastroAcoes.Consulta;
  public usuario: UsuarioModel = new UsuarioModel();
}
