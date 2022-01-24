import { BookSourceType } from "api/__generated__/resolvers-types";
import { query as q, type Client } from "faunadb";
import execIfComponentOwner from "../fql-helpers/exec-if-component-owner";

export type updateBookComponentInput = {
  componentId: string;
  bookSourceType?: BookSourceType;
  sourceKey?: string;
  loggedInAs: string;
};

export type updateBookComponentOutput = boolean;

export default function updateBookComponent(client: Client) {
  return async ({
    componentId,
    bookSourceType,
    sourceKey,
    loggedInAs,
  }: updateBookComponentInput) => {
    console.log(
      "updateBookComponent",
      componentId,
      bookSourceType,
      sourceKey,
      loggedInAs
    );

    const sourceData =
      bookSourceType && Object.values(BookSourceType).includes(bookSourceType)
        ? {
            bookSourceType,
            sourceKey:
              bookSourceType === BookSourceType.None ? "" : sourceKey ?? "",
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
