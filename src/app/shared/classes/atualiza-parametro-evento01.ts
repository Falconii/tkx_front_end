import { ParametroEvento01 } from "../../parametros/parametro-evento01";


export function AtualizaParametroEvento01(par : ParametroEvento01, config : JSON):ParametroEvento01 {

    try {

        let key:number = 0;

        key = parseInt(Object(config).id_empresa, 10);

        if (isNaN(key)) {
          par.id_empresa = 0;
        } else {
          par.id_empresa = key;
        }

       key = parseInt(Object(config).id, 10);

        if (isNaN(key)) {
          par.id = 0;
        } else {
          par.id = key;
        }


        if (Object(config).descricao?.trim() !== '') {
          par.descricao = Object(config).descricao;
        }

        key = parseInt(Object(config).id_responsavel, 10);

        if (isNaN(key)) {
          par.id_responsavel = 0;
        } else {
          par.id_responsavel = key;
        }

        if (Object(config).status?.trim() !== '') {
          par.status = Object(config).status;
        }


    return par;

  } catch(error){
       throw error
  }
}
