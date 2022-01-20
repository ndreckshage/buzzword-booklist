import gql from "graphql-tag";
import { type GridComponent } from "api/__generated__/resolvers-types";
import BookGrid from "./book-grid.client";

export default function BookGridServer(props: GridComponent) {
  return (
    <div className="container mx-auto my-10">
      <BookGrid {...props} />
    </div>
  );
}

export const GridComponentFragment = gql`
  fragment GridComponentFragment on GridComponent {
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
