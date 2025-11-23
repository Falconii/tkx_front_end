import { EventoModel } from '../../../models/evento-model';
import { CadastroAcoes } from '../../../shared/classes/cadastro-acoes';

export class EventoDialogData {
  public processar: boolean = false;
  public opcao: CadastroAcoes = CadastroAcoes.Consulta;
  public evento: EventoModel = new EventoModel();
}
