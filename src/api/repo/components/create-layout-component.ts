import { type Client, query as q } from "faunadb";

export type CreateLayoutComponentInput = { title: string; loggedInAs: string };
export type CreateLayoutComponentOutput = boolean;

export default function createLayoutComponent(client: Client) {
  return async ({ title, loggedInAs }: CreateLayoutComponentInput) => {
    if (!title) {
      throw new Error("missing title");
    }

    const layout = await client.query(
      q.Create("Components", {
        data: {
          componentType: "LayoutComponent",
          title,
          createdBy: loggedInAs,
          flexDirection: "col",
          componentRefs: [],
        },
      })
    );

    return !!layout as CreateLayoutComponentOutput;
  };
}
