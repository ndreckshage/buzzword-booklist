import {
  type BookCardComponent,
  BookListContext,
} from "api/__generated__/resolvers-types";

export type RootComponentModel = { id: string; componentType: string };

export type RootLayoutComponentModel = RootComponentModel & {
  componentRefs: string[];
};

export type RootBookListComponentModel = RootComponentModel & {
  sourceType: BookListContext | null;
  sourceKey: string | null;
};

export type BookListComponentModel = {
  id: string;
  title: string;
  slug: string;
  totalBookCards: number;
  bookCards: BookCardComponent[];
};

export { default as getComponentsByIds } from "./get-components-by-ids";
export { default as getLayoutComponentsByCreators } from "./get-layout-components-by-creators";
export { default as getBookListComponents } from "./get-book-list-components";
