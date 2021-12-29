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
  type ComponentModel,
  type LayoutModel,
  getLayoutComponentsByIds,
  getComponentsByIds,
} from "api/repo/components";

// import {
//   getBookCarouselComponents,
//   BookCarouselComponentQuery,
// } from "./repo/BookCarouselComponent";

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
    componentsByIdsLoader: DataLoader<string, ComponentModel, string>;
    layoutComponentsByIdsLoader: DataLoader<string, LayoutModel, string>;
    listsBySlugsLoader: DataLoader<string, ListModel, string>;
    // bookCarouselComponentLoader: DataLoader<
    //   string,
    //   BookCarouselComponentQuery,
    //   string
    // >;
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
      // bookCarouselComponentLoader: new DataLoader(
      //   getBookCarouselComponents(client)
      // ),
    },
    mutations: {
      addBookToList: addBookToList(client),
      createList: createList(client),
      removeBookFromList: removeBookFromList(client),
    },
  };
}
