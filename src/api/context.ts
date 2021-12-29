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

import { getLayouts, LayoutQuery } from "api/repo/Layout";
import { getComponents, ComponentQuery } from "api/repo/Component";

import {
  getBookCarouselComponents,
  BookCarouselComponentQuery,
} from "./repo/BookCarouselComponent";

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
    layoutLoader: DataLoader<string, LayoutQuery, string>;
    componentLoader: DataLoader<string, ComponentQuery, string>;
    listsBySlugsLoader: DataLoader<string, ListModel, string>;
    booksByListIdsLoader: DataLoader<string, BookModel[], string>;
    bookCarouselComponentLoader: DataLoader<
      string,
      BookCarouselComponentQuery,
      string
    >;
  };
  mutations: {
    createList: (title: CreateListInput) => Promise<CreateListOutput>;
    addBookToList: (input: AddBookToListInput) => Promise<AddBookToListOutput>;
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
      layoutLoader: new DataLoader(getLayouts(client)),
      componentLoader: new DataLoader(getComponents(client)),
      listsBySlugsLoader: new DataLoader(getListsBySlugs(client)),
      booksByListIdsLoader: new DataLoader(getBooksByListIds(client)),
      bookCarouselComponentLoader: new DataLoader(
        getBookCarouselComponents(client)
      ),
    },
    mutations: {
      createList: createList(client),
      addBookToList: addBookToList(client),
      removeBookFromList: removeBookFromList(client),
    },
  };
}
