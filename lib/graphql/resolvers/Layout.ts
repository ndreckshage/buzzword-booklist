import { LayoutResolvers } from "../__generated__/resolvers-types";
import { ResolverContext } from "../context";

export default {
  __resolveType: (obj) => obj.layoutType,
} as LayoutResolvers<ResolverContext>;
