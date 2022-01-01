import {
  type Resolvers,
  LinkComponentVariant,
  BookListContext,
} from "api/__generated__/resolvers-types";
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
    title: ({ componentType, sourceType, sourceKey }, args, { loaders }) =>
      loaders.bookListComponentsLoader
        .load({ componentType, sourceType, sourceKey })
        .then(({ title }) => title),

    link: ({ componentType, sourceType, sourceKey }, args, { loaders }) =>
      loaders.bookListComponentsLoader
        .load({ componentType, sourceType, sourceKey })
        .then(({ totalBookCards }) => ({
          title: `See all ${totalBookCards} books`,
          href: `/collections/${(() => {
            if (sourceType === BookListContext.List) return "lists";
            if (sourceType === BookListContext.Category) return "categories";
            if (sourceType === BookListContext.Author) return "authors";
            throw new Error("Invalid Source Type");
          })()}/show?sourceKey=${sourceKey}`,
          variant: LinkComponentVariant.Default,
        })),

    bookCards: ({ componentType, sourceType, sourceKey }, args, { loaders }) =>
      loaders.bookListComponentsLoader
        .load({ componentType, sourceType, sourceKey })
        .then(({ bookCards }) => bookCards),
  },
  BookGridComponent: {
    id: globalIdField(),

    title: ({ componentType }, { sourceType, sourceKey }, { loaders }) =>
      loaders.bookListComponentsLoader
        .load({ componentType, sourceType, sourceKey })
        .then(({ title }) => title),

    bookCards: ({ componentType }, { sourceType, sourceKey }, { loaders }) =>
      loaders.bookListComponentsLoader
        .load({ componentType, sourceType, sourceKey })
        .then(({ bookCards }) => bookCards),
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
