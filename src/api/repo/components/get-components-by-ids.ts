import { Client, type ExprArg, type Expr, query as Q } from "faunadb";
import { type RootComponentModel } from ".";

export const selectLayoutModelData = (componentDoc: Expr) => ({
  id: Q.Select(["ref", "id"], componentDoc),
  componentType: Q.Select(["data", "componentType"], componentDoc),
  createdBy: Q.Select(["data", "createdBy"], componentDoc),
  title: Q.Select(["data", "title"], componentDoc),
  styleOptions: Q.Select(["data", "styleOptions"], componentDoc),
  componentRefs: Q.Map(
    Q.Select(["data", "componentRefs"], componentDoc),
    Q.Lambda("componentRef", Q.Select("id", Q.Var("componentRef")))
  ),
});

const selectBookCarouselModelData = {
  id: Q.Select(["ref", "id"], Q.Var("componentDoc")),
  componentType: Q.Select(["data", "componentType"], Q.Var("componentDoc")),
  sourceType: Q.Select(
    ["data", "sourceRef", "collection", "id"],
    Q.Var("componentDoc")
  ),
  sourceId: Q.Select(["data", "sourceRef", "id"], Q.Var("componentDoc")),
};

const ifComponentType = (
  componentType: string,
  doIf: ExprArg,
  elseIf: ExprArg
) => Q.If(Q.Equals(Q.Var("componentType"), componentType), doIf, elseIf);

const ifOneOfComponentType = (
  componentTypes: string[],
  doIf: ExprArg,
  elseIf: ExprArg
) =>
  Q.If(Q.ContainsValue(Q.Var("componentType"), componentTypes), doIf, elseIf);

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
                  ifComponentType(
                    "LayoutComponent",
                    selectLayoutModelData(Q.Var("componentDoc")),
                    ifComponentType(
                      "BookCarouselComponent",
                      selectBookCarouselModelData,
                      ifOneOfComponentType(
                        ["BookGridComponent"],
                        Q.Select("data", Q.Var("componentDoc")),
                        Q.Select("data", Q.Var("componentDoc"))
                      )
                    )
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
