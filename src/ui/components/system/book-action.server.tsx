import gql from "graphql-tag";
import { type BookActionComponent } from "api/__generated__/resolvers-types";
import Link from "./link.client";

export default function BooksActionComponent(props: BookActionComponent) {
  if (!props.link?.href) {
    return null;
  }

  return <Link {...props.link} />;
}

export const BookActionComponentFragment = gql`
  fragment BookActionComponentFragment on BookActionComponent {
    id
    link {
      href
      title
      variant
    }
  }
`;
