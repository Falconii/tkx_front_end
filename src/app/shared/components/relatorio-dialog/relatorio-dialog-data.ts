export type FinalizacaoRelatorio = 'email' | 'download';

export class RelatorioDialogData {
  public titulo: string = 'Relatório';
  /** sigla do relatório no backend (excel/relatorios.js), ex.: 'evento01' */
  public sigla: string = '';
  public finalizacao: FinalizacaoRelatorio = 'download';
  public destinatario: string = '';
  /** 'T' = toda a consulta | 'P' = página atual */
  public escopo: string = 'T';
  public labelBottonSim: string = 'Processar';
  public labelBottomNao: string = 'Cancelar';
  /** página que o usuário está vendo (usada no escopo 'P') */
  public pagina: number = 1;
  public tamPagina: number = 50;
  /**
   * Parâmetros de consulta JÁ TIPADOS (o mesmo objeto que a listagem envia, ex.:
   * ParametroEvento01 montado com AtualizaParametroEvento01). O diálogo só aplica o
   * escopo: pagina = 0 (toda a consulta) ou a página atual.
   */
  public parametros: object = {};
}
