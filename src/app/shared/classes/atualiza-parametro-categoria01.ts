import { TipoPesquisa } from './tipo-pesquisa';
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
    // campo coringa "pesquisa": o filtro decide o tipo (so digitos = codigo; texto = descricao)
    const pesquisa = String(Object(config).pesquisa ?? '').trim();
    switch (parseInt(Object(config).pesquisarPor, 10)) {
      case TipoPesquisa.Codigo: {
        const key = parseInt(pesquisa, 10);
        par.id = isNaN(key) ? 0 : key;
        break;
      }
      case TipoPesquisa.Descricao:
        par.descricao = pesquisa;
        break;
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
