import { type Resolvers } from "api/__generated__/resolvers-types";
import { type ResolverContext } from "api/context";
import { type GraphQLResolveInfo } from "graphql";

import { globalIdField, fromGlobalId } from "graphql-relay";

const authenticated =
  <T, R>(
    next: (
      root: {},
      args: T,
      context: ResolverContext & { loggedInAs: string },
      info: GraphQLResolveInfo
    ) => R
  ) =>
  (root: {}, args: T, context: ResolverContext, info: GraphQLResolveInfo) => {
    if (!context.loggedInAs) {
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
    title: ({ sourceId, sourceType }, args, { loaders }) =>
      loaders.bookCarouselComponentsByRefsLoader
        .load({ sourceId, sourceType })
        .then(({ title }) => title),

    link: ({ sourceId, sourceType }, args, { loaders }) =>
      loaders.bookCarouselComponentsByRefsLoader
        .load({ sourceId, sourceType })
        .then(({ link }) => link),

    bookCards: ({ sourceId, sourceType }, args, { loaders }) =>
      loaders.bookCarouselComponentsByRefsLoader
        .load({ sourceId, sourceType })
        .then(({ bookCards }) => bookCards),
  },
  BookGridComponent: {
    id: globalIdField(),

    title: async (parent, args, { loaders }) => {
      console.log("book grid", parent, args);
      return "dffsf";
    },

    bookCards: async (parent, args, { loaders }) => {
      console.log("book grid cards", args);
      // create loader on loading by context!
      // hmmm though .... how will the admin interface work, to know that I need to configure context for a nested selection
      return [];
    },
  },
  Component: {
    __resolveType: (obj) => obj.componentType,
  },
  CurrentUser: {
    layoutComponents: async ({ name }, args, { loaders }) =>
      loaders.layoutComponentsByCreatorsLoader.load(name),

    lists: async ({ name }, args, { loaders }) =>
      loaders.listsByCreatorsLoader.load(name),
  },
  HeroComponent: {
    id: globalIdField(),
  },
  LayoutComponent: {
    id: globalIdField(),
    components: ({ componentRefs }, args, { loaders }) =>
      loaders.componentsByIdsLoader.loadMany(componentRefs),
  },
  List: {
    id: globalIdField(),
    books: ({ id }, args, { loaders }) => loaders.booksByListIdsLoader.load(id),
  },
  Mutation: {
    createList: authenticated((parent, { title }, { mutations, loggedInAs }) =>
      mutations.createList({ title, loggedInAs })
    ),

    addBookToList: authenticated(
      (parent, { listSlug, googleBooksVolumeId }, { mutations, loggedInAs }) =>
        mutations.addBookToList({
          listSlug,
          googleBooksVolumeId,
          loggedInAs,
        })
    ),

    removeBookFromList: authenticated(
      (parent, { listSlug, googleBooksVolumeId }, { mutations, loggedInAs }) =>
        mutations.removeBookFromList({
          listSlug,
          googleBooksVolumeId,
          loggedInAs,
        })
    ),
  },
  Query: {
    currentUser: (parent, args, { loggedInAs }) => {
      console.log("GRAPHQL QUERY currentUser");
      return loggedInAs ? { name: loggedInAs } : null;
    },

    component: (parent, { id }, { loaders }) => {
      console.log("GRAPHQL QUERY component", fromGlobalId(id));
      return loaders.componentsByIdsLoader.load(fromGlobalId(id).id);
    },

    list: (parent, { listSlug }, { loaders }) => {
      console.log("GRAPHQL QUERY list", listSlug);
      return loaders.listsBySlugsLoader.load(listSlug);
    },
  },
} as Resolvers<ResolverContext>;
