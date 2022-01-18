import gql from "graphql-tag";
import { type BookListComponent } from "api/__generated__/resolvers-types";
import BookList from "./book-list.client";

export default function BookListServer(props: BookListComponent) {
  return (
    <div className="container mx-auto my-5">
      <BookList {...props} />
    </div>
  );
}

export const BookListComponentFragment = gql`
  fragment BookListComponentFragment on BookListComponent {
    id
    title
    bookListCreatedBy
    bookCards {
      id
      href
      image
      title
    }
  }
`;
