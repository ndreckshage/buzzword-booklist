import type { MutationResolvers } from "../__generated__/resolvers-types";
import { ResolverContext } from "../context";
import { GraphQLResolveInfo } from "graphql";

const authenticated =
  <T, R>(
    next: (
      root: {},
      args: T,
      context: ResolverContext & { currentUser: string },
      info: GraphQLResolveInfo
    ) => R
  ) =>
  (root: {}, args: T, context: ResolverContext, info: GraphQLResolveInfo) => {
    if (!context.currentUser) {
      throw new Error(`Unauthenticated!`);
    }

    // @ts-ignore override maybe currentUser from resolver context
    return next(root, args, context, info);
  };

export default {
  createList: authenticated((parent, { title }, { repo, currentUser }) =>
    repo.bookList.createList({ title, currentUser })
  ),

  addBookToList: authenticated(
    (parent, { listSlug, googleBooksVolumeId }, { repo, currentUser }) =>
      repo.bookList.addBookToList({
        listSlug,
        googleBooksVolumeId,
        currentUser,
      })
  ),

  removeBookFromList: authenticated(
    (parent, { listSlug, googleBooksVolumeId }, { repo, currentUser }) =>
      repo.bookList.removeBookListConnection({
        listSlug,
        googleBooksVolumeId,
        currentUser,
      })
  ),
} as MutationResolvers<ResolverContext>;
