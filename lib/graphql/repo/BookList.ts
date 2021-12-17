import { Client, query as Q, Var } from "faunadb";

export type BookListQueryInput = {
  sourceId: string;
  sourceType: string;
  size: number | null;
  before: string | null;
  after: string | null;
};

export type BookListQuery = {
  before: string | null;
  after: string | null;
  data: {
    id: string;
    author: {
      id: string;
      name: string;
      description: string;
    };
    image: string;
    description: string;
    listPrice: number;
    price: number;
    bookshopUrl: string;
    publisher: string;
    publishDate: string;
    dimensions: string;
    language: string;
    coverType: string;
    isbn: string;
    pages: number;
  }[];
};

export const getBookList =
  (client: Client) =>
  async ({ sourceId, sourceType, size, before, after }: BookListQueryInput) => {
    const sourceIndex =
      sourceType === "Lists"
        ? "list_items_by_list_ref"
        : "genre_items_by_genre_ref";

    try {
      const result = await client.query(
        Q.Let(
          {
            paginationResults: Q.Map(
              Q.Paginate(
                Q.Match(
                  Q.Index(sourceIndex),
                  Q.Ref(Q.Collection(sourceType), sourceId)
                ),
                {
                  size: size ? size : undefined,
                  after: after
                    ? Q.Ref(Q.Collection(sourceType), after)
                    : undefined,
                  before: before
                    ? Q.Ref(Q.Collection(sourceType), before)
                    : undefined,
                }
              ),
              Q.Lambda(
                "sourceRef",
                Q.Let(
                  {
                    bookDoc: Q.Get(
                      Q.Select(["data", "bookRef"], Q.Get(Q.Var("sourceRef")))
                    ),
                  },
                  {
                    id: Q.Select(["ref", "id"], Q.Var("bookDoc")),
                    author: Q.Let(
                      {
                        authorDoc: Q.Get(
                          Q.Select(["data", "author"], Q.Var("bookDoc"))
                        ),
                      },
                      {
                        id: Q.Select(["ref", "id"], Q.Var("authorDoc")),
                        name: Q.Select(["data", "name"], Q.Var("authorDoc")),
                        description: Q.Select(
                          ["data", "description"],
                          Q.Var("authorDoc")
                        ),
                      }
                    ),
                    image: Q.Select(["data", "image"], Q.Var("bookDoc")),
                    description: Q.Select(
                      ["data", "description"],
                      Q.Var("bookDoc")
                    ),
                    listPrice: Q.Select(
                      ["data", "listPrice"],
                      Q.Var("bookDoc")
                    ),
                    price: Q.Select(["data", "price"], Q.Var("bookDoc")),
                    bookshopUrl: Q.Select(
                      ["data", "bookshopUrl"],
                      Q.Var("bookDoc")
                    ),
                    publisher: Q.Select(
                      ["data", "publisher"],
                      Q.Var("bookDoc")
                    ),
                    publishDate: Q.Select(
                      ["data", "publishDate"],
                      Q.Var("bookDoc")
                    ),
                    dimensions: Q.Select(
                      ["data", "dimensions"],
                      Q.Var("bookDoc")
                    ),
                    language: Q.Select(["data", "language"], Q.Var("bookDoc")),
                    coverType: Q.Select(
                      ["data", "coverType"],
                      Q.Var("bookDoc")
                    ),
                    isbn: Q.Select(["data", "isbn"], Q.Var("bookDoc")),
                    pages: Q.Select(["data", "pages"], Q.Var("bookDoc")),
                  }
                )
              )
            ),
          },
          {
            after: Q.If(
              Q.ContainsPath(["after", 0, "id"], Q.Var("paginationResults")),
              Q.Select(["after", 0, "id"], Q.Var("paginationResults")),
              null
            ),
            data: Q.Select(["data"], Q.Var("paginationResults")),
            before: Q.If(
              Q.ContainsPath(["before", 0, "id"], Q.Var("paginationResults")),
              Q.Select(["before", 0, "id"], Q.Var("paginationResults")),
              null
            ),
          }
        )
      );

      // console.log("get-book-lists", JSON.stringify(result, null, 2));

      return result as BookListQuery;
    } catch (e) {
      console.error(e);
      throw e;
    }
  };
