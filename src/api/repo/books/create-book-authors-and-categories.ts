import { type Client, query as Q } from "faunadb";
import createDocumentIfUnique from "api/repo/fql-helpers/create-document-if-unique";
import appendConnectionToDocumentIfUnique from "api/repo/fql-helpers/append-connection-to-document-if-unique";
import createConnectionIfUnique from "api/repo/fql-helpers/create-connection-if-unique";
import slugify from "slugify";

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
    isbn:
      (googleBook.volumeInfo.industryIdentifiers ?? []).find(
        (i) => i.type === "ISBN_13"
      )?.identifier ?? "",
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

export default async function createBookAuthorsAndCategories(
  client: Client,
  googleBooksVolumeId: string
) {
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
        createDocumentIfUnique({
          index: "unique_authors_by_slug",
          indexTerms: [author.slug],
          collectionName: "Authors",
          documentData: { ...author, bookRefs: [] },
        })
      ),
      ...categories.map((category) =>
        createDocumentIfUnique({
          index: "unique_categories_by_slug",
          indexTerms: [category.slug],
          collectionName: "Categories",
          documentData: category,
        })
      ),
      createDocumentIfUnique({
        index: "unique_books_by_google_books_volume_id",
        indexTerms: [googleBooksVolumeId],
        collectionName: "Books",
        documentData: {
          ...book,
          authorRefs: authors.map((author) =>
            Q.Select(
              "ref",
              Q.Get(Q.Match(Q.Index("unique_authors_by_slug"), author.slug))
            )
          ),
          categoryRefs: categories.map((category) =>
            Q.Select(
              "ref",
              Q.Get(
                Q.Match(Q.Index("unique_categories_by_slug"), category.slug)
              )
            )
          ),
        },
      }),
      ...authors.map((author) =>
        appendConnectionToDocumentIfUnique({
          docIndex: "unique_authors_by_slug",
          docIndexTerms: [author.slug],
          docEdgeRefName: "bookRefs",
          edgeIndex: "unique_books_by_google_books_volume_id",
          edgeIndexTerms: [googleBooksVolumeId],
        })
      ),
      ...categories.map((category) =>
        createConnectionIfUnique({
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
}
