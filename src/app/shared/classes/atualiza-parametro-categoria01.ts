import { ParametroCategoria01 } from '../../parametros/parametro-categoria01';

/**
 * Converte a configuração do filtro (tudo texto) no parâmetro tipado da consulta de categorias.
 * Valores neutros: id 0 e descricao '' = sem filtro.
 */
export function AtualizaParametroCategoria01(
  par: ParametroCategoria01,
  config: JSON,
): ParametroCategoria01 {
  try {
    const key = parseInt(Object(config).id, 10);
    par.id = isNaN(key) ? 0 : key;

    const descricao = Object(config).descricao;
    if (typeof descricao === 'string' && descricao.trim() !== '') {
      par.descricao = descricao.trim();
    }

    const orderby = Object(config).orderby;
    if (typeof orderby === 'string' && orderby.trim() !== '') {
      par.orderby = orderby;
    }

    return par;
  } catch (error) {
    throw error;
  }
}
