export type GoogleBook = {
  googleBooksVolumeId: string;
  title: string;
  authors: string[];
  image: string;
};

const bookCache = new Map();

export default async function fetchBooks(value: string) {
  const cachedResponse = bookCache.get(value);
  if (cachedResponse) return Promise.resolve(cachedResponse);
  if (value === "") return Promise.resolve([]);

  const results = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${value}`
  )
    .then((r) => r.json())
    .then((json) =>
      json.items.slice(0, 5).map(
        (rawBook: {
          id: string;
          volumeInfo: {
            title?: string;
            authors?: string[];
            imageLinks?: { thumbnail?: "" };
          };
        }) => ({
          googleBooksVolumeId: rawBook.id,
          title: rawBook.volumeInfo.title ?? "",
          authors: rawBook.volumeInfo.authors ?? [],
          image: rawBook.volumeInfo.imageLinks?.thumbnail ?? "",
        })
      )
    );

  bookCache.set(value, results);
  return results;
}
