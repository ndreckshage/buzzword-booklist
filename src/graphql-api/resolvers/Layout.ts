import { LayoutResolvers } from "../__generated__/resolvers-types";
import { ResolverContext } from "../context";
import { globalIdField } from "graphql-relay";

export default {
  id: globalIdField(),

  async components(obj, args, context) {
    if (obj.components) {
      return obj.components;
    }

    const layout = await context.loaders.layoutLoader.load(obj.key);
    return layout.components;
  },
} as LayoutResolvers<ResolverContext>;
