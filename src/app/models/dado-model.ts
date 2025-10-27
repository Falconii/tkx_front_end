export class DadosModel {
public	evento_descricao	: string = ""	;
public	nome	: string = ""	;
public	cpf	:string = ""	;
public	inscricao	:number = 0	;
public	nro_peito	:number = 0	;
public	sexo	: string = ""	;
public	data_nasc	: string = ""	;
public	categoria_descricao	: string = ""	;
public	tam_camiseta	: string = ""	;
public	nome_retirada	: string = ""	;
public	rg_retirada	: string = ""	;


constructor(evento_descricao:string ,nome:string , cpf:string , inscricao:number , nro_peito:number , sexo:string , data_nasc:string , categoria_descricao:string , tam_camiseta:string , nome_retirada:string , rg_retirada:string ) {
  this.evento_descricao = evento_descricao;
  this.nome = nome;
  this.cpf = cpf;
  this.inscricao = inscricao;
  this.nro_peito = nro_peito;
  this.sexo = sexo;
  this.data_nasc = data_nasc;
  this.categoria_descricao = categoria_descricao;
  this.tam_camiseta = tam_camiseta;
  this.nome_retirada = nome_retirada;
  this.rg_retirada = rg_retirada;
}
}
