import { TipoPesquisa } from './tipo-pesquisa';
import { hasNonNumeric } from '../classes/util';

export class Pesquisa {
  constructor() {}

  definirPesquisa(texto: string): TipoPesquisa {
    if (texto.trim().length == 0) {
      return TipoPesquisa.None;
    }
    const isTexto = hasNonNumeric(texto);

    if (isTexto) {
      return TipoPesquisa.Nome;
    }
    if (texto.trim().length <= 9) {
      return TipoPesquisa.Codigo;
    }
    return TipoPesquisa.Cpf;
  }

  getTextoTipoPesquisa(value: TipoPesquisa = TipoPesquisa.None): string {
    switch (value) {
      case TipoPesquisa.Codigo:
        return 'Pelo Código';

      case TipoPesquisa.Nome:
        return 'Pelo Nome';

      case TipoPesquisa.Cpf:
        return 'Pelo CPF';

      case TipoPesquisa.Inscricao:
        return 'Pela Incrição';

      case TipoPesquisa.Nro_Peito:
        return 'Pelo Nº Do Peito';

      default:
        return '';
    }
  }
}
