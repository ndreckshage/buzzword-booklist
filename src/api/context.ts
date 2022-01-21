import { Client } from "faunadb";
import DataLoader from "dataloader";

import {
  type ListModel,
  type CreateListInput,
  type CreateListOutput,
  type AddBookToListInput,
  type AddBookToListOutput,
  type RemoveBookFromListInput,
  type RemoveBookFromListOutput,
  createList,
  addBookToList,
  removeBookFromList,
  getListsByKeys,
  getListsByCreators,
} from "api/repo/lists";

import {
  LayoutContextType,
  ListSourceType,
} from "./__generated__/resolvers-types";

import { type BookModel, getBooksByListIds } from "api/repo/books";

import {
  type RootComponentModel,
  type RootLayoutComponentModel,
  type ListComponentModel,
  type BookComponentModel,
  getLayoutComponentsByCreators,
  getComponentsByIds,
  getListComponents,
  getBookComponents,
  createLayoutComponent,
  type CreateLayoutComponentInput,
  type CreateLayoutComponentOutput,
  createComponentInLayout,
  type CreateComponentInLayoutInput,
  type CreateComponentInLayoutOutput,
  updateLayoutComponent,
  type UpdateLayoutComponentInput,
  type UpdateLayoutComponentOutput,
  removeComponentInLayout,
  type RemoveComponentInLayoutInput,
  type RemoveComponentInLayoutOutput,
  updateMarkdownComponent,
  type UpdateMarkdownComponentInput,
  type UpdateMarkdownComponentOutput,
  updateListComponent,
  type updateListComponentInput,
  type updateListComponentOutput,
} from "api/repo/components";

export default function createClient() {
  const FAUNA_KEY = process.env.FAUNA_KEY;
  if (!FAUNA_KEY) {
    throw new Error("MISSING FAUNA_KEY");
  }

  return new Client({
    secret: FAUNA_KEY,
    domain: "db.us.fauna.com",
  });
}

export type ResolverContext = {
  loggedInAs: string | null;
  loaders: {
    booksByListIdsLoader: DataLoader<string, BookModel[], string>;
    componentsByIdsAndContextLoader: DataLoader<
      { id: string; contextType: LayoutContextType; contextKey: string },
      RootComponentModel,
      string
    >;
    layoutComponentsByCreatorsLoader: DataLoader<
      string,
      RootLayoutComponentModel[],
      string
    >;
    listsByKeysLoader: DataLoader<string, ListModel, string>;
    listsByCreatorsLoader: DataLoader<string, ListModel[], string>;
    listComponentsLoader: DataLoader<
      {
        componentType: string;
        sourceType: ListSourceType | LayoutContextType | null;
        sourceKey: string | null;
        pageSize: number;
      },
      ListComponentModel,
      string
    >;
    bookComponentsByKeysLoader: DataLoader<string, BookComponentModel, string>;
  };
  mutations: {
    addBookToList: (input: AddBookToListInput) => Promise<AddBookToListOutput>;
    createList: (title: CreateListInput) => Promise<CreateListOutput>;
    removeBookFromList: (
      input: RemoveBookFromListInput
    ) => Promise<RemoveBookFromListOutput>;
    createLayoutComponent: (
      input: CreateLayoutComponentInput
    ) => Promise<CreateLayoutComponentOutput>;
    updateLayoutComponent: (
      input: UpdateLayoutComponentInput
    ) => Promise<UpdateLayoutComponentOutput>;
    createComponentInLayout: (
      input: CreateComponentInLayoutInput
    ) => Promise<CreateComponentInLayoutOutput>;
    removeComponentInLayout: (
      input: RemoveComponentInLayoutInput
    ) => Promise<RemoveComponentInLayoutOutput>;
    updateMarkdownComponent: (
      input: UpdateMarkdownComponentInput
    ) => Promise<UpdateMarkdownComponentOutput>;
    updateListComponent: (
      input: updateListComponentInput
    ) => Promise<updateListComponentOutput>;
  };
};

export function createContext({ currentUser }: { currentUser: string | null }) {
  const client = createClient();

  return {
    loggedInAs: currentUser,
    loaders: {
      booksByListIdsLoader: new DataLoader(getBooksByListIds(client)),
      componentsByIdsAndContextLoader: new DataLoader(
        getComponentsByIds(client),
        {
          cacheKeyFn: JSON.stringify,
        }
      ),
      layoutComponentsByCreatorsLoader: new DataLoader(
        getLayoutComponentsByCreators(client)
      ),
      listsByKeysLoader: new DataLoader(getListsByKeys(client)),
      listsByCreatorsLoader: new DataLoader(getListsByCreators(client)),
      listComponentsLoader: new DataLoader(getListComponents(client), {
        cacheKeyFn: JSON.stringify,
      }),
      bookComponentsByKeysLoader: new DataLoader(getBookComponents(client)),
    },
    mutations: {
      addBookToList: addBookToList(client),
      createList: createList(client),
      removeBookFromList: removeBookFromList(client),
      createLayoutComponent: createLayoutComponent(client),
      updateLayoutComponent: updateLayoutComponent(client),
      createComponentInLayout: createComponentInLayout(client),
      removeComponentInLayout: removeComponentInLayout(client),
      updateMarkdownComponent: updateMarkdownComponent(client),
      updateListComponent: updateListComponent(client),
    },
  };
}
