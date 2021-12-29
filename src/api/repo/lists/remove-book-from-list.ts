import { type Client, query as Q } from "faunadb";
import execIfListOwner from "api/repo/fql-helpers/exec-if-list-owner";
import removeConnectionFromDocument from "api/repo/fql-helpers/remove-connection-from-document";

export type RemoveBookFromListInput = {
  listSlug: string;
  googleBooksVolumeId: string;
  currentUser: string;
};

export type RemoveBookFromListOutput = boolean;

export default function removeBookFromList(client: Client) {
  return async ({
    googleBooksVolumeId,
    listSlug,
    currentUser,
  }: RemoveBookFromListInput) => {
    console.log("removeBookFromList", { googleBooksVolumeId, listSlug });
    try {
      await client.query(
        execIfListOwner({
          listSlug,
          currentUser,
          execExpr: removeConnectionFromDocument({
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

    return true as RemoveBookFromListOutput;
  };
}
