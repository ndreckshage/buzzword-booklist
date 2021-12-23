import {
  BookCarouselComponentResolvers,
  LinkVariant,
} from "../__generated__/resolvers-types";
import { ResolverContext } from "../context";
import { globalIdField } from "graphql-relay";

export default {
  id: globalIdField(),

  // async title({ id }, args, { loaders }) {
  //   const { title, sourceType } =
  //     await loaders.bookCarouselComponentLoader.load(id);

  //   return sourceType === "Genres" ? `Genre: ${title}` : title;
  // },

  // async link({ id }, args, { loaders }) {
  //   const { count } = await loaders.bookCarouselComponentLoader.load(id);
  //   return {
  //     text: `See all ${count} books`,
  //     href: `/lists/${id}`,
  //     variant: LinkVariant.CallToAction,
  //   };
  // },

  // async items({ id }, { first, after, last, before }, { loaders, repo }) {
  //   if (first && last) {
  //     throw new Error("first and last used together");
  //   } else if ((first && first < 0) || (last && last < 0)) {
  //     throw new Error("first/last cannot be negative");
  //   }

  //   const { sourceId, sourceType, count } =
  //     await loaders.bookCarouselComponentLoader.load(id);

  //   const results = await repo.bookList.getBookList({
  //     sourceId,
  //     sourceType,
  //     size: first || last || null,
  //     after: after || null,
  //     before: before || null,
  //   });

  //   return {
  //     totalCount: count,
  //     edges: results.data.map((book) => ({
  //       cursor: book.id,
  //       node: {
  //         id: book.id,
  //         image: book.image,
  //         href: book.bookshopUrl,
  //       },
  //     })),
  //     pageInfo: {
  //       hasNextPage: !!results.after,
  //       hasPreviousPage: !!results.before,
  //       startCursor: results.before,
  //       endCursor: results.after,
  //     },
  //   };
  // },
} as BookCarouselComponentResolvers<ResolverContext>;
