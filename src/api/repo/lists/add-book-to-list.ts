import { type Client } from "faunadb";
import createBookAuthorsAndCategories from "api/repo/books/create-book-authors-and-categories";
import incrementBookAuthorsAndCategoriesCount from "api/repo/books/increment-book-authors-and-categories-count";

import appendConnectionToDocumentIfUnique from "api/repo/fql-helpers/append-connection-to-document-if-unique";
import ifListOwner from "api/repo/fql-helpers/exec-if-list-owner";

export type AddBookToListInput = {
  listKey: string;
  googleBooksVolumeId: string;
  loggedInAs: string;
};

export type AddBookToListOutput = boolean;

export default function addBookToList(client: Client) {
  return async ({
    googleBooksVolumeId,
    listKey,
    loggedInAs,
  }: AddBookToListInput) => {
    console.log("addBookToList", {
      googleBooksVolumeId,
      listKey,
      loggedInAs,
    });

    try {
      await createBookAuthorsAndCategories(client, googleBooksVolumeId);

      await client.query(
        ifListOwner({
          listKey,
          loggedInAs,
          execExpr: appendConnectionToDocumentIfUnique({
            docIndex: "unique_lists_by_key",
            docIndexTerms: [listKey],
            docEdgeRefName: "bookRefs",
            edgeIndex: "unique_books_by_googleBooksVolumeId",
            edgeIndexTerms: [googleBooksVolumeId],
          }),
        })
      );

      await incrementBookAuthorsAndCategoriesCount(
        client,
        googleBooksVolumeId,
        true
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
