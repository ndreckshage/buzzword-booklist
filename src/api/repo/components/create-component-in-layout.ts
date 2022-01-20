import { ComponentContextType } from "api/__generated__/resolvers-types";
import { type Client, query as q } from "faunadb";
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

        case "BookImageComponent":
        case "BookTitleComponent":
        case "BookActionComponent":
        case "BookAuthorsComponent":
        case "BookCategoriesComponent":
        case "BookDetailsComponent":
          return {
            componentType,
            createdBy: loggedInAs,
          };

        case "CarouselComponent":
        case "GridComponent":
        case "ListComponent":
          return {
            componentType,
            createdBy: loggedInAs,
          };

        case "MarkdownComponent":
          return {
            componentType,
            text: "",
            backgroundColor: "inherit",
            createdBy: loggedInAs,
          };

        default:
          throw new Error("invalid component");
      }
    })();

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
                componentDoc: q.Create("Components", { data: componentData }),
              },
              q.Update(q.Select("ref", q.Var("layoutDoc")), {
                data: {
                  componentRefs: q.Append(
                    q.Select("ref", q.Var("componentDoc")),
                    q.Select(["data", "componentRefs"], q.Var("layoutDoc"))
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
