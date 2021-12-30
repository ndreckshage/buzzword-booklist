import { Client, query as Q, query } from "faunadb";
import { type RootComponentModel } from ".";
import { selectLayoutModelData } from "./get-components-by-ids";
import { QueryLayoutComponentArgs } from "api/__generated__/resolvers-types";

export default function getLayoutComponentsByIdsAndContext(client: Client) {
  return async (queryLayoutArgs: readonly QueryLayoutComponentArgs[]) => {
    try {
      const result = await client.query(
        Q.Map(
          queryLayoutArgs,
          Q.Lambda(
            "queryLayoutArgs",
            Q.Let(
              { id: Q.Select("id", Q.Var("queryLayoutArgs")) },
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
        )
      );

      return result as RootComponentModel[];
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
