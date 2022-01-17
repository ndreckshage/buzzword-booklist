import gql from "graphql-tag";
import { type BookGridComponent } from "api/__generated__/resolvers-types";
import BookGrid from "./book-grid.client";

export default function BookGridServer(props: BookGridComponent) {
  return (
    <div className="container mx-auto my-10">
      <BookGrid {...props} />
    </div>
  );
}

export const BookGridComponentFragment = gql`
  fragment BookGridComponentFragment on BookGridComponent {
    id
    title
    bookCards {
      id
      href
      image
      title
    }
  }
`;
