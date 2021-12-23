import { Client, query as Q, Var, type Expr } from "faunadb";
import fetch from "node-fetch";
import slugify from "slugify";

export type GetListBooksQueryInput = {
  sourceId: string;
  sourceType: string;
  size: number | null;
  before: string | null;
  after: string | null;
};

export type GetListBooksQuery = {
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

export const getListBooks =
  (client: Client) =>
  async ({
    sourceId,
    sourceType,
    size,
    before,
    after,
  }: GetListBooksQueryInput) => {
    const sourceIndex =
      sourceType === "Lists" ? "list_book_connections_by_listRef" : "TODO";

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
                    // author: Q.Let(
                    //   {
                    //     authorDoc: Q.Get(
                    //       Q.Select(["data", "author"], Q.Var("bookDoc"))
                    //     ),
                    //   },
                    //   {
                    //     id: Q.Select(["ref", "id"], Q.Var("authorDoc")),
                    //     name: Q.Select(["data", "name"], Q.Var("authorDoc")),
                    //     description: Q.Select(
                    //       ["data", "description"],
                    //       Q.Var("authorDoc")
                    //     ),
                    //   }
                    // ),

                    // listPrice: Q.Select(
                    //   ["data", "listPrice"],
                    //   Q.Var("bookDoc")
                    // ),
                    // price: Q.Select(["data", "price"], Q.Var("bookDoc")),
                    // bookshopUrl: Q.Select(
                    //   ["data", "bookshopUrl"],
                    //   Q.Var("bookDoc")
                    // ),

                    // dimensions: Q.Select(
                    //   ["data", "dimensions"],
                    //   Q.Var("bookDoc")
                    // ),
                    // language: Q.Select(["data", "language"], Q.Var("bookDoc")),
                    // coverType: Q.Select(
                    //   ["data", "coverType"],
                    //   Q.Var("bookDoc")
                    // ),
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

      console.log("get-book-list", JSON.stringify(result, null, 2));

      return result as GetListBooksQuery;
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

const maybeCreateDocument = ({
  index,
  indexTerms,
  collectionName,
  documentData,
}: {
  index: string;
  indexTerms: string[];
  collectionName: string;
  documentData: Object;
}) =>
  Q.Let(
    { sourceMatch: Q.Match(Q.Index(index), indexTerms) },
    Q.If(
      Q.Exists(Q.Var("sourceMatch")),
      null,
      Q.Create(collectionName, { data: documentData })
    )
  );

const maybeCreateConnection = ({
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
      Q.If(
        Q.Exists(Q.Var("connectionMatch")),
        null,
        Q.Create(connectionCollectionName, {
          data: {
            [edgeAName]: Q.Var("edgeARef"),
            [edgeBName]: Q.Var("edgeBRef"),
          },
        })
      )
    )
  );

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

const maybeCreateBookAuthorsAndCategories = async (
  client: Client,
  googleBooksVolumeId: string
) => {
  if (
    await client.query(
      Q.Exists(
        Q.Match(
          Q.Index("unique_books_by_google_books_volume_id"),
          googleBooksVolumeId
        )
      )
    )
  ) {
    console.log(`Book ${googleBooksVolumeId} exists. Skip fetch & create.`);
    return;
  }

  console.log(`Fetching ${googleBooksVolumeId} from Google Books...`);
  const { book, authors, categories } = await fetchFromGoogleBooks(
    googleBooksVolumeId
  );

  return await client.query(
    Q.Do(
      ...authors.map((author) =>
        maybeCreateDocument({
          index: "unique_authors_by_slug",
          indexTerms: [author.slug],
          collectionName: "Authors",
          documentData: author,
        })
      ),
      ...categories.map((category) =>
        maybeCreateDocument({
          index: "unique_categories_by_slug",
          indexTerms: [category.slug],
          collectionName: "Categories",
          documentData: category,
        })
      ),
      maybeCreateDocument({
        index: "unique_books_by_google_books_volume_id",
        indexTerms: [googleBooksVolumeId],
        collectionName: "Books",
        documentData: book,
      }),
      ...authors.map((author) =>
        maybeCreateConnection({
          edgeAName: "authorRef",
          edgeBName: "bookRef",
          edgeAIndex: "unique_authors_by_slug",
          edgeAIndexTerms: [author.slug],
          edgeBIndex: "unique_books_by_google_books_volume_id",
          edgeBIndexTerms: [googleBooksVolumeId],
          connectionRefIndex: "unique_author_book_connections_by_refs",
          connectionCollectionName: "AuthorBookConnections",
        })
      ),
      ...categories.map((category) =>
        maybeCreateConnection({
          edgeAName: "categoryRef",
          edgeBName: "bookRef",
          edgeAIndex: "unique_categories_by_slug",
          edgeAIndexTerms: [category.slug],
          edgeBIndex: "unique_books_by_google_books_volume_id",
          edgeBIndexTerms: [googleBooksVolumeId],
          connectionRefIndex: "unique_category_book_connections_by_refs",
          connectionCollectionName: "CategoryBookConnections",
        })
      )
    )
  );
};

export type AddBookToListMutationInput = {
  listSlug: string;
  googleBooksVolumeId: string;
};

export type AddBookToListMutation = boolean;

export const addBookToList =
  (client: Client) =>
  async ({ googleBooksVolumeId, listSlug }: AddBookToListMutationInput) => {
    await maybeCreateBookAuthorsAndCategories(client, googleBooksVolumeId);

    await client.query(
      maybeCreateConnection({
        edgeAName: "listRef",
        edgeBName: "bookRef",
        edgeAIndex: "unique_lists_by_slug",
        edgeAIndexTerms: [listSlug],
        edgeBIndex: "unique_books_by_google_books_volume_id",
        edgeBIndexTerms: [googleBooksVolumeId],
        connectionRefIndex: "unique_list_book_connections_by_refs",
        connectionCollectionName: "ListBookConnections",
      })
    );

    return true as AddBookToListMutation;
  };

export type CreateListMutationInput = string;
export type CreateListMutation = boolean;

export const createList =
  (client: Client) => async (title: CreateListMutationInput) => {
    const slug = slugify(title, { lower: true, strict: true });

    const list = await client.query(
      Q.Let(
        {
          listMatch: Q.Match(Q.Index("unique_lists_by_slug"), slug),
        },
        Q.If(
          Q.Exists(Q.Var("listMatch")),
          null,
          Q.Select("ref", Q.Create("Lists", { data: { title, slug } }))
        )
      )
    );

    return !!list as CreateListMutation;
  };

export type GetListQueryInput = string;
export type GetListQuery = {
  id: string;
  title: string;
  slug: string;
};

export const getList =
  (client: Client) => async (listSlug: GetListQueryInput) => {
    const result = await client.query(
      Q.Let(
        { listDoc: Q.Get(Q.Match(Q.Index("unique_lists_by_slug"), listSlug)) },
        {
          id: Q.Select(["ref", "id"], Q.Var("listDoc")),
          title: Q.Select(["data", "title"], Q.Var("listDoc")),
          slug: Q.Select(["data", "slug"], Q.Var("listDoc")),
        }
      )
    );

    return result as GetListQuery;
  };
