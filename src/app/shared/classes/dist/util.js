"use strict";
exports.__esModule = true;
exports.isTokenExpired = exports.getPayloadData = exports.hasNonNumeric = exports.ConvertNumberToInt = exports.GetValueJsonBoolean = exports.GetValueJsonStringArray = exports.GetValueJsonString = exports.GetValueJsonNumber = exports.SituacaoProjeto = exports.getSituacoesProjeto = exports.getfirstName = exports.messageError = exports.getFirstName = exports.aaaammddddmmaaaa = exports.ddmmaaaatoaaaammdd = exports.setDBtoAngularGMT = exports.setDBtoAngular = exports.getMinuto = exports.getHora = exports.setHorario = exports.horahexa = exports.minutostostohorasexagenal = exports.hhmm = exports.formatDateHour = exports.formatarData = exports.adicionaZero = exports.MensagensBotoes = exports.nextCode = exports.DataYYYYMMDDTHHMMSSZ = exports.DataDDMMYYYY = exports.DataYYYYMMDD = void 0;
var payload_model_1 = require("../../models/payload-model");
var jwt_decode_1 = require("jwt-decode");
function DataYYYYMMDD(value) {
    var d = new Date(value), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    return [year, month, day].join('-');
}
exports.DataYYYYMMDD = DataYYYYMMDD;
function DataDDMMYYYY(value) {
    var d = new Date(value), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = d.getFullYear();
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    return [day, month, year].join('/');
}
exports.DataDDMMYYYY = DataDDMMYYYY;
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
function DataYYYYMMDDTHHMMSSZ(value) {
    var d = new Date(value), month = '' + (d.getMonth() + 1), day = '' + d.getDate(), year = '' + d.getFullYear(), hora = '' + d.getHours(), min = '' + d.getMinutes(), seg = '' + d.getSeconds();
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    if (hora.length < 2)
        hora = '0' + hora;
    if (min.length < 2)
        min = '0' + min;
    if (seg.length < 2)
        seg = '0' + seg;
    return ([year, month, day].join('-') + 'T' + [hora, min, seg].join(':') + '.000Z');
}
exports.DataYYYYMMDDTHHMMSSZ = DataYYYYMMDDTHHMMSSZ;
function nextCode(value) {
    var base = value.substring(0, 3);
    var chave = value.substring(3);
    var nro = 0;
    var retorno = '';
    try {
        nro = parseInt(chave) + 1;
        retorno = '000' + nro.toString();
        retorno = retorno.substring(retorno.length - 3);
        retorno = base + retorno;
    }
    catch (err) {
        console.log('Problemas Com Chave', value);
    }
    return retorno;
}
exports.nextCode = nextCode;
var MensagensBotoes = /** @class */ (function () {
    function MensagensBotoes() {
    }
    MensagensBotoes.incluir = 'Novo Registro';
    MensagensBotoes.alterar = 'Alterar Registro';
    MensagensBotoes.consultar = 'Consultar registro';
    MensagensBotoes.foto = 'Visualizar Fotos';
    MensagensBotoes.excluir = 'Excluir Registro';
    MensagensBotoes.tarefas_incluir = 'Manutenção Das Tarefas';
    MensagensBotoes.trabalhos_incluir = 'Manutenção Dos Trabalhos';
    MensagensBotoes.planejamentos_manutencao = 'Manutenção Dos Planejamentos';
    MensagensBotoes.sub_conta = 'Acesso As SubContas.';
    MensagensBotoes.financeiro = 'Financeiro';
    MensagensBotoes.multi_edicao = 'Alteração Em Lote';
    MensagensBotoes.kit = 'Kits';
    MensagensBotoes.processar = 'Processamento';
    MensagensBotoes.liberar = 'Liberar Evento';
    MensagensBotoes.ativar = 'Ativar Evento';
    MensagensBotoes.encerrar = 'Encerrar Evento';
    MensagensBotoes.zerar_senha = 'Zerar Senha';
    MensagensBotoes.ativar_inativar = 'Ativar/Inativar';
    MensagensBotoes.standby = 'StandBy';
    MensagensBotoes.resumo_evento = 'Resumo Do Evento';
    MensagensBotoes.trocar_situacao_evento = 'Trocar Situação Evento';
    return MensagensBotoes;
}());
exports.MensagensBotoes = MensagensBotoes;
function adicionaZero(numero) {
    if (numero <= 9)
        return '0' + numero;
    else
        return '' + numero;
}
exports.adicionaZero = adicionaZero;
function formatarData(date) {
    if (date == null) {
        return '';
    }
    if (typeof date === 'string') {
        return date;
    }
    else {
        var data = new Date(date);
        return data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    }
}
exports.formatarData = formatarData;
function formatDateHour(date) {
    return date;
}
exports.formatDateHour = formatDateHour;
function hhmm(minutos) {
    var str = (minutos / 60).toString();
    var parte = str.split('.');
    var horas = parseInt(parte[0]);
    var min = minutos - horas * 60;
    var hora = '' + horas.toString();
    var minu = '' + min.toString();
    if (hora.length < 2)
        hora = '0' + hora;
    if (minu.length < 2)
        minu = '0' + minu;
    return hora + ':' + minu;
}
exports.hhmm = hhmm;
function minutostostohorasexagenal(minutos) {
    var str = (minutos / 60).toString();
    var parte = str.split('.');
    var horas = parseInt(parte[0]);
    var min = minutos - horas * 60;
    min = Number.parseInt((min * 1.67).toFixed(0)) / 100;
    return horas + min;
}
exports.minutostostohorasexagenal = minutostostohorasexagenal;
function horahexa(value) {
    var numero = Number(value).toFixed(2);
    var horas = numero.substring(0, numero.indexOf('.'));
    var minutos = numero.substring(numero.indexOf('.') + 1);
    minutos = '00' + (Number.parseInt(minutos) / 1.67).toFixed(0).trim();
    minutos = minutos.substring(minutos.length - 2);
    if (minutos.length < 2)
        minutos = '0' + minutos;
    return horas + ':' + minutos;
}
exports.horahexa = horahexa;
function setHorario(value, horas, minutos) {
    var retorno = '';
    var dt = new Date(value);
    retorno = setDBtoAngularGMT(DataYYYYMMDD(dt) + " " + horas + ":" + minutos + ":00");
    return retorno;
}
exports.setHorario = setHorario;
function getHora(hora) {
    var retorno = '00';
    retorno = hora.split(':')[0];
    return retorno;
}
exports.getHora = getHora;
function getMinuto(hora) {
    var retorno = '00';
    retorno = hora.split(':')[1];
    return retorno;
}
exports.getMinuto = getMinuto;
function setDBtoAngular(value) {
    var retorno = '';
    retorno = value.replace(' ', 'T') + '.000Z';
    return retorno;
}
exports.setDBtoAngular = setDBtoAngular;
function setDBtoAngularGMT(value) {
    var retorno = '';
    retorno = value + ' GMT-0300';
    return retorno;
}
exports.setDBtoAngularGMT = setDBtoAngularGMT;
function ddmmaaaatoaaaammdd(dt) {
    var data = dt.split('/');
    return [data[2], data[1], data[0]].join('-');
}
exports.ddmmaaaatoaaaammdd = ddmmaaaatoaaaammdd;
function aaaammddddmmaaaa(dt) {
    var data = dt.substring(0, 10).split('-');
    return [data[2], data[1], data[0]].join('/');
}
exports.aaaammddddmmaaaa = aaaammddddmmaaaa;
function getFirstName(value) {
    var nomes = value.split(' ');
    return nomes[0];
}
exports.getFirstName = getFirstName;
function messageError(value) {
    var retorno = '';
    if (value.name == 'HttpErrorResponse' && value.tabela === 'undefined') {
        retorno += " " + value.message + "\n" + value.url + " ";
    }
    else {
        if (!(typeof value.error === 'undefined')) {
            retorno += value.error.message + " ";
        }
        else {
            if (!(typeof value.tabela === 'undefined')) {
                retorno += value.tabela + " ";
            }
            if (!(typeof value.erro === 'undefined')) {
                retorno += value.erro + " ";
            }
            if (!(typeof value.message === 'undefined')) {
                retorno += value.message + " ";
            }
        }
    }
    if (retorno.length == 0)
        retorno = value;
    return retorno;
}
exports.messageError = messageError;
function getfirstName(name) {
    return getFirstName(name);
}
exports.getfirstName = getfirstName;
function getSituacoesProjeto() {
    var retorno = [];
    retorno.push(new SituacaoProjeto(-1, 'TODAS'));
    retorno.push(new SituacaoProjeto(0, 'Proposta'));
    retorno.push(new SituacaoProjeto(1, 'Em Aberto'));
    retorno.push(new SituacaoProjeto(2, 'Em Andamento'));
    retorno.push(new SituacaoProjeto(3, 'Encerrado'));
    retorno.push(new SituacaoProjeto(4, 'Suspenso'));
    retorno.push(new SituacaoProjeto(5, 'Cancelado'));
    return retorno;
}
exports.getSituacoesProjeto = getSituacoesProjeto;
var SituacaoProjeto = /** @class */ (function () {
    function SituacaoProjeto(idx, descricao) {
        this.idx = 0;
        this.descricao = '';
        this.idx = idx;
        this.descricao = descricao;
    }
    return SituacaoProjeto;
}());
exports.SituacaoProjeto = SituacaoProjeto;
function GetValueJsonNumber(obj, tag) {
    var retorno = Object(obj)[tag];
    return retorno;
}
exports.GetValueJsonNumber = GetValueJsonNumber;
function GetValueJsonString(obj, tag) {
    var retorno = Object(obj)[tag];
    return retorno;
}
exports.GetValueJsonString = GetValueJsonString;
function GetValueJsonStringArray(obj, tag) {
    var retorno = Object(obj)[tag];
    return retorno;
}
exports.GetValueJsonStringArray = GetValueJsonStringArray;
function GetValueJsonBoolean(obj, tag) {
    var retorno = Object(obj)[tag];
    return retorno;
}
exports.GetValueJsonBoolean = GetValueJsonBoolean;
function ConvertNumberToInt(value) {
    var key = parseInt(value, 10);
    if (isNaN(key)) {
        return 0;
    }
    else {
        return key;
    }
}
exports.ConvertNumberToInt = ConvertNumberToInt;
function hasNonNumeric(value) {
    return /\D/.test(value);
}
exports.hasNonNumeric = hasNonNumeric;
function getPayloadData(token) {
    try {
        var payloadBase64 = token.split('.')[1];
        var payloadJson = atob(payloadBase64);
        var payload = JSON.parse(payloadJson);
        var retorno = new payload_model_1.PayLoadModel();
        retorno.id_empresa = payload.id_empresa;
        retorno.id_usuario = payload.id_usuario;
        return retorno;
    }
    catch (error) {
        console.error('Erro ao decodificar o token:', error);
        return null;
    }
}
exports.getPayloadData = getPayloadData;
function isTokenExpired(token) {
    try {
        var decoded = jwt_decode_1.jwtDecode(token);
        if (!decoded.exp) {
            return true; // token sem exp é considerado inválido
        }
        var now = Math.floor(Date.now() / 1000); // agora em segundos
        return decoded.exp < now; // true = expirado
    }
    catch (e) {
        return true; // token inválido ou malformado
    }
}
exports.isTokenExpired = isTokenExpired;
