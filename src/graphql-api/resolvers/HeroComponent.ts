import { HeroComponentResolvers } from "../__generated__/resolvers-types";
import { ResolverContext } from "../context";
import { globalIdField } from "graphql-relay";

export default {
  id: globalIdField(),

  async title(obj, args, context) {
    const { title } = await context.loaders.componentLoader.load(obj.id);

    return title;
  },

  async subTitle(obj, args, context) {
    const { subTitle } = await context.loaders.componentLoader.load(obj.id);
    return subTitle;
  },
} as HeroComponentResolvers<ResolverContext>;
