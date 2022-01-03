import { query as Q, type Client } from "faunadb";
import execIfLayoutOwner from "../fql-helpers/exec-if-layout-owner";

export default function reorderComponentsInLayout(client: Client) {
  return async ({
    layoutId,
    componentIds,
    loggedInAs,
  }: {
    layoutId: string;
    componentIds: string[];
    loggedInAs: string;
  }) => {
    const reorderdComponents = componentIds.map((id) =>
      Q.Ref(Q.Collection("Components"), id)
    );

    try {
      await client.query(
        Q.Let(
          {
            layoutDoc: Q.Get(Q.Ref(Q.Collection("Components"), layoutId)),
          },
          execIfLayoutOwner({
            layoutDoc: Q.Var("layoutDoc"),
            loggedInAs,
            execExpr: Q.Let(
              {
                componentRefs: Q.Select(
                  ["data", "componentRefs"],
                  Q.Var("layoutDoc")
                ),
              },
              Q.If(
                Q.IsEmpty(
                  Q.Difference(Q.Var("componentRefs"), reorderdComponents)
                ),
                Q.Update(Q.Select("ref", Q.Var("layoutDoc")), {
                  data: {
                    componentRefs: reorderdComponents,
                  },
                }),
                Q.Abort("Unexpected array difference while reordering")
              )
            ),
          })
        )
      );
    } catch (e) {
      if (e instanceof Error) {
        // @ts-ignore
        throw new Error(e.description || e.message);
      }

      throw e;
    }

    return true;
  };
}
