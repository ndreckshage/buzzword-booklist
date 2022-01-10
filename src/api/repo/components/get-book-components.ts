import { type Client, query as Q } from "faunadb";
import { LinkComponentVariant } from "api/__generated__/resolvers-types";
import slugify from "slugify";

export default function getBookListComponents(client: Client) {
  return async (googleBooksVolumeIds: readonly string[]) => {
    const results = (await client.query(
      Q.Map(
        googleBooksVolumeIds,
        Q.Lambda(
          "googleBooksVolumeId",
          Q.Let(
            {
              bookMatch: Q.Match(
                Q.Index("unique_books_by_googleBooksVolumeId"),
                Q.Var("googleBooksVolumeId")
              ),
            },
            Q.If(
              Q.Exists(Q.Var("bookMatch")),
              Q.Let(
                {
                  bookDoc: Q.Get(Q.Var("bookMatch")),
                },
                {
                  id: Q.Select(["ref", "id"], Q.Var("bookDoc")),
                  googleBooksVolumeId: Q.Select(
                    ["data", "googleBooksVolumeId"],
                    Q.Var("bookDoc")
                  ),
                  title: Q.Select(["data", "title"], Q.Var("bookDoc")),
                  authors: Q.Map(
                    Q.Select(["data", "authorRefs"], Q.Var("bookDoc")),
                    Q.Lambda(
                      "authorRef",
                      Q.Let(
                        {
                          authorDoc: Q.Get(Q.Var("authorRef")),
                        },
                        {
                          key: Q.Select(["data", "key"], Q.Var("authorDoc")),
                          name: Q.Select(["data", "name"], Q.Var("authorDoc")),
                        }
                      )
                    )
                  ),
                  categories: Q.Map(
                    Q.Select(["data", "categoryRefs"], Q.Var("bookDoc")),
                    Q.Lambda(
                      "categoryRef",
                      Q.Let(
                        {
                          categoryDoc: Q.Get(Q.Var("categoryRef")),
                        },
                        {
                          key: Q.Select(["data", "key"], Q.Var("categoryDoc")),
                          name: Q.Select(
                            ["data", "name"],
                            Q.Var("categoryDoc")
                          ),
                        }
                      )
                    )
                  ),
                  publisher: Q.Select(["data", "publisher"], Q.Var("bookDoc")),
                  publishedDate: Q.Select(
                    ["data", "publishedDate"],
                    Q.Var("bookDoc")
                  ),
                  description: Q.Select(
                    ["data", "description"],
                    Q.Var("bookDoc")
                  ),
                  isbn: Q.Select(["data", "isbn"], Q.Var("bookDoc")),
                  pageCount: Q.Select(["data", "pageCount"], Q.Var("bookDoc")),
                  image: Q.Select(["data", "image"], Q.Var("bookDoc")),
                }
              ),
              {
                googleBooksVolumeId: Q.Var("googleBooksVolumeId"),
                title: "Book ID not found.",
                image: "",
                authors: [],
                categories: [],
                isbn: "",
                pageCount: null,
                publisher: "",
                publishedDate: "",
                description: "",
              }
            )
          )
        )
      )
    )) as {
      googleBooksVolumeId: string;
      title: string;
      image: string;
      authors: {
        key: string;
        name: string;
      }[];
      categories: {
        key: string;
        name: string;
      }[];
      isbn: string;
      pageCount: number;
      publisher: string;
      publishedDate: string;
      description: string;
    }[];

    return results.map((result) => ({
      title: result.title,
      image: result.image,
      authorLinks: result.authors.map((author) => ({
        href: `/collections/authors/show?sourceKey=${author.key}`,
        title: author.name,
        variant: LinkComponentVariant.Default,
      })),
      categoryLinks: result.categories.map((category) => ({
        href: `/collections/categories/show?sourceKey=${category.key}`,
        title: category.name,
        variant: LinkComponentVariant.Default,
      })),
      actionLink: {
        href: `https://bookshop.org/books?keywords=${slugify(result.title, {
          lower: true,
          strict: true,
        })}`,
        title: "Buy on Bookshop.org!",
        variant: LinkComponentVariant.Default,
      },
      detailsMarkdown: `### ISBN
${result.isbn}

### Page
${result.pageCount}

### Publisher
${result.publisher}

### Published Date
${result.publishedDate}

### Description
${result.description}`,
    }));
  };
}
