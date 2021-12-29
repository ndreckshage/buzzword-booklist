import { query as Q, type Expr } from "faunadb";

export default function execIfListOwner({
  listSlug,
  currentUser,
  execExpr,
}: {
  listSlug: string;
  currentUser: string;
  execExpr: Expr;
}) {
  return Q.If(
    Q.Equals(
      Q.Select(
        ["data", "createdBy"],
        Q.Get(Q.Match(Q.Index("unique_lists_by_slug"), listSlug))
      ),
      currentUser
    ),
    execExpr,
    Q.Abort("Not Authorized")
  );
}
