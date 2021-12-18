import { Client, query as Q, Var } from "faunadb";
import { ComponentQuery } from "./Component";

export type LayoutQuery = {
  id: string;
  layoutType: string;
  components: ComponentQuery[];
};

export const getLayouts =
  (client: Client) => async (keys: readonly string[]) => {
    const result = await client.query(
      Q.Map(
        keys,
        Q.Lambda(
          "key",
          Q.Let(
            {
              layoutDoc: Q.Get(Q.Match(Q.Index("layout_by_key"), Q.Var("key"))),
            },
            {
              id: Q.Select(["ref", "id"], Q.Var("layoutDoc")),
              layoutType: Q.Select(["data", "layoutType"], Q.Var("layoutDoc")),
              components: Q.Map(
                Q.Select(["data", "componentRefs"], Q.Var("layoutDoc")),
                Q.Lambda(
                  "componentRef",
                  Q.Let(
                    {
                      componentDoc: Q.Get(Q.Var("componentRef")),
                    },
                    {
                      id: Q.Select(["ref", "id"], Q.Var("componentDoc")),
                      componentType: Q.Select(
                        ["data", "componentType"],
                        Q.Var("componentDoc")
                      ),
                    }
                  )
                )
              ),
            }
          )
        )
      )
    );

    // console.log('get-layouts', JSON.stringify(result, null, 2));

    return result as Promise<LayoutQuery[]>;
  };
