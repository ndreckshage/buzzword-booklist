import { ComponentContextType } from "api/__generated__/resolvers-types";
import { query as Q, type Client } from "faunadb";
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
        Q.Let(
          {
            componentDoc: Q.Get(Q.Ref(Q.Collection("Components"), componentId)),
          },
          execIfComponentOwner({
            componentDoc: Q.Var("componentDoc"),
            loggedInAs,
            execExpr: Q.Replace(Q.Select("ref", Q.Var("componentDoc")), {
              data: {
                componentType: Q.Select(
                  ["data", "componentType"],
                  Q.Var("componentDoc")
                ),
                createdBy: Q.Select(
                  ["data", "createdBy"],
                  Q.Var("componentDoc")
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
