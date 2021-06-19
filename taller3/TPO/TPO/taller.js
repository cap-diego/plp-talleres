AgenteDeControl = function (){
	this.agencia = "Control";
};

setAgenteID = function(agente, label, id) {
	agente[label] = id
}

actualizarCantAgentes = function(agencia, n) {
	agencia.Programa.prototype[agencia.nLabel] += n
}

smart = new AgenteDeControl();

Agencia = function (agenteFn, idLabel, nLabel) {
  this.Programa = agenteFn
  this.idLabel = idLabel;
  this.nLabel = nLabel;
  agenteFn.prototype[this.nLabel] = 0;

  agenteFn.prototype.espiar = function(agencia) {
	agencia.Programa.bind(this)()
    Object.setPrototypeOf(this, agencia.Programa.prototype)
	actualizarCantAgentes(agencia, 1)
  }
  
};

control = new Agencia(AgenteDeControl,"idC","nC");

nuevoAgente = function (agencia) {
	let agente = new agencia.Programa(agencia);
	actualizarCantAgentes(agencia, 1)
	setAgenteID(agente, agencia.idLabel, agencia.Programa.prototype[agencia.nLabel])

	agente.dejarDeEspiar = function() {
		Object.setPrototypeOf(this, agencia.Programa.prototype)
	}

	return agente
};

enrolar = function (agente, agencia) {
	Object.setPrototypeOf(agente, agencia.Programa.prototype)
	actualizarCantAgentes(agencia, 1)
	setAgenteID(agente, agencia.idLabel, agencia.Programa.prototype[agencia.nLabel])
	agencia.Programa.bind(agente)()

	agente.dejarDeEspiar = function() {
		Object.setPrototypeOf(this, agencia.Programa.prototype)
	}

};

agenteEspecial = function(agencia, skillFn) {
  this[skillFn.name] = skillFn
  enrolar(this, agencia)
}

camuflar = function(obj) {
  Object.assign(this, obj)
};

// Agreguen aquí los tests representados como funciones que toman un objeto res como argumento.
  // Pueden llamar a res.write para escribir en la salida.
  // Si le pasan un booleano como segundo argumento, el color de los que escriban será verde o rojo en base al valor de dicho booleano.

// Ejemplo de un test
function testEjemplo(res) {
  res.write("\n|| Probando la suma ||\n");
  let sumando1 = 4;
  let sumando2 = 6;
  let resultado_obtenido = sumando1 + sumando2;
  let resultado_esperado = 10;
  res.write("El resultado de sumar " + sumando1 + " y " + sumando2 + " da " + resultado_obtenido, (resultado_obtenido===resultado_esperado));
  sumando1 = "4";
  sumando2 = "6";
  resultado_obtenido = sumando1 + sumando2;
  resultado_esperado = "10";
  res.write("El resultado de sumar " + sumando1 + " y " + sumando2 + " da " + resultado_obtenido, (resultado_obtenido===resultado_esperado));
  sumando1 = 4;
  sumando2 = undefined;
  resultado_obtenido = sumando1 + sumando2;
  res.write("El resultado de sumar " + sumando1 + " y " + sumando2 + " da " + resultado_obtenido);
}

// Test Ejercicio 1
function testEjercicio1(res) {
  res.write("\n|| Crear al agente Smart ||\n");
  let creadoCorrectamente = Object.getPrototypeOf(smart) === AgenteDeControl.prototype;
  res.write(`Agente Smart creado de forma ${creadoCorrectamente ? '' : 'in'}correcta`, creadoCorrectamente);
  let conoceSuAgencia = "agencia" in smart;
  res.write(`Agente Smart ${si_o_no(conoceSuAgencia)} conoce su agencia`, conoceSuAgencia);
  let suAgenciaEsControl = smart.agencia === "Control";
  res.write(`La Agencia del agente Smart ${si_o_no(suAgenciaEsControl)} es Control`, suAgenciaEsControl);

  res.write("\n|| Crear al agente Smith ||\n");
  let smith = new AgenteDeControl();
  creadoCorrectamente = Object.getPrototypeOf(smith) === Object.getPrototypeOf(smart);
  res.write(`Agente Smith creado de forma ${creadoCorrectamente ? '' : 'in'}correcta`, creadoCorrectamente);
  conoceSuAgencia = "agencia" in smith;
  res.write(`Agente Smith ${si_o_no(conoceSuAgencia)} conoce su agencia`, conoceSuAgencia);
  let suAgenciaEsSmith = smith.agencia === "Smith";
  res.write(`La Agencia del agente Smith ${si_o_no(suAgenciaEsSmith)} no es la Agencia Smith`, !suAgenciaEsSmith);
}

// Test Ejercicio 2
function testEjercicio2(res) {
  let agenciaEstaDefinida = Agencia != undefined;
  res.write(`La función Agencia ${si_o_no(agenciaEstaDefinida)} está definida`, agenciaEstaDefinida);

  let AgenteDeKaos = function() {};
  kaos = new Agencia(AgenteDeKaos);
  let tieneDefinidoElProgramaDeEntrenamiento = Object.values(kaos).includes(AgenteDeKaos);
  res.write(`La agencia ${si_o_no(tieneDefinidoElProgramaDeEntrenamiento)} tiene definido un programa de entrenamiento`, tieneDefinidoElProgramaDeEntrenamiento);

  res.write("\n|| Crear al agente Smith, por medio del agente kaos ||\n");
  let smith = Object.create(kaos)
  tieneDefinidoElProgramaDeEntrenamiento = Object.values(Object.getPrototypeOf(smith)).includes(AgenteDeKaos);
  res.write(`La agencia ${si_o_no(tieneDefinidoElProgramaDeEntrenamiento)} tiene definido un programa de entrenamiento, el cual lo va a buscar por medio del agente smith`, tieneDefinidoElProgramaDeEntrenamiento);

}

// Test Ejercicio 3
function testEjercicio3(res) {
  res.write("\n|| Crear una agencia y un agente ||\n");
  let fConstructora = function() { };
  fConstructora.prototype.peliculas = 2;
  let oss = new Agencia(fConstructora);
  let miniEspia = nuevoAgente(oss);
  let conoceMensajePrototipo = miniEspia.peliculas === 2;
  res.write(`El agente ${si_o_no(conoceMensajePrototipo)} conoce el mensaje de su prototipo`, conoceMensajePrototipo);
  fConstructora.prototype.peliculas = 3;
  let mensajePrototipoActualizado = miniEspia.peliculas === 3;
  res.write(`El agente ${si_o_no(mensajePrototipoActualizado)} sabe que el mensaje se actualizó`, mensajePrototipoActualizado);
  res.write("\n|| Enrolar a un agente ||\n");
  let miniEspia2 = {};
  enrolar(miniEspia2, oss);
  conoceMensajePrototipo = miniEspia2.peliculas === 3;
  res.write(`El agente enrolado ${si_o_no(conoceMensajePrototipo)} conoce el mensaje de su prototipo`, conoceMensajePrototipo);
  fConstructora.prototype.peliculas = 1;
  mensajePrototipoActualizado = miniEspia2.peliculas === 1;
  res.write(`El agente enrolado ${si_o_no(mensajePrototipoActualizado)} sabe que el mensaje se actualizó`, mensajePrototipoActualizado);

  let agentes = 0;
  let fConstructora2 = function() { 
    agentes++;
  };
  let cia = new Agencia(fConstructora2);
  let miniEspia3 = {};
  enrolar(miniEspia3, cia);
  agenciaRegistraEnrolamiento = agentes == 1;
  res.write(`El agente enrolado ${si_o_no(agenciaRegistraEnrolamiento)} pasó por el programa de entrenamiento`, agenciaRegistraEnrolamiento);


  res.write("\n|| Creamos un Agente Bombero el cual lo enrolamos en la agencia de bomberos alpha y despues es trasladado a beta ||\n");
  let fBomberosAlpha = function() {
    this.saludo = "Somos del escuadron alpha"
  };
  fBomberosAlpha.prototype.totalSedes = 1;
  let agenciDeBomberosAlpha = new Agencia(fBomberosAlpha);
  let bombero = {}
  let saberLaCantidadDeSedes = bombero.totalSedes === 1;
  res.write(`El bombero ${si_o_no(saberLaCantidadDeSedes)} no conoce la cantidad de sedes de los bomberos alpha`, !saberLaCantidadDeSedes);

  enrolar(bombero, agenciDeBomberosAlpha);
  saberLaCantidadDeSedes = bombero.totalSedes == 1;
  res.write(`El bombero ${si_o_no(saberLaCantidadDeSedes)} conoce la cantidad de sedes de los bomberos alpha, por medio de su prototipo`, saberLaCantidadDeSedes);
  let sabeElSaludoAlpha = bombero.saludo === "Somos del escuadron alpha";
  res.write(`El bombero ${si_o_no(sabeElSaludoAlpha)} conoce el saludo de los bomberos alpha`, sabeElSaludoAlpha);

  let fBomberosBeta = function() {
    this.saludo = "Somos del escuadron beta"
  };
  fBomberosBeta.prototype.totalSedes = 2;
  let agenciDeBomberosBeta = new Agencia(fBomberosBeta);
  enrolar(bombero, agenciDeBomberosBeta);
  saberLaCantidadDeSedes = bombero.totalSedes == 2;
  res.write(`El bombero ${si_o_no(saberLaCantidadDeSedes)} conoce la cantidad de sedes de los bomberos beta, por medio de su prototipo`, saberLaCantidadDeSedes);
  let sabeElSaludoBeta = bombero.saludo === "Somos del escuadron beta";
  res.write(`El bombero ${si_o_no(sabeElSaludoBeta)} conoce el saludo de los bomberos beta`, sabeElSaludoBeta);
  sabeElSaludoAlpha = bombero.saludo === "Somos del escuadron alpha";
  res.write(`El bombero ${si_o_no(sabeElSaludoAlpha)} ya no conoce el saludo de los bomberos alpha`, !sabeElSaludoAlpha);
}

// Test Ejercicio 4
function testEjercicio4(res) {
	res.write("\n|| Crear un agente de cada agencia ||\n");
	control = new Agencia(function() { }, "idC", "nC");
	kaos = new Agencia(function() { }, "idK", "nK");
	let agenteK = {};
  let agenteC = nuevoAgente(control);
  enrolar(agenteK, kaos);
  let C_conoce_idC = "idC" in agenteC;
  let C_conoce_nC = "nC" in agenteC;
  let C_conoce_idK = "idK" in agenteC;
  let C_conoce_nK = "nK" in agenteC;
  let K_conoce_idC = "idC" in agenteK;
  let K_conoce_nC = "nC" in agenteK;
  let K_conoce_idK = "idK" in agenteK;
  let K_conoce_nK = "nK" in agenteK;
  res.write("El agente de Control" + si_o_no(C_conoce_idC) + "sabe responder idC", C_conoce_idC);
  res.write("El agente de Control" + si_o_no(C_conoce_nC) + "sabe responder nC", C_conoce_nC);
  res.write("El agente de Control" + si_o_no(C_conoce_idK) + "sabe responder idK", !C_conoce_idK);
  res.write("El agente de Control" + si_o_no(C_conoce_nK) + "sabe responder nK", !C_conoce_nK);
  res.write("El agente de Kaos" + si_o_no(K_conoce_idC) + "sabe responder idC", !K_conoce_idC);
  res.write("El agente de Kaos" + si_o_no(K_conoce_nC) + "sabe responder nC", !K_conoce_nC);
  res.write("El agente de Kaos" + si_o_no(K_conoce_idK) + "sabe responder idK", K_conoce_idK);
  res.write("El agente de Kaos" + si_o_no(K_conoce_nK) + "sabe responder nK", K_conoce_nK);



  res.write("\n|| Creamos la agencia de policia y de la Cia, donde agregamos un agente a cada agencia ||\n");
  let agenciaPolicia = new Agencia(function() { this.orden = "Arrestar" }, "idP", "nP");
  let agenciaCia = new Agencia(function() { this.orden = "Investigar" }, "idCIA", "nCIA");
  let teniente =nuevoAgente(agenciaPolicia);
  let policiaCivil = {}
  let general = nuevoAgente(agenciaCia);
  let agenteEspecial = {}
  enrolar(agenteEspecial, agenciaCia);
  let supervisorEspecial = nuevoAgente(agenciaCia);
  enrolar(policiaCivil, agenciaPolicia);

  let policia_conoce_su_idP = "idP" in policiaCivil;
  let policia_conoce_su_np = "nP" in policiaCivil;
  let agente_especial_conoce_su_idp = "idP" in agenteEspecial;
  let agente_especial_conoce_su_np = "inP" in agenteEspecial;
  let agente_especial_conoce_su_idCIA = "idCIA" in agenteEspecial;
  let agente_especial_conoce_su_nCIA = "nCIA" in agenteEspecial;
  let policia_conoce_su_idCIA = "idCIA" in policiaCivil;
  let policia_conoce_su_nCIA = "nCIA" in policiaCivil;
  let policia_conoce_valor_idP = policiaCivil.idP === 2;
  let policia_conoce_valor_nP = policiaCivil.nP === 2;
  let agente_especial_conoce_valor_idCIA = agenteEspecial.idCIA === 2;
  let agente_especial_conoce_valor_nCIA  = agenteEspecial.nCIA === 3;

  res.write("El agente de Policia" + si_o_no(policia_conoce_su_idP) + "sabe responder idP", policia_conoce_su_idP);
  res.write("El agente de Policia" + si_o_no(policia_conoce_valor_idP) + "conoce el valor de su idP", policia_conoce_valor_idP);
  res.write("El agente de Policia" + si_o_no(policia_conoce_su_np) + "sabe responder nP", policia_conoce_su_np);
  res.write("El agente de Policia" + si_o_no(policia_conoce_valor_nP) + "conoce el valor de su nP", policia_conoce_valor_nP);
  res.write("El agente de Policia" + si_o_no(policia_conoce_su_idCIA) + "sabe responder idCIA", !policia_conoce_su_idCIA);
  res.write("El agente de Policia" + si_o_no(policia_conoce_su_nCIA) + "sabe responder nCIA", !policia_conoce_su_nCIA);

  res.write("El agente de Especial de la CIA" + si_o_no(agente_especial_conoce_su_idCIA) + "sabe responder idCIA", agente_especial_conoce_su_idCIA);
  res.write("El agente de Especial de la CIA" + si_o_no(agente_especial_conoce_valor_idCIA) + "conoce el valor de su idCIA", agente_especial_conoce_valor_idCIA);
  res.write("El agente de Especial de la CIA" + si_o_no(agente_especial_conoce_su_nCIA) + "sabe responder nCIA", agente_especial_conoce_su_nCIA);
  res.write("El agente de Especial de la CIA" + si_o_no(agente_especial_conoce_valor_nCIA) + "conoce el valor de su nCIA", agente_especial_conoce_valor_nCIA);
  res.write("El agente de Especial de la CIA" + si_o_no(agente_especial_conoce_su_idp) + "sabe responder idP", !agente_especial_conoce_su_idp);
  res.write("El agente de Especial de la CIA" + si_o_no(policia_conoce_su_nCIA) + "sabe responder nP", !policia_conoce_su_nCIA);
}

// Test Ejercicio 5
function testEjercicio5(res) {
  res.write("\n|| Crear un agente de cada agencia y mandarlo a espiar ||\n");
  control = new Agencia(function() { }, "idC", "nC");
  kaos = new Agencia(function() { }, "idK", "nK");
  let agenteK = nuevoAgente(kaos);
  let agenteC = {};
  enrolar(agenteC, control);
  agenteC.espiar(kaos);
  agenteK.espiar(control);
  let C_conoce_idC = "idC" in agenteC;
  let C_conoce_nC = "nC" in agenteC;
  let C_conoce_idK = "idK" in agenteC;
  let C_conoce_nK = "nK" in agenteC;
  let K_conoce_idC = "idC" in agenteK;
  let K_conoce_nC = "nC" in agenteK;
  let K_conoce_idK = "idK" in agenteK;
  let K_conoce_nK = "nK" in agenteK;
  res.write("El espía de Control" + si_o_no(C_conoce_idC) + "sabe responder idC", C_conoce_idC);
  res.write("El espía de Control" + si_o_no(C_conoce_nC) + "sabe responder nC", !C_conoce_nC);
  res.write("El espía de Control" + si_o_no(C_conoce_idK) + "sabe responder idK", !C_conoce_idK);
  res.write("El espía de Control" + si_o_no(C_conoce_nK) + "sabe responder nK", C_conoce_nK);
  res.write("El espía de Kaos" + si_o_no(K_conoce_idC) + "sabe responder idC", !K_conoce_idC);
  res.write("El espía de Kaos" + si_o_no(K_conoce_nC) + "sabe responder nC", K_conoce_nC);
  res.write("El espía de Kaos" + si_o_no(K_conoce_idK) + "sabe responder idK", K_conoce_idK);
  res.write("El espía de Kaos" + si_o_no(K_conoce_nK) + "sabe responder nK", !K_conoce_nK);

  smithsAgencia = new Agencia(function() { }, "idS", "nS");
  let agenteS = nuevoAgente(smithsAgencia);
  let agenteS_2 = {};
  enrolar(agenteS_2, smithsAgencia);
  let S_conoce_idS = "idS" in agenteS;
  let S_conoce_nS = "nS" in agenteS;
  res.write("El agente de la agencia de Smith" + si_o_no(S_conoce_nS) + "sabe responder nS", S_conoce_nS);
  res.write("El agente de la agencia de Smith" + si_o_no(S_conoce_idS) + "sabe responder idS", S_conoce_idS);

  let S_conoce_idC = "idC" in agenteS;
  let S_conoce_nC = "nC" in agenteS;
  let S_id = agenteS[smithsAgencia.idLabel] == 1;
  let S_n = smithsAgencia.Programa.prototype[smithsAgencia.nLabel] == 2;
  
  res.write("El agente de la agencia de Smith " + si_o_no(S_id) + "tiene id=1", S_id);
  res.write("La agencia Smith " + si_o_no(S_id) + "tiene tiene 2 agentes", S_n);
  res.write("El agente de la agencia de Smith" + si_o_no(S_conoce_idC) + "sabe responder idC", !S_conoce_idC);
  res.write("El agente de la agencia de Smith" + si_o_no(S_conoce_nC) + "sabe responder nC", !S_conoce_nC);
  	
  let nC = control.Programa.prototype[control.nLabel] == 2;
  res.write("***La agencia Control" + si_o_no(nC) + "tiene 2 agentes***", nC);
  
  res.write("\n|| El agente Smith se infiltró en Control!||\n");
  agenteS.espiar(control);
  S_conoce_idC = "idC" in agenteS;
  S_conoce_nC = "nC" in agenteS;
  S_conoce_idS = "idS" in agenteS;
  S_conoce_nS = "nS" in agenteS;
  S_id = agenteS[smithsAgencia.idLabel] == 1;
  S_n = smithsAgencia.Programa.prototype[smithsAgencia.nLabel] == 2;
  nC = control.Programa.prototype[control.nLabel] == 3;

  res.write("El agente smith que espía Control" + si_o_no(S_conoce_idC) + "sabe responder idC", !S_conoce_idC);
  res.write("El agente smith que espía Control" + si_o_no(S_conoce_idS) + "sabe responder idS", S_conoce_idS);
  res.write("El agente smith que espía Control" + si_o_no(S_conoce_nC) + "sabe responder nC", S_conoce_nC);
  res.write("El agente smith que espía Control" + si_o_no(S_conoce_nS) + "sabe responder nS", !S_conoce_nS);
  res.write("El agente smith que espía Control" + si_o_no(S_id) + "sigue teniendo id 1", S_id);
  res.write("La agencia Smith " + si_o_no(S_id) + "sigue teniendo 2 agentes", S_n);
  res.write("***La agencia Control" + si_o_no(nC) + "tiene 3 agentes***", nC);
  
  res.write("\n|| El agente Smith deja de espiar la agencia Control!||\n");
  agenteS.dejarDeEspiar();
  S_conoce_idS = "idS" in agenteS;
  S_conoce_nS = "nS" in agenteS;
  S_conoce_idC = "idC" in agenteS;
  S_conoce_nC = "nC" in agenteS;
  S_n = smithsAgencia.Programa.prototype[smithsAgencia.nLabel] == 2;
  S_id = agenteS[smithsAgencia.idLabel] == 1;
  nC = control.Programa.prototype[control.nLabel] == 3;
  res.write("El agente smith que espiaba Control" + si_o_no(S_conoce_idC) + "sabe responder idC", !S_conoce_idC);
  res.write("El agente smith que espiaba Control" + si_o_no(S_conoce_idS) + "sabe responder idS", S_conoce_idS);
  res.write("El agente smith que espiaba Control" + si_o_no(S_conoce_nC) + "sabe responder nC", !S_conoce_nC);
  res.write("El agente smith que espiaba Control" + si_o_no(S_conoce_nS) + "sabe responder nS", S_conoce_nS);
  res.write("El agente smith que espiaba Control" + si_o_no(S_id) + "sigue teniendo id 1", S_id);
  res.write("La agencia Smith " + si_o_no(S_id) + "sigue teniendo 2 agentes", S_n);
  res.write("***La agencia Control" + si_o_no(nC) + "sigue teniendo 3 agente***", nC);
  
  res.write("\n|| El otro agente Smith espia la agencia Smith!||\n");
  agenteS_2.espiar(smithsAgencia);
  let S2_conoce_idS = "idS" in agenteS_2;
  let S2_conoce_nS = "nS" in agenteS_2;
  let S2_id = agenteS_2[smithsAgencia.idLabel] == 2;
  
  res.write("El otro agente de la agencia de Smith" + si_o_no(S2_conoce_nS) + "sabe responder nS", S2_conoce_nS);
  res.write("El otro agente de la agencia de Smith" + si_o_no(S2_conoce_idS) + "sabe responder idS", S2_conoce_idS);
  res.write("El otro agente de la agencia de Smith " + si_o_no(S2_id) + "tiene id=2", S2_id);
  
  res.write("\n|| Ahora deja de espiar su propia agencia Smith!||\n");
  agenteS_2.dejarDeEspiar();
  S2_conoce_idS = "idS" in agenteS_2;
  S2_conoce_nS = "nS" in agenteS_2;
  S2_id = agenteS_2[smithsAgencia.idLabel] == 2;

  res.write("El otro agente de la agencia de Smith" + si_o_no(S2_conoce_nS) + "sabe responder nS", S2_conoce_nS);
  res.write("El otro agente de la agencia de Smith" + si_o_no(S2_conoce_idS) + "sabe responder idS", S2_conoce_idS);
  res.write("El otro agente de la agencia de Smith " + si_o_no(S2_id) + "tiene id=2", S2_id);
}

// Test Ejercicio 6
function testEjercicio6(res) {
  let fConstructora = function() {
    this.sombrero = true;
  };
  let owca = new Agencia(fConstructora, "idOw", "nOw");
  let sacarseElSombrero = function() {
    this.sombrero = false;
  }
  res.write("\n|| Crear al agente P ||\n");
  let p = new agenteEspecial(owca, sacarseElSombrero);
  let perrySabeSacarseElSombrero = 'sacarseElSombrero' in p;
  res.write(`El agente P ${si_o_no(perrySabeSacarseElSombrero)} sabe sacarse el sombrero`, perrySabeSacarseElSombrero);

  res.write("\n|| Crear al agente Camaleón ||\n");
  let camaleon = new agenteEspecial(owca, camuflar);
  camaleon.camuflar({
    color: 'rojo',
    repetir: function(s) {return s;}
  });

  let camaleonSabeResponderColor = 'color' in camaleon;
  let camaleonSabeResponderRepetir = 'repetir' in camaleon;
  res.write(`El agente Camaleón ${si_o_no(camaleonSabeResponderColor)} sabe responder \"color\"`, camaleonSabeResponderColor);
  res.write(`El agente Camaleón ${si_o_no(camaleonSabeResponderRepetir)} sabe responder \"repetir\"`, camaleonSabeResponderRepetir);

  let camaleonEsRojo = camaleon.color == 'rojo';
  let camaleonRespondeQOnda = camaleon.repetir('q onda?') == 'q onda?';
  res.write(`El agente Camaleón ${si_o_no(camaleonEsRojo)} es de color rojo`, camaleonEsRojo);
  res.write(`El agente Camaleón ${si_o_no(camaleonRespondeQOnda)} responde 'q onda?' si le piden repetir 'q onda?'`, camaleonRespondeQOnda);

  N_ow = owca.Programa.prototype[owca.nLabel] == 2;
  res.write(`La agencia Owca ${si_o_no(N_ow)} tiene 2 agentes`, N_ow);
  camaleon_conoce_idOw = "idOw" in camaleon;
  camaleon_conoce_nOw = "nOw" in camaleon;
  res.write("El agente camaleon" + si_o_no(camaleon_conoce_idOw) + "conoce idOw", camaleon_conoce_idOw);
  res.write("El agente camaleon" + si_o_no(camaleon_conoce_nOw) + "conoce nOw", camaleon_conoce_nOw);
  
  res.write("\n|| El agente Camaleón se infiltra en Kaos||\n");
  kaos = new Agencia(function() { }, "idK", "nK");
  let agenteK = nuevoAgente(kaos);
  camaleon.espiar(kaos);
  
  camaleon_conoce_idK = "idK" in camaleon;
  camaleon_conoce_nK = "nK" in camaleon;
  camaleon_conoce_idOw = "idOw" in camaleon;
  camaleon_conoce_nOw = "nOw" in camaleon;
  res.write("El espía de Kaos (camaleon)" + si_o_no(camaleon_conoce_idK) + "sabe responder idK", !camaleon_conoce_idK);
  res.write("El espía de Kaos (camaleon)" + si_o_no(camaleon_conoce_nK) + "sabe responder nK", camaleon_conoce_nK);
  res.write("El agente camaleon" + si_o_no(camaleon_conoce_idOw) + "conoce idOw", camaleon_conoce_idOw);
  res.write("El agente camaleon" + si_o_no(camaleon_conoce_nOw) + "conoce nOw", !camaleon_conoce_nOw);
  
  
  res.write("\n|| El agente Camaleón deja de espiar Kaos||\n");
  camaleon.dejarDeEspiar();
  
camaleon_conoce_idK = "idK" in camaleon;
  camaleon_conoce_nK = "nK" in camaleon;
  camaleon_conoce_idOw = "idOw" in camaleon;
  camaleon_conoce_nOw = "nOw" in camaleon;
  N_ow = owca.Programa.prototype[owca.nLabel] == 2;
  res.write(`La agencia Owca ${si_o_no(N_ow)} sigue teniendo 2 agentes`, N_ow);
  res.write("El agente camaleon" + si_o_no(camaleon_conoce_idK) + "sabe responder idK", !camaleon_conoce_idK);
  res.write("El agente camaleon" + si_o_no(camaleon_conoce_nK) + "sabe responder nK", !camaleon_conoce_nK);
  res.write("El agente camaleon" + si_o_no(camaleon_conoce_idOw) + "conoce idOw", camaleon_conoce_idOw);
  res.write("El agente camaleon" + si_o_no(camaleon_conoce_nOw) + "conoce nOw", camaleon_conoce_nOw);
  
  
  res.write("\n|| Crear al agente Pitonisa ||\n");
  let futuroAgencia = new Agencia(function() { }, "idO", "nO");
  let skillFn = {verFuturo: function() {return true;}};
  let pitonisa = new agenteEspecial(futuroAgencia, camuflar);
  pitonisa.camuflar(skillFn);
  let agentePuedeVerElFuturo = 'verFuturo' in pitonisa;
  res.write(`El agente Pitonisa ${si_o_no(agentePuedeVerElFuturo)} sabe ver el futuro`, agentePuedeVerElFuturo);
  
  res.write("\n|| Skill editado fuera del agente||\n");
  skillFn.verFuturo = function(b) {return b};
  agentePuedeVerElFuturo = 'verFuturo' in pitonisa;
  res.write(`El agente Pitonisa ${si_o_no(agentePuedeVerElFuturo)} sigue pudiendo ver el futuro`, agentePuedeVerElFuturo);
  
  res.write("\n|| Agrego skills a Pitonisa sin cambiar ver el futuro||\n");
  pitonisa.camuflar({
    laCucharaSeDobla: function() {return false;}
  });
  agenteSabeSiSeDoblaLaCuchara = 'laCucharaSeDobla' in pitonisa;
  agentePuedeVerElFuturo = 'verFuturo' in pitonisa;
  res.write(`El agente Pitonisa ${si_o_no(agenteSabeSiSeDoblaLaCuchara)} sabe si se dobla la cuchara`, agenteSabeSiSeDoblaLaCuchara);  
  res.write(`El agente Pitonisa ${si_o_no(agentePuedeVerElFuturo)} sigue pudiendo ver el futuro`, agentePuedeVerElFuturo);
}
