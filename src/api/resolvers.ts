import {
  type Resolvers,
  ComponentContextType,
  LinkComponentVariant,
} from "api/__generated__/resolvers-types";
import { type ResolverContext } from "api/context";
import { type RootLayoutComponentModel } from "api/repo/components";
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
            switch (sourceType) {
              case ComponentContextType.List:
                return "lists";
              case ComponentContextType.Category:
                return "categories";
              case ComponentContextType.Author:
                return "authors";
              default:
                throw new Error(`Invalid type ${sourceType} requested`);
            }
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

    title: ({ componentType, contextType, contextKey }, args, { loaders }) =>
      loaders.bookListComponentsLoader
        .load({ componentType, sourceType: contextType, sourceKey: contextKey })
        .then(({ title }) => title),

    bookCards: (
      { componentType, contextType, contextKey },
      args,
      { loaders }
    ) =>
      loaders.bookListComponentsLoader
        .load({ componentType, sourceType: contextType, sourceKey: contextKey })
        .then(({ bookCards }) => bookCards),
  },
  BookListComponent: {
    id: globalIdField(),

    title: ({ componentType, contextType, contextKey }, args, { loaders }) =>
      loaders.bookListComponentsLoader
        .load({ componentType, sourceType: contextType, sourceKey: contextKey })
        .then(({ title }) => title),

    bookCards: (
      { componentType, contextType, contextKey },
      args,
      { loaders }
    ) =>
      loaders.bookListComponentsLoader
        .load({ componentType, sourceType: contextType, sourceKey: contextKey })
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
    components: (
      { componentRefs, contextKey, contextType },
      args,
      { loaders }
    ) =>
      loaders.componentsByIdsAndContextLoader.loadMany(
        componentRefs.map((id) => ({ id, contextKey, contextType }))
      ),
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

    layout: async (parent, { id, contextType, contextKey }, { loaders }) => {
      console.log(
        "GRAPHQL QUERY layout",
        fromGlobalId(id),
        contextType,
        contextKey
      );

      const component = await loaders.componentsByIdsAndContextLoader.load({
        id: fromGlobalId(id).id,
        contextType,
        contextKey,
      });

      if (component.componentType !== "LayoutComponent") {
        throw new Error("Invalid component requested");
      }

      return component as RootLayoutComponentModel;
    },

    list: (parent, { listSlug }, { loaders }) => {
      console.log("GRAPHQL QUERY list", listSlug);
      return loaders.listsBySlugsLoader.load(listSlug);
    },
  },
} as Resolvers<ResolverContext>;
