import { query as q, type Client } from "faunadb";
import execIfComponentOwner from "../fql-helpers/exec-if-component-owner";

export type UpdateMarkdownComponentInput = {
  componentId: string;
  text: string;
  loggedInAs: string;
  backgroundColor: string;
};

export type UpdateMarkdownComponentOutput = boolean;

export default function updateMarkdownComponent(client: Client) {
  return async ({
    componentId,
    text,
    backgroundColor,
    loggedInAs,
  }: UpdateMarkdownComponentInput) => {
    console.log("updateMarkdownComponent", componentId, text, loggedInAs);

    try {
      await client.query(
        q.Let(
          {
            componentDoc: q.Get(q.Ref(q.Collection("Components"), componentId)),
          },
          execIfComponentOwner({
            componentDoc: q.Var("componentDoc"),
            loggedInAs,
            execExpr: q.Update(q.Select("ref", q.Var("componentDoc")), {
              data: {
                text,
                backgroundColor,
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
