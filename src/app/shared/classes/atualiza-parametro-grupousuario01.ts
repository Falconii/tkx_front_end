import { ParametroGrupousuario01 } from '../../parametros/parametro-grupousuario01';
import { TipoPesquisa } from './tipo-pesquisa';

export function AtualizaParametroGrupousuario01(
  par: ParametroGrupousuario01,
  config: JSON,
): ParametroGrupousuario01 {
  try {
    let key: number = 0;

    const tipo = parseInt(Object(config).pesquisarPor, 10);

    console.log('Tipo de Pesquisa:', tipo);
    if (tipo !== TipoPesquisa.None) {
      switch (tipo) {
        case TipoPesquisa.Codigo:
          if (Object(config).pesquisa?.trim() !== '') {
            key = parseInt(Object(config).pesquisa, 10);

            if (isNaN(key)) {
              par.codigo = 0;
            } else {
              par.codigo = key;
            }
          }
          break;
        case TipoPesquisa.Nome:
          if (Object(config).pesquisa?.trim() !== '') {
            par.descricao = Object(config).pesquisa;
          }
          break;
      }
    }

    if (Object(config).orderby?.trim() !== '') {
      par.orderby = Object(config).orderby;
    }

    return par;
  } catch (error) {
    throw error;
  }
}
