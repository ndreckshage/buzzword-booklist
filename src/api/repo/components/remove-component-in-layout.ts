import { type Client, query as q } from "faunadb";
import execIfComponentOwner from "../fql-helpers/exec-if-component-owner";

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
        q.Let(
          {
            layoutDoc: q.Get(q.Ref(q.Collection("Components"), layoutId)),
          },
          execIfComponentOwner({
            componentDoc: q.Var("layoutDoc"),
            loggedInAs,
            execExpr: q.Update(q.Select("ref", q.Var("layoutDoc")), {
              data: {
                componentRefs: q.Difference(
                  q.Select(["data", "componentRefs"], q.Var("layoutDoc")),
                  [q.Ref(q.Collection("Components"), componentId)]
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
