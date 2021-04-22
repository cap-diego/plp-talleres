module TP1
  ( Fabrica,
    Material (..),
    crearFabricaSimple,
    neg,
    esPar,
    sumarTuplas,
    foldMaterial,
    crearFabricaDeMaterial,
    secuenciar,
    paralelizar,
    pureza,
    filtrarPorPureza,
    emparejador,
    crearFabricaCompleja,
  )
where

import Data.List
import Test.HUnit

-- Definiciones

-- Fábricas son funciones [a] -> [b]
type Fabrica a b = [a] -> [b]

-- Materiales son un tipo algebráico
data Material a
  = MateriaPrima a
  | Mezclar (Material a) Float (Material a)
  deriving (Eq, Show)

-- Ejercicio 1 a
-- Dada una función a->b crear una Fabrica a b
crearFabricaSimple :: (a -> b) -> (Fabrica a b)
crearFabricaSimple f = map f

-- Ejercicio 1 b
-- Usando la función crearFabricaSimple, definir las siguientes fábricas:
-- neg que dada una lista de booleanos devuelve una lista con la negación de cada uno
neg :: Fabrica Bool Bool
neg = crearFabricaSimple not

-- esPar que dada una lista de números enteros devuelve una lista que indica si cada uno es par
esPar :: Fabrica Int Bool
esPar = crearFabricaSimple even

-- sumarTuplas que dada una lista de tuplas numéricas devuelve una lista con la suma de sus componentes
sumarTuplas :: Num a => Fabrica (a, a) a
sumarTuplas = crearFabricaSimple (uncurry (+))

-- Ejercicio 2
-- Definir el esquema de recursión estructural para el tipo Material
foldMaterial :: (a -> b) -> (b -> Float -> b -> b) -> Material a -> b
foldMaterial casoMPrima casoMezclar mat = case mat of
  MateriaPrima a -> casoMPrima a
  Mezclar m1 perc m2 -> casoMezclar (rec m1) perc (rec m2)
    where
      rec = foldMaterial casoMPrima casoMezclar

-- Ejercicio 3
-- Dada una función a->b crear una fábrica que procese materiales de tipo a y produzca
-- materiales de tipo b aplicándole la función a cada caso base
crearFabricaDeMaterial :: (a -> b) -> Fabrica (Material a) (Material b)
crearFabricaDeMaterial f = crearFabricaSimple $ foldMaterial (\a -> MateriaPrima (f a)) (\rec1 porc rec2 -> Mezclar rec1 porc rec2)

-- Ejercicio 4 a
-- Dadas dos fábricas simples, conectar la salida de la primera con la entrada de la segunda
secuenciar :: Fabrica a b -> Fabrica b d -> Fabrica a d
secuenciar fab1 fab2 = fab2 . fab1

-- Ejercicio 4 b
-- Cuando dos fábricas simples producen cosas del mismo tipo, estas se pueden paralelizar
-- De esta forma, dos fábricas simples se convierten en una sola que toma una lista de pares
-- (cada par contiene una entrada de cada una de las fábricas originales) y devuelve
-- una única lista que intercala los productos de ambas fábricas
paralelizar :: Fabrica a b -> Fabrica c b -> [(a, c)] -> [b]
paralelizar fab1 fab2 xs = entrelazar (foldr (\(x, y) rec -> (head (fab1 [x]), head (fab2 [y])) : rec) [] xs)

entrelazar :: [(a, a)] -> [a]
entrelazar = foldr (\(x, y) rec -> [x] ++ [y] ++ rec) []

-- Ejercicio 5 a
-- Dado un elemento y un material, determinar la pureza de dicho material
-- respecto a dicho elemento

-- Version con recursion explicita:
-- pureza a (MateriaPrima m) = if a == m then 100.0 else 0.0
-- pureza a (Mezclar m1 porc m2) = ((pureza a m1) * porc) / 100 + ((pureza a m2) * porc / 100)

pureza :: (Eq a) => a -> Material a -> Float
pureza m = foldMaterial calcPurezaPrima calcPurezaMezc
  where
    calcPurezaPrima a = if a == m then 100.0 else 0.0
    calcPurezaMezc purezaM1 porc purezaM2 = (purezaM1 * porc / 100) + (purezaM2 * (100 - porc) / 100)

-- Ejercicio 5 b
-- Dada una lista de materiales y una lista de restricciones de pureza (representadas
-- como tuplas elemento-valor), filtrar los materiales en la primera lista
-- que cumplen con todas las restricciones de pureza en la segunda lista
filtrarPorPureza :: (Eq a) => [Material a] -> [(a, Float)] -> [Material a]
filtrarPorPureza mats xs = filter (\mat -> cumpleFiltros mat xs) mats

cumpleFiltros :: (Eq a) => Material a -> [(a, Float)] -> Bool
cumpleFiltros m = foldr (\(matFiltro, porcFiltro) rec -> (pureza matFiltro m >= porcFiltro) && rec) True

-- Ejercicio 6 a
-- Crear un emparejador
-- Un emparejador es una fábrica que en lugar de producir algo,
-- lo que hace es agrupar los materiales en pares

-- Version con recursion explicita:
-- emparejador [] = []
-- emparejador (x : xs) = if null xs then [] else (x, head xs) : (emparejador (tail xs))

emparejador :: [a] -> [(a, a)]
emparejador l = uncurry zip (paresEImpares l)

paresEImpares :: [a] -> ([a], [a])
paresEImpares = foldr (\x rec -> (x : snd rec, fst rec)) ([], [])

-- Ejercicio 6 b
-- Dada una función a->a->b crear una Fabrica a b
-- Las fábricas complejas requieren dos unidades de material para producir cada unidad de producto
crearFabricaCompleja :: (a -> a -> b) -> Fabrica a b
crearFabricaCompleja f = \xs -> map (\(x, y) -> f x y) (emparejador xs)

-- Tests
tests :: IO Counts
tests = do runTestTT allTests

allTests =
  test
    [ "ejercicio1" ~: testsEj1,
      "ejercicio2" ~: testsEj2,
      "ejercicio3" ~: testsEj3,
      "ejercicio4" ~: testsEj4,
      "ejercicio5" ~: testsEj5,
      "ejercicio6" ~: testsEj6
    ]

-- Ejemplos sólo para mostrar cómo se escriben los tests. Reemplazar por los tests propios.
testsEj1 =
  test
    [ [4, 3, 2] ~=? crearFabricaSimple (+ 1) [3, 2, 1],
      [False, False, True] ~=? neg [True, True, False],
      [False, True, False] ~=? esPar [3, 2, 1],
      [4, 3, 2] ~=? sumarTuplas [(1, 3), (2, 1), (1, 1)],
      [1, 2, 3, 4, 5] ~=? crearFabricaSimple id (take 5 [1 ..]),
      [1, 2, 3] ~=? crearFabricaSimple (+ (-1)) (crearFabricaSimple (+ 1) [1, 2, 3]),
      [] ~=? crearFabricaSimple (+ 1) [],
      [] ~=? neg [],
      [] ~=? esPar [],
      [] ~=? sumarTuplas []
    ]

testsEj2 =
  test
    [ Mezclar (MateriaPrima "azucar") 80 (MateriaPrima "azucar") ~=? foldMaterial MateriaPrima Mezclar (Mezclar (MateriaPrima "azucar") 80 (MateriaPrima "azucar")),
    Mezclar (MateriaPrima "azucar") 80 (MateriaPrima "azucar") ~=? foldMaterial (\a -> MateriaPrima "azucar") Mezclar (Mezclar (MateriaPrima "Harina") 80 (MateriaPrima "Huevos")),
    Mezclar (MateriaPrima "azucar") 80 (MateriaPrima "sal") ~=? foldMaterial (\a -> if a == "Harina" then MateriaPrima "azucar" else MateriaPrima "sal") Mezclar (Mezclar (MateriaPrima "Harina") 80 (MateriaPrima "Huevos"))
    ]

testsEj3 =
  test
    [ [Mezclar (MateriaPrima "azucar") 80 (MateriaPrima "azucar")] ~=? crearFabricaDeMaterial (\a -> "azucar") [Mezclar (MateriaPrima "Harina") 80 (MateriaPrima "Huevos")],
      [Mezclar (MateriaPrima "azucar") 80 (MateriaPrima "sal")] ~=? crearFabricaDeMaterial (\a -> if a == "Harina" then "azucar" else "sal") [Mezclar (MateriaPrima "Harina") 80 (MateriaPrima "Huevos")],
      [Mezclar (MateriaPrima 10) 80 (MateriaPrima 200)] ~=? crearFabricaDeMaterial ((*)2) [Mezclar (MateriaPrima 5) 80 (MateriaPrima 100)]
    ]

testsEj4 =
  test
    [ [True, False, True, True] ~=? secuenciar esPar neg [1, 2, 3, 5],
      [] ~=? secuenciar esPar neg [],
      [False, False, True, False, True, False] ~=? paralelizar neg esPar [(True, 1), (False, 3), (False, 1)],
      [] ~=? paralelizar neg esPar [],
      [True, True] ~=? secuenciar neg neg [True, True]
    ]

verdad = MateriaPrima True

mentira = MateriaPrima False

harina = MateriaPrima "Harina"

azucar = MateriaPrima "azucar"

sal = MateriaPrima "sal"

testsEj5 =
  test
    [ 25.0 ~=? pureza True (Mezclar (Mezclar verdad 50.0 mentira) 50.0 mentira),
      [Mezclar verdad 80.0 mentira] ~=? filtrarPorPureza [Mezclar verdad 44.5 mentira, Mezclar verdad 80.0 mentira, Mezclar mentira 99.0 verdad] [(True, 50.0), (False, 1.0)],
      100.0 ~=? pureza "sal" (Mezclar sal 100.0 sal),
      0.0 ~=? pureza "azucar" (Mezclar sal 100.0 azucar),
      10.0 ~=? pureza "sal" (Mezclar sal 10.0 azucar)
    ]

testsEj6 =
  test
    [ [] ~=? emparejador [1],
      [(1, 2), (3, 4)] ~=? emparejador [1, 2, 3, 4],
      [5, 9, 11] ~=? crearFabricaCompleja (+) [2, 3, 12, -3, 11, 0],
      ([0], []) ~=? paresEImpares [0],
      ([0, 2, 4], [1, 3]) ~=? paresEImpares [0 .. 4]
    ]
