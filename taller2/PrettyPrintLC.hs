module PrettyPrintLC (Doc, ppExpr, ppType, ppContext, ppTypingJudgment, ppTypingResult)
where

import Exp
import Type
import TypeInference
import Text.PrettyPrint
import Data.List(nub)

class PrintableAnnot a where
    ppAnnot :: a -> Doc

instance PrintableAnnot () where
    ppAnnot _ = empty

instance PrintableAnnot Type where
    ppAnnot t = ppType t


ppExpr :: PrintableAnnot a => Exp a -> Doc
ppExpr = recExp (\x -> text x)
                     (ppConstant "0")
                     (ppNat "succ")
                     (ppNat "pred")
                     (ppNat "isZero")
                     (ppConstant "true")
                     (ppConstant "false")
                     (\e1 e2 e3 d1 d2 d3 ->
                        vcat [text "if" <+> (parensIf e1 d1),
                          nest 1 (text "then" <+> (parensIf e2 d2)),
                          nest 1 (text "else" <+> (parensIf e3 d3))])
                     (\e x t d ->
                        sep[(text $ "\\" ++ x ++ ":") Text.PrettyPrint.<> ppAnnot t, text "->", parensLam e d])
                     (\e1 e2 d1 d2 ->
                        sep [parensAppLeft e1 d1, parensAppRight e2 d2])
    where ppNat keyword e = ppUnary (Text.PrettyPrint.<>) (parensNat e) keyword

ppType :: Type -> Doc
ppType (TVar n) = text $ "t" ++ show n
ppType TNat = text "Nat"
ppType TBool = text "Bool"
ppType (TFun t1 t2) = (parensFun t1 $ ppType t1) Text.PrettyPrint.<> text " -> " Text.PrettyPrint.<> ppType t2

ppContext :: Context -> Doc
ppContext gamma = text "{"
             Text.PrettyPrint.<> (sep . punctuate (text ","))
                 [(text $ x ++ ":") Text.PrettyPrint.<> (ppType $ evalC gamma x) | x <- nub $ domainC gamma]
              Text.PrettyPrint.<> text "}"

ppTypingJudgment :: TypingJudgment -> Doc
ppTypingJudgment (gamma, expr, t) = sep [(ppContext gamma) <+> (text ">>"),
                                        ppExpr expr,
                                         (text ":") <+> ppType t]

ppTypingResult :: Result TypingJudgment -> Doc
ppTypingResult (OK tj) = ppTypingJudgment tj
ppTypingResult (Error s) = text s


ppConstant :: String -> Doc
ppConstant = text

ppUnary :: (Doc -> Doc -> Doc) -> (Doc -> Doc) -> String -> Doc -> Doc
ppUnary fSep fParens keyword doc = fSep (text keyword) (fParens doc)

parensNat, parensIf, parensLam, parensAppLeft, parensAppRight
    :: Exp a -> Doc -> Doc
parensNat = const parens

parensIf (IfExp _ _ _) = parens
parensIf (LamExp _ _ _) = parens
parensIf (AppExp _ _) = parens
parensIf _ = id

parensLam = const id

parensAppLeft (IfExp _ _ _) = parens
parensAppLeft (LamExp _ _ _) = parens
parensAppLeft _ = id

parensAppRight (IfExp _ _ _) = parens
parensAppRight (LamExp _ _ _) = parens
parensAppRight (AppExp _ _) = parens
parensAppRight _ = id

parensFun :: Type -> Doc -> Doc
parensFun (TFun _ _) = parens
parensFun _ = id
