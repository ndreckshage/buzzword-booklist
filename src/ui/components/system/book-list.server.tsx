import gql from "graphql-tag";
import { type ListComponent } from "api/__generated__/resolvers-types";
import BookList from "./book-list.client";

export default function BookListServer(props: ListComponent) {
  return (
    <div className="container mx-auto my-5">
      <BookList {...props} />
    </div>
  );
}

export const ListComponentFragment = gql`
  fragment ListComponentFragment on ListComponent {
    id
    title
    createdBy
    cards {
      id
      href
      image
      title
    }
  }
`;
