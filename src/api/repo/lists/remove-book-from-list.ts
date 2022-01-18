import { type Client, query as Q } from "faunadb";
import execIfListOwner from "api/repo/fql-helpers/exec-if-list-owner";
import removeConnectionFromDocument from "api/repo/fql-helpers/remove-connection-from-document";
import incrementBookAuthorsAndCategoriesCount from "api/repo/books/increment-book-authors-and-categories-count";

export type RemoveBookFromListInput = {
  listKey: string;
  googleBooksVolumeId: string;
  loggedInAs: string;
};

export type RemoveBookFromListOutput = boolean;

export default function removeBookFromList(client: Client) {
  return async ({
    googleBooksVolumeId,
    listKey,
    loggedInAs,
  }: RemoveBookFromListInput) => {
    console.log("removeBookFromList", { googleBooksVolumeId, listKey });
    try {
      await client.query(
        execIfListOwner({
          listKey,
          loggedInAs,
          execExpr: removeConnectionFromDocument({
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
        false
      );
    } catch (e) {
      if (e instanceof Error) {
        // @ts-ignore
        throw new Error(e.description || e.message);
      }

      throw e;
    }

    return true as RemoveBookFromListOutput;
  };
}
