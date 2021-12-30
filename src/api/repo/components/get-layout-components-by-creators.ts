import { Client, query as Q } from "faunadb";
import { selectLayoutModelData } from "./get-components-by-ids";
import { RootComponentModel } from ".";

export default function getLayoutComponentsByCreators(client: Client) {
  return async (creators: readonly string[]) => {
    try {
      const result = await client.query(
        Q.Map(
          creators,
          Q.Lambda(
            "createdBy",
            Q.Filter(
              Q.Map(
                // @NOTE not supporting pagination to reduce complexity
                Q.Select(
                  "data",
                  Q.Paginate(
                    Q.Match(
                      Q.Index("components_by_createdBy"),
                      Q.Var("createdBy")
                    )
                  )
                ),
                Q.Lambda(
                  "componentRef",
                  Q.Let(
                    {
                      componentDoc: Q.Get(Q.Var("componentRef")),
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
                        selectLayoutModelData({
                          componentDocVar: "componentDoc",
                        }),
                        null
                      )
                    )
                  )
                )
              ),
              Q.Lambda("layoutData", Q.IsObject(Q.Var("layoutData")))
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
