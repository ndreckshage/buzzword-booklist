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
  getListsBySlugs,
} from "api/repo/lists";

import { type BookModel, getBooksByListIds } from "api/repo/books";

import {
  type RootComponentModel,
  type RootLayoutComponentModel,
  getLayoutComponentsByIds,
  getComponentsByIds,
  getBookCarouselComponentsByJsonRefs,
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
  currentUser: string | null;
  loaders: {
    booksByListIdsLoader: DataLoader<string, BookModel[], string>;
    componentsByIdsLoader: DataLoader<string, RootComponentModel, string>;
    layoutComponentsByIdsLoader: DataLoader<
      string,
      RootLayoutComponentModel,
      string
    >;
    listsBySlugsLoader: DataLoader<string, ListModel, string>;
    bookCarouselComponentsByJsonRefs: DataLoader<string, [], string>;
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
    currentUser,
    loaders: {
      booksByListIdsLoader: new DataLoader(getBooksByListIds(client)),
      componentsByIdsLoader: new DataLoader(getComponentsByIds(client)),
      layoutComponentsByIdsLoader: new DataLoader(
        getLayoutComponentsByIds(client)
      ),
      listsBySlugsLoader: new DataLoader(getListsBySlugs(client)),
      bookCarouselComponentsByJsonRefs: new DataLoader(
        getBookCarouselComponentsByJsonRefs(client)
      ),
    },
    mutations: {
      addBookToList: addBookToList(client),
      createList: createList(client),
      removeBookFromList: removeBookFromList(client),
    },
  };
}
