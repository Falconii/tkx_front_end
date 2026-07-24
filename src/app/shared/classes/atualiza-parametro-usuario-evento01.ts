import { ParametroEvento01 } from '../../parametros/parametro-evento01';
import { ParametroUsuario_Evento01 } from '../../parametros/parametro-usuario_evento01';

export function AtualizaParametroUsuarioEvento01(
  par: ParametroUsuario_Evento01,
  config: JSON,
): ParametroUsuario_Evento01 {
  try {
    let key: number = 0;

    key = parseInt(Object(config).id_evento, 10);

    if (isNaN(key)) {
      par.id_evento = 0;
    } else {
      par.id_evento = key;
    }


         if (Object(config).orderby?.trim() !== '') {
           par.orderby = Object(config).orderby;
         }
    return par;
  } catch (error) {
    throw error;
  }
}
