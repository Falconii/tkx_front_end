import { CabplanilhaModel } from '../../../models/cabplanilha-model';

export class ProcessaPlanilhaDialogData {
  public processar: boolean = false;
  public planilha: CabplanilhaModel = new CabplanilhaModel();
}
