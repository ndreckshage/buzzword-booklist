export type BookModel = {
  id: string;
  googleBooksVolumeId: string;
  title: string;
  publisher: string;
  publishedDate: string;
  description: string;
  isbn: string;
  pageCount: number;
  image: string;
};

export { default as getBooksByListIds } from "./get-books-by-list-ids";
