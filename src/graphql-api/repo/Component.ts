import { Client, query as Q } from "faunadb";

export type ComponentQuery = { id: string; componentType: string };

export const getComponents =
  (client: Client) => async (ids: readonly string[]) => {
    console.log("get components", ids);

    const result = await client.query(
      Q.Map(
        ids,
        Q.Lambda(
          "id",
          Q.Let(
            {
              componentRef: Q.Ref(Q.Collection("Components"), Q.Var("id")),
            },
            Q.Let(
              { componentDoc: Q.Get(Q.Var("componentRef")) },
              Q.Merge(
                {
                  id: Q.Select("id", Q.Var("componentRef")),
                  componentType: Q.Select(
                    ["data", "componentType"],
                    Q.Var("componentDoc")
                  ),
                },
                Q.Select(["data", "componentData"], Q.Var("componentDoc"))
              )
            )
          )
        )
      )
    );

    return result as Promise<ComponentQuery[]>;
  };
