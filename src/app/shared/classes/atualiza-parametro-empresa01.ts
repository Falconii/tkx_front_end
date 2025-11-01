import { ParametroEmpresa01 } from '../../parametros/parametro-empresa01';

export function AtualizaParametroEmpresa01(par : ParametroEmpresa01 , config : JSON):ParametroEmpresa01 {

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


    return par;

  } catch(error){
       throw error
  }
}
