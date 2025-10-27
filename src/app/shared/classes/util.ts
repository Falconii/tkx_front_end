export function DataYYYYMMDD(value: Date): string {
  let d: Date = new Date(value),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

export function DataDDMMYYYY(value: Date): string {
  let d: Date = new Date(value),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [day, month, year].join('/');
}

/*
exports Date.prototype.yyyymmdd = function() {
  var mm = this.getMonth() + 1; // getMonth() is zero-based
  var dd = this.getDate();

  return [this.getFullYear(),
          (mm>9 ? '' : '0') + mm,
          (dd>9 ? '' : '0') + dd
         ].join('');
};

*/
export function DataYYYYMMDDTHHMMSSZ(value: Date): string {
  let d: Date = new Date(value),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = '' + d.getFullYear(),
    hora = '' + d.getHours(),
    min = '' + d.getMinutes(),
    seg = '' + d.getSeconds();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  if (hora.length < 2) hora = '0' + hora;
  if (min.length < 2) min = '0' + min;
  if (seg.length < 2) seg = '0' + seg;
  return (
    [year, month, day].join('-') + 'T' + [hora, min, seg].join(':') + '.000Z'
  );
}

export function nextCode(value: string): string {
  let base: string = value.substring(0, 3);
  let chave: string = value.substring(3);
  let nro: number = 0;
  let retorno = '';
  try {
    nro = parseInt(chave) + 1;
    retorno = '000' + nro.toString();
    retorno = retorno.substring(retorno.length - 3);
    retorno = base + retorno;
  } catch (err) {
    console.log('Problemas Com Chave', value);
  }

  return retorno;
}

export class MensagensBotoes {
  static incluir: string = 'Novo Registro';
  static alterar: string = 'Alterar Registro';
  static consultar: string = 'Consultar registro';
  static foto: string = 'Visualizar Fotos';
  static excluir: string = 'Excluir Registro';
  static tarefas_incluir = 'Manutenção Das Tarefas';
  static trabalhos_incluir = 'Manutenção Dos Trabalhos';
  static planejamentos_manutencao = 'Manutenção Dos Planejamentos';
  static sub_conta = 'Acesso As SubContas.';
  static financeiro = 'Financeiro';
  static multi_edicao = 'Alteração Em Lote';
}

export function adicionaZero(numero: number) {
  if (numero <= 9) return '0' + numero;
  else return '' + numero;
}

export function formatarData(date: any): string {
  if (date == null) {
    return '';
  }

  if (typeof date === 'string') {
    return date;
  } else {
    let data = new Date(date);
    return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  }
}

export function formatDateHour(date: Date) {
  return date;
}

export function hhmm(minutos: number): string {
  const str = (minutos / 60).toString();

  const parte = str.split('.');

  const horas = parseInt(parte[0]);

  const min = minutos - horas * 60;

  let hora = '' + horas.toString();

  let minu = '' + min.toString();

  if (hora.length < 2) hora = '0' + hora;

  if (minu.length < 2) minu = '0' + minu;

  return hora + ':' + minu;
}

export function minutostostohorasexagenal(minutos: number): number {
  const str = (minutos / 60).toString();

  const parte = str.split('.');

  const horas = parseInt(parte[0]);

  let min = minutos - horas * 60;

  min = Number.parseInt((min * 1.67).toFixed(0)) / 100;

  return horas + min;
}

export function horahexa(value: number): string {
  let numero: string = Number(value).toFixed(2);
  let horas: string = numero.substring(0, numero.indexOf('.'));
  let minutos: string = numero.substring(numero.indexOf('.') + 1);
  minutos = '00' + (Number.parseInt(minutos) / 1.67).toFixed(0).trim();
  minutos = minutos.substring(minutos.length - 2);
  if (minutos.length < 2) minutos = '0' + minutos;
  return horas + ':' + minutos;
}

export function setHorario(
  value: Date,
  horas: string,
  minutos: string
): string {
  let retorno: string = '';
  let dt = new Date(value);
  retorno = setDBtoAngularGMT(`${DataYYYYMMDD(dt)} ${horas}:${minutos}:00`);
  return retorno;
}

export function getHora(hora: string): string {
  let retorno: string = '00';
  retorno = hora.split(':')[0];
  return retorno;
}

export function getMinuto(hora: string): string {
  let retorno: string = '00';
  retorno = hora.split(':')[1];
  return retorno;
}

export function setDBtoAngular(value: string): string {
  let retorno = '';
  retorno = value.replace(' ', 'T') + '.000Z';
  return retorno;
}

export function setDBtoAngularGMT(value: string): string {
  let retorno = '';
  retorno = value + ' GMT-0300';
  return retorno;
}

export function ddmmaaaatoaaaammdd(dt: string): string {
  var data = dt.split('/');

  return [data[2], data[1], data[0]].join('-');
}

export function aaaammddddmmaaaa(dt: string): string {
  var data = dt.substring(0, 10).split('-');

  return [data[2], data[1], data[0]].join('/');
}

export function getFirstName(value: string): string {
  const nomes = value.split(' ');
  return nomes[0];
}

export function messageError(value: any): string {
  var retorno = '';
  if (value.name == 'HttpErrorResponse' && value.tabela === 'undefined') {
    retorno += ` ${value.message}\n${value.url} `;
  } else {
    if (!(typeof value.error === 'undefined')) {
      retorno += `${value.error.message} `;
    } else {
      if (!(typeof value.tabela === 'undefined')) {
        retorno += `${value.tabela} `;
      }

      if (!(typeof value.erro === 'undefined')) {
        retorno += `${value.erro} `;
      }

      if (!(typeof value.message === 'undefined')) {
        retorno += `${value.message} `;
      }
    }
  }
  if (retorno.length == 0) retorno = value;

  return retorno;
}

export function getfirstName(name: string): string {
  return getFirstName(name);
}

export function getSituacoesProjeto(): SituacaoProjeto[] {
  const retorno: SituacaoProjeto[] = [];
  retorno.push(new SituacaoProjeto(-1, 'TODAS'));
  retorno.push(new SituacaoProjeto(0, 'Proposta'));
  retorno.push(new SituacaoProjeto(1, 'Em Aberto'));
  retorno.push(new SituacaoProjeto(2, 'Em Andamento'));
  retorno.push(new SituacaoProjeto(3, 'Encerrado'));
  retorno.push(new SituacaoProjeto(4, 'Suspenso'));
  retorno.push(new SituacaoProjeto(5, 'Cancelado'));
  return retorno;
}

export class SituacaoProjeto {
  public idx: number = 0;
  public descricao: string = '';

  constructor(idx: number, descricao: string) {
    this.idx = idx;
    this.descricao = descricao;
  }
}

export function GetValueJsonNumber(obj: JSON, tag: string): number {
  const retorno = Object(obj)[tag];
  return retorno;
}

export function GetValueJsonString(obj: JSON, tag: string): string {
  const retorno = Object(obj)[tag];
  return retorno;
}

export function GetValueJsonStringArray(obj: JSON, tag: string): string[] {
  const retorno = Object(obj)[tag];
  return retorno;
}

export function GetValueJsonBoolean(obj: JSON, tag: string): boolean {
  const retorno = Object(obj)[tag];
  return retorno;
}


export function ConvertNumberToInt(value:string): number {
  let key = parseInt(value, 10);
    if (isNaN(key)) {
       return  0;
    } else {
       return  key;
    }
}

