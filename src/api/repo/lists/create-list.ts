import { type Client, query as Q } from "faunadb";
import slugify from "slugify";

export type CreateListInput = { title: string; loggedInAs: string };
export type CreateListOutput = boolean;

export default function createList(client: Client) {
  return async ({ title, loggedInAs }: CreateListInput) => {
    const key = slugify(title, { lower: true, strict: true });

    const list = await client.query(
      Q.Let(
        {
          listMatch: Q.Match(Q.Index("unique_lists_by_key"), key),
        },
        Q.If(
          Q.Exists(Q.Var("listMatch")),
          null,
          Q.Select(
            "ref",
            Q.Create("Lists", {
              data: { title, key, createdBy: loggedInAs, bookRefs: [] },
            })
          )
        )
      )
    );

    return !!list as CreateListOutput;
  };
}
