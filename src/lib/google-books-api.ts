import suspenseWrapPromise from "./suspense-wrap-promise";

export type GoogleBook = {
  googleBooksId: string;
  title: string;
  authors: string[];
  publisher: string;
  publishedDate: string;
  description: string;
  isbn13: string;
  pageCount: number | null;
  categories: string[];
  image: string;
};

const bookCache = new Map();

const fetchBooks = async (value: string) => {
  const cachedResponse = bookCache.get(value);
  if (cachedResponse) return Promise.resolve(cachedResponse);
  if (value === "") return Promise.resolve([]);

  const results = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${value}`
  )
    .then((r) => r.json())
    .then((json) =>
      json.items.map(
        (rawBook: {
          id: string;
          volumeInfo: {
            title?: string;
            authors?: string[];
            publisher?: string;
            publishedDate?: string;
            description?: string;
            industryIdentifiers?: { type: string; identifier: string }[];
            pageCount?: number;
            categories?: string[];
            imageLinks?: { thumbnail?: "" };
          };
        }) => ({
          googleBooksId: rawBook.id,
          title: rawBook.volumeInfo.title ?? "",
          authors: rawBook.volumeInfo.authors ?? [],
          publisher: rawBook.volumeInfo.publisher ?? "",
          publishedDate: rawBook.volumeInfo.publishedDate ?? "",
          description: rawBook.volumeInfo.description ?? "",
          isbn13: (rawBook.volumeInfo.industryIdentifiers ?? []).find(
            (i) => i.type === "ISBN_13"
          )?.identifier,
          pageCount: rawBook.volumeInfo.pageCount ?? null,
          categories: rawBook.volumeInfo.categories ?? [],
          image: rawBook.volumeInfo.imageLinks?.thumbnail ?? "",
        })
      )
    );

  bookCache.set(value, results);
  return results;
};

export default (value: string) => suspenseWrapPromise(fetchBooks(value));
