import { query as Q, type Client } from "faunadb";
import execIfLayoutOwner from "../fql-helpers/exec-if-layout-owner";

type UpdateLayoutComponentInput = {
  layoutId: string;
  componentIds: string[] | null;
  flexDirection: string | null;
  loggedInAs: string;
};

type UpdateLayoutComponentOutput = boolean;

export default function updateLayoutComponent(client: Client) {
  return async ({
    layoutId,
    componentIds,
    flexDirection,
    loggedInAs,
  }: UpdateLayoutComponentInput) => {
    const reorderdComponents =
      componentIds?.map((id) => Q.Ref(Q.Collection("Components"), id)) ?? null;

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
                  // important! dont allow deleting or adding any components someone else owns0..
                  Q.Difference(
                    Q.Var("componentRefs"),
                    reorderdComponents ?? Q.Var("componentRefs")
                  )
                ),
                Q.Update(Q.Select("ref", Q.Var("layoutDoc")), {
                  data: {
                    ...(reorderdComponents
                      ? { componentRefs: reorderdComponents }
                      : {}),
                    ...(flexDirection && ["row", "col"].includes(flexDirection)
                      ? { flexDirection }
                      : {}),
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
