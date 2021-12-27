import { HeroComponentResolvers } from "../__generated__/resolvers-types";
import { ResolverContext } from "../context";
import { globalIdField } from "graphql-relay";

type HeroComponentQuery = {
  id: string;
  componentType: "HeroComponent";
  title: string;
  subTitle: string;
};

export default {
  id: globalIdField(),

  async title(obj, args, context) {
    const { title } = (await context.loaders.componentLoader.load(
      obj.id
    )) as HeroComponentQuery;

    return title;
  },

  async subTitle(obj, args, context) {
    const { subTitle } = (await context.loaders.componentLoader.load(
      obj.id
    )) as HeroComponentQuery;

    return subTitle;
  },
} as HeroComponentResolvers<ResolverContext>;
