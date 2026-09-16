import { Entregav2Model } from '../../../models/entregav2-model';
import { Participantev2Model } from '../../../models/participantev2-model';

export class EntregaV2DialogData {
  public processar: boolean = false;
  public index:number = 0;
  public participantev2: Participantev2Model = new Participantev2Model();
  public entregav2: Entregav2Model = new Entregav2Model();
}
