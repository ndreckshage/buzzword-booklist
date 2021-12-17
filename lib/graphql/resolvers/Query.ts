import { QueryResolvers } from "../__generated__/resolvers-types";
import { ResolverContext } from "../context";

export default {
  async layout(obj, { layoutKey }, { loaders }) {
    return loaders.layoutLoader.load(layoutKey);
  },

  async node(obj, args, context, info) {
    return null;
  },
} as QueryResolvers<ResolverContext>;
