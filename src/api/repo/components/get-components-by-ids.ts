import { Client, ExprArg, query as Q } from "faunadb";
import { type RootComponentModel } from ".";

export const selectLayoutModelData = ({
  componentDocVar,
}: {
  componentDocVar: string;
}) => ({
  id: Q.Select(["ref", "id"], Q.Var(componentDocVar)),
  componentType: Q.Select(["data", "componentType"], Q.Var(componentDocVar)),
  createdBy: Q.Select(["data", "createdBy"], Q.Var(componentDocVar)),
  title: Q.Select(["data", "title"], Q.Var(componentDocVar)),
  styleOptions: Q.Select(["data", "styleOptions"], Q.Var(componentDocVar)),
  componentRefs: Q.Map(
    Q.Select(["data", "componentRefs"], Q.Var(componentDocVar)),
    Q.Lambda("componentRef", Q.Select("id", Q.Var("componentRef")))
  ),
  // @TODO layout context
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
                    selectLayoutModelData({ componentDocVar: "componentDoc" }),
                    ifComponentType(
                      "BookCarouselComponent",
                      selectBookCarouselModelData,
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
      console.error(e);

      if (e instanceof Error) {
        // @ts-ignore
        throw new Error(e.description || e.message);
      }

      throw e;
    }
  };
}
