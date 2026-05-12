import { ParticipanteModel } from '../../../models/participante-model';
import { Participantev2Model } from '../../../models/participantev2-model';
import { CadastroAcoes } from '../../../shared/classes/cadastro-acoes';

export class ParticipanteV2DialogData {
  public indice: number = 0;
  public processar: boolean = false;
  public opcao: CadastroAcoes = CadastroAcoes.Consulta;
  public participante: Participantev2Model = new Participantev2Model();
}
