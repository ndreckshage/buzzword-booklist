import { Client } from "faunadb";
import DataLoader from "dataloader";

import { getLayouts, LayoutQuery } from "./repo/Layout";
import {
  getBookList,
  upsertBookList,
  BookListQuery,
  BookListQueryInput,
  UpsertBookListMutation,
  UpsertBookListMutationInput,
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
      getBookList: (
        booklistQueryInput: BookListQueryInput
      ) => Promise<BookListQuery>;
      upsertBookList: (
        bookList: UpsertBookListMutationInput
      ) => Promise<UpsertBookListMutation>;
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
        getBookList: getBookList(client),
        upsertBookList: upsertBookList(client),
      },
    },
  };
}
