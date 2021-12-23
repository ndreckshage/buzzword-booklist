import { Client } from "faunadb";
import DataLoader from "dataloader";

import { getLayouts, LayoutQuery } from "./repo/Layout";
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
  loaders: {
    layoutLoader: DataLoader<string, LayoutQuery, string>;
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
    };
  };
};

export function createContext() {
  const client = createClient();

  return {
    loaders: {
      layoutLoader: new DataLoader(getLayouts(client)),
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
      },
    },
  };
}
