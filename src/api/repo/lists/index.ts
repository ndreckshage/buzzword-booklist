export type ListModel = {
  id: string;
  title: string;
  slug: string;
  createdBy: string;
};

export {
  default as createList,
  type CreateListInput,
  type CreateListOutput,
} from "./create-list";

export {
  default as addBookToList,
  type AddBookToListInput,
  type AddBookToListOutput,
} from "./add-book-to-list";

export {
  default as removeBookFromList,
  type RemoveBookFromListInput,
  type RemoveBookFromListOutput,
} from "./remove-book-from-list";

export { default as getListsBySlugs } from "./get-lists-by-slugs";
