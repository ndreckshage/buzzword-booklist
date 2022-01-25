import { query as q, type Client } from "faunadb";
import execIfComponentOwner from "../fql-helpers/exec-if-component-owner";

export type UpdateLayoutComponentInput = {
  layoutId: string;
  componentIds: string[] | null;
  flexDirection: string | null;
  container: boolean | null;
  loggedInAs: string;
};

export type UpdateLayoutComponentOutput = boolean;

export default function updateLayoutComponent(client: Client) {
  return async ({
    layoutId,
    componentIds,
    flexDirection,
    container,
    loggedInAs,
  }: UpdateLayoutComponentInput) => {
    const reorderdComponents =
      componentIds?.map((id) => q.Ref(q.Collection("Components"), id)) ?? null;

    try {
      await client.query(
        q.Let(
          {
            layoutDoc: q.Get(q.Ref(q.Collection("Components"), layoutId)),
          },
          execIfComponentOwner({
            componentDoc: q.Var("layoutDoc"),
            loggedInAs,
            execExpr: q.Let(
              {
                componentRefs: q.Select(
                  ["data", "componentRefs"],
                  q.Var("layoutDoc")
                ),
              },
              q.If(
                q.IsEmpty(
                  // important! dont allow deleting or adding any components someone else owns0..
                  q.Difference(
                    q.Var("componentRefs"),
                    reorderdComponents ?? q.Var("componentRefs")
                  )
                ),
                q.Update(q.Select("ref", q.Var("layoutDoc")), {
                  data: {
                    ...(reorderdComponents
                      ? { componentRefs: reorderdComponents }
                      : {}),
                    ...(flexDirection && ["row", "col"].includes(flexDirection)
                      ? { flexDirection }
                      : {}),
                    ...(typeof container === "boolean" ? { container } : {}),
                  },
                }),
                q.Abort("Unexpected array difference while reordering")
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
