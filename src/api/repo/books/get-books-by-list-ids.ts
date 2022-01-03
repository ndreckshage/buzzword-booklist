import { type Client, query as Q } from "faunadb";
import { type BookModel } from ".";

export default function getBooksByListIds(client: Client) {
  return async (listIds: readonly string[]) => {
    try {
      return (await client.query(
        Q.Map(
          listIds,
          Q.Lambda(
            "listId",
            Q.Let(
              {
                listDoc: Q.Get(Q.Ref(Q.Collection("Lists"), Q.Var("listId"))),
              },
              Q.Map(
                Q.Select(["data", "bookRefs"], Q.Var("listDoc")),
                Q.Lambda(
                  "bookRef",
                  Q.Let(
                    {
                      bookDoc: Q.Get(Q.Var("bookRef")),
                    },
                    {
                      id: Q.Select(["ref", "id"], Q.Var("bookDoc")),
                      googleBooksVolumeId: Q.Select(
                        ["data", "googleBooksVolumeId"],
                        Q.Var("bookDoc")
                      ),
                      title: Q.Select(["data", "title"], Q.Var("bookDoc")),
                      publisher: Q.Select(
                        ["data", "publisher"],
                        Q.Var("bookDoc")
                      ),
                      publishedDate: Q.Select(
                        ["data", "publishedDate"],
                        Q.Var("bookDoc")
                      ),
                      description: Q.Select(
                        ["data", "description"],
                        Q.Var("bookDoc")
                      ),
                      isbn: Q.Select(["data", "isbn"], Q.Var("bookDoc")),
                      pageCount: Q.Select(
                        ["data", "pageCount"],
                        Q.Var("bookDoc")
                      ),
                      image: Q.Select(["data", "image"], Q.Var("bookDoc")),
                    }
                  )
                )
              )
            )
          )
        )
      )) as BookModel[];
    } catch (e) {
      if (e instanceof Error) {
        // @ts-ignore
        throw new Error(e.description || e.message);
      }

      throw e;
    }
  };
}
