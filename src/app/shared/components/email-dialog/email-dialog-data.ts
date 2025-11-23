import { ParametroModel } from "../../../models/parametro-model";

export class EmailDialogData {
  public titulo: string       = 'Atenção';
  public destinatario: string = '';
  public escopo:string        = 'T';
  public labelBottonSim       = 'SIM';
  public labelBottomNao       = 'NÃO';
  public resposta: string     = '';
  public id_empresa: number = 0;
  public id_evento: number = 0;
  public pagina:number = 0;
  public parametro:ParametroModel = new ParametroModel()
}
