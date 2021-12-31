import {
  type BookCardComponent,
  LinkComponent,
} from "api/__generated__/resolvers-types";

export type RootComponentModel = { id: string; componentType: string };

export type RootLayoutComponentModel = RootComponentModel & {
  componentRefs: string[];
};

export type RootBookCarouselComponentModel = RootComponentModel & {
  sourceType: string;
  sourceId: string;
};

export type RootBookListComponentModel = RootComponentModel & {
  sourceType: string;
};

export type BookCarouselComponentModel = {
  id: string;
  title: string;
  link: LinkComponent;
  bookCards: BookCardComponent[];
};

export { default as getComponentsByIds } from "./get-components-by-ids";
export { default as getLayoutComponentsByCreators } from "./get-layout-components-by-creators";
export { default as getBookCarouselComponentsByRefs } from "./get-book-carousel-components-by-refs";
