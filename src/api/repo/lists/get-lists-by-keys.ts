import { type Client, query as Q } from "faunadb";
import { type ListModel, selectListModel } from ".";

export default function getListsByKeys(client: Client) {
  return async (listKeys: readonly string[]) => {
    const result = await client.query(
      Q.Map(
        listKeys,
        Q.Lambda(
          "listKey",
          Q.Let(
            {
              listDoc: Q.Get(
                Q.Match(Q.Index("unique_lists_by_key"), Q.Var("listKey"))
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
