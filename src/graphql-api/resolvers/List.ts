import { ListResolvers } from "../__generated__/resolvers-types";
import { ResolverContext } from "../context";
import { globalIdField } from "graphql-relay";

export default {
  id: globalIdField(),

  async books({ id }, { first, after, last, before }, { loaders, repo }) {
    const results = await repo.bookList.getListBooks({
      sourceId: id,
      sourceType: "Lists",
      size: first || last || null,
      after: after || null,
      before: before || null,
    });

    return {
      totalCount: 5,
      edges: results.data.map((book) => ({
        cursor: book.id,
        node: book,
      })),
      pageInfo: {
        hasNextPage: !!results.after,
        hasPreviousPage: !!results.before,
        startCursor: results.before,
        endCursor: results.after,
      },
    };
  },
} as ListResolvers<ResolverContext>;
