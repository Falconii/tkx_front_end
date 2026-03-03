import { EntregaModel } from '../../../models/entrega-model';
import { ParticipanteModel } from './../../../models/participante-model';

export class EntregaDialogData {
  public processar: boolean = false;
  public dado: ParticipanteModel = new ParticipanteModel();
  public entrega: EntregaModel = new EntregaModel();
}
