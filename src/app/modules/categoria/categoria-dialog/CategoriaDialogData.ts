import { CategoriaModel } from '../../../models/categoria-model';
import { CadastroAcoes } from '../../../shared/classes/cadastro-acoes';

export class CategoriaDialogData {
  public indice: number = 0;
  public processar: boolean = false;
  public opcao: CadastroAcoes = CadastroAcoes.Consulta;
  public categoria: CategoriaModel = new CategoriaModel();
}
