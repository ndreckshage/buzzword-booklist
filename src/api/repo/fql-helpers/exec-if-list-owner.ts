import { query as Q, type Expr } from "faunadb";

export default function execIfListOwner({
  listKey,
  loggedInAs,
  execExpr,
}: {
  listKey: string;
  loggedInAs: string;
  execExpr: Expr;
}) {
  return Q.If(
    Q.Equals(
      Q.Select(
        ["data", "createdBy"],
        Q.Get(Q.Match(Q.Index("unique_lists_by_key"), listKey))
      ),
      loggedInAs
    ),
    execExpr,
    Q.Abort("Not Authorized")
  );
}
