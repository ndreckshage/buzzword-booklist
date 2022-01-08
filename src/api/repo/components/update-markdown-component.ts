import { query as Q, type Client } from "faunadb";
import execIfComponentOwner from "../fql-helpers/exec-if-component-owner";

export type UpdateMarkdownComponentInput = {
  componentId: string;
  text: string;
  loggedInAs: string;
};

export type UpdateMarkdownComponentOutput = boolean;

export default function updateMarkdownComponent(client: Client) {
  return async ({
    componentId,
    text,
    loggedInAs,
  }: UpdateMarkdownComponentInput) => {
    console.log("updateMarkdownComponent", componentId, text, loggedInAs);

    try {
      await client.query(
        Q.Let(
          {
            componentDoc: Q.Get(Q.Ref(Q.Collection("Components"), componentId)),
          },
          execIfComponentOwner({
            componentDoc: Q.Var("componentDoc"),
            loggedInAs,
            execExpr: Q.Update(Q.Select("ref", Q.Var("componentDoc")), {
              data: {
                text,
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
