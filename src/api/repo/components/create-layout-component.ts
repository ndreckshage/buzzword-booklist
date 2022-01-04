import { type Client, query as Q } from "faunadb";

export type CreateLayoutComponentInput = { title: string; loggedInAs: string };
export type CreateLayoutComponentOutput = boolean;

export default function createLayoutComponent(client: Client) {
  return async ({ title, loggedInAs }: CreateLayoutComponentInput) => {
    const layout = await client.query(
      Q.Create("Components", {
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
