import { QueryResolvers } from "../__generated__/resolvers-types";
import { ResolverContext } from "../context";

export default {
  currentUser: (parent, args, { currentUser }) => currentUser,

  layout: (parent, { layoutKey }, { loaders }) =>
    loaders.layoutLoader.load(layoutKey),

  list: (parent, { listSlug }, context) =>
    context.repo.bookList.getList(listSlug),

  async node(parent, args, context, info) {
    return null;
  },
} as QueryResolvers<ResolverContext>;
