import { query as Q, type Expr } from "faunadb";

export default function execIfComponentOwner({
  componentDoc,
  loggedInAs,
  execExpr,
}: {
  componentDoc: Expr;
  loggedInAs: string;
  execExpr: Expr;
}) {
  return Q.If(
    Q.Equals(Q.Select(["data", "createdBy"], componentDoc), loggedInAs),
    execExpr,
    Q.Abort("Not Authorized")
  );
}
