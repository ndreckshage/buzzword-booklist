export type RootComponentModel = { id: string; componentType: string };

export type RootLayoutComponentModel = RootComponentModel & {
  componentRefs: string[];
};

export type RootBookCarouselComponentModel = RootComponentModel & {
  sourceType: string;
  sourceId: string;
};

export { default as getComponentsByIds } from "./get-components-by-ids";
export { default as getLayoutComponentsByIds } from "./get-layout-components-by-ids";
export { default as getBookCarouselComponentsByJsonRefs } from "./get-book-carousel-components-by-json-refs";
