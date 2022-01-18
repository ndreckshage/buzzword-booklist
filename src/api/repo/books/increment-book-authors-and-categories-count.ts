import { type Client, query as Q, Add } from "faunadb";

export default async function incrementBookAuthorsAndCategoriesCount(
  client: Client,
  googleBooksVolumeId: string,
  increment: boolean
) {
  try {
    await client.query(
      Q.Let(
        {
          bookDoc: Q.Get(
            Q.Match(
              Q.Index("unique_books_by_googleBooksVolumeId"),
              googleBooksVolumeId
            )
          ),
        },
        Q.Let(
          {
            bookRef: Q.Select(["ref"], Q.Var("bookDoc")),
            authorRefs: Q.Select(["data", "authorRefs"], Q.Var("bookDoc")),
            categoryRefs: Q.Select(["data", "categoryRefs"], Q.Var("bookDoc")),
          },
          Q.Do(
            Q.Update(Q.Var("bookRef"), {
              data: {
                listCount: Add(
                  increment ? 1 : -1,
                  Q.If(
                    Q.ContainsPath(["data", "listCount"], Q.Var("bookDoc")),
                    Q.Select(["data", "listCount"], Q.Var("bookDoc")),
                    0
                  )
                ),
              },
            }),
            Q.Map(
              Q.Var("authorRefs"),
              Q.Lambda(
                "authorRef",
                Q.Let(
                  {
                    authorDoc: Q.Get(Q.Var("authorRef")),
                  },
                  Q.Update(Q.Var("authorRef"), {
                    data: {
                      listCount: Add(
                        increment ? 1 : -1,
                        Q.If(
                          Q.ContainsPath(
                            ["data", "listCount"],
                            Q.Var("authorDoc")
                          ),
                          Q.Select(["data", "listCount"], Q.Var("authorDoc")),
                          0
                        )
                      ),
                    },
                  })
                )
              )
            ),
            Q.Map(
              Q.Var("categoryRefs"),
              Q.Lambda(
                "categoryRef",
                Q.Let(
                  {
                    categoryDoc: Q.Get(Q.Var("categoryRef")),
                  },
                  Q.Update(Q.Var("categoryRef"), {
                    data: {
                      listCount: Add(
                        increment ? 1 : -1,
                        Q.If(
                          Q.ContainsPath(
                            ["data", "listCount"],
                            Q.Var("categoryDoc")
                          ),
                          Q.Select(["data", "listCount"], Q.Var("categoryDoc")),
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
