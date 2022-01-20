import { query as q, type Expr } from "faunadb";

export default function execIfListOwner({
  listKey,
  loggedInAs,
  execExpr,
}: {
  listKey: string;
  loggedInAs: string;
  execExpr: Expr;
}) {
  return q.If(
    q.Equals(
      q.Select(
        ["data", "createdBy"],
        q.Get(q.Match(q.Index("unique_lists_by_key"), listKey))
      ),
      loggedInAs
    ),
    execExpr,
    q.Abort("Not Authorized")
  );
}
