import { type Client, query as Q } from "faunadb";
import execIfLayoutOwner from "../fql-helpers/exec-if-layout-owner";

export type RemoveComponentInLayoutInput = {
  layoutId: string;
  componentId: string;
  loggedInAs: string;
};

export type RemoveComponentInLayoutOutput = boolean;

export default function removeComponentInLayout(client: Client) {
  return async ({
    layoutId,
    componentId,
    loggedInAs,
  }: RemoveComponentInLayoutInput) => {
    console.log("removeComponentInLayout", layoutId, componentId, loggedInAs);

    try {
      await client.query(
        Q.Let(
          {
            layoutDoc: Q.Get(Q.Ref(Q.Collection("Components"), layoutId)),
          },
          execIfLayoutOwner({
            layoutDoc: Q.Var("layoutDoc"),
            loggedInAs,
            execExpr: Q.Update(Q.Select("ref", Q.Var("layoutDoc")), {
              data: {
                componentRefs: Q.Difference(
                  Q.Select(["data", "componentRefs"], Q.Var("layoutDoc")),
                  [Q.Ref(Q.Collection("Components"), componentId)]
                ),
              },
            }),
          })
        )
      );
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        // @ts-ignore
        throw new Error(e.description || e.message);
      }

      throw e;
    }

    return true;
  };
}
