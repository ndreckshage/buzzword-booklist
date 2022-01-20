import { type Client, query as q } from "faunadb";
import { type BookModel } from ".";

export default function getBooksByListIds(client: Client) {
  return async (listIds: readonly string[]) => {
    try {
      return (await client.query(
        q.Map(
          listIds,
          q.Lambda(
            "listId",
            q.Let(
              {
                listDoc: q.Get(q.Ref(q.Collection("Lists"), q.Var("listId"))),
              },
              q.Map(
                q.Select(["data", "bookRefs"], q.Var("listDoc")),
                q.Lambda(
                  "bookRef",
                  q.Let(
                    {
                      bookDoc: q.Get(q.Var("bookRef")),
                    },
                    {
                      id: q.Select(["ref", "id"], q.Var("bookDoc")),
                      googleBooksVolumeId: q.Select(
                        ["data", "googleBooksVolumeId"],
                        q.Var("bookDoc")
                      ),
                      title: q.Select(["data", "title"], q.Var("bookDoc")),
                      publisher: q.Select(
                        ["data", "publisher"],
                        q.Var("bookDoc")
                      ),
                      publishedDate: q.Select(
                        ["data", "publishedDate"],
                        q.Var("bookDoc")
                      ),
                      description: q.Select(
                        ["data", "description"],
                        q.Var("bookDoc")
                      ),
                      isbn: q.Select(["data", "isbn"], q.Var("bookDoc")),
                      pageCount: q.Select(
                        ["data", "pageCount"],
                        q.Var("bookDoc")
                      ),
                      image: q.Select(["data", "image"], q.Var("bookDoc")),
                    }
                  )
                )
              )
            )
          )
        )
      )) as BookModel[];
    } catch (e) {
      console.error("get-books-by-list-ids", e);

      if (e instanceof Error) {
        // @ts-ignore
        throw new Error(e.description || e.message);
      }

      throw e;
    }
  };
}
