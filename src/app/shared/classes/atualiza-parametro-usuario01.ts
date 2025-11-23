
import { ParametroUsuario01 } from "../../parametros/parametro-usuario01";

export function AtualizaParametroUsuario01(par : ParametroUsuario01, config : JSON):ParametroUsuario01 {

    try {

        let key:number = 0;

        key = parseInt(Object(config).id, 10);

        if (isNaN(key)) {
          par.id = 0;
        } else {
          par.id = key;
        }

        if (Object(config).razao?.trim() !== '') {
          par.razao = Object(config).razao;
        }

        if (Object(config).cnpj_cpf?.trim() !== '') {
          par.cnpj_cpf = Object(config).cnpj_cpf;
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

  } catch(error){
       throw error
  }
}
