import { query as q } from "faunadb";

export type ListModel = {
  id: string;
  title: string;
  key: string;
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

export { default as getListsByKeys } from "./get-lists-by-keys";
export { default as getListsByCreators } from "./get-lists-by-creators";

export const selectListModel = {
  id: q.Select(["ref", "id"], q.Var("listDoc")),
  title: q.Select(["data", "title"], q.Var("listDoc")),
  key: q.Select(["data", "key"], q.Var("listDoc")),
  createdBy: q.Select(["data", "createdBy"], q.Var("listDoc")),
};
