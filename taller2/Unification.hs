module Unification(UnifGoal, UnifResult(..), mgu)
where

import Type

type UnifGoal = (Type, Type)
data UnifResult = UOK Subst | UError Type Type

instance Substitutable UnifResult
    where (<.>) s (UOK subst) = UOK (s <.> subst)
          (<.>) _ (UError t1 t2) = UError t1 t2


mgu :: [UnifGoal] -> UnifResult
mgu []                                          = UOK emptySubst
mgu ((TNat, TNat) : goals)                      = mgu goals
mgu ((TBool, TBool) : goals)                    = mgu goals
mgu ((TVar n, TVar m) : goals) | n == m         = mgu goals
mgu ((TVar n, t) : goals) | not (n `elem` fv t) = let s = extendS n t emptySubst
                                                   in (s <.> mgu (s <.> goals))
mgu ((t, TVar n) : goals)                       = mgu ((TVar n, t) : goals)
mgu ((TFun t1 t2, TFun t1' t2') : goals)        = mgu ((t1, t1'):(t2, t2'):goals)
mgu ((t1, t2) : _)                              = UError t1 t2

