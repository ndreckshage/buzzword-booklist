import { globalIdField } from "graphql-relay";
import { BookListResolvers } from "../__generated__/resolvers-types";
import { ResolverContext } from "../context";

export default {
  id: globalIdField(),
  books: async () => {
    return [];
  },
} as BookListResolvers<ResolverContext>;
