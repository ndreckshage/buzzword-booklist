import { type Client, query as q } from "faunadb";
import { type ListModel, selectListModel } from ".";

export default function getListsByCreators(client: Client) {
  return async (creators: readonly string[]) => {
    const result = await client.query(
      q.Map(
        creators,
        q.Lambda(
          "createdBy",
          q.Map(
            // @NOTE not supporting pagination to reduce complexity
            q.Select(
              "data",
              q.Paginate(
                q.Reverse(
                  q.Match(q.Index("lists_by_createdBy"), q.Var("createdBy"))
                )
              )
            ),
            q.Lambda(
              "listRef",
              q.Let(
                {
                  listDoc: q.Get(q.Var("listRef")),
                },
                selectListModel
              )
            )
          )
        )
      )
    );

    return result as ListModel[];
  };
}
