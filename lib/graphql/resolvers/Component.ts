import { ComponentResolvers } from "../__generated__/resolvers-types";
import { ResolverContext } from "../context";

export default {
  __resolveType: (obj) => obj.componentType,
} as ComponentResolvers<ResolverContext>;
