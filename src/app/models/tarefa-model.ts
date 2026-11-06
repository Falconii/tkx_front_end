import { SimNao } from '../shared/classes/sim-nao';

export class TarefaModel {
  public id_empresa: number = 0;
  public id: number = 0;
  public id_usuario: number = 0;
  public name_file: string = '';
  public sigla: string = '';
  /** nome amigável do relatório (preenchido pelo backend) */
  public titulo: string = '';
  public data_solicitacao: string = '';
  public data_conclusao: string = '';
  public status: string = '0';
  public mensagem: string = '';
}

/** status gravado pelo backend na tabela tarefas */
export const TarefaStatus = {
  PENDENTE: '0',
  PROCESSANDO: '1',
  CONCLUIDA: '2',
  ERRO: '3',
  SEM_DADOS: '4',
} as const;

/** situações para exibição e filtro */
export const TarefaSituacoes: SimNao[] = [
  new SimNao(TarefaStatus.PENDENTE, 'Na fila'),
  new SimNao(TarefaStatus.PROCESSANDO, 'Processando'),
  new SimNao(TarefaStatus.CONCLUIDA, 'Concluída'),
  new SimNao(TarefaStatus.ERRO, 'Com erro'),
  new SimNao(TarefaStatus.SEM_DADOS, 'Sem resultados'),
];

/** relatório disponível (GET tarefa/relatorios) */
export class RelatorioDisponivel {
  public sigla: string = '';
  public titulo: string = '';
}
