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

import { ComponentContextType } from "./__generated__/resolvers-types";

import { type BookModel, getBooksByListIds } from "api/repo/books";

import {
  type RootComponentModel,
  type RootLayoutComponentModel,
  type BookListComponentModel,
  getLayoutComponentsByCreators,
  getComponentsByIds,
  getBookListComponents,
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
  updateBooklistComponent,
  type UpdateBooklistComponentInput,
  type UpdateBooklistComponentOutput,
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
      { id: string; contextType: ComponentContextType; contextKey: string },
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
    bookListComponentsLoader: DataLoader<
      {
        componentType: string;
        sourceType: ComponentContextType | null;
        sourceKey: string | null;
      },
      BookListComponentModel,
      string
    >;
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
    updateBooklistComponent: (
      input: UpdateBooklistComponentInput
    ) => Promise<UpdateBooklistComponentOutput>;
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
      bookListComponentsLoader: new DataLoader(getBookListComponents(client), {
        cacheKeyFn: JSON.stringify,
      }),
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
      updateBooklistComponent: updateBooklistComponent(client),
    },
  };
}
