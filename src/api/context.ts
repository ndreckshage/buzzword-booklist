import { Client } from "faunadb";
import DataLoader from "dataloader";

import { QueryLayoutComponentArgs } from "./__generated__/resolvers-types";

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
  getListsBySlugs,
  getListsByCreators,
} from "api/repo/lists";

import { type BookModel, getBooksByListIds } from "api/repo/books";

import {
  type RootComponentModel,
  type RootLayoutComponentModel,
  type BookCarouselComponentModel,
  getLayoutComponentsByCreators,
  getLayoutComponentsByIdsAndContext,
  getComponentsByIds,
  getBookCarouselComponentsByRefs,
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
    componentsByIdsLoader: DataLoader<string, RootComponentModel, string>;
    layoutComponentsByCreatorsLoader: DataLoader<
      string,
      RootLayoutComponentModel[],
      string
    >;
    layoutComponentsByIdsAndContextLoader: DataLoader<
      QueryLayoutComponentArgs,
      RootLayoutComponentModel,
      string
    >;
    listsBySlugsLoader: DataLoader<string, ListModel, string>;
    listsByCreatorsLoader: DataLoader<string, ListModel[], string>;
    bookCarouselComponentsByJsonRefs: DataLoader<
      { sourceId: string; sourceType: string },
      BookCarouselComponentModel,
      string
    >;
  };
  mutations: {
    addBookToList: (input: AddBookToListInput) => Promise<AddBookToListOutput>;
    createList: (title: CreateListInput) => Promise<CreateListOutput>;
    removeBookFromList: (
      input: RemoveBookFromListInput
    ) => Promise<RemoveBookFromListOutput>;
  };
};

export function createContext({ currentUser }: { currentUser: string | null }) {
  const client = createClient();

  return {
    loggedInAs: currentUser,
    loaders: {
      booksByListIdsLoader: new DataLoader(getBooksByListIds(client)),
      componentsByIdsLoader: new DataLoader(getComponentsByIds(client)),
      layoutComponentsByCreatorsLoader: new DataLoader(
        getLayoutComponentsByCreators(client)
      ),
      layoutComponentsByIdsAndContextLoader: new DataLoader(
        getLayoutComponentsByIdsAndContext(client),
        { cacheKeyFn: JSON.stringify }
      ),
      listsBySlugsLoader: new DataLoader(getListsBySlugs(client)),
      listsByCreatorsLoader: new DataLoader(getListsByCreators(client)),
      bookCarouselComponentsByJsonRefs: new DataLoader(
        getBookCarouselComponentsByRefs(client),
        { cacheKeyFn: JSON.stringify }
      ),
    },
    mutations: {
      addBookToList: addBookToList(client),
      createList: createList(client),
      removeBookFromList: removeBookFromList(client),
    },
  };
}
