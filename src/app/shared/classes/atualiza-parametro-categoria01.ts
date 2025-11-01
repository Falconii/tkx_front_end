import { ParametroCategoria01 } from "../../parametros/parametro-categoria01";


export function AtualizaParametroCategoria01(par : ParametroCategoria01 , config : JSON):ParametroCategoria01 {

    try {


        let key:number = 0;

        key = parseInt(Object(config).id, 10);

        if (isNaN(key)) {
          par.id = 0;
        } else {
          par.id = key;
        }

        if (Object(config).razao?.trim() !== '') {
          par.descricao = Object(config).razao;
        }

    return par;

  } catch(error){
       throw error
  }
}
