import { type Client } from "faunadb";
import createBookAuthorsAndCategories from "api/repo/books/create-book-authors-and-categories";
import appendConnectionToDocumentIfUnique from "api/repo/fql-helpers/append-connection-to-document-if-unique";
import ifListOwner from "api/repo/fql-helpers/exec-if-list-owner";

export type AddBookToListInput = {
  listSlug: string;
  googleBooksVolumeId: string;
  loggedInAs: string;
};

export type AddBookToListOutput = boolean;

export default function addBookToList(client: Client) {
  return async ({
    googleBooksVolumeId,
    listSlug,
    loggedInAs,
  }: AddBookToListInput) => {
    console.log("addBookToList", {
      googleBooksVolumeId,
      listSlug,
      loggedInAs,
    });

    try {
      await createBookAuthorsAndCategories(client, googleBooksVolumeId);
      await client.query(
        ifListOwner({
          listSlug,
          loggedInAs,
          execExpr: appendConnectionToDocumentIfUnique({
            docIndex: "unique_lists_by_slug",
            docIndexTerms: [listSlug],
            docEdgeRefName: "bookRefs",
            edgeIndex: "unique_books_by_google_books_volume_id",
            edgeIndexTerms: [googleBooksVolumeId],
          }),
        })
      );

      return true as AddBookToListOutput;
    } catch (e) {
      if (e instanceof Error) {
        // @ts-ignore
        throw new Error(e.description || e.message);
      }

      throw e;
    }
  };
}
