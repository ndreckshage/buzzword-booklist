import { type Client, query as Q } from "faunadb";
import { type ListModel, selectListModel } from ".";

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
            selectListModel
          )
        )
      )
    );

    return result as ListModel[];
  };
}
