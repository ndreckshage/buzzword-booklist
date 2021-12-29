import { Client, query as Q } from "faunadb";
import { type ComponentModel } from ".";
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
                  selectLayoutModelData({ componentDocVar: "componentDoc" }),
                  null
                )
              )
            )
          )
        )
      );

      return result as ComponentModel[];
    } catch (e) {
      console.error(e);

      if (e instanceof Error) {
        // @ts-ignore
        throw new Error(e.description || e.message);
      }

      throw e;
    }
  };
}
