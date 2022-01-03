import { type Client, query as Q } from "faunadb";

export type CreateLayoutInput = { title: string; loggedInAs: string };
export type CreateLayoutOutput = boolean;

export default function createLayout(client: Client) {
  return async ({ title, loggedInAs }: CreateLayoutInput) => {
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

    return !!layout as CreateLayoutOutput;
  };
}
