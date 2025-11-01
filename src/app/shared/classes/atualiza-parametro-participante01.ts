import { ParametroParticipante01 } from "../../parametros/parametro-participante01";



export function AtualizaParametroParticipante01(par : ParametroParticipante01, config : JSON):ParametroParticipante01 {

    try {

        let key:number = 0;

        key = parseInt(Object(config).id_empresa, 10);

        if (isNaN(key)) {
          par.id_empresa = 0;
        } else {
          par.id_empresa = key;
        }

       key = parseInt(Object(config).id_evento, 10);

        if (isNaN(key)) {
          par.id_evento = 0;
        } else {
          par.id_evento = key;
        }

        key = parseInt(Object(config).id_inscrito, 10);

        if (isNaN(key)) {
          par.id_inscrito = 0;
        } else {
          par.id_inscrito = key;
        }

         key = parseInt(Object(config).inscricao, 10);

        if (isNaN(key)) {
          par.inscricao = 0;
        } else {
          par.inscricao = key;
        }

        key = parseInt(Object(config).nro_peito, 10);

        if (isNaN(key)) {
          par.nro_peito = 0;
        } else {
          par.nro_peito = key;
        }

        key = parseInt(Object(config).id_categoria, 10);

        if (isNaN(key)) {
          par.id_categoria = 0;
        } else {
          par.id_categoria = key;
        }

        if (Object(config).evento_descricao?.trim() !== '') {
          par.evento_descricao = Object(config).evento_descricao;
        }
          if (Object(config).inscrito_nome?.trim() !== '') {
          par.inscrito_nome = Object(config).inscrito_nome;
        }
          if (Object(config).inscrito_cpf?.trim() !== '') {
          par.inscrito_cpf = Object(config).inscrito_cpf;
        }

        if (Object(config).categoria_descricao?.trim() !== '') {
          par.categoria_descricao = Object(config).categoria_descricao;
        }

        key = parseInt(Object(config).id_old_inscrito, 10);

        if (isNaN(key)) {
          par.id_old_inscrito = 0;
        } else {
          par.id_old_inscrito = key;
        }


    return par;

  } catch(error){
       throw error
  }
}
