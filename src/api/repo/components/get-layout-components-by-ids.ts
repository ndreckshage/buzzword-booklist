import { Client, query as Q, query } from "faunadb";
import { type RootComponentModel } from ".";
import { selectLayoutModelData } from "./get-components-by-ids";

export default function getLayoutComponentsByIds(client: Client) {
  return async (ids: readonly string[]) => {
    try {
      const result = await client.query(
        Q.Map(
          ids,
          Q.Lambda(
            "id",
            Q.Let(
              {
                componentDoc: Q.Get(
                  Q.Ref(Q.Collection("Components"), Q.Var("id"))
                ),
              },
              Q.Let(
                {
                  componentType: Q.Select(
                    ["data", "componentType"],
                    Q.Var("componentDoc")
                  ),
                },
                Q.If(
                  Q.Equals(Q.Var("componentType"), "LayoutComponent"),
                  selectLayoutModelData(Q.Var("componentDoc")),
                  null
                )
              )
            )
          )
        )
      );

      return result as RootComponentModel[];
    } catch (e) {
      console.error("get-layout-components-by-ids", e);

      if (e instanceof Error) {
        // @ts-ignore
        throw new Error(e.description || e.message);
      }

      throw e;
    }
  };
}
