import { query as Q } from "faunadb";

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
export { default as getListsByCreators } from "./get-lists-by-creators";

export const selectListModel = {
  id: Q.Select(["ref", "id"], Q.Var("listDoc")),
  title: Q.Select(["data", "title"], Q.Var("listDoc")),
  slug: Q.Select(["data", "slug"], Q.Var("listDoc")),
  createdBy: Q.Select(["data", "createdBy"], Q.Var("listDoc")),
};
