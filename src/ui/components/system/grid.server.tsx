import gql from "graphql-tag";
import { type GridComponent } from "api/__generated__/resolvers-types";
import Grid from "./grid.client";

export default function GridServer(props: GridComponent) {
  return (
    <div className="container mx-auto my-10">
      <Grid {...props} />
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
