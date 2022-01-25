import { Client, query as q } from "faunadb";
import { selectLayoutModelData } from "./get-components-by-ids";
import { RootComponentModel } from ".";

export default function getLayoutComponentsByCreators(client: Client) {
  return async (creators: readonly string[]) => {
    try {
      const result = await client.query(
        q.Map(
          creators,
          q.Lambda(
            "createdBy",
            q.Map(
              // @NOTE not supporting pagination to reduce complexity
              q.Select(
                "data",
                q.Paginate(
                  q.Reverse(
                    q.Match(
                      q.Index(
                        "components_by_createdBy_and_isRoot_and_componentType"
                      ),
                      [q.Var("createdBy"), true, "LayoutComponent"]
                    )
                  )
                )
              ),
              q.Lambda(
                "componentRef",
                q.Let(
                  {
                    componentDoc: q.Get(q.Var("componentRef")),
                  },
                  q.Let(
                    {
                      componentType: q.Select(
                        ["data", "componentType"],
                        q.Var("componentDoc")
                      ),
                    },
                    q.If(
                      q.Equals(q.Var("componentType"), "LayoutComponent"),
                      selectLayoutModelData(q.Var("componentDoc")),
                      null
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
