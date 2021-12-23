import type { MutationResolvers } from "../__generated__/resolvers-types";
import { ResolverContext } from "../context";

export default {
  createList: (parent, args, context) =>
    context.repo.bookList.createList(args.title),

  addBookToList: (parent, args, context) =>
    context.repo.bookList.addBookToList({
      listSlug: args.listSlug,
      googleBooksVolumeId: args.googleBooksVolumeId,
    }),

  async removeBookFromList(parent, args, context) {
    return false;
  },
} as MutationResolvers<ResolverContext>;
