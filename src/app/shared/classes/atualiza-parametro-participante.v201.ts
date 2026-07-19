import { Pesquisa } from './Pesquisa';
import { ParametroParticipante01 } from '../../parametros/parametro-participante01';
import { ParametroParticipantev201 } from '../../parametros/parametro-participantev201';
import { TipoPesquisa } from './tipo-pesquisa';

export function AtualizaParametroParticipantev201(
  par: ParametroParticipantev201,
  config: JSON,
): ParametroParticipantev201 {
  try {
    let key: number = 0;

    const tipo = parseInt(Object(config).pesquisarPor, 10);

    switch (tipo) {
      case TipoPesquisa.Nome:
        par.nome = Object(config).pesquisa;
        break;

      case TipoPesquisa.Cpf:
        par.cnpj_cpf = Object(config).pesquisa;
        break;

      case TipoPesquisa.Inscricao:

        key = parseInt(Object(config).pesquisa, 10);

        if (isNaN(key)) {
          par.inscricao = -1;
        } else {
          par.inscricao = key;
        }
        break;

      case TipoPesquisa.Nro_Peito:
        key = parseInt(Object(config).pesquisa, 10);
        if (isNaN(key)) {
          par.nro_peito = -1;
        } else {
          par.nro_peito = key;
        }

        break;
    }

    key = parseInt(Object(config).id_evento, 10);

    if (isNaN(key)) {
      par.id_evento = 0;
    } else {
      par.id_evento = key;
    }

    key = parseInt(Object(config).id, 10);

    if (isNaN(key)) {
      par.id = 0;
    } else {
      par.id = key;
    }
    key = parseInt(Object(config).id_categoria, 10);

    if (isNaN(key)) {
      par.id_categoria = 0;
    } else {
      par.id_categoria = key;
    }

    if (Object(config).orderby?.trim() !== '') {
      par.orderby = Object(config).orderby;
    }

    return par;
  } catch (error) {
    throw error;
  }
}
