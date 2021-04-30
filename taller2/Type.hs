module Type(Type(..), fv, foldType,
            Symbol,
            Context, emptyContext, extendC, removeC, evalC, joinC, domainC,
            Subst, emptySubst, extendS, Substitutable, (<.>))
where

-----------
-- Types --
-----------

data Type = TVar Int | TNat | TBool | TFun Type Type

foldType :: (Int -> b) -> b -> b -> (b -> b -> b) -> Type -> b
foldType fI cN cB fF t = case t of
                                 TVar n -> fI n
                                 TNat -> cN
                                 TBool -> cB
                                 TFun u v -> fF (rec u) (rec v)
  where rec = foldType fI cN cB fF

instance Show Type where
    show (TVar n) = "t" ++ show n
    show TNat = "Nat"
    show TBool = "Bool"
    show (TFun t1 t2) = (parensFun t1 $ show t1) ++ " -> " ++ show t2
        where parensFun (TFun _ _) = \s -> "(" ++ s ++ ")"
              parensFun _ = id


fv :: Type -> [Int]
fv TNat = []
fv TBool = []
fv (TVar n) = [n]
fv (TFun t1 t2) = fv t1 ++ fv t2

---------------
-- Contexts --
---------------

type Symbol = String

newtype Context = C [(Symbol,  Type)] deriving Show

emptyContext :: Context
emptyContext = C []

extendC :: Context -> Symbol -> Type -> Context
extendC (C gamma) x t = C ((x,t):gamma)

removeC :: Context -> Symbol -> Context
removeC (C gamma) x = C (filter ((/=x) . fst) gamma)

evalC :: Context -> Symbol -> Type
evalC (C gamma) x = case lookup x gamma of
                    (Just t) -> t
                    Nothing -> error $ "Context does not include " ++ show x

joinC :: [Context] -> Context
joinC = gamma . concat . map extractSymbol
    where gamma = C
          extractSymbol (C e) = e

domainC :: Context -> [Symbol]
domainC (C gamma) = map fst gamma

-------------------
-- Substitutions --
-------------------

newtype Subst = S (Int -> Type)

emptySubst :: Subst
emptySubst = S (\n -> TVar n)

extendS :: Int -> Type -> Subst -> Subst
extendS n t (S subs) = S (\m -> if m == n then t else subs m)

class Substitutable a where
    infixr 5 <.>
    (<.>) :: Subst -> a -> a

instance Substitutable Type where 
    (<.>) _     TNat        = TNat
    (<.>) _     TBool       = TBool
    (<.>) s     (TFun t1 t2)= TFun (s <.> t1) (s <.> t2)
    (<.>) (S s) (TVar n)    = unfold s n
        where unfold f m = case f m of
                            tVar@(TVar m') -> if m == m' then tVar else (S f) <.> tVar
                            tOther -> (S f) <.> tOther


instance Substitutable Context where
    (<.>) s (C gamma) = C (map (\(x,t)->(x, s <.> t)) gamma)

instance Substitutable Subst where
    (<.>) s (S s2) = S (\n -> s <.> s2 n)

instance (Substitutable a, Substitutable b) => Substitutable (a, b) where
    (<.>) s (x,y) = (s <.> x, s <.> y)

instance Substitutable a => Substitutable [a] where
    (<.>) s = map (s <.>)
