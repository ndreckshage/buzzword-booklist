import { Client, query as Q, type Expr } from "faunadb";

const selectBookRefs = ({
  sourceDoc,
  sourceType,
}: {
  sourceDoc: Expr;
  sourceType: Expr;
}) =>
  Q.If(
    Q.Equals(sourceType, "CATEGORY"),
    Q.Map(
      Q.Select(
        "data",
        Q.Paginate(
          Q.Match(
            Q.Index("category_book_connections_by_categoryRef"),
            Q.Select("ref", sourceDoc)
          )
        )
      ),
      Q.Lambda(
        "bookConnectionRef",
        Q.Select(["data", "bookRef"], Q.Get(Q.Var("bookConnectionRef")))
      )
    ),
    Q.Select(["data", "bookRefs"], sourceDoc)
  );

const selectTitle = ({
  sourceDoc,
  sourceType,
}: {
  sourceDoc: Expr;
  sourceType: Expr;
}) =>
  Q.If(
    Q.Equals(sourceType, "LIST"),
    Q.Select(["data", "title"], sourceDoc),
    Q.Select(["data", "name"], sourceDoc)
  );

const selectIndex = ({
  sourceDoc,
  sourceType,
}: {
  sourceDoc: Expr;
  sourceType: Expr;
}) =>
  Q.If(
    Q.Equals(sourceType, "LIST"),
    Q.Index("unique_lists_by_key"),
    Q.If(
      Q.Equals(sourceType, "CATEGORY"),
      Q.Index("unique_categories_by_key"),
      Q.Index("unique_authors_by_key")
    )
  );

const selectNumberWanted = ({ componentType }: { componentType: Expr }) =>
  Q.If(Q.Equals(componentType, "BookCarouselComponent"), 10, 64);

export default function getBookListComponents(client: Client) {
  return async (
    sourceArr: readonly {
      componentType: string;
      sourceType: string | null;
      sourceKey: string | null;
    }[]
  ) => {
    try {
      const result = (await client.query(
        Q.Map(
          sourceArr,
          Q.Lambda(
            "sourceData",
            Q.Let(
              {
                componentType: Q.Select("componentType", Q.Var("sourceData")),
                sourceType: Q.Select("sourceType", Q.Var("sourceData")),
                sourceKey: Q.Select("sourceKey", Q.Var("sourceData")),
              },
              Q.Let(
                {
                  sourceMatch: Q.Match(
                    selectIndex({
                      sourceDoc: Q.Var("sourceDoc"),
                      sourceType: Q.Var("sourceType"),
                    }),
                    Q.Var("sourceKey")
                  ),
                },
                Q.If(
                  Q.Exists(Q.Var("sourceMatch")),
                  Q.Let(
                    {
                      sourceDoc: Q.Get(Q.Var("sourceMatch")),
                    },
                    Q.Let(
                      {
                        bookRefs: selectBookRefs({
                          sourceDoc: Q.Var("sourceDoc"),
                          sourceType: Q.Var("sourceType"),
                        }),
                      },
                      {
                        title: selectTitle({
                          sourceDoc: Q.Var("sourceDoc"),
                          sourceType: Q.Var("sourceType"),
                        }),
                        totalBookCards: Q.Count(Q.Var("bookRefs")),
                        bookCards: Q.Take(
                          selectNumberWanted({
                            componentType: Q.Var("componentType"),
                          }),
                          Q.Map(
                            Q.Var("bookRefs"),
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
                                  image: Q.Select(
                                    ["data", "image"],
                                    Q.Var("bookDoc")
                                  ),
                                }
                              )
                            )
                          )
                        ),
                        bookListCreatedBy: Q.If(
                          Q.Equals(Q.Var("sourceType"), "LIST"),
                          Q.Select(["data", "createdBy"], Q.Var("sourceDoc")),
                          ""
                        ),
                      }
                    )
                  ),
                  Q.Let(
                    {},
                    {
                      title:
                        "Data source not found. Ensure valid context / source entered.",
                      totalBookCards: 0,
                      bookCards: [],
                      bookListCreatedBy: "",
                    }
                  )
                )
              )
            )
          )
        )
      )) as {
        title: string;
        totalBookCards: number;
        bookCards: {
          id: string;
          googleBooksVolumeId: string;
          image: string;
        }[];
        bookListCreatedBy: string;
      }[];

      return result.map((bookListComponent) => ({
        ...bookListComponent,
        bookCards: bookListComponent.bookCards.map((bookCard) => ({
          ...bookCard,
          href: `/books/show?googleBooksVolumeId=${bookCard.googleBooksVolumeId}`,
        })),
      }));
    } catch (e) {
      console.error("get-book-list-components", e);

      if (e instanceof Error) {
        // @ts-ignore
        throw new Error(e.description || e.message);
      }

      throw e;
    }
  };
}
