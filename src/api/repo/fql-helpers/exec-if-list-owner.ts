import { query as Q, type Expr } from "faunadb";

export default function execIfListOwner({
  listSlug,
  loggedInAs,
  execExpr,
}: {
  listSlug: string;
  loggedInAs: string;
  execExpr: Expr;
}) {
  return Q.If(
    Q.Equals(
      Q.Select(
        ["data", "createdBy"],
        Q.Get(Q.Match(Q.Index("unique_lists_by_slug"), listSlug))
      ),
      loggedInAs
    ),
    execExpr,
    Q.Abort("Not Authorized")
  );
}
