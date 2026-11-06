import { ParametroTarefa01 } from '../../parametros/parametro-tarefa01';

/**
 * Converte a configuração do filtro (tudo texto) no parâmetro tipado da pesquisa de tarefas.
 * Valores neutros: status '' e sigla '' = sem filtro.
 */
export function AtualizaParametroTarefa01(
  par: ParametroTarefa01,
  config: JSON,
): ParametroTarefa01 {
  const texto = (v: any): string => (typeof v === 'string' ? v.trim() : '');

  par.status = texto(Object(config).status);
  par.sigla = texto(Object(config).sigla);

  const orderby = texto(Object(config).orderby);
  if (orderby !== '') par.orderby = orderby;

  return par;
}
