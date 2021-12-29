import { type Client, query as Q } from "faunadb";
import { type ListModel } from ".";

export default function getListsBySlugs(client: Client) {
  return async (listSlugs: readonly string[]) => {
    const result = await client.query(
      Q.Map(
        listSlugs,
        Q.Lambda(
          "listSlug",
          Q.Let(
            {
              listDoc: Q.Get(
                Q.Match(Q.Index("unique_lists_by_slug"), Q.Var("listSlug"))
              ),
            },
            {
              id: Q.Select(["ref", "id"], Q.Var("listDoc")),
              title: Q.Select(["data", "title"], Q.Var("listDoc")),
              slug: Q.Select(["data", "slug"], Q.Var("listDoc")),
              createdBy: Q.Select(["data", "createdBy"], Q.Var("listDoc")),
            }
          )
        )
      )
    );

    return result as ListModel[];
  };
}
