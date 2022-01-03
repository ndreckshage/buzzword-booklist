import { query as Q, type Expr } from "faunadb";

export default function execIfLayoutOwner({
  layoutDoc,
  loggedInAs,
  execExpr,
}: {
  layoutDoc: Expr;
  loggedInAs: string;
  execExpr: Expr;
}) {
  return Q.If(
    Q.Equals(Q.Select(["data", "createdBy"], layoutDoc), loggedInAs),
    execExpr,
    Q.Abort("Not Authorized")
  );
}
