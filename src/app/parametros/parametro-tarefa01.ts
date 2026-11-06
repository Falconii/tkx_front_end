/**
 * Parâmetros da pesquisa de tarefas (tela de acompanhamento).
 * id_empresa e id_usuario NÃO são enviados: o backend sempre usa os do usuário logado.
 */
export class ParametroTarefa01 {
  public status: string = '';
  public sigla: string = '';
  public pagina: number = 0;
  public tamPagina: number = 50;
  public contador: string = 'N';
  public orderby: string = '';
  public sharp: boolean = false;
}
