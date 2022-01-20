import { type Client, query as q } from "faunadb";
import { type ListModel, selectListModel } from ".";

export default function getListsByKeys(client: Client) {
  return async (listKeys: readonly string[]) => {
    const result = await client.query(
      q.Map(
        listKeys,
        q.Lambda(
          "listKey",
          q.Let(
            {
              listDoc: q.Get(
                q.Match(q.Index("unique_lists_by_key"), q.Var("listKey"))
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
