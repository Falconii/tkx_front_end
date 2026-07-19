import { ParametroDetplanilha01 } from "../../parametros/parametro-detPlanilha01";
import { TipoPesquisa } from "./tipo-pesquisa";

export function AtualizaParametroDetplanilha01(par: ParametroDetplanilha01, config: JSON): ParametroDetplanilha01
  {

     try {
        let key: number = 0;

       key = parseInt(Object(config).id_evento, 10);

       if (isNaN(key)) {
         par.id_evento = 0;
       } else {
         par.id_evento = key;
       }

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


       key = parseInt(Object(config).status, 10);

        if (isNaN(key)) {
          par.status = -1;
        } else {
          par.status = key;
        }

        if (Object(config).orderby?.trim() !== '') {
          par.orderby = Object(config).orderby;
        }

        return par;
      } catch (error) {
        throw error;
      }
  }

