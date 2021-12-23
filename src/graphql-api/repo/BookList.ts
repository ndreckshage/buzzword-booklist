import { Client, query as Q, Var, type Expr } from "faunadb";
import fetch from "node-fetch";
import slugify from "slugify";

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

type GoogleBookResponse = {
  volumeInfo: {
    authors?: string[];
    categories?: string[];
    title?: string;
    publisher?: string;
    publishedDate?: string;
    description?: string;
    industryIdentifiers?: { type: string; identifier: string }[];
    pageCount?: number;
    imageLinks?: { thumbnail?: string };
  };
};

// add book to author
// add book to categorybookconnections

type MappedBookData = {
  book: {
    googleBooksVolumeId: string;
    title: string;
    publisher: string;
    publishedDate: string;
    description: string;
    isbn: string | undefined;
    pageCount: number | null;
    image: string;
  };
  authors: { name: string; slug: string }[];
  categories: { name: string; slug: string }[];
};

const upsertItem = ({
  source,
  index,
  indexTerms,
  collectionName,
}: {
  source: Object;
  index: string;
  indexTerms: string[];
  collectionName: string;
}) =>
  Q.Let(
    {
      sourceMatch: Q.Match(Q.Index(index), indexTerms),
    },
    Q.Select(
      ["ref"],
      Q.If(
        Q.Exists(Q.Var("sourceMatch")),
        Q.Update(Q.Select(["ref"], Q.Get(Q.Var("sourceMatch"))), {
          data: source,
        }),
        Q.Create(collectionName, { data: source })
      )
    )
  );

const getOrCreateConnection = ({
  edgeAName,
  edgeBName,
  edgeAIndex,
  edgeAIndexTerms,
  edgeBIndex,
  edgeBIndexTerms,
  connectionRefIndex,
  connectionCollectionName,
}: {
  edgeAName: string;
  edgeBName: string;
  edgeAIndex: string;
  edgeAIndexTerms: string[];
  edgeBIndex: string;
  edgeBIndexTerms: string[];
  connectionRefIndex: string;
  connectionCollectionName: string;
}) =>
  Q.Let(
    {
      edgeARef: Q.Select(
        ["ref"],
        Q.Get(Q.Match(Q.Index(edgeAIndex), edgeAIndexTerms))
      ),
      edgeBRef: Q.Select(
        ["ref"],
        Q.Get(Q.Match(Q.Index(edgeBIndex), edgeBIndexTerms))
      ),
    },
    Q.Let(
      {
        connectionMatch: Q.Match(Q.Index(connectionRefIndex), [
          Q.Var("edgeARef"),
          Q.Var("edgeBRef"),
        ]),
      },
      Q.Select(
        ["ref"],
        Q.If(
          Q.Exists(Q.Var("connectionMatch")),
          Q.Get(Q.Var("connectionMatch")),
          Q.Create(connectionCollectionName, {
            data: {
              [edgeAName]: Q.Var("edgeARef"),
              [edgeBName]: Q.Var("edgeBRef"),
            },
          })
        )
      )
    )
  );

const getOrCreateBooks = async (
  client: Client,
  googleBooksDataArr: MappedBookData[]
) => {
  try {
    const x = await client.query(
      Q.Do(
        ...googleBooksDataArr.reduce(
          (acc, googleBooksData) => [
            ...acc,
            // upsert authors
            ...googleBooksData.authors.map((author) =>
              upsertItem({
                source: author,
                index: "unique_authors_by_slug",
                indexTerms: [author.slug],
                collectionName: "Authors",
              })
            ),
            // upsert categories
            ...googleBooksData.categories.map((category) =>
              upsertItem({
                source: category,
                index: "unique_categories_by_slug",
                indexTerms: [category.slug],
                collectionName: "Categories",
              })
            ),
            // upsert book
            upsertItem({
              source: googleBooksData.book,
              index: "unique_books_by_google_books_volume_id",
              indexTerms: [googleBooksData.book.googleBooksVolumeId],
              collectionName: "Books",
            }),
            // upsert author book connections
            ...googleBooksData.authors.map((author) =>
              getOrCreateConnection({
                edgeAName: "authorRef",
                edgeBName: "bookRef",
                edgeAIndex: "unique_authors_by_slug",
                edgeAIndexTerms: [author.slug],
                edgeBIndex: "unique_books_by_google_books_volume_id",
                edgeBIndexTerms: [googleBooksData.book.googleBooksVolumeId],
                connectionRefIndex: "unique_author_book_connections_by_refs",
                connectionCollectionName: "AuthorBookConnections",
              })
            ),
            // upsert category book connections
            ...googleBooksData.categories.map((category) =>
              getOrCreateConnection({
                edgeAName: "categoryRef",
                edgeBName: "bookRef",
                edgeAIndex: "unique_categories_by_slug",
                edgeAIndexTerms: [category.slug],
                edgeBIndex: "unique_books_by_google_books_volume_id",
                edgeBIndexTerms: [googleBooksData.book.googleBooksVolumeId],
                connectionRefIndex: "unique_category_book_connections_by_refs",
                connectionCollectionName: "CategoryBookConnections",
              })
            ),
          ],
          [] as Expr[]
        )
      )
    );

    console.log("x", x);
  } catch (e) {
    console.error(e);
  }
};

const fetchFromGoogleBooks = async (googleBooksVolumeId: string) => {
  const googleBookUri = `https://www.googleapis.com/books/v1/volumes/${googleBooksVolumeId}`;
  const googleBook = (await fetch(googleBookUri).then((r) =>
    r.json()
  )) as GoogleBookResponse;

  const book = {
    googleBooksVolumeId,
    title: googleBook.volumeInfo.title ?? "",
    publisher: googleBook.volumeInfo.publisher ?? "",
    publishedDate: googleBook.volumeInfo.publishedDate ?? "",
    description: googleBook.volumeInfo.description ?? "",
    isbn: (googleBook.volumeInfo.industryIdentifiers ?? []).find(
      (i) => i.type === "ISBN_13"
    )?.identifier,
    pageCount: googleBook.volumeInfo.pageCount || null,
    image: googleBook.volumeInfo.imageLinks?.thumbnail ?? "",
  };

  const authors = (googleBook.volumeInfo.authors ?? []).map((name) => ({
    slug: slugify(name, { lower: true, strict: true }),
    name,
  }));

  const categories = (googleBook.volumeInfo.categories ?? []).map((name) => ({
    slug: slugify(name, { lower: true, strict: true }),
    name,
  }));

  return {
    book,
    authors,
    categories,
  } as MappedBookData;
};

export type UpsertBookListMutationInput = {
  title: string;
  googleBooksVolumeIds: string[];
};

export type UpsertBookListMutation = {
  success: boolean;
  list?: {
    id: string;
    title: string;
    slug: string;
  };
};

export const upsertBookList =
  (client: Client) => async (bookList: UpsertBookListMutationInput) => {
    const googleBooksData = await Promise.all(
      bookList.googleBooksVolumeIds.map((googleBooksVolumeId) =>
        fetchFromGoogleBooks(googleBooksVolumeId)
      )
    );

    await getOrCreateBooks(client, googleBooksData);

    const listSlug = slugify(bookList.title, { lower: true, strict: true });

    const list = await client.query(
      Q.Do(
        // create the list
        upsertItem({
          source: { title: bookList.title, slug: listSlug },
          index: "unique_lists_by_slug",
          indexTerms: [listSlug],
          collectionName: "Lists",
        }),
        // delete existing list items
        Q.Let(
          {
            listRef: Q.Select(
              "ref",
              Q.Get(Q.Match(Q.Index("unique_lists_by_slug"), listSlug))
            ),
          },
          Q.Map(
            Q.Paginate(
              Q.Match(
                Q.Index("list_book_connections_by_listRef"),
                Q.Var("listRef")
              )
            ),
            Q.Lambda(
              "listBookConnection",
              Q.Delete(Q.Select("ref", Q.Get(Q.Var("listBookConnection"))))
            )
          )
        ),
        // create the list items
        ...bookList.googleBooksVolumeIds.map((googleBooksVolumeId) =>
          getOrCreateConnection({
            edgeAName: "listRef",
            edgeBName: "bookRef",
            edgeAIndex: "unique_lists_by_slug",
            edgeAIndexTerms: [listSlug],
            edgeBIndex: "unique_books_by_google_books_volume_id",
            edgeBIndexTerms: [googleBooksVolumeId],
            connectionRefIndex: "unique_list_book_connections_by_refs",
            connectionCollectionName: "ListBookConnections",
          })
        ),
        Q.Let(
          {
            listDoc: Q.Get(Q.Match(Q.Index("unique_lists_by_slug"), listSlug)),
          },
          {
            id: Q.Select(["ref", "id"], Q.Var("listDoc")),
            title: bookList.title,
            slug: listSlug,
          }
        )
      )
    );

    return { success: true, list } as UpsertBookListMutation;
  };
