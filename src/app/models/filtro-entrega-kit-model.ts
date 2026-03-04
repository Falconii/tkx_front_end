import { TipoPesquisa } from '../shared/classes/tipo-pesquisa';

export class FiltroEntregaKitModel {
  public pesquisarPor: TipoPesquisa = TipoPesquisa.None;
  public pesquisar: string = '';
  public kit: boolean = false;
}
