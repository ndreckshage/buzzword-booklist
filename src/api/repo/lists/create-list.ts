import { type Client, query as q } from "faunadb";
import slugify from "slugify";

export type CreateListInput = { title: string; loggedInAs: string };
export type CreateListOutput = boolean;

export default function createList(client: Client) {
  return async ({ title, loggedInAs }: CreateListInput) => {
    const key = slugify(title, { lower: true, strict: true });

    if (!title) {
      throw new Error("missing title");
    }

    const list = await client.query(
      q.Let(
        {
          listMatch: q.Match(q.Index("unique_lists_by_key"), key),
        },
        q.If(
          q.Exists(q.Var("listMatch")),
          null,
          q.Select(
            "ref",
            q.Create("Lists", {
              data: { title, key, createdBy: loggedInAs, bookRefs: [] },
            })
          )
        )
      )
    );

    return !!list as CreateListOutput;
  };
}
