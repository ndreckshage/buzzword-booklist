import { Client, query as Q, type Expr } from "faunadb";

const selectMatch = (sourceType: Expr) =>
  Q.If(
    Q.Equals(sourceType, "LIST"),
    Q.Documents(Q.Collection("Lists")),
    Q.If(
      Q.Equals(sourceType, "BOOK"),
      Q.Match(Q.Index("books_by_listCount")),
      Q.If(
        Q.Equals(sourceType, "CATEGORY"),
        Q.Match(Q.Index("categories_by_listCount")),
        // author
        Q.Match(Q.Index("authors_by_listCount"))
      )
    )
  );

const selectTitle = (sourceType: Expr) =>
  Q.If(
    Q.Equals(sourceType, "LIST"),
    Q.Select(["data", "title"], Q.Var("sourceDoc")),
    Q.If(
      Q.Equals(sourceType, "BOOK"),
      Q.Select(["data", "title"], Q.Var("sourceDoc")),
      Q.If(
        Q.Equals(sourceType, "CATEGORY"),
        Q.Select(["data", "name"], Q.Var("sourceDoc")),
        // author
        Q.Select(["data", "name"], Q.Var("sourceDoc"))
      )
    )
  );

const selectKey = (sourceType: Expr) =>
  Q.If(
    Q.Equals(sourceType, "LIST"),
    Q.Select(["data", "key"], Q.Var("sourceDoc")),
    Q.If(
      Q.Equals(sourceType, "BOOK"),
      Q.Select(["data", "googleBooksVolumeId"], Q.Var("sourceDoc")),
      Q.If(
        Q.Equals(sourceType, "CATEGORY"),
        Q.Select(["data", "key"], Q.Var("sourceDoc")),
        // author
        Q.Select(["data", "key"], Q.Var("sourceDoc"))
      )
    )
  );

export default function getBookListLinksComponents(client: Client) {
  return async (sourceTypes: readonly string[]) => {
    try {
      console.log("getBookListLinksComponents", sourceTypes);

      const results = await client.query(
        Q.Map(
          sourceTypes,
          Q.Lambda(
            "sourceType",
            Q.Select(
              "data",
              Q.Map(
                Q.Paginate(selectMatch(Q.Var("sourceType")), {
                  size: 50,
                }),
                Q.Lambda(
                  "indexMatch",
                  Q.Let(
                    {
                      sourceDoc: Q.If(
                        Q.Equals(Q.Var("sourceType"), "LIST"),
                        Q.Get(Q.Var("indexMatch")),
                        Q.Get(Q.Select([1], Q.Var("indexMatch")))
                      ),
                    },
                    {
                      sourceType: Q.Var("sourceType"),
                      title: selectTitle(Q.Var("sourceType")),
                      key: selectKey(Q.Var("sourceType")),
                    }
                  )
                )
              )
            )
          )
        )
      );

      return results.map((result) =>
        result.map((linkData) => ({
          title: linkData.title,
          href: (() => {
            switch (linkData.sourceType) {
              case "LIST":
                return `/collections/lists/show?sourceKey=${linkData.key}`;
              case "AUTHOR":
                return `/collections/authors/show?sourceKey=${linkData.key}`;
              case "BOOK":
                return `/books/show?googleBooksVolumeId=${linkData.key}`;
              case "CATEGORY":
                return `/collections/categories/show?sourceKey=${linkData.key}`;
              default:
                throw new Error("bad context");
            }
          })(),
        }))
      );
    } catch (e) {
      console.error("get-book-list-links-components", e);

      if (e instanceof Error) {
        // @ts-ignore
        throw new Error(e.description || e.message);
      }

      throw e;
    }
  };
}
