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

const selectBookListModelData = (componentDoc: Expr) => ({
  id: Q.Select(["ref", "id"], componentDoc),
  componentType: Q.Select(["data", "componentType"], componentDoc),
  sourceType: Q.If(
    Q.ContainsPath(["data", "sourceType"], componentDoc),
    Q.Select(["data", "sourceType"], componentDoc),
    null
  ),
  sourceKey: Q.If(
    Q.ContainsPath(["data", "sourceKey"], componentDoc),
    Q.Select(["data", "sourceKey"], componentDoc),
    null
  ),
});

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
                    ifOneOfComponentType(
                      [
                        "BookCarouselComponent",
                        "BookGridComponent",
                        "BookListComponent",
                      ],
                      selectBookListModelData(Q.Var("componentDoc")),
                      Q.Select("data", Q.Var("componentDoc"))
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
      console.error("get-components-by-ids", e);

      if (e instanceof Error) {
        // @ts-ignore
        throw new Error(e.description || e.message);
      }

      throw e;
    }
  };
}
