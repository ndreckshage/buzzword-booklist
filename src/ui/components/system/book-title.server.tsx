import gql from "graphql-tag";
import { type BookTitleComponent } from "api/__generated__/resolvers-types";

export default function BookTitleComponent(props: BookTitleComponent) {
  return <h1>{props.title}</h1>;
}

export const BookTitleComponentFragment = gql`
  fragment BookTitleComponentFragment on BookTitleComponent {
    id
    title
  }
`;
