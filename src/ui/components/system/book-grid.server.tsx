import gql from "graphql-tag";
import { type BookGridComponent } from "api/__generated__/resolvers-types";

export default function BookGridServer(props: BookGridComponent) {
  return <p>{props.title}</p>;
}

export const BookGridComponentFragment = gql`
  fragment BookGridComponentFragment on BookGridComponent {
    id
    title
    bookCards {
      id
      href
      image
    }
  }
`;
