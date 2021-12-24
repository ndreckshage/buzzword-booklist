import type { MutationResolvers } from "../__generated__/resolvers-types";
import { ResolverContext } from "../context";

export default {
  createList: (parent, args, context) =>
    context.repo.bookList.createList(args.title),

  addBookToList: (parent, { listSlug, googleBooksVolumeId }, { repo }) =>
    repo.bookList.addBookToList({ listSlug, googleBooksVolumeId }),

  removeBookFromList: (parent, { listSlug, googleBooksVolumeId }, { repo }) =>
    repo.bookList.removeBookListConnection({ listSlug, googleBooksVolumeId }),
} as MutationResolvers<ResolverContext>;
