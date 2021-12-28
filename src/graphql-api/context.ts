import { Client } from "faunadb";
import DataLoader from "dataloader";

import { getLayouts, LayoutQuery } from "./repo/Layout";
import { getComponents, ComponentQuery } from "./repo/Component";

import {
  getList,
  GetListQuery,
  GetListQueryInput,
  getListBooks,
  GetListBooksQuery,
  GetListBooksQueryInput,
  createList,
  CreateListMutation,
  CreateListMutationInput,
  addBookToList,
  AddBookToListMutation,
  AddBookToListMutationInput,
  removeBookListConnection,
  RemoveBookListConnectionInput,
  RemoveBookListConnectionResult,
} from "./repo/BookList";

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
    bookCarouselComponentLoader: DataLoader<
      string,
      BookCarouselComponentQuery,
      string
    >;
  };
  repo: {
    bookList: {
      getList: (listSlug: GetListQueryInput) => Promise<GetListQuery>;
      getListBooks: (
        input: GetListBooksQueryInput
      ) => Promise<GetListBooksQuery>;
      createList: (
        title: CreateListMutationInput
      ) => Promise<CreateListMutation>;
      addBookToList: (
        input: AddBookToListMutationInput
      ) => Promise<AddBookToListMutation>;
      removeBookListConnection: (
        input: RemoveBookListConnectionInput
      ) => Promise<RemoveBookListConnectionResult>;
    };
  };
};

export function createContext({ currentUser }: { currentUser: string | null }) {
  const client = createClient();

  return {
    currentUser,
    loaders: {
      layoutLoader: new DataLoader(getLayouts(client)),
      componentLoader: new DataLoader(getComponents(client)),
      bookCarouselComponentLoader: new DataLoader(
        getBookCarouselComponents(client)
      ),
    },
    repo: {
      bookList: {
        getList: getList(client),
        getListBooks: getListBooks(client),
        createList: createList(client),
        addBookToList: addBookToList(client),
        removeBookListConnection: removeBookListConnection(client),
      },
    },
  };
}
