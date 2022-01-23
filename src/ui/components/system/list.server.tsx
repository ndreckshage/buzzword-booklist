import gql from "graphql-tag";
import { type ListComponent } from "api/__generated__/resolvers-types";
import List from "./list.client";

export default function ListServer(props: ListComponent) {
  return <List {...props} />;
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
      createdBy
    }
  }
`;
