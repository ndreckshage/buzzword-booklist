import { type Client, query as Q } from "faunadb";
import execIfLayoutOwner from "../fql-helpers/exec-if-layout-owner";

export type CreateComponentInLayoutInput = {
  layoutId: string;
  componentType: string;
  loggedInAs: string;
};

export type CreateComponentInLayoutOutput = boolean;

export default function createComponentInLayout(client: Client) {
  return async ({
    layoutId,
    componentType,
    loggedInAs,
  }: CreateComponentInLayoutInput) => {
    console.log("create...", layoutId, componentType, loggedInAs);

    const componentData = (() => {
      switch (componentType) {
        case "HeroComponent":
          return {
            componentType,
            title: "",
            subTitle: "",
            createdBy: loggedInAs,
          };

        default:
          throw new Error("invalid component");
      }
    })();

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
                componentDoc: Q.Create("Components", { data: componentData }),
              },
              Q.Update(Q.Select("ref", Q.Var("layoutDoc")), {
                data: {
                  componentRefs: Q.Append(
                    Q.Select("ref", Q.Var("componentDoc")),
                    Q.Select(["data", "componentRefs"], Q.Var("layoutDoc"))
                  ),
                },
              })
            ),
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
