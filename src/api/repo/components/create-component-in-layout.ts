import { ComponentContextType } from "api/__generated__/resolvers-types";
import { type Client, query as Q } from "faunadb";
import execIfComponentOwner from "../fql-helpers/exec-if-component-owner";

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
        case "LayoutComponent":
          return {
            componentType,
            title: "Nested layout",
            createdBy: loggedInAs,
            flexDirection: "col",
            componentRefs: [],
          };

        case "BookCarouselComponent":
        case "BookGridComponent":
        case "BookListComponent":
          return {
            componentType,
            createdBy: loggedInAs,
          };

        case "MarkdownComponent":
          return {
            componentType,
            text: "",
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
          execIfComponentOwner({
            componentDoc: Q.Var("layoutDoc"),
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
