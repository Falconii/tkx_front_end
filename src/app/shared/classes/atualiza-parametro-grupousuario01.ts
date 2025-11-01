import { ParametroGrupousuario01 } from "../../parametros/parametro-grupousuario01";


export function AtualizaParametroGrupousuario01(par : ParametroGrupousuario01 , config : JSON):ParametroGrupousuario01 {

    try {

        let key:number = 0;

        key = parseInt(Object(config).id, 10);

        if (isNaN(key)) {
          par.codigo = 0;
        } else {
          par.codigo = key;
        }

        if (Object(config).razao?.trim() !== '') {
          par.descricao = Object(config).descricao;
        }


    return par;

  } catch(error){
       throw error
  }
}
