import { type BookCardComponent } from "api/__generated__/resolvers-types";

export type RootComponentModel = { id: string; componentType: string };

export type RootLayoutComponentModel = RootComponentModel & {
  componentRefs: string[];
};

export type RootBookCarouselComponentModel = RootComponentModel & {
  sourceType: string;
  sourceId: string;
};

export type BookCarouselComponentModel = {
  id: string;
  title: string;
  slug: string;
  bookCards: BookCardComponent[];
};

export { default as getComponentsByIds } from "./get-components-by-ids";
export { default as getLayoutComponentsByIds } from "./get-layout-components-by-ids";
export { default as getBookCarouselComponentsByRefs } from "./get-book-carousel-components-by-refs";
