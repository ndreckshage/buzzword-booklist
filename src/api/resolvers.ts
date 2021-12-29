import { type Resolvers } from "api/__generated__/resolvers-types";
import { type ResolverContext } from "api/context";
import { type GraphQLResolveInfo } from "graphql";

import { globalIdField } from "graphql-relay";

const authenticated =
  <T, R>(
    next: (
      root: {},
      args: T,
      context: ResolverContext & { currentUser: string },
      info: GraphQLResolveInfo
    ) => R
  ) =>
  (root: {}, args: T, context: ResolverContext, info: GraphQLResolveInfo) => {
    if (!context.currentUser) {
      throw new Error(`Unauthenticated!`);
    }

    // @ts-ignore override maybe currentUser from resolver context
    return next(root, args, context, info);
  };

export default {
  Book: {
    id: globalIdField(),
  },
  BookCardComponent: {
    id: globalIdField(),
  },
  BookCarouselComponent: {
    id: globalIdField(),
  },
  Component: {
    __resolveType: (obj) => obj.componentType,
  },
  HeroComponent: {
    id: globalIdField(),
  },
  LayoutComponent: {
    id: globalIdField(),
    components: ({ componentType, componentRefs }, args, { loaders }) =>
      loaders.componentsByIdsLoader.loadMany(componentRefs),
  },
  List: {
    id: globalIdField(),
    books: ({ id }, args, { loaders }) => loaders.booksByListIdsLoader.load(id),
  },
  Mutation: {
    createList: authenticated((parent, { title }, { mutations, currentUser }) =>
      mutations.createList({ title, currentUser })
    ),

    addBookToList: authenticated(
      (parent, { listSlug, googleBooksVolumeId }, { mutations, currentUser }) =>
        mutations.addBookToList({
          listSlug,
          googleBooksVolumeId,
          currentUser,
        })
    ),

    removeBookFromList: authenticated(
      (parent, { listSlug, googleBooksVolumeId }, { mutations, currentUser }) =>
        mutations.removeBookFromList({
          listSlug,
          googleBooksVolumeId,
          currentUser,
        })
    ),
  },
  Query: {
    currentUser: (parent, args, { currentUser }) => currentUser,

    layout: (parent, { layoutRef }, { loaders }) =>
      loaders.layoutComponentsByIdsLoader.load(layoutRef),

    // component: (parent, {}, {loaders}) =>

    layoutWithCollectionContext: (parent, args, context) => null,
    layoutWithBookContext: (parent, args, context) => null,

    list: (parent, { listSlug }, { loaders }) =>
      loaders.listsBySlugsLoader.load(listSlug),
  },
} as Resolvers<ResolverContext>;
