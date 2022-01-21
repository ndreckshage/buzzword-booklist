import { Client, type ExprArg, type Expr, query as q } from "faunadb";
import { type RootComponentModel } from ".";

const ifComponentType = (
  componentType: string,
  doIf: ExprArg,
  elseIf: ExprArg
) => q.If(q.Equals(q.Var("componentType"), componentType), doIf, elseIf);

const ifOneOfComponentType = (
  componentTypes: string[],
  doIf: ExprArg,
  elseIf: ExprArg
) =>
  q.If(q.ContainsValue(q.Var("componentType"), componentTypes), doIf, elseIf);

export const selectLayoutModelData = (componentDoc: Expr) => ({
  id: q.Select(["ref", "id"], componentDoc),
  componentType: q.Select(["data", "componentType"], componentDoc),
  createdBy: q.Select(["data", "createdBy"], componentDoc),
  title: q.Select(["data", "title"], componentDoc),
  flexDirection: q.Select(["data", "flexDirection"], componentDoc),
  container: q.If(
    q.ContainsPath(["data", "container"], componentDoc),
    q.Select(["data", "container"], componentDoc),
    false
  ),
  componentRefs: q.Map(
    q.Select(["data", "componentRefs"], componentDoc),
    q.Lambda("componentRef", q.Select("id", q.Var("componentRef")))
  ),
});

const selectListModelData = (componentDoc: Expr) => ({
  id: q.Select(["ref", "id"], componentDoc),
  componentType: q.Select(["data", "componentType"], componentDoc),
  sourceType: q.If(
    q.ContainsPath(["data", "sourceType"], componentDoc),
    q.Select(["data", "sourceType"], componentDoc),
    null
  ),
  sourceKey: q.If(
    q.ContainsPath(["data", "sourceKey"], componentDoc),
    q.Select(["data", "sourceKey"], componentDoc),
    null
  ),
  pageSize: q.If(
    q.ContainsPath(["data", "pageSize"], componentDoc),
    q.Select(["data", "pageSize"], componentDoc),
    ifOneOfComponentType(["CarouselComponent", "BookCarouselComponent"], 10, 64)
  ),
});

export default function getComponentsByIds(client: Client) {
  return async (idAndContextArrs: readonly string[]) => {
    try {
      const result = await client.query(
        q.Map(
          idAndContextArrs,
          q.Lambda(
            "idAndContext",
            q.Let(
              {
                id: q.Select("id", q.Var("idAndContext")),
                contextType: q.Select("contextType", q.Var("idAndContext")),
                contextKey: q.Select("contextKey", q.Var("idAndContext")),
              },
              q.Let(
                {
                  componentDoc: q.Get(
                    q.Ref(q.Collection("Components"), q.Var("id"))
                  ),
                },
                q.Let(
                  {
                    componentType: q.Select(
                      ["data", "componentType"],
                      q.Var("componentDoc")
                    ),
                  },
                  q.Merge(
                    {
                      id: q.Select(["ref", "id"], q.Var("componentDoc")),
                      componentType: q.Var("componentType"),
                      contextType: q.Var("contextType"),
                      contextKey: q.Var("contextKey"),
                    },
                    ifComponentType(
                      "LayoutComponent",
                      selectLayoutModelData(q.Var("componentDoc")),
                      ifOneOfComponentType(
                        [
                          // temp
                          "BookCarouselComponent",
                          "BookGridComponent",
                          "BookListComponent",
                          "CarouselComponent",
                          "GridComponent",
                          "ListComponent",
                        ],
                        selectListModelData(q.Var("componentDoc")),
                        q.Select("data", q.Var("componentDoc"))
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
      console.error("get-components-by-ids", e);

      if (e instanceof Error) {
        // @ts-ignore
        throw new Error(e.description || e.message);
      }

      throw e;
    }
  };
}
