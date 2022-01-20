import { query as q, type Expr } from "faunadb";

export default function execIfComponentOwner({
  componentDoc,
  loggedInAs,
  execExpr,
}: {
  componentDoc: Expr;
  loggedInAs: string;
  execExpr: Expr;
}) {
  return q.If(
    q.Equals(q.Select(["data", "createdBy"], componentDoc), loggedInAs),
    execExpr,
    q.Abort("Not Authorized")
  );
}
