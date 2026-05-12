import { TipoPesquisa } from './tipo-pesquisa';

import { ParametroUsuario01 } from '../../parametros/parametro-usuario01';

export function AtualizaParametroUsuario01(
  par: ParametroUsuario01,
  config: JSON,
): ParametroUsuario01 {
  try {
    console.log('config', config);

    let key: number = 0;

    const tipo = parseInt(Object(config).pesquisarPor, 10);

    console.log('Tipo de Pesquisa:', tipo);
    if (tipo !== TipoPesquisa.None) {
      switch (tipo) {
        case TipoPesquisa.Codigo:
          if (Object(config).pesquisa?.trim() !== '') {
            key = parseInt(Object(config).pesquisa, 10);

            if (isNaN(key)) {
              par.id = 0;
            } else {
              par.id = key;
            }
          }
          break;
        case TipoPesquisa.Cpf:
          if (Object(config).pesquisa?.trim() !== '') {
            par.cnpj_cpf = Object(config).pesquisa;
          }
          break;
        case TipoPesquisa.Nome:
          if (Object(config).pesquisa?.trim() !== '') {
            par.razao = Object(config).pesquisa;
          }
          break;
      }
    }

    key = parseInt(Object(config).grupo, 10);

    if (isNaN(key)) {
      par.grupo = 0;
    } else {
      par.grupo = key;
    }

    if (Object(config).orderby?.trim() !== '') {
      par.orderby = Object(config).orderby;
    }

    return par;
  } catch (error) {
    throw error;
  }
}
