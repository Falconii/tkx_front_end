import { ParametroCabplanilha01 } from '../../parametros/parametro-cabplanilha01';

export function AtualizaParametrocabEmpresa(
  par: ParametroCabplanilha01,
  config: JSON,
): ParametroCabplanilha01 {
  try {
    let key: number = 0;

    key = parseInt(Object(config).id, 10);

    if (isNaN(key)) {
      par.id = 0;
    } else {
      par.id = key;
    }

    key = parseInt(Object(config).id_evento, 10);

    if (isNaN(key)) {
      par.id_evento = 0;
    } else {
      par.id_evento = key;
    }

    if (Object(config).arquivo?.trim() !== '') {
      par.arquivo = Object(config).arquivo;
    }

    if (Object(config).orderby?.trim() !== '') {
      par.orderby = Object(config).orderby;
    }

    return par;
  } catch (error) {
    throw error;
  }
}
