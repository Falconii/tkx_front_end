export class ParametroModel {
  public id_empresa: number = 0;
  public modulo: string = '';
  public assinatura: string = '';
  public id_usuario: number = 0;
  public parametro: string = '';
  public user_insert: number = 0;
  public user_update: number = 0;

  public load(param:any){
    this.id_empresa	= param.id_empresa;
    this.modulo		= param.modulo	;
    this.assinatura	= param.assinatura;
    this.id_usuario	= param.id_usuario;
    this.parametro	= param.parametro;
    this.user_insert	= param.user_insert;
    this.user_update	= param.user_update;
  }

  public getParametro(): JSON {
    try {
      const retorno = JSON.parse(this.parametro);
      return retorno;
    } catch (error) {
      const retorno = JSON.parse(`{"mensagem":${error}}`);
      return retorno;
    }
  }

  public setParametro(value: JSON) {
    this.parametro = JSON.stringify(value);
  }
}
