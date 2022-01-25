import {
  type Resolvers,
  LayoutContextType,
  ListSourceType,
  BookSourceType,
} from "api/__generated__/resolvers-types";
import { type ResolverContext } from "api/context";
import {
  RootBookComponentModel,
  RootListComponentModel,
  type RootLayoutComponentModel,
} from "api/repo/components";
import { type GraphQLResolveInfo } from "graphql";

const listComponentLoaderArgs = ({
  componentType,
  listSourceType,
  contextType,
  sourceKey,
  contextKey,
  pageSize,
}: RootListComponentModel) => {
  const useContext = [
    LayoutContextType.Author,
    LayoutContextType.Category,
    LayoutContextType.List,
  ].includes(contextType);

  return {
    componentType,
    listSourceType: useContext
      ? contextType
      : listSourceType ?? ListSourceType.None,
    sourceKey: useContext ? contextKey : sourceKey ?? "",
    pageSize,
  };
};

const bookComponentLoaderArgs = ({
  componentType,
  bookSourceType,
  contextType,
  sourceKey,
  contextKey,
}: RootBookComponentModel) => {
  const useContext = [LayoutContextType.Book].includes(contextType);

  return {
    componentType,
    bookSourceType: useContext
      ? contextType
      : bookSourceType ?? BookSourceType.None,
    sourceKey: useContext ? contextKey : sourceKey ?? "",
  };
};

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
  CarouselComponent: {
    title: (obj, args, { loaders }) =>
      loaders.listComponentsLoader
        .load(listComponentLoaderArgs(obj))
        .then(({ title }) => title),

    link: (obj, args, { loaders }) =>
      loaders.listComponentsLoader
        .load(listComponentLoaderArgs(obj))
        .then(({ link }) => link),

    cards: (obj, args, { loaders }) =>
      loaders.listComponentsLoader
        .load(listComponentLoaderArgs(obj))
        .then(({ cards }) => cards),

    createdBy: (obj, args, { loaders }) =>
      loaders.listComponentsLoader
        .load(listComponentLoaderArgs(obj))
        .then(({ createdBy }) => createdBy),

    pageSize: (obj) => obj.pageSize,
    listSourceType: (obj) => listComponentLoaderArgs(obj).listSourceType,
    sourceKey: (obj) => listComponentLoaderArgs(obj).sourceKey,
  },
  GridComponent: {
    title: (obj, args, { loaders }) =>
      loaders.listComponentsLoader
        .load(listComponentLoaderArgs(obj))
        .then(({ title }) => title),

    cards: (obj, args, { loaders }) =>
      loaders.listComponentsLoader
        .load(listComponentLoaderArgs(obj))
        .then(({ cards }) => cards),

    createdBy: (obj, args, { loaders }) =>
      loaders.listComponentsLoader
        .load(listComponentLoaderArgs(obj))
        .then(({ createdBy }) => createdBy),

    pageSize: (obj) => obj.pageSize,
    listSourceType: (obj) => listComponentLoaderArgs(obj).listSourceType,
    sourceKey: (obj) => listComponentLoaderArgs(obj).sourceKey,
  },
  ListComponent: {
    title: (obj, args, { loaders }) =>
      loaders.listComponentsLoader
        .load(listComponentLoaderArgs(obj))
        .then(({ title }) => title),

    cards: (obj, args, { loaders }) =>
      loaders.listComponentsLoader
        .load(listComponentLoaderArgs(obj))
        .then(({ cards }) => cards),

    createdBy: (obj, args, { loaders }) =>
      loaders.listComponentsLoader
        .load(listComponentLoaderArgs(obj))
        .then(({ createdBy }) => createdBy),

    pageSize: (obj) => obj.pageSize,
    listSourceType: (obj) => listComponentLoaderArgs(obj).listSourceType,
    sourceKey: (obj) => listComponentLoaderArgs(obj).sourceKey,
  },
  BookImageComponent: {
    image: (obj, args, { loaders }) =>
      loaders.bookComponentsByKeysLoader
        .load(bookComponentLoaderArgs(obj).sourceKey)
        .then(({ image }) => image),

    bookSourceType: (obj) => bookComponentLoaderArgs(obj).bookSourceType,
    sourceKey: (obj) => bookComponentLoaderArgs(obj).sourceKey,
  },
  BookTitleComponent: {
    title: (obj, args, { loaders }) =>
      loaders.bookComponentsByKeysLoader
        .load(bookComponentLoaderArgs(obj).sourceKey)
        .then(({ title }) => title),

    bookSourceType: (obj) => bookComponentLoaderArgs(obj).bookSourceType,
    sourceKey: (obj) => bookComponentLoaderArgs(obj).sourceKey,
  },
  BookActionComponent: {
    link: (obj, args, { loaders }) =>
      loaders.bookComponentsByKeysLoader
        .load(bookComponentLoaderArgs(obj).sourceKey)
        .then(({ actionLink }) => actionLink),

    bookSourceType: (obj) => bookComponentLoaderArgs(obj).bookSourceType,
    sourceKey: (obj) => bookComponentLoaderArgs(obj).sourceKey,
  },
  BookAuthorsComponent: {
    links: (obj, args, { loaders }) =>
      loaders.bookComponentsByKeysLoader
        .load(bookComponentLoaderArgs(obj).sourceKey)
        .then(({ authorLinks }) => authorLinks),

    bookSourceType: (obj) => bookComponentLoaderArgs(obj).bookSourceType,
    sourceKey: (obj) => bookComponentLoaderArgs(obj).sourceKey,
  },
  BookCategoriesComponent: {
    links: (obj, args, { loaders }) =>
      loaders.bookComponentsByKeysLoader
        .load(bookComponentLoaderArgs(obj).sourceKey)
        .then(({ categoryLinks }) => categoryLinks),

    bookSourceType: (obj) => bookComponentLoaderArgs(obj).bookSourceType,
    sourceKey: (obj) => bookComponentLoaderArgs(obj).sourceKey,
  },
  BookDetailsComponent: {
    text: (obj, args, { loaders }) =>
      loaders.bookComponentsByKeysLoader
        .load(bookComponentLoaderArgs(obj).sourceKey)
        .then(({ detailsMarkdown }) => detailsMarkdown),

    bookSourceType: (obj) => bookComponentLoaderArgs(obj).bookSourceType,
    sourceKey: (obj) => bookComponentLoaderArgs(obj).sourceKey,
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
          contextType: contextType || LayoutContextType.None,
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
        { layoutId, componentOrder, flexDirection, container },
        { mutations, loggedInAs }
      ) =>
        mutations.updateLayoutComponent({
          layoutId,
          componentIds: componentOrder ?? null,
          flexDirection: flexDirection ?? null,
          container: container ?? null,
          loggedInAs,
        })
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

    updateListComponent: authenticated(
      (
        parent,
        { componentId, sourceKey, listSourceType, pageSize },
        { mutations, loggedInAs }
      ) =>
        mutations.updateListComponent({
          componentId,
          sourceKey,
          listSourceType,
          pageSize,
          loggedInAs,
        })
    ),

    updateBookComponent: authenticated(
      (
        parent,
        { componentId, sourceKey, bookSourceType },
        { mutations, loggedInAs }
      ) =>
        mutations.updateBookComponent({
          componentId,
          sourceKey,
          bookSourceType,
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
