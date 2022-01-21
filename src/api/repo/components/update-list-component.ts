import { ListSourceType } from "api/__generated__/resolvers-types";
import { query as q, type Client } from "faunadb";
import execIfComponentOwner from "../fql-helpers/exec-if-component-owner";

export type updateListComponentInput = {
  componentId: string;
  pageSize: number;
  sourceType?: ListSourceType;
  sourceKey?: string;
  loggedInAs: string;
};

export type updateListComponentOutput = boolean;

export default function updateListComponent(client: Client) {
  return async ({
    componentId,
    sourceType,
    sourceKey,
    pageSize,
    loggedInAs,
  }: updateListComponentInput) => {
    console.log(
      "updateListComponent",
      componentId,
      sourceType,
      sourceKey,
      pageSize,
      loggedInAs
    );

    const sourceData =
      sourceType && Object.values(ListSourceType).includes(sourceType)
        ? {
            sourceType,
            sourceKey: sourceKey ?? "",
          }
        : {};

    try {
      await client.query(
        q.Let(
          {
            componentDoc: q.Get(q.Ref(q.Collection("Components"), componentId)),
          },
          execIfComponentOwner({
            componentDoc: q.Var("componentDoc"),
            loggedInAs,
            execExpr: q.Replace(q.Select("ref", q.Var("componentDoc")), {
              data: {
                componentType: q.Select(
                  ["data", "componentType"],
                  q.Var("componentDoc")
                ),
                createdBy: q.Select(
                  ["data", "createdBy"],
                  q.Var("componentDoc")
                ),
                ...sourceData,
                ...(pageSize && pageSize < 64 ? { pageSize } : {}),
              },
            }),
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
