%% LENGUAJE S

% Variables (representadas con su correspondiente codificación): Y (1), X1 (2), Z1 (3), X2 (4), Z2 (5), ...

% Etiquetas (representadas con su correspondiente codificación): A(1), B(2), C(3), ...

% Instrucciones:
%  nada(L,V)   [L] V <- V
%  suma(L,V)   [L] V <- V+1
%  resta(L,V)  [L] V <- V-1
%  goto(L,V,E) [L] if V /= 0 goto E

% esInstruccionValida(+I)
esInstruccionValida(nada(L,V))   :- L >= 0, V > 0.
esInstruccionValida(suma(L,V))   :- L >= 0, V > 0.
esInstruccionValida(resta(L,V))  :- L >= 0, V > 0.
esInstruccionValida(goto(L,V,E)) :- L >= 0, V > 0, E > 0.


% Estado (lista de pares variable-valor):
%  [(var,val)]

% evaluar(+Estado, +Var, -Val)
% Dado un estado y una variable, instancia en el tercer argumento el valor
%   de la variable en el estado. Las variables que no aparecen en el estado tienen valor 0.
% COMPLETAR

evaluar([], _, 0).
evaluar([(VARIABLE,VALOR)|L],VAR, VAL) :- VARIABLE \= VAR, evaluar(L,VAR, VAL).
evaluar([(VARIABLE,VALOR)|L],VAR, VAL) :- VARIABLE =:= VAR, VAL is VALOR .

%% CODIFICACIÓN

%% Codificación de listas

% codificacionLista(?L, ?Z)
codificacionLista(L, Z) :- codificacionListaDesde(L, Z, 1).

% codificacionLista(?L, ?Z, +I)
codificacionListaDesde([], 1, _).
codificacionListaDesde([X|Xs], Z, I) :- ground([X|Xs]), Im1 is I+1, iesimoPrimo(I, P), codificacionListaDesde(Xs, Rec, Im1), Z is Rec*P**X.
codificacionListaDesde([X|Xs], Z, I) :- var(X), var(Xs), Im1 is I+1, iesimoPrimo(I, P), maximoExponenteQueDivideA(X,P,Z), Rec is Z/(P**X), codificacionListaDesde(Xs, Rec, Im1).

% divide(?A, +B)
divide(A, B) :- between(1, B, A), between(1, B, X), B is A*X.

% esPrimo(+P)
esPrimo(P) :- P \= 1, Pm1 is P-1, not((between(2, Pm1, X), divide(X, P))).

% iesimoPrimo(+I, -P)
iesimoPrimo(I,P) :- iesimoPrimoDesde(I,2,P).


iesimoPrimoDesde(I,V,P) :- I =:= 1, esPrimo(V), P is V. 

iesimoPrimoDesde(I,V,P) :- I > 1, esPrimo(V), 
						   I2 is I-1,
						   V2 is V+1, 
						   iesimoPrimoDesde(I2,V2,P).
						   						  
iesimoPrimoDesde(I,V,P) :- I >= 1, not(esPrimo(V)), 
						   V2 is V+1, 
						   iesimoPrimoDesde(I,V2,P).						   


%desde2(+X,?Y)
desde2(X,X).
desde2(X,Y) :- nonvar(Y), Y > X.
desde2(X,Y) :- var(Y), N is X+1, desde2(N,Y).

% maximoExponenteQueDivideA(-X, +P, +Z)

maximoExponenteQueDivideA(X,P,Z) :- desde2(0,X), 
									Divisor is P**X, 
									divide(Divisor,Z), 
									Divisor2 is P**(X+1), 
									not(divide(Divisor2,Z)),
									!.



% COMPLETAR

%% OBSERVADORES

% pi1(+(X,Y), -X) % instancia en el segundo argumento la primer componente de la tupla (X, Y).
pi1((X, _), X).

% pi2(+(X,Y), -Y) % instancia en el segundo argumento la primer componente de la tupla (X, Y).
pi2((_, Y), Y).

% iesimo(+L, +I, -X) % indexar en lista: instancia en el tercer argumento el elemento en la posición I de la lista L.
iesimo([X|_], 1, X).
iesimo([_|Xs], I, E) :- I > 1, Im1 is I-1, iesimo(Xs, Im1, E).

% etiquetaInstruccion(+Instruccion, -Etiqueta)
etiquetaInstruccion(nada(L,_), L).
etiquetaInstruccion(suma(L,_), L).
etiquetaInstruccion(resta(L,_), L).
etiquetaInstruccion(goto(L,_,_), L).

% codigoInstruccion(+Instruccion, -Codigo)
codigoInstruccion(nada(_,_), 0).
codigoInstruccion(suma(_,_), 1).
codigoInstruccion(resta(_,_), 2).
codigoInstruccion(goto(_,_,E), C) :- C is E+2.

% variableInstruccion(+Instruccion, -Variable)
variableInstruccion(nada(_,V), V).
variableInstruccion(suma(_,V), V).
variableInstruccion(resta(_,V), V).
variableInstruccion(goto(_,V,_), V).

% longitud(+P, -L) % Instancia en el segundo argumento la longitud del programa P
longitud([], 0).
longitud([_|Xs], L) :- longitud(Xs, Lm1), L is Lm1 + 1.

% iEsimaInstruccion(+P, +Indice, -Instruccion) % Instancia en el tercer argumento la Indice-ésima instrucción del programa P.
iEsimaInstruccion(E, Indice, Instruccion) :- is_list(E), iesimo(E, Indice, Instruccion).

%% Simulación del lenguaje S

% Descripción instantánea (par índice-estado, donde el índice (empezando en 1)
% indica el número de la próxima instrucción a ejecutar):
%  (i,s)

% snap(+Xs, +P, +T, -Di)
% Instancia en el cuarto argumento la descripción instantánea resultante de
% ejecutar el programa P con entradas Xs tras T pasos.
% COMPLETAR

% avanzarIndice(+P, +S, +Ins, +I0, -I)
% avanzarIndice(Programa,Estado,Instruccion,Indice,I) :-

% avanzarEstado(+Ins, +S0, -S) 

avanzarEstado(Instruccion, EstIni, EstFinal):- 
											variableInstruccion(Instruccion,X),
											codigoInstruccion(Instruccion,Codigo),
											evaluar(EstIni, X, Valor),
											ejecutarCodigo(Codigo,Valor,Res),
											armarEstado(EstIni,X,Res,EstFinal).
												
armarEstado(EstIni,X,Res,EstFinal) :- delete(EstIni,(X,Z),L2),
									  append(L2,[(X,Res)],EstFinal).

ejecutarCodigo(0,V,V).
ejecutarCodigo(1,V,Z) :- Z is V+1 .
ejecutarCodigo(2,V,Z) :- Z is V-1 .



%[(variable,valor),....]

% stp(+Xs, +P, +T)
% Indica si el programa P con entradas Xs termina tras T pasos.
% Se dice que un programa terminó cuando la próxima instrucción a ejecutar es
% 1 más que la longitud del programa.
% COMPLETAR

%% Pseudo-Halt

% pseudoHalt(+X, +Y)
% COMPLETAR

% Buscar entradas para las cuales el programa Y termina
% pseudoHalt2(-X, +Y)
% COMPLETAR

% Buscar pares programa-entrada que terminen
% pseudoHalt3(-X, -Y)
% COMPLETAR

% programa(-P, +N)
programa([], 0).
programa([I|Is], N) :- N > 0, between(1,N,C), instruccion(I,C), N2 is N-C, programa(Is,N2).

% instruccion(-I, +N)
instruccion(nada(0,1),1).
instruccion(nada(L,V),N) :- N > 1, between(1,N,V), L is N-V.
instruccion(suma(0,1),1).
instruccion(suma(L,V),N) :- N > 1, between(1,N,V), L is N-V.
instruccion(resta(0,1),1).
instruccion(resta(L,V),N) :- N > 1, between(1,N,V), L is N-V.
instruccion(goto(0,1,1),2).
instruccion(goto(L,V,E),N) :- N > 2, N2 is N-1, between(1,N2,V), N3 is N-V, between(1,N3,E), L is N3-E.

%% TESTS

cantidadTestsEvaluar(2). % Actualizar con la cantidad de tests que entreguen
testEvaluar(1) :- evaluar([],1,0).
testEvaluar(2) :- evaluar([(4,0),(2,3)],2,3).
%caso anomalo ---> raro
testEvaluar(3) :- evaluar([(4,0),(4,2)],4,0).


cantidadTestsCodificacion(2). % Actualizar con la cantidad de tests que entreguen
testCodificacion(1) :- codificacionLista([],1).
testCodificacion(2) :- codificacionLista([1],2).
% Agregar más tests

cantidadTestsSnapYstp(2). % Actualizar con la cantidad de tests que entreguen
testSnapYstp(1) :- stp([],[],1).
testSnapYstp(2) :- snap([10],[suma(0,1)],0,(1,[(2,10)])).
% Agregar más tests

cantidadTestsHalt(1). % Actualizar con la cantidad de tests que entreguen
testHalt(1) :- pseudoHalt([1],[suma(0,1)]).
% Agregar más tests

tests(evaluar) :- cantidadTestsEvaluar(M), forall(between(1,M,N), testEvaluar(N)).
tests(codificacion) :- cantidadTestsCodificacion(M), forall(between(1,M,N), testCodificacion(N)).
tests(snapYstp) :- cantidadTestsSnapYstp(M), forall(between(1,M,N), testSnapYstp(N)).
tests(halt) :- cantidadTestsHalt(M), forall(between(1,M,N), testHalt(N)).

tests(todos) :-
  tests(evaluar),
  tests(codificacion),
  tests(snapYstp),
  tests(halt).

tests :- tests(todos).
