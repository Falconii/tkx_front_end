import { Entregav2Model } from '../../../models/entregav2-model';
import { Participantev2Model } from '../../../models/participantev2-model';

export class EntregaV2DialogData {
  public processar: boolean = false;
  public dado: Participantev2Model = new Participantev2Model();
  public entrega: Entregav2Model = new Entregav2Model();
}
