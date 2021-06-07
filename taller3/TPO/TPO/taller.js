//--------------------ejercicio 1, 2, 3-----------------------------------------------------

// AgenteDeControl = function (){
//   this.agencia = "Control";
// };
//
// smart = new AgenteDeControl();
//
// Agencia = function (agentes){
//   this.programa = agentes;
// };
//
// control = new Agencia(AgenteDeControl);
//
// nuevoAgente = function (agencia){
//   return new agencia.programa();
// };
//
// enrolar = function (agente, agencia){
//   Object.setPrototypeOf(agente,agencia.programa.prototype)
//   agencia.programa.bind(agente)()
// };

//------------------------------------------------------------------------------------------
//-----------------------------ejercicio 4--------------------------------------------------
//AgenteDeControl = function (){
//  this.agencia = "Control";
//};

//smart = new AgenteDeControl();

//Agencia = function (agentes, idLabel, nLabel){
//  this.programa = agentes;
//  this.idLabel = idLabel;
//  this.nLabel = nLabel;
//  agentes.prototype[this.nLabel] = 0
//};

//control = new Agencia(AgenteDeControl,"idC","nC");

//Agencia.prototype.setId = function (agente){
//  this.programa.prototype[this.nLabel] = this.programa.prototype[this.nLabel] +1;
//  agente[this.idLabel] = this.programa.prototype[this.nLabel];
//}

//nuevoAgente = function (agencia){
//  let agente = new agencia.programa();
//  agencia.setId(agente)
//  return agente
//};

//enrolar = function (agente, agencia){
//  Object.setPrototypeOf(agente,agencia.programa.prototype)
//  agencia.setId(agente)
//  agencia.programa.bind(agente)()
//};

//------------------------------Ejercicios 5 a 6--------------------------------------------------

AgenteDeControl = function (){
  this.agencia = "Control";
};

smart = new AgenteDeControl();

Agencia = function (agenteFn, idLabel, nLabel) {
  this.Programa = agenteFn
  this.idLabel = idLabel;
  this.nLabel = nLabel;
  agenteFn.prototype[this.nLabel] = 0;

  agenteFn.prototype.espiar = function(agencia) {
    Object.setPrototypeOf(this, agencia.Programa.prototype)
	//cuando espia otra agencia, guardo cuál es su agencia de origen
	agencia.Programa.bind(this, this.agenciaOrigen)()
  }
  
  agenteFn.prototype.dejarDeEspiar = function() {
    Object.setPrototypeOf(this, this.agenciaOrigen.Programa.prototype)
  }
};

control = new Agencia(AgenteDeControl,"idC","nC");

Agencia.prototype.setId = function (agente) {
  this.Programa.prototype[this.nLabel] += 1;
  agente[this.idLabel] = this.Programa.prototype[this.nLabel];
  agente.agenciaOrigen = this;
}

nuevoAgente = function (agencia) {
  let agente = new agencia.Programa(agencia);
  //si tiene que espiar otra agencia, guardo la agencia de origen para cuando deje de espiar
  //agente.agenciaOrigen = agencia;
  agencia.setId(agente)
  return agente
};

enrolar = function (agente, agencia) {
  Object.setPrototypeOf(agente, agencia.Programa.prototype)
  //agente.agenciaOrigen = agencia;
  agencia.setId(agente)
  agencia.Programa.bind(agente)()
};

agenteEspecial = function(agencia, skillFn) {
  this[skillFn.name] = skillFn
  enrolar(this, agencia)
}

camuflar = function(obj) {
  Object.assign(this, obj)
};

//falta agregar test
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
  smith = new AgenteDeControl();
  creadoCorrectamente = Object.getPrototypeOf(smith) === Object.getPrototypeOf(smart);
  res.write(`Agente Smith creado de forma ${creadoCorrectamente ? '' : 'in'}correcta`, creadoCorrectamente);
  conoceSuAgencia = "agencia" in smith;
  res.write(`Agente Smith ${si_o_no(conoceSuAgencia)} conoce su agencia`, conoceSuAgencia);
  let suAgenciaEsSmith = smith.agencia === "Smith";
  res.write(`La Agencia del agente Smith ${si_o_no(suAgenciaEsSmith)} es Smith`, !suAgenciaEsSmith);
}

// Test Ejercicio 2
function testEjercicio2(res) {
  let agenciaEstaDefinida = Agencia != undefined;
  res.write(`La función Agencia ${si_o_no(agenciaEstaDefinida)} está definida`, agenciaEstaDefinida);

  let AgenteDeKaos = function() {};
  kaos = new Agencia(AgenteDeKaos);
  let tieneDefinidoElProgramaDeEntrenamiento = Object.values(kaos).includes(AgenteDeKaos);
  res.write(`La agencia ${si_o_no(tieneDefinidoElProgramaDeEntrenamiento)} tiene definido un programa de entrenamiento`, tieneDefinidoElProgramaDeEntrenamiento);

  smith = Object.create(kaos)
  tieneDefinidoElProgramaDeEntrenamiento = Object.values(Object.getPrototypeOf(smith)).includes(AgenteDeKaos);
  res.write(`La agencia ${si_o_no(tieneDefinidoElProgramaDeEntrenamiento)} tiene definido un programa de entrenamiento`, tieneDefinidoElProgramaDeEntrenamiento);

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
  // Completar

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
  // Completar

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
  	
  
  let nC = control.Programa.prototype[control.nLabel] == 1;
  res.write("***La agencia Control" + si_o_no(nC) + "tiene 1 agente***", nC);
  
  res.write("\n|| El agente Smith se infiltró en Control!||\n");
  agenteS.espiar(control);
  S_conoce_idC = "idC" in agenteS;
  S_conoce_nC = "nC" in agenteS;
  S_conoce_idS = "idS" in agenteS;
  S_conoce_nS = "nS" in agenteS;
  S_id = agenteS[smithsAgencia.idLabel] == 1;
  S_n = smithsAgencia.Programa.prototype[smithsAgencia.nLabel] == 2;
  nC = control.Programa.prototype[control.nLabel] == 1;

  res.write("El agente smith que espía Control" + si_o_no(S_conoce_idC) + "sabe responder idC", !S_conoce_idC);
  res.write("El agente smith que espía Control" + si_o_no(S_conoce_idS) + "sabe responder idS", S_conoce_idS);
  res.write("El agente smith que espía Control" + si_o_no(S_conoce_nC) + "sabe responder nC", S_conoce_nC);
  res.write("El agente smith que espía Control" + si_o_no(S_conoce_nS) + "sabe responder nS", !S_conoce_nS);
  res.write("El agente smith que espía Control" + si_o_no(S_id) + "sigue teniendo id 1", S_id);
  res.write("La agencia Smith " + si_o_no(S_id) + "sigue teniendo 2 agentes", S_n);
  res.write("***La agencia Control" + si_o_no(nC) + "sigue teniendo 1 agente***", nC);
  
  res.write("\n|| El agente Smith deja de espiar la agencia Control!||\n");
  agenteS.dejarDeEspiar(control);
  S_conoce_idS = "idS" in agenteS;
  S_conoce_nS = "nS" in agenteS;
  S_conoce_idC = "idC" in agenteS;
  S_conoce_nC = "nC" in agenteS;
  S_n = smithsAgencia.Programa.prototype[smithsAgencia.nLabel] == 2;
  S_id = agenteS[smithsAgencia.idLabel] == 1;
  nC = control.Programa.prototype[control.nLabel] == 1;
  res.write("El agente smith que espiaba Control" + si_o_no(S_conoce_idC) + "sabe responder idC", !S_conoce_idC);
  res.write("El agente smith que espiaba Control" + si_o_no(S_conoce_idS) + "sabe responder idS", S_conoce_idS);
  res.write("El agente smith que espiaba Control" + si_o_no(S_conoce_nC) + "sabe responder nC", !S_conoce_nC);
  res.write("El agente smith que espiaba Control" + si_o_no(S_conoce_nS) + "sabe responder nS", S_conoce_nS);
  res.write("El agente smith que espiaba Control" + si_o_no(S_id) + "sigue teniendo id 1", S_id);
  res.write("La agencia Smith " + si_o_no(S_id) + "sigue teniendo 2 agentes", S_n);
  res.write("***La agencia Control" + si_o_no(nC) + "sigue teniendo 1 agente***", nC);
  
  res.write("\n|| El otro agente Smith espia la agencia Smith!||\n");
  agenteS_2.espiar(smithsAgencia);
  let S2_conoce_idS = "idS" in agenteS_2;
  let S2_conoce_nS = "nS" in agenteS_2;
  let S2_id = agenteS_2[smithsAgencia.idLabel] == 2;
  
  res.write("El otro agente de la agencia de Smith" + si_o_no(S2_conoce_nS) + "sabe responder nS", S2_conoce_nS);
  res.write("El otro agente de la agencia de Smith" + si_o_no(S2_conoce_idS) + "sabe responder idS", S2_conoce_idS);
  res.write("El otro agente de la agencia de Smith " + si_o_no(S2_id) + "tiene id=2", S2_id);
  
  res.write("\n|| Ahora deja de espiar su propia agencia Smith!||\n");
  agenteS_2.dejarDeEspiar(smithsAgencia);
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
  let owca = new Agencia(fConstructora, "idOw", "nOw"); //TODO: consultar: está bien que le agreguemos idOw y nOw?
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
  camaleon.dejarDeEspiar(kaos);
  
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
  
}

