import { Client, query as Q } from "faunadb";
import { type ComponentModel } from ".";

export const selectLayoutModelData = ({
  componentDocVar,
}: {
  componentDocVar: string;
}) => ({
  id: Q.Select(["ref", "id"], Q.Var(componentDocVar)),
  componentType: Q.Select(["data", "componentType"], Q.Var(componentDocVar)),
  componentRefs: Q.Map(
    Q.Select(["data", "componentRefs"], Q.Var(componentDocVar)),
    Q.Lambda("componentRef", Q.Select("id", Q.Var("componentRef")))
  ),
});

export default function getComponentsByIds(client: Client) {
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
                Q.Merge(
                  {
                    id: Q.Select(["ref", "id"], Q.Var("componentDoc")),
                    componentType: Q.Var("componentType"),
                  },
                  Q.If(
                    Q.Equals(Q.Var("componentType"), "LayoutComponent"),
                    selectLayoutModelData({ componentDocVar: "componentDoc" }),
                    Q.Select("data", Q.Var("componentDoc"))
                  )
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
