import {
  type CardComponent,
  LayoutContextType,
  ListSourceType,
  LinkComponent,
} from "api/__generated__/resolvers-types";

export type RootComponentModel = {
  id: string;
  componentType: string;
  contextType: LayoutContextType;
  contextKey: string;
};

export type RootLayoutComponentModel = RootComponentModel & {
  componentRefs: string[];
};

export type RootListComponentModel = RootComponentModel & {
  sourceType: ListSourceType | null;
  sourceKey: string | null;
  pageSize: number;
};

export type RootBookComponentModel = RootComponentModel & {
  sourceKey: string | null;
};

export type ListComponentModel = {
  title: string;
  link: LinkComponent | null;
  totalCards: number;
  cards: CardComponent[];
  createdBy: string;
};

export type BookComponentModel = {
  id: string;
  title: string;
  image: string;
  authorLinks: LinkComponent[];
  categoryLinks: LinkComponent[];
  actionLink: LinkComponent;
  detailsMarkdown: string;
};

export { default as getComponentsByIds } from "./get-components-by-ids";
export { default as getLayoutComponentsByCreators } from "./get-layout-components-by-creators";
export { default as getListComponents } from "./get-list-components";
export { default as getBookComponents } from "./get-book-components";

export {
  default as updateLayoutComponent,
  type UpdateLayoutComponentInput,
  type UpdateLayoutComponentOutput,
} from "./update-layout-component";

export {
  default as createLayoutComponent,
  type CreateLayoutComponentInput,
  type CreateLayoutComponentOutput,
} from "./create-layout-component";

export {
  default as createComponentInLayout,
  type CreateComponentInLayoutInput,
  type CreateComponentInLayoutOutput,
} from "./create-component-in-layout";

export {
  default as removeComponentInLayout,
  type RemoveComponentInLayoutInput,
  type RemoveComponentInLayoutOutput,
} from "./remove-component-in-layout";

export {
  default as updateMarkdownComponent,
  type UpdateMarkdownComponentInput,
  type UpdateMarkdownComponentOutput,
} from "./update-markdown-component";

export {
  default as updateListComponent,
  type updateListComponentInput,
  type updateListComponentOutput,
} from "./update-list-component";
