import { type Client, query as Q } from "faunadb";
import { type ListModel, selectListModel } from ".";

export default function getListsByCreators(client: Client) {
  return async (creators: readonly string[]) => {
    const result = await client.query(
      Q.Map(
        creators,
        Q.Lambda(
          "createdBy",
          Q.Map(
            // @NOTE not supporting pagination to reduce complexity
            Q.Select(
              "data",
              Q.Paginate(
                Q.Match(Q.Index("lists_by_createdBy"), Q.Var("createdBy"))
              )
            ),
            Q.Lambda(
              "listRef",
              Q.Let(
                {
                  listDoc: Q.Get(Q.Var("listRef")),
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
