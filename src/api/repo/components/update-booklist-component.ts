import { ComponentContextType } from "api/__generated__/resolvers-types";
import { query as q, type Client } from "faunadb";
import execIfComponentOwner from "../fql-helpers/exec-if-component-owner";

export type UpdateBooklistComponentInput = {
  componentId: string;
  sourceType?: ComponentContextType;
  sourceKey?: string;
  loggedInAs: string;
};

export type UpdateBooklistComponentOutput = boolean;

export default function updateBooklistComponent(client: Client) {
  return async ({
    componentId,
    sourceType,
    sourceKey,
    loggedInAs,
  }: UpdateBooklistComponentInput) => {
    console.log(
      "updateBooklistComponent",
      componentId,
      sourceType,
      sourceKey,
      loggedInAs
    );

    const data =
      sourceKey &&
      sourceType &&
      [
        ComponentContextType.Author,
        ComponentContextType.Category,
        ComponentContextType.List,
      ].includes(sourceType)
        ? {
            sourceType,
            sourceKey,
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
                ...data,
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
