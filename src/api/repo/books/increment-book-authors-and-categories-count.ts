import { type Client, query as q, Add } from "faunadb";

export default async function incrementBookAuthorsAndCategoriesCount(
  client: Client,
  googleBooksVolumeId: string,
  increment: boolean
) {
  try {
    await client.query(
      q.Let(
        {
          bookDoc: q.Get(
            q.Match(
              q.Index("unique_books_by_googleBooksVolumeId"),
              googleBooksVolumeId
            )
          ),
        },
        q.Let(
          {
            bookRef: q.Select(["ref"], q.Var("bookDoc")),
            authorRefs: q.Select(["data", "authorRefs"], q.Var("bookDoc")),
            categoryRefs: q.Select(["data", "categoryRefs"], q.Var("bookDoc")),
          },
          q.Do(
            q.Update(q.Var("bookRef"), {
              data: {
                listCount: Add(
                  increment ? 1 : -1,
                  q.If(
                    q.ContainsPath(["data", "listCount"], q.Var("bookDoc")),
                    q.Select(["data", "listCount"], q.Var("bookDoc")),
                    0
                  )
                ),
              },
            }),
            q.Map(
              q.Var("authorRefs"),
              q.Lambda(
                "authorRef",
                q.Let(
                  {
                    authorDoc: q.Get(q.Var("authorRef")),
                  },
                  q.Update(q.Var("authorRef"), {
                    data: {
                      listCount: Add(
                        increment ? 1 : -1,
                        q.If(
                          q.ContainsPath(
                            ["data", "listCount"],
                            q.Var("authorDoc")
                          ),
                          q.Select(["data", "listCount"], q.Var("authorDoc")),
                          0
                        )
                      ),
                    },
                  })
                )
              )
            ),
            q.Map(
              q.Var("categoryRefs"),
              q.Lambda(
                "categoryRef",
                q.Let(
                  {
                    categoryDoc: q.Get(q.Var("categoryRef")),
                  },
                  q.Update(q.Var("categoryRef"), {
                    data: {
                      listCount: Add(
                        increment ? 1 : -1,
                        q.If(
                          q.ContainsPath(
                            ["data", "listCount"],
                            q.Var("categoryDoc")
                          ),
                          q.Select(["data", "listCount"], q.Var("categoryDoc")),
                          0
                        )
                      ),
                    },
                  })
                )
              )
            )
          )
        )
      )
    );
  } catch (e) {
    console.error("incrementBookAuthorsAndCategoriesCount", e);
    if (e instanceof Error) {
      // @ts-ignore
      throw new Error(e.description || e.message);
    }

    throw e;
  }

  return true;
}
