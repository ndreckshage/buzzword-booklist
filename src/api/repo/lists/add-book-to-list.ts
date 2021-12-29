import { type Client } from "faunadb";
import createBookAuthorsAndCategories from "api/repo/books/create-book-authors-and-categories";
import appendConnectionToDocumentIfUnique from "api/repo/fql-helpers/append-connection-to-document-if-unique";
import ifListOwner from "api/repo/fql-helpers/exec-if-list-owner";

export type AddBookToListInput = {
  listSlug: string;
  googleBooksVolumeId: string;
  currentUser: string;
};

export type AddBookToListOutput = boolean;

export default function addBookToList(client: Client) {
  return async ({
    googleBooksVolumeId,
    listSlug,
    currentUser,
  }: AddBookToListInput) => {
    console.log("addBookToList", {
      googleBooksVolumeId,
      listSlug,
      currentUser,
    });

    try {
      await createBookAuthorsAndCategories(client, googleBooksVolumeId);
      await client.query(
        ifListOwner({
          listSlug,
          currentUser,
          execExpr: appendConnectionToDocumentIfUnique({
            docIndex: "unique_lists_by_slug",
            docIndexTerms: [listSlug],
            docEdgeRefName: "bookRefs",
            edgeIndex: "unique_books_by_google_books_volume_id",
            edgeIndexTerms: [googleBooksVolumeId],
          }),
        })
      );
    } catch (e) {
      if (e instanceof Error) {
        // @ts-ignore
        throw new Error(e.description || e.message);
      }

      throw e;
    }

    return true as AddBookToListOutput;
  };
}
