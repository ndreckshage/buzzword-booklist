import { Client } from "faunadb";
import DataLoader from "dataloader";

import { getLayouts, LayoutQuery } from "./repo/Layout";
import {
  getBookList,
  BookListQuery,
  BookListQueryInput,
} from "./repo/BookList";
import {
  getBookCarouselComponents,
  BookCarouselComponentQuery,
} from "./repo/BookCarouselComponent";

export default function createClient() {
  const FAUNA_SECRET = process.env.FAUNA_ADMIN_KEY;
  if (!FAUNA_SECRET) {
    throw new Error("MISSING FAUNA_ADMIN_KEY");
  }

  return new Client({
    secret: FAUNA_SECRET,
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
  queries: {
    getBookList: (
      booklistQueryInput: BookListQueryInput
    ) => Promise<BookListQuery>;
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
    queries: {
      getBookList: getBookList(client),
    },
  };
}
