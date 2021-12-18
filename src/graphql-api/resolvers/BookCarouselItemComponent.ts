import { globalIdField } from "graphql-relay";
import { BookCarouselItemComponentResolvers } from "../__generated__/resolvers-types";
import { ResolverContext } from "../context";

export default {
  id: globalIdField(),
} as BookCarouselItemComponentResolvers<ResolverContext>;
