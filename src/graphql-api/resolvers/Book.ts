import { ListResolvers } from "../__generated__/resolvers-types";
import { ResolverContext } from "../context";
import { globalIdField } from "graphql-relay";

export default {
  id: globalIdField(),
} as ListResolvers<ResolverContext>;
