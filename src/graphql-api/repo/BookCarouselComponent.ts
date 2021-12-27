import { Client, query as Q } from "faunadb";

export type BookCarouselComponentQuery = {
  id: string;
  title: string;
  sourceType: string;
  sourceId: string;
  count: number;
};

export const getBookCarouselComponents =
  (client: Client) => async (componentIds: readonly string[]) => {
    try {
      const result = await client.query(
        Q.Map(
          componentIds,
          Q.Lambda(
            "componentId",
            Q.Let(
              {
                componentDoc: Q.Get(
                  Q.Ref(Q.Collection("Components"), Q.Var("componentId"))
                ),
              },
              Q.Let(
                {
                  dataRef: Q.Select(["data", "dataRef"], Q.Var("componentDoc")),
                  dataRefType: Q.Select(
                    ["data", "dataRef", "collection", "id"],
                    Q.Var("componentDoc")
                  ),
                },
                {
                  id: Q.Select(["ref", "id"], Q.Var("componentDoc")),
                  title: Q.Select(["data", "name"], Q.Get(Q.Var("dataRef"))),
                  sourceId: Q.Select(["id"], Q.Var("dataRef")),
                  sourceType: Q.Var("dataRefType"),
                  count: Q.Count(
                    Q.Match(
                      Q.If(
                        Q.Equals(Q.Var("dataRefType"), "Lists"),
                        Q.Index("list_items_by_list_ref"),
                        Q.Index("genre_items_by_genre_ref")
                      ),
                      Q.Var("dataRef")
                    )
                  ),
                }
              )
            )
          )
        )
      );

      // console.log(
      //   "get-book-carousel-components",
      //   JSON.stringify(result, null, 2)
      // );

      return result as Promise<BookCarouselComponentQuery[]>;
    } catch (e) {
      console.error(e);
      throw e;
    }
  };
