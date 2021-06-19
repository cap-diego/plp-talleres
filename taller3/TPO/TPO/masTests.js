// Test Ejercicio 1
function testEjercicio1(res) {
  res.write("\n|| Crear al agente Smart ||\n");
  let creadoCorrectamente = Object.getPrototypeOf(smart) === AgenteDeControl.prototype;
  res.write(`Agente Smart creado de forma ${creadoCorrectamente ? '' : 'in'}correcta`, creadoCorrectamente);
  let conoceSuAgencia = "agencia" in smart;
  res.write(`Agente Smart ${si_o_no(conoceSuAgencia)} conoce su agencia`, conoceSuAgencia);
  let suAgenciaEsControl = smart.agencia === "Control";
  res.write(`La Agencia del agente Smart ${si_o_no(suAgenciaEsControl)} es Control`, suAgenciaEsControl);
  // Completar

}

// Test Ejercicio 2
function testEjercicio2(res) {
  let agenciaEstaDefinida = Agencia !== undefined;
  res.write(`La funciÃ³n Agencia ${si_o_no(agenciaEstaDefinida)} estÃ¡ definida`, agenciaEstaDefinida);

  let AgenteDeKaos = function() {};
  kaos = new Agencia(AgenteDeKaos);
  let tieneDefinidoElProgramaDeEntrenamiento = Object.values(kaos).includes(AgenteDeKaos);
  res.write(`La agencia ${si_o_no(tieneDefinidoElProgramaDeEntrenamiento)} tiene definido un programa de entrenamiento`, tieneDefinidoElProgramaDeEntrenamiento);
  // Completar
  let controlEstaDefinida = control !== undefined;
  res.write(`Control ${si_o_no(controlEstaDefinida)} estÃ¡ definida`, controlEstaDefinida);
  if (controlEstaDefinida) {
    let controlEsUnaAgencia = Object.getPrototypeOf(control) === Agencia.prototype;
    res.write(`Control ${si_o_no(controlEsUnaAgencia)} es una agencia`, controlEsUnaAgencia);
  }

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
  res.write(`El agente ${si_o_no(mensajePrototipoActualizado)} sabe que el mensaje se actualizÃ³`, mensajePrototipoActualizado);
  res.write("\n|| Enrolar a un agente ||\n");
  let miniEspia2 = {};
  enrolar(miniEspia2, oss);
  conoceMensajePrototipo = miniEspia2.peliculas === 3;
  res.write(`El agente enrolado ${si_o_no(conoceMensajePrototipo)} conoce el mensaje de su prototipo`, conoceMensajePrototipo);
  fConstructora.prototype.peliculas = 1;
  mensajePrototipoActualizado = miniEspia2.peliculas === 1;
  res.write(`El agente enrolado ${si_o_no(mensajePrototipoActualizado)} sabe que el mensaje se actualizÃ³`, mensajePrototipoActualizado);

  let agentes = 0;
  let fConstructora2 = function() {
    agentes++;
  };
  let cia = new Agencia(fConstructora2);
  let miniEspia3 = {};
  enrolar(miniEspia3, cia);
  agenciaRegistraEnrolamiento = agentes == 1;
  res.write(`El agente enrolado ${si_o_no(agenciaRegistraEnrolamiento)} pasÃ³ por el programa de entrenamiento`, agenciaRegistraEnrolamiento);
  // Completar
  let f = function() {
    this.x = true;
  }
  let a = new Agencia(f);
  let z = {};
  enrolar(z, a);
  agenciaRegistraEnrolamiento = z.x === true;
  res.write(`El agente enrolado ${si_o_no(agenciaRegistraEnrolamiento)} pasÃ³ por el programa de entrenamiento`, agenciaRegistraEnrolamiento);
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
  C_conoce_idC = agenteC.idC === 1;
  C_conoce_nC = agenteC.nC === 1;
  K_conoce_idK = agenteK.idK === 1;
  K_conoce_nK = agenteK.nK === 1;
  res.write("El agente de Control" + si_o_no(C_conoce_idC) + "responde idC correctamente", C_conoce_idC);
  res.write("El agente de Control" + si_o_no(C_conoce_nC) + "responde nC correctamente", C_conoce_nC);
  res.write("El agente de Kaos" + si_o_no(K_conoce_idK) + "responde idK correctamente", K_conoce_idK);
  res.write("El agente de Kaos" + si_o_no(K_conoce_nK) + "responde nK correctamente", K_conoce_nK);
}

// Test Ejercicio 5
function testEjercicio5(res) {
  let ejecuciones = 0;
  res.write("\n|| Crear un agente de cada agencia y mandarlo a espiar ||\n");
	control = new Agencia(function() { this.z = 1; ejecuciones++; }, "idC", "nC");
	kaos = new Agencia(function() { ejecuciones++; }, "idK", "nK");
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
  let K_conoce_z = agenteK.z === 1;
  res.write("El espía de Kaos" + si_o_no(K_conoce_z) + "pasÃ³ por el programa de entrenamiento de Control", K_conoce_z);
  // Completar
  agenteC.espiar(control);
  agenteK.dejarDeEspiar();
  C_conoce_idC = "idC" in agenteC;
  C_conoce_nC = "nC" in agenteC;
  C_conoce_idK = "idK" in agenteC;
  C_conoce_nK = "nK" in agenteC;
  K_conoce_idC = "idC" in agenteK;
  K_conoce_nC = "nC" in agenteK;
  K_conoce_idK = "idK" in agenteK;
  K_conoce_nK = "nK" in agenteK;
  res.write("El doble espía de Control" + si_o_no(C_conoce_idC) + "sabe responder idC", C_conoce_idC);
  res.write("El doble espía de Control" + si_o_no(C_conoce_nC) + "sabe responder nC", C_conoce_nC);
  res.write("El doble espía de Control" + si_o_no(C_conoce_idK) + "sabe responder idK", !C_conoce_idK);
  res.write("El doble espía de Control" + si_o_no(C_conoce_nK) + "sabe responder nK", !C_conoce_nK);
  res.write("El ex-espía de Kaos" + si_o_no(K_conoce_idC) + "sabe responder idC", !K_conoce_idC);
  res.write("El ex-espía de Kaos" + si_o_no(K_conoce_nC) + "sabe responder nC", !K_conoce_nC);
  res.write("El ex-espía de Kaos" + si_o_no(K_conoce_idK) + "sabe responder idK", K_conoce_idK);
  res.write("El ex-espía de Kaos" + si_o_no(K_conoce_nK) + "sabe responder nK", K_conoce_nK);
  let ejecucionesActuales = ejecuciones;
  let cantidadActualDeAgentes = agenteC.nC;
  agenteC.dejarDeEspiar();
  let cambioElN = cantidadActualDeAgentes !== agenteC.nC;
  let se_ejecuto_p = ejecucionesActuales != ejecuciones;
  C_conoce_idC = "idC" in agenteC;
  C_conoce_nC = "nC" in agenteC;
  C_conoce_idK = "idK" in agenteC;
  C_conoce_nK = "nK" in agenteC;
  res.write("El ex-doble espía de Control" + si_o_no(C_conoce_idC) + "sabe responder idC", C_conoce_idC);
  res.write("El ex-doble espía de Control" + si_o_no(C_conoce_nC) + "sabe responder nC", C_conoce_nC);
  res.write("El ex-doble espía de Control" + si_o_no(C_conoce_idK) + "sabe responder idK", !C_conoce_idK);
  res.write("El ex-doble espía de Control" + si_o_no(C_conoce_nK) + "sabe responder nK", !C_conoce_nK);
  C_conoce_idC = agenteC.idC === 1;
  res.write("El ex-doble espía de Control" + si_o_no(C_conoce_idC) + "responde idC correctamente", C_conoce_idC);
  res.write("Al dejar de espiar" + si_o_no(cambioElN) + "cambiÃ³ el nÃºmero total de agentes", !cambioElN);
  res.write("Al dejar de espiar" + si_o_no(se_ejecuto_p) + "se vuelve a ejecutar el programa de entrenamiento", !se_ejecuto_p);
}

// Test Ejercicio 6
function testEjercicio6(res) {
  let fConstructora = function() {
    this.sombrero = true;
  };
  let owca = new Agencia(fConstructora, "idW", "nW");
  let sacarseElSombrero = function() {
    this.sombrero = false;
  }
  res.write("\n|| Crear al agente P ||\n");
  let p = new agenteEspecial(owca, sacarseElSombrero);
  let perryConoceN = "nW" in p;
  let perryRespondeCorrectamenteN = p.nW === 1;
  res.write("El agente P" + si_o_no(perryRespondeCorrectamenteN) + "responde nW correctamente", perryRespondeCorrectamenteN);
  res.write("El agente de P" + si_o_no(perryConoceN) + "sabe responder nW", perryConoceN);
  let perrySabeSacarseElSombrero = 'sacarseElSombrero' in p;
  let perryTieneSombrero = p.sombrero === true;
  res.write(`El agente P${si_o_no(perryTieneSombrero)}tiene sombrero`, perryTieneSombrero);
  res.write(`El agente P${si_o_no(perrySabeSacarseElSombrero)} sabe sacarse el sombrero`, perrySabeSacarseElSombrero);
  p.sacarseElSombrero();
  perryTieneSombrero = p.sombrero === false;
  res.write(`El agente P${si_o_no(perryTieneSombrero)}se sacÃ³ el sombrero`, perryTieneSombrero);

  res.write("\n|| Crear al agente CamaleÃ³n ||\n");
  let camaleon = new agenteEspecial(owca, camuflar);
  camaleon.camuflar({
    color: 'rojo',
    repetir: function(s) {return s;}
  });

  let camaleonSabeResponderColor = 'color' in camaleon;
  let camaleonSabeResponderRepetir = 'repetir' in camaleon;
  res.write(`El agente CamaleÃ³n ${si_o_no(camaleonSabeResponderColor)} sabe responder \"color\"`, camaleonSabeResponderColor);
  res.write(`El agente CamaleÃ³n ${si_o_no(camaleonSabeResponderRepetir)} sabe responder \"repetir\"`, camaleonSabeResponderRepetir);

  let camaleonEsRojo = camaleon.color == 'rojo';
  let camaleonRespondeQOnda = camaleon.repetir('q onda?') == 'q onda?';
  res.write(`El agente CamaleÃ³n ${si_o_no(camaleonEsRojo)} es de color rojo`, camaleonEsRojo);
  res.write(`El agente CamaleÃ³n ${si_o_no(camaleonRespondeQOnda)} responde 'q onda?' si le piden repetir 'q onda?'`, camaleonRespondeQOnda);
}