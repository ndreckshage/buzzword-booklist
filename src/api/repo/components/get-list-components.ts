import { Client, query as q, type Expr, type ExprArg } from "faunadb";
import { type ListComponentModel } from ".";
import {
  LinkComponentVariant,
  ListSourceType,
} from "api/__generated__/resolvers-types";

const ifOneOfComponentType = (
  componentTypes: string[],
  doIf: ExprArg,
  elseIf: ExprArg
) =>
  q.If(q.ContainsValue(q.Var("componentType"), componentTypes), doIf, elseIf);

const authorLink = (authorDoc: Expr) =>
  q.Concat(
    ["/authors/show?sourceKey=", q.Select(["data", "key"], authorDoc)],
    ""
  );

const bookLink = (bookDoc: Expr) =>
  q.Concat(
    [
      "/books/show?googleBooksVolumeId=",
      q.Select(["data", "googleBooksVolumeId"], bookDoc),
    ],
    ""
  );

const categoryLink = (categoryDoc: Expr) =>
  q.Concat(
    ["/categories/show?sourceKey=", q.Select(["data", "key"], categoryDoc)],
    ""
  );

const listLink = (listDoc: Expr) =>
  q.Concat(["/lists/show?sourceKey=", q.Select(["data", "key"], listDoc)], "");

const layoutLink = (layoutDoc: Expr) =>
  q.Concat(["/layouts/show?layout=", q.Select(["ref", "id"], layoutDoc)], "");

const selectTopAuthors = ({ pageSize }: { pageSize: Expr }) =>
  q.Let(
    {
      totalCards: q.Count(q.Match(q.Index("authors_by_listCount"))),
      cards: q.Select(
        "data",
        q.Map(
          q.Paginate(q.Match(q.Index("authors_by_listCount")), {
            size: pageSize,
          }),
          q.Lambda(
            "authorIndexMatch",
            q.Let(
              {
                inLists: q.Select(0, q.Var("authorIndexMatch")),
                authorDoc: q.Get(q.Select(1, q.Var("authorIndexMatch"))),
              },
              {
                id: q.Select(["ref", "id"], q.Var("authorDoc")),
                href: authorLink(q.Var("authorDoc")),
                image: q.Select(
                  ["data", "image"],
                  q.Get(q.Select(["data", "bookRefs", 0], q.Var("authorDoc")))
                ),
                title: q.Concat(
                  [
                    q.Select(["data", "name"], q.Var("authorDoc")),
                    q.Concat(
                      ["(Lists: ", q.ToString(q.Var("inLists")), ")"],
                      ""
                    ),
                  ],
                  " "
                ),
                createdBy: "",
              }
            )
          )
        )
      ),
    },
    {
      title: "Top Authors",
      link: null,
      totalCards: q.Var("totalCards"),
      cards: q.Var("cards"),
      createdBy: "",
    }
  );

const selectTopBooks = ({ pageSize }: { pageSize: Expr }) =>
  q.Let(
    {
      totalCards: q.Count(q.Match(q.Index("books_by_listCount"))),
      cards: q.Select(
        "data",
        q.Map(
          q.Paginate(q.Match(q.Index("books_by_listCount")), {
            size: pageSize,
          }),
          q.Lambda(
            "bookIndexMatch",
            q.Let(
              {
                inLists: q.Select(0, q.Var("bookIndexMatch")),
                bookDoc: q.Get(q.Select(1, q.Var("bookIndexMatch"))),
              },
              {
                id: q.Select(["ref", "id"], q.Var("bookDoc")),
                href: bookLink(q.Var("bookDoc")),
                image: q.Select(["data", "image"], q.Var("bookDoc")),
                title: q.Concat(
                  [
                    q.Select(["data", "title"], q.Var("bookDoc")),
                    q.Concat(
                      ["(Lists: ", q.ToString(q.Var("inLists")), ")"],
                      ""
                    ),
                  ],
                  " "
                ),
                createdBy: "",
              }
            )
          )
        )
      ),
    },
    {
      title: "Top Books",
      link: null,
      totalCards: q.Var("totalCards"),
      cards: q.Var("cards"),
      createdBy: "",
    }
  );

const selectTopCategories = ({ pageSize }: { pageSize: Expr }) =>
  q.Let(
    {
      totalCards: q.Count(q.Match(q.Index("categories_by_listCount"))),
      cards: q.Select(
        "data",
        q.Map(
          q.Paginate(q.Match(q.Index("categories_by_listCount")), {
            size: pageSize,
          }),
          q.Lambda(
            "categoryIndexMatch",
            q.Let(
              {
                inLists: q.Select(0, q.Var("categoryIndexMatch")),
                categoryDoc: q.Get(q.Select(1, q.Var("categoryIndexMatch"))),
              },
              q.Let(
                {
                  bookDoc: q.Get(
                    q.Select(
                      ["data", "bookRef"],
                      q.Get(
                        q.Select(
                          0,
                          q.Paginate(
                            q.Match(
                              q.Index(
                                "category_book_connections_by_categoryRef"
                              ),
                              q.Select("ref", q.Var("categoryDoc"))
                            ),
                            { size: 1 }
                          )
                        )
                      )
                    )
                  ),
                },
                {
                  id: q.Select(["ref", "id"], q.Var("categoryDoc")),
                  href: categoryLink(q.Var("categoryDoc")),
                  image: q.Select(["data", "image"], q.Var("bookDoc")),
                  title: q.Concat(
                    [
                      q.Select(["data", "name"], q.Var("categoryDoc")),
                      q.Concat(
                        ["(Lists: ", q.ToString(q.Var("inLists")), ")"],
                        ""
                      ),
                    ],
                    " "
                  ),
                  createdBy: "",
                }
              )
            )
          )
        )
      ),
    },
    {
      title: "Top Categories",
      link: null,
      totalCards: q.Var("totalCards"),
      cards: q.Var("cards"),
      createdBy: "",
    }
  );

const selectRecentLists = ({ pageSize }: { pageSize: Expr }) =>
  q.Let(
    {
      totalCards: q.Count(q.Match(q.Index("lists_with_books"), true)),
      cards: q.Select(
        "data",
        q.Map(
          q.Paginate(q.Reverse(q.Match(q.Index("lists_with_books"), true)), {
            size: pageSize,
          }),
          q.Lambda(
            "listRef",
            q.Let(
              {
                listDoc: q.Get(q.Var("listRef")),
              },
              {
                id: q.Select(["ref", "id"], q.Var("listDoc")),
                href: listLink(q.Var("listDoc")),
                image: q.If(
                  q.ContainsPath(["data", "bookRefs", 0], q.Var("listDoc")),
                  q.Select(
                    ["data", "image"],
                    q.Get(q.Select(["data", "bookRefs", 0], q.Var("listDoc")))
                  ),
                  ""
                ),
                title: q.Select(["data", "title"], q.Var("listDoc")),
                createdBy: q.Select(["data", "createdBy"], q.Var("listDoc")),
              }
            )
          )
        )
      ),
    },
    {
      title: "Recent Lists",
      link: null,
      totalCards: q.Var("totalCards"),
      cards: q.Var("cards"),
      createdBy: "",
    }
  );

const selectRecentLayouts = ({ pageSize }: { pageSize: Expr }) =>
  q.Let(
    {
      totalCards: q.Count(
        q.Match(q.Index("components_by_isRoot_and_componentType"), [
          true,
          "LayoutComponent",
        ])
      ),
      cards: q.Select(
        "data",
        q.Map(
          q.Paginate(
            q.Reverse(
              q.Match(q.Index("components_by_isRoot_and_componentType"), [
                true,
                "LayoutComponent",
              ])
            ),
            { size: pageSize }
          ),
          q.Lambda(
            "layoutRef",
            q.Let(
              {
                layoutDoc: q.Get(q.Var("layoutRef")),
              },
              {
                id: q.Select(["ref", "id"], q.Var("layoutDoc")),
                href: layoutLink(q.Var("layoutDoc")),
                image: "",
                title: q.Select(["data", "title"], q.Var("layoutDoc")),
                createdBy: q.Select(["data", "createdBy"], q.Var("layoutDoc")),
              }
            )
          )
        )
      ),
    },
    {
      title: "Recent Layouts",
      link: null,
      totalCards: q.Var("totalCards"),
      cards: q.Var("cards"),
      createdBy: "",
    }
  );

const mapBooks = (bookRefs: Expr) =>
  q.Map(
    q.Var("bookRefs"),
    q.Lambda(
      "bookRef",
      q.Let(
        {
          bookDoc: q.Get(q.Var("bookRef")),
        },
        {
          id: q.Select(["ref", "id"], q.Var("bookDoc")),
          href: bookLink(q.Var("bookDoc")),
          image: q.Select(["data", "image"], q.Var("bookDoc")),
          title: q.Select(["data", "title"], q.Var("bookDoc")),
          createdBy: "",
        }
      )
    )
  );

const selectList = ({
  sourceKey,
  pageSize,
}: {
  sourceKey: Expr;
  pageSize: Expr;
}) =>
  q.Let(
    {
      listDoc: q.Get(q.Match(q.Index("unique_lists_by_key"), sourceKey)),
    },
    q.Let(
      {
        bookRefs: q.Select(["data", "bookRefs"], q.Var("listDoc")),
      },
      q.Let(
        {
          totalCards: q.Count(q.Var("bookRefs")),
        },
        {
          title: q.Select(["data", "title"], q.Var("listDoc")),
          link: {
            title: q.Concat(
              ["See all", q.ToString(q.Var("totalCards")), "books"],
              " "
            ),
            href: listLink(q.Var("listDoc")),
            variant: LinkComponentVariant.Default,
          },
          totalCards: q.Var("totalCards"),
          cards: q.Take(pageSize, mapBooks(q.Var("bookRefs"))),
          createdBy: q.Select(["data", "createdBy"], q.Var("listDoc")),
        }
      )
    )
  );

const selectAuthor = ({
  componentType,
  sourceKey,
  pageSize,
}: {
  componentType: Expr;
  sourceKey: Expr;
  pageSize: Expr;
}) =>
  q.Let(
    {
      authorDoc: q.Get(q.Match(q.Index("unique_authors_by_key"), sourceKey)),
    },
    q.Let(
      {
        bookRefs: q.Select(["data", "bookRefs"], q.Var("authorDoc")),
      },
      q.Let(
        {
          totalCards: q.Count(q.Var("bookRefs")),
        },
        {
          title: q.Concat(
            [
              ifOneOfComponentType(["CarouselComponent"], "Author: ", ""),
              q.Select(["data", "name"], q.Var("authorDoc")),
            ],
            ""
          ),
          link: {
            title: q.Concat(
              ["See all", q.ToString(q.Var("totalCards")), "books"],
              " "
            ),
            href: authorLink(q.Var("authorDoc")),
            variant: LinkComponentVariant.Default,
          },
          totalCards: q.Var("totalCards"),
          cards: q.Take(pageSize, mapBooks(q.Var("bookRefs"))),
          createdBy: "",
        }
      )
    )
  );

const selectCategory = ({
  componentType,
  sourceKey,
  pageSize,
}: {
  componentType: Expr;
  sourceKey: Expr;
  pageSize: Expr;
}) =>
  q.Let(
    {
      categoryDoc: q.Get(
        q.Match(q.Index("unique_categories_by_key"), sourceKey)
      ),
    },
    q.Let(
      {
        bookRefs: q.Map(
          q.Select(
            "data",
            q.Paginate(
              q.Match(
                q.Index("category_book_connections_by_categoryRef"),
                q.Select("ref", q.Var("categoryDoc"))
              )
            )
          ),
          q.Lambda(
            "bookConnectionRef",
            q.Select(["data", "bookRef"], q.Get(q.Var("bookConnectionRef")))
          )
        ),
      },
      q.Let(
        { totalCards: q.Count(q.Var("bookRefs")) },
        {
          title: q.Concat(
            [
              ifOneOfComponentType(["CarouselComponent"], "Category: ", ""),
              q.Select(["data", "name"], q.Var("categoryDoc")),
            ],
            ""
          ),
          link: {
            title: q.Concat(
              ["See all", q.ToString(q.Var("totalCards")), "books"],
              " "
            ),
            href: categoryLink(q.Var("categoryDoc")),
            variant: LinkComponentVariant.Default,
          },
          totalCards: q.Var("totalCards"),
          cards: q.Take(pageSize, mapBooks(q.Var("bookRefs"))),
          createdBy: "",
        }
      )
    )
  );

const selectDefault = q.Let(
  {},
  {
    title: "Data source not found. Ensure valid context / source entered.",
    href: "",
    totalCards: 0,
    cards: [],
    createdBy: "",
  }
);

export default function getListComponents(client: Client) {
  return async (
    sourceArr: readonly {
      componentType: string;
      sourceType: string | null;
      sourceKey: string | null;
      pageSize: number;
    }[]
  ) => {
    console.log("getListComponents", sourceArr);

    try {
      const result = (await client.query(
        q.Map(
          sourceArr,
          q.Lambda(
            "sourceData",
            q.Let(
              {
                componentType: q.Select("componentType", q.Var("sourceData")),
                sourceType: q.Select("sourceType", q.Var("sourceData")),
                sourceKey: q.Select("sourceKey", q.Var("sourceData")),
                pageSize: q.Select("pageSize", q.Var("sourceData")),
              },
              q.If(
                q.Equals(q.Var("sourceType"), ListSourceType.RecentLists),
                selectRecentLists({ pageSize: q.Var("pageSize") }),
                q.If(
                  q.Equals(q.Var("sourceType"), ListSourceType.RecentLayouts),
                  selectRecentLayouts({ pageSize: q.Var("pageSize") }),
                  q.If(
                    q.Equals(q.Var("sourceType"), ListSourceType.TopBooks),
                    selectTopBooks({ pageSize: q.Var("pageSize") }),
                    q.If(
                      q.Equals(q.Var("sourceType"), ListSourceType.TopAuthors),
                      selectTopAuthors({ pageSize: q.Var("pageSize") }),
                      q.If(
                        q.Equals(
                          q.Var("sourceType"),
                          ListSourceType.TopCategories
                        ),
                        selectTopCategories({ pageSize: q.Var("pageSize") }),
                        q.If(
                          q.Equals(q.Var("sourceType"), ListSourceType.List),
                          selectList({
                            sourceKey: q.Var("sourceKey"),
                            pageSize: q.Var("pageSize"),
                          }),
                          q.If(
                            q.Equals(
                              q.Var("sourceType"),
                              ListSourceType.Author
                            ),
                            selectAuthor({
                              componentType: q.Var("componentType"),
                              sourceKey: q.Var("sourceKey"),
                              pageSize: q.Var("pageSize"),
                            }),
                            q.If(
                              q.Equals(
                                q.Var("sourceType"),
                                ListSourceType.Category
                              ),
                              selectCategory({
                                componentType: q.Var("componentType"),
                                sourceKey: q.Var("sourceKey"),
                                pageSize: q.Var("pageSize"),
                              }),
                              selectDefault
                            )
                          )
                        )
                      )
                    )
                  )
                )
              )
            )
          )
        )
      )) as ListComponentModel[];

      return result;
    } catch (e) {
      console.error("get-list-components", e);

      if (e instanceof Error) {
        // @ts-ignore
        throw new Error(e.description || e.message);
      }

      throw e;
    }
  };
}
