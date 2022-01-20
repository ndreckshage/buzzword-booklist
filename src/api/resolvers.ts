import {
  type Resolvers,
  ComponentContextType,
  LinkComponentVariant,
} from "api/__generated__/resolvers-types";
import { type ResolverContext } from "api/context";
import {
  RootListComponentModel,
  type RootLayoutComponentModel,
} from "api/repo/components";
import { type GraphQLResolveInfo } from "graphql";

const pickBookList = ({
  componentType,
  sourceType,
  contextType,
  sourceKey,
  contextKey,
}: RootListComponentModel) => ({
  componentType,
  sourceType: sourceType ?? contextType,
  sourceKey: sourceKey ?? contextKey,
});

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
      loaders.bookListComponentsLoader
        .load(pickBookList(obj))
        .then(({ title }) => title),

    link: (obj, args, { loaders }) =>
      loaders.bookListComponentsLoader
        .load(pickBookList(obj))
        .then(({ link }) => link),

    cards: (obj, args, { loaders }) =>
      loaders.bookListComponentsLoader
        .load(pickBookList(obj))
        .then(({ cards }) => cards),

    createdBy: (obj, args, { loaders }) =>
      loaders.bookListComponentsLoader
        .load(pickBookList(obj))
        .then(({ createdBy }) => createdBy),
  },
  GridComponent: {
    title: (obj, args, { loaders }) =>
      loaders.bookListComponentsLoader
        .load(pickBookList(obj))
        .then(({ title }) => title),

    cards: (obj, args, { loaders }) =>
      loaders.bookListComponentsLoader
        .load(pickBookList(obj))
        .then(({ cards }) => cards),

    createdBy: (obj, args, { loaders }) =>
      loaders.bookListComponentsLoader
        .load(pickBookList(obj))
        .then(({ createdBy }) => createdBy),
  },
  ListComponent: {
    title: (obj, args, { loaders }) =>
      loaders.bookListComponentsLoader
        .load(pickBookList(obj))
        .then(({ title }) => title),

    cards: (obj, args, { loaders }) =>
      loaders.bookListComponentsLoader
        .load(pickBookList(obj))
        .then(({ cards }) => cards),

    createdBy: (obj, args, { loaders }) =>
      loaders.bookListComponentsLoader
        .load(pickBookList(obj))
        .then(({ createdBy }) => createdBy),

    sourceType: (obj) => pickBookList(obj).sourceType,
    sourceKey: (obj) => pickBookList(obj).sourceKey,
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
    // __resolveType: (obj) => obj.componentType,
    __resolveType: (obj) => {
      if (obj.componentType === "BookListComponent") return "ListComponent";
      if (obj.componentType === "BookGridComponent") return "GridComponent";
      if (obj.componentType === "BookCarouselComponent")
        return "CarouselComponent";

      return obj.componentType;
    },
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
