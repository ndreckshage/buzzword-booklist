import {
  type Resolvers,
  ComponentContextType,
  LinkComponentVariant,
} from "api/__generated__/resolvers-types";
import { type ResolverContext } from "api/context";
import { type RootLayoutComponentModel } from "api/repo/components";
import { type GraphQLResolveInfo } from "graphql";

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
  BookCarouselComponent: {
    title: (
      { componentType, contextType, contextKey, sourceType, sourceKey },
      args,
      { loaders }
    ) =>
      loaders.bookListComponentsLoader
        .load({
          componentType,
          sourceType: sourceType ?? contextType,
          sourceKey: sourceKey ?? contextKey,
        })
        .then(({ title }) => title),

    link: (
      { componentType, contextType, contextKey, sourceType, sourceKey },
      args,
      { loaders }
    ) => {
      const finalSourceType = sourceType ?? contextType;
      const finalSourceKey = sourceKey ?? contextKey;

      if (finalSourceType === ComponentContextType.None) {
        return null;
      }

      return loaders.bookListComponentsLoader
        .load({
          componentType,
          sourceType: finalSourceType,
          sourceKey: finalSourceKey,
        })
        .then(({ totalBookCards }) => ({
          title: `See all ${totalBookCards} books`,
          href: `/collections/${(() => {
            switch (finalSourceType) {
              case ComponentContextType.List:
                return "lists";
              case ComponentContextType.Category:
                return "categories";
              case ComponentContextType.Author:
                return "authors";
              default:
                throw new Error(`Invalid type ${finalSourceType} requested`);
            }
          })()}/show?sourceKey=${finalSourceKey}`,
          variant: LinkComponentVariant.Default,
        }));
    },

    bookCards: (
      { componentType, contextType, contextKey, sourceType, sourceKey },
      args,
      { loaders }
    ) =>
      loaders.bookListComponentsLoader
        .load({
          componentType,
          sourceType: sourceType ?? contextType,
          sourceKey: sourceKey ?? contextKey,
        })
        .then(({ bookCards }) => bookCards),

    bookListCreatedBy: (
      { componentType, contextType, contextKey, sourceType, sourceKey },
      args,
      { loaders }
    ) =>
      loaders.bookListComponentsLoader
        .load({
          componentType,
          sourceType: sourceType ?? contextType,
          sourceKey: sourceKey ?? contextKey,
        })
        .then(({ bookListCreatedBy }) => bookListCreatedBy),
  },
  BookGridComponent: {
    title: (
      { componentType, contextType, contextKey, sourceType, sourceKey },
      args,
      { loaders }
    ) =>
      loaders.bookListComponentsLoader
        .load({
          componentType,
          sourceType: sourceType ?? contextType,
          sourceKey: sourceKey ?? contextKey,
        })
        .then(({ title }) => title),

    bookCards: (
      { componentType, contextType, contextKey, sourceType, sourceKey },
      args,
      { loaders }
    ) =>
      loaders.bookListComponentsLoader
        .load({
          componentType,
          sourceType: sourceType ?? contextType,
          sourceKey: sourceKey ?? contextKey,
        })
        .then(({ bookCards }) => bookCards),
  },
  BookListComponent: {
    title: (
      { componentType, contextType, contextKey, sourceType, sourceKey },
      args,
      { loaders }
    ) =>
      loaders.bookListComponentsLoader
        .load({
          componentType,
          sourceType: sourceType ?? contextType,
          sourceKey: sourceKey ?? contextKey,
        })
        .then(({ title }) => title),

    bookCards: (
      { componentType, contextType, contextKey, sourceType, sourceKey },
      args,
      { loaders }
    ) =>
      loaders.bookListComponentsLoader
        .load({
          componentType,
          sourceType: sourceType ?? contextType,
          sourceKey: sourceKey ?? contextKey,
        })
        .then(({ bookCards }) => bookCards),
  },
  BookImageComponent: {
    image: ({ contextKey, sourceKey }, args, { loaders }) =>
      loaders.bookComponentsByKeysLoader
        .load(sourceKey ?? contextKey)
        .then(({ image }) => image),
  },
  BookTitleComponent: {
    title: ({ contextKey, sourceKey }, args, { loaders }) =>
      loaders.bookComponentsByKeysLoader
        .load(sourceKey ?? contextKey)
        .then(({ title }) => title),
  },
  BookActionComponent: {
    link: ({ contextKey, sourceKey }, args, { loaders }) =>
      loaders.bookComponentsByKeysLoader
        .load(sourceKey ?? contextKey)
        .then(({ actionLink }) => actionLink),
  },
  BookAuthorsComponent: {
    links: ({ contextKey, sourceKey }, args, { loaders }) =>
      loaders.bookComponentsByKeysLoader
        .load(sourceKey ?? contextKey)
        .then(({ authorLinks }) => authorLinks),
  },
  BookCategoriesComponent: {
    links: ({ contextKey, sourceKey }, args, { loaders }) =>
      loaders.bookComponentsByKeysLoader
        .load(sourceKey ?? contextKey)
        .then(({ categoryLinks }) => categoryLinks),
  },
  BookDetailsComponent: {
    text: ({ contextKey, sourceKey }, args, { loaders }) =>
      loaders.bookComponentsByKeysLoader
        .load(sourceKey ?? contextKey)
        .then(({ detailsMarkdown }) => detailsMarkdown),
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
  LayoutComponent: {
    components: (
      { componentRefs, contextKey, contextType },
      args,
      { loaders }
    ) =>
      loaders.componentsByIdsAndContextLoader.loadMany(
        componentRefs.map((id) => ({
          id,
          contextType: contextType || ComponentContextType.None,
          contextKey: contextKey || "",
        }))
      ),
  },
  List: {
    books: ({ id }, args, { loaders }) => loaders.booksByListIdsLoader.load(id),
  },
  Mutation: {
    createList: authenticated((parent, { title }, { mutations, loggedInAs }) =>
      mutations.createList({ title, loggedInAs })
    ),

    addBookToList: authenticated(
      (parent, { listKey, googleBooksVolumeId }, { mutations, loggedInAs }) =>
        mutations.addBookToList({
          listKey,
          googleBooksVolumeId,
          loggedInAs,
        })
    ),

    removeBookFromList: authenticated(
      (parent, { listKey, googleBooksVolumeId }, { mutations, loggedInAs }) =>
        mutations.removeBookFromList({
          listKey,
          googleBooksVolumeId,
          loggedInAs,
        })
    ),

    updateLayoutComponent: authenticated(
      (
        parent,
        { layoutId, componentOrder, flexDirection },
        { mutations, loggedInAs }
      ) => {
        return mutations.updateLayoutComponent({
          layoutId,
          componentIds: componentOrder ?? null,
          flexDirection: flexDirection ?? null,
          loggedInAs,
        });
      }
    ),

    createLayoutComponent: authenticated(
      (parent, { title }, { mutations, loggedInAs }) =>
        mutations.createLayoutComponent({ title, loggedInAs })
    ),

    createComponentInLayout: authenticated(
      (parent, { layoutId, componentType }, { mutations, loggedInAs }) =>
        mutations.createComponentInLayout({
          layoutId,
          componentType,
          loggedInAs,
        })
    ),

    removeComponentInLayout: authenticated(
      (parent, { layoutId, componentId }, { mutations, loggedInAs }) =>
        mutations.removeComponentInLayout({
          layoutId,
          componentId,
          loggedInAs,
        })
    ),

    updateMarkdownComponent: authenticated(
      (
        parent,
        { componentId, text, backgroundColor },
        { mutations, loggedInAs }
      ) =>
        mutations.updateMarkdownComponent({
          componentId,
          text,
          loggedInAs,
          backgroundColor,
        })
    ),

    updateBooklistComponent: authenticated(
      (
        parent,
        { componentId, sourceKey, sourceType },
        { mutations, loggedInAs }
      ) =>
        mutations.updateBooklistComponent({
          componentId,
          sourceKey,
          sourceType,
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
      console.log("GRAPHQL QUERY layout", id, contextType, contextKey);

      const component = await loaders.componentsByIdsAndContextLoader.load({
        id,
        contextType,
        contextKey,
      });

      if (component.componentType !== "LayoutComponent") {
        throw new Error("Invalid component requested");
      }

      return component as RootLayoutComponentModel;
    },

    list: (parent, { listKey }, { loaders }) => {
      console.log("GRAPHQL QUERY list", listKey);
      return loaders.listsByKeysLoader.load(listKey);
    },
  },
} as Resolvers<ResolverContext>;
