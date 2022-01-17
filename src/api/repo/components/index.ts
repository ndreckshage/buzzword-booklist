import {
  type BookCardComponent,
  ComponentContextType,
  LinkComponent,
} from "api/__generated__/resolvers-types";

export type RootComponentModel = {
  id: string;
  componentType: string;
  contextType: ComponentContextType;
  contextKey: string;
};

export type RootLayoutComponentModel = RootComponentModel & {
  componentRefs: string[];
};

export type RootBookListComponentModel = RootComponentModel & {
  sourceType: ComponentContextType | null;
  sourceKey: string | null;
};

export type RootBookComponentModel = RootComponentModel & {
  sourceKey: string | null;
};

export type BookListComponentModel = {
  id: string;
  title: string;
  key: string;
  totalBookCards: number;
  bookCards: BookCardComponent[];
  bookListCreatedBy: string;
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
export { default as getBookListComponents } from "./get-book-list-components";
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
  default as updateBooklistComponent,
  type UpdateBooklistComponentInput,
  type UpdateBooklistComponentOutput,
} from "./update-booklist-component";
