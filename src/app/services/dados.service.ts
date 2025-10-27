import { Injectable } from '@angular/core';
import { DadosModel } from '../models/dado-model';

@Injectable({
  providedIn: 'root'
})
export class DadosService {

lsDados:DadosModel[] = []

constructor() {
  this.loadDados();
  console.log("Passei pelo construtor do service");
 }

 getDados(): DadosModel[] {
  return this.lsDados;
 }

 setDadoRetirada(dados:DadosModel) {
  const index = this.lsDados.findIndex(dado => dado.nro_peito === dados.nro_peito);
  if (index !== -1) {
    this.lsDados[index] = dados;
  }
 }


loadDados() {
this.lsDados = [];
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','ELAINE MEDEIROS','12339535832',207355,5978,'FC','25083','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','CLARISSA SANCHES','27924693823',207357,6007,'FC','29236','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','LEILA COSTA','32366998848',207430,5992,'FC','30587','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','SARA REGINA SANTANA GARCÊS','39008316889',207475,5463,'FC','35522','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','KETLIN CRISTINA AMARO DA SILVA','34128526860',207476,1309,'FC','31728','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','SAMIRA GARCES','39008333899',207501,6285,'FC','34985','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','LEO THOMAZ','8850094876',207484,5028,'MC','21860','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','JOQUE MOTA CAFÉ','35480733877',209306,1171,'FC','32201','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','AGDA CARDOZO DE ANDRADE DE SOUZA','17897515869',207441,6133,'FC','27683','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','ALINNE SOLEDADE SOLCIA ANDRADE','39154705894',207461,6291,'FC','33272','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','ANNA FLAVIA MONTEIRO GONSALVES','52755200855',207561,9089,'FC','38643','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','LAURA VITTI CRUZ','37039157810',207569,5747,'FC','34564','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','NATÁLIA LIMA','47094243812',207572,5877,'FC','36081','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','ALESSANDRA THAIS AMORIN EBULIANI','47152459819',207590,5938,'FC','36297','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','FERNANDA PRADO','33830792875',207706,1299,'FC','31233','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','BRUNA RIBEIRO','40200522809',207734,5688,'FC','33468','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','MIRIÃ CARVALHO DA SILVA','47232221894',207751,6112,'FC','35736','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','GABRIELE TERRA CARDOSO','41491125845',207807,6259,'FC','33368','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','KELLY COSTA','19170037817',207818,5834,'FC','27092','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','ALINE ALMEIDA PINHEIRO','38257664898',207834,6315,'FC','33171','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','CAMILA RUFINI','22572526832',207839,1020,'FC','30096','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','CESAR FELIPE ASSARICCI BARBOSA','33558307801',207633,1221,'MC','33214','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','DAVID HENRIQUE ABE CUNHA','22801341878',207664,5305,'MC','31793','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','ALEXSANDER DINIZ','46384245892',207670,5775,'MC','35320','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','YORDANO RICARDO BLANCO MACHADO','24285553830',207841,1297,'MC','31531','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','MARISTELA CHAPARIM','47201686801',207855,1039,'FC','36561','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','ANA DÉBORA SOUZA AGUIAR','33477420870',207867,9009,'FC','33447','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','STHEFANI RODRIGUES','48721503842',207907,1388,'FC','36230','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','SARAH SOUZA DA SILVA','31694133842',207909,1382,'FC','31123','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','MAIELE CINTRA','3965259547',207918,1379,'FC','33490','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','KARINA SOARES','42079566890',207981,5815,'FC','33923','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','SILVANA DIAS','15479700812',207993,6098,'FC','26555','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','ANDRESSA CAMARINI','26920256878',208018,1389,'FC','28885','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','JULIANA RANDO','39465189820',208030,5314,'FC','34975','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','ISABELA DE OLIVEIRA ROMANO','47691335881',208042,6114,'FC','36694','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','RAQUEL CARVALHO','38081777806',208057,5286,'FC','33535','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','JOYCE ARAUJO','45385131806',208061,9087,'FC','35160','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','MARIANA FOREGATO','44387568801',208063,5466,'FC','35816','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','MILENE SALVIETI','27702387874',208091,9137,'FC','28411','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','EDIMILSON LUIS BEINOTTE','9549884512',207853,5367,'MC','24354','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','UEDERSON MORGADO','17888718809',207884,5581,'MC','27887','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','EDSON ZANCHETA','22575955807',207902,9014,'MC','34761','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','EDUARDO CARDOSO','34714532880',207908,6152,'MC','33659','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','CARLOS CALSA','19033499827',207941,1102,'MC','27142','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','VINÍCIUS LEMES','40957574851',208071,6132,'MC','33295','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','MURYLO CRUZ SIQUEIRA','49394041885',208079,1206,'MC','36897','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','MARCUS VINICIUS DUARTE AMARAL','39000292883',208089,5255,'MC','32865','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','DENISE PAES','50844570877',208123,1087,'FC','36662','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','CAMILA ANDRESSA','24483093886',208142,5284,'FC','37317','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','ALINE MARIA MARCHENTI DE MELLO','38326052825',208148,5169,'FC','32444','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','ARIANE BELTRAME MARTIM','27368583879',208196,5272,'FC','28830','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','GEOVANNA SANTOS','49490339806',208250,9114,'FC','35967','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','MARIANA SILVIA COQUEDA SILVA','58368448875',208259,1147,'FC','31343','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','JESSICA ALVES','43884138871',208279,5312,'FC','34269','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','MARIANA LEMES','22196761885',208315,9062,'FC','30353','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','BARBARA FELIX','50112386873',208319,5015,'FC','38336','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','DULCECLEIA ALVES CARDOSO','12943333808',208328,6280,'FC','25474','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','LEVI ROCCIA','25264259801',208194,5014,'MC','28564','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','LUIZ EDUARDO GIOVANELLI','10588341932',208202,5041,'MC','36034','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','JEFERSON MARQUES DA SILVA','22058166833',208254,6148,'MC','29485','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','RODRIGO DA SILVA','41597841862',208290,1300,'MC','33498','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','ALEXANDRE CAMILO ALVES ALVES','27922582846',208325,5342,'MC','28391','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','MARLENE CHIBIM','35289983856',208345,9024,'FC','25681','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','THAINARA DE PAULA SILVA','41444048899',208364,5698,'FC','34245','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','JUSSIMARA MATOS','31861028806',208407,9020,'FC','29529','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','ERIKA BARBOSA','21689175826',208425,5388,'FC','29257','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','LUCIANA FRANCISCA SERGIO SERGIO','21650629850',208432,9131,'FC','29305','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','CLARICE FERREIRA DE MORAIS','25864984884',208453,6072,'FC','26845','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','BEATRIZ SOUZA','50902549820',208461,5743,'FC','38275','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','ANA LIVIA ANDRADE JOAO','57853340893',208462,5188,'FC','36458','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','DAIONY DE CASTRO','26134893838',208464,5888,'FC','27580','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','VITÓRA DA CUNHA PICCOLI','36202768894',208469,6298,'FC','36824','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','EVA ESTEVES CANEDO','15660831842',208516,5078,'FC','25758','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','VIVIANE JUSTO','1663624925',208543,5401,'FC','27783','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','RAISSA FELIX','50112369863',208567,1064,'FC','37535','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','VANESSA SOARES','37322345843',208577,1058,'FC','32429','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','RITA DE CÁSSIA MARQUES LUGLIO DE FREITAS','22428963856',208583,9050,'FC','29913','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','RONYERTON CARVALHO','27256583818',208346,6019,'MC','29275','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','GILSON ALVES ROLEDO','10059704837',208378,5594,'MC','24819','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','HIDELBRANDO OLIVEIRA','10424019850',208380,6020,'MC','24301','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','SERGIO CORREA','41839828803',208413,5567,'MC','34120','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','VALMIR OLIVEIRA','15917902801',208508,9010,'MC','26902','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','LUIS FERNANDO DINI ROVEROTO','28756069804',208529,1348,'MC','29750','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','WILLIAM GALVAO','35955645888',208573,1209,'MC','32864','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','MONICA RIBEIRO','48524070889',208600,1353,'FC','36614','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','PRISCILLA SANTOS','40972546855',208622,5623,'FC','35703','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','ALDENICE FERREIRA MENDES','22204747807',208626,5750,'FC','30182','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','MARIA DE LURDES CORDEIRO','10635493888',208629,5139,'FC','26086','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','ADRIANA CRISTINA','25854397803',208645,5217,'FC','28679','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','JULIA MORCELI SANTOS','48222959824',208704,5427,'FC','45772','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','LARISSA MAESTRO','47403505808',208742,5343,'FC','38493','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','VANESSA ALENCAR DE MENESES MARQUES','28410139871',208777,6049,'FC','29800','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','AMANDA PRADO','36162343871',208806,5142,'FC','32395','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','SILVANA TEZUKA','10585245851',208808,6328,'FC','24955','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','ANGELICA  FERREIRA DA SILVA GONCALVES','35533655875',208810,9093,'FC','31989','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','SUZANA TEZUKA','47330697826',208820,5538,'FC','37775','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','CARLA CORRER MARDEGAM','16786846866',208823,1346,'FC','26998','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','SEBASTIÃO ARAUJO NASCIMENTO','31571653805',208605,6371,'MC','30698','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','CAIO DE MELO NOGUEIRA QUEIROZ','36479688899',208791,5861,'MC','32139','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','SERGIO ARDIANI','9578616805',208804,6048,'MC','24437','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','ROGÉRIO QUINTILIIANO','28405127852',208831,1243,'MC','28653','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','NATALLY ATTICO','44052190874',208847,6205,'FC','38225','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','GIULIA CERIGNONI','42413520813',208866,6220,'FC','34388','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','LETICIA A. Q. SOARES','36777814850',208900,5879,'FC','32643','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','MARTHA CAMPOS','5144158862',208908,9162,'FC','22807','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','GABRIELLI GASPAR BANCHETE','40327713836',208912,5511,'FC','34354','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','BEATRIZ DA SILVA','31594539871',208946,5185,'FC','30150','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','RAFAELA RENATA DE OLIVEIRA','43161610830',208951,5689,'FC','34620','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','OLINDA SIQUEIRA RIBEIRO','87068079849',208956,9027,'FC','20258','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','VANINA CARDOSO DE MORAES','39853484803',208976,5520,'FC','33598','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','CAROLINI ASSUNÇÃO','34487527899',209002,6041,'FC','34946','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','TAIS SIQUEIRA RODRIGUES GODOY','22191331840',209023,5898,'FC','29522','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','SAMANTA CAROLINE CALSA TARGHER','40331031809',209031,9129,'FC','33450','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','ALEXANDRA SECHIM','21939223814',209032,1050,'FC','27768','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','CAMILA NASCIMENTO','43016713829',209069,1119,'FC','34363','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','WALTER ANDRES MUÑOZ BERNUCCI','8164333808',208848,5347,'MC','25038','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','OSMAR SANTOS','11924139898',208851,9070,'MC','24604','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','WALMIR OLIVEIRA','7867621873',208871,5095,'MC','24538','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','ONY RODRIGUES DE CAMPOS','5165502848',208896,5866,'MC','22910','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','EMERSON CLEITON DE LIMA','17591529862',208906,1056,'MC','29378','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','ROBERT SANTOS','43351424809',209064,5175,'MC','34939','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','ELAINE SILVA','21616946857',209087,1111,'FC','26795','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','TAYNARA FERNANDES','45476256890',209111,5183,'FC','35853','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','KARINA CARDOZO DE ANDRADE','42524157806',209116,1341,'FC','34793','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','CAROLINA SILVA','44805329866',209137,5759,'FC','35661','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','TAMIRES MARIANA','37732039858',209138,6405,'FC','32021','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','MARI HELOISA PEQUENO DA SILVA','41467786896',209140,6092,'FC','37634','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','LIVIA FUNARI','50519911814',209147,6215,'FC','37402','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','ANA GOMES','30992704820',209155,5080,'FC','30760','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','LUCIANE ANDRÉIA GONÇALVES','29281557835',209162,5029,'FC','28428','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','ALINE BARBOSA','32130041892',209181,5081,'FC','30608','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','JOSIELE IATAURO','36989078871',209190,5179,'FC','32370','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','FABIANA CAPISTRANO','31833890884',209233,5373,'FC','31206','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','DANIELA BARBOSA','32011671850',209242,6417,'FC','31189','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','MARISA  DA SILVA CAMARGO','2980482803',209243,5865,'FC','18654','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','GIOVANNA ANDRADE','52311702831',209254,5543,'FC','38369','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','ALESSANDRA DIAS BARBOSA','24709391866',209260,5576,'FC','27224','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','VANESSA MENDES HOLANDA','43369563835',209266,6302,'FC','34702','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','DOUGLAS DESIDÉRIO','31749323869',209083,6206,'MC','33283','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','ROGÉRIO  NOVOLETTI','9595768863',209129,5519,'MC','25729','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','GABRIEL DORRICIO','46279637859',209154,5372,'MC','36047','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','ANDRE MULLER','11927705878',209156,1328,'MC','24122','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','IVALDO RODRIGUES','12376323827',209160,6110,'MC','25283','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','NILSON SANTOS','24839879826',209175,5042,'MC','28050','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','TONI WIENDL','25935622858',209265,5964,'MC','28023','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','MARILENE PEREIRA VENERANDO DE LIMA','27450437813',209355,5158,'FC','23408','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','SAMIRA PANIGUEL DE OLIVEIRA','32827338874',209362,5320,'FC','31413','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','MARIA CLARA CAPISTRANO MOLINARI','58279381813',209365,5807,'FC','43886','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','CARLOS EDUARDO PORTELLA','51037543807',209363,5304,'MC','42446','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','BÁRBARA CARDOSO','50195553802',207366,1143,'FC','36085','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','JOÃO OLIVEIRA','45293347837',207368,1227,'MC','35527','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','BIANCA DOS SANTOS','46308673846',207428,5170,'FC','36128','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','JOHN JHOSEFF BLABER','48582642890',207427,5481,'MC','05/04/0200','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','DANIELLA DE JESUS GONCALVES','49333204890',208296,6288,'FC','39781','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','MIGUEL CARVALHO','44924527882',208324,5268,'MC','39844','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','JOSIANE DAMIANI','18925485850',208653,6289,'FC','39624','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','MIGUEL NICOLETE','51525889869',208824,5644,'MC','39588','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','GUSTAVO BARBOSA','51908721812',209015,5785,'MC','40572','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','JULIA SOUSA','45460392802',209282,9142,'FC','39115','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','EMERSON CLEITON DE LIMA JUNIOR','49075515847',209284,5800,'MC','39699','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','CREUZA PINHEIRO','27112862825',207761,5816,'FC','20373','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','ANA CLAUDIA RIBEIRO DE SOUZA','24268488200',207947,5611,'FC','23744','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','JOSE CARLOS DOS REIS','1593132875',207937,5030,'MC','19893','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','MARIA AP MORETTO','25649871841',208146,5514,'FC','20315','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','MARIA CORREIA DA SILVA FONSECA FONSECA','20551442867',208322,6060,'FC','21089','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','GERMANO OLIVEIRA','58305700844',208205,1107,'MC','18446','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','JOANA CORTINOVI ALCARDE','25232491890',208361,5418,'FC','21725','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','CATARINA GONÇALVES CARDOSO','11526435845',208411,5031,'FC','23783','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','PEDRINA CARVALHO DE SOUZA SOUZA','36534587300',208488,9033,'FC','20852','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','MARLENE PANIGUEL DE OLIVEIRA','4425492889',208566,5920,'FC','20989','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','LUCILENA VICENTE','35891767848',208572,5708,'FC','18397','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','MARCOS CHIBIM','5170908806',208369,5245,'MC','23228','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','APARECIDO SEBASTIÃO','65040864',208438,1019,'MC','20421','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','LUCIDALVA FERREIRA REIS DA SILVA','33928908553',208589,5503,'FC','23497','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','MARIA IGNEZ MARTELO','30877056838',208594,5757,'FC','20903','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','PAULO TODESCO','6105561857',208678,5550,'MC','23536','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','FRANCISCO CELSO GALVAO','96642963849',208760,6196,'MC','20536','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','ANTONIO VITTI','14877880887',208936,5724,'MC','12878','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','IDINALVA RIBEIRO DE ANDRADE','13290273881',209167,9095,'FC','21166','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','HELIDA AP RABELLO DE OLIVEIRA','96632682804',209179,6071,'FC','21041','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','GILVANEIDE M. SILVA  SEGANTINI','5084484840',209249,5382,'FC','19817','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','MARIA AUXILIADORA','17191582820',209277,5428,'FC','23500','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','MARGARETH HEFLIGER','8507919871',209279,9011,'FC','23303','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','EDINALDO MEIRA','3144956813',209159,6393,'MC','21528','CORRIDA','','',''));
this.lsDados.push(new DadosModel(	'SÃO SILVESTRE','LILIAN PEXE VITO','25018155809',207354,6123,'F10','29612','CORRIDA','','',''));
}

}
