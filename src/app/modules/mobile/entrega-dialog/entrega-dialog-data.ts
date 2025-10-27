import { DadosModel } from "../../../models/dado-model";

export class EntregaDialogData {
  public processar: boolean = false;
  public dado   : DadosModel = new DadosModel("", "", "", 0, 0, "", "", "", "", "", "");
}
