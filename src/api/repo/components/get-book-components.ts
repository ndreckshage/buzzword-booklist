import { type Client, query as q } from "faunadb";
import { LinkComponentVariant } from "api/__generated__/resolvers-types";
import slugify from "slugify";

export default function getListComponents(client: Client) {
  return async (googleBooksVolumeIds: readonly string[]) => {
    const results = (await client.query(
      q.Map(
        googleBooksVolumeIds,
        q.Lambda(
          "googleBooksVolumeId",
          q.Let(
            {
              bookMatch: q.Match(
                q.Index("unique_books_by_googleBooksVolumeId"),
                q.Var("googleBooksVolumeId")
              ),
            },
            q.If(
              q.Exists(q.Var("bookMatch")),
              q.Let(
                {
                  bookDoc: q.Get(q.Var("bookMatch")),
                },
                {
                  id: q.Select(["ref", "id"], q.Var("bookDoc")),
                  googleBooksVolumeId: q.Select(
                    ["data", "googleBooksVolumeId"],
                    q.Var("bookDoc")
                  ),
                  title: q.Select(["data", "title"], q.Var("bookDoc")),
                  authors: q.Map(
                    q.Select(["data", "authorRefs"], q.Var("bookDoc")),
                    q.Lambda(
                      "authorRef",
                      q.Let(
                        {
                          authorDoc: q.Get(q.Var("authorRef")),
                        },
                        {
                          key: q.Select(["data", "key"], q.Var("authorDoc")),
                          name: q.Select(["data", "name"], q.Var("authorDoc")),
                        }
                      )
                    )
                  ),
                  categories: q.Map(
                    q.Select(["data", "categoryRefs"], q.Var("bookDoc")),
                    q.Lambda(
                      "categoryRef",
                      q.Let(
                        {
                          categoryDoc: q.Get(q.Var("categoryRef")),
                        },
                        {
                          key: q.Select(["data", "key"], q.Var("categoryDoc")),
                          name: q.Select(
                            ["data", "name"],
                            q.Var("categoryDoc")
                          ),
                        }
                      )
                    )
                  ),
                  publisher: q.Select(["data", "publisher"], q.Var("bookDoc")),
                  publishedDate: q.Select(
                    ["data", "publishedDate"],
                    q.Var("bookDoc")
                  ),
                  description: q.Select(
                    ["data", "description"],
                    q.Var("bookDoc")
                  ),
                  isbn: q.Select(["data", "isbn"], q.Var("bookDoc")),
                  pageCount: q.Select(["data", "pageCount"], q.Var("bookDoc")),
                  image: q.Select(["data", "image"], q.Var("bookDoc")),
                }
              ),
              {
                googleBooksVolumeId: q.Var("googleBooksVolumeId"),
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
        href: `/authors/show?sourceKey=${author.key}`,
        title: author.name,
        variant: LinkComponentVariant.Default,
      })),
      categoryLinks: result.categories.map((category) => ({
        href: `/categories/show?sourceKey=${category.key}`,
        title: category.name,
        variant: LinkComponentVariant.Default,
      })),
      actionLink: {
        href: `https://bookshop.org/books?keywords=${slugify(result.title, {
          lower: true,
          strict: true,
        })}`,
        title: "Buy on Bookshop.org!",
        variant: LinkComponentVariant.Button,
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
