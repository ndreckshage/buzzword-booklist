import gql from "graphql-tag";
import { type BookActionComponent } from "api/__generated__/resolvers-types";
import Link from "./link.client";

export default function BooksActionComponent(props: BookActionComponent) {
  if (!props.link?.href) {
    return null;
  }

  return (
    <div className="pb-2">
      <Link {...props.link} />
    </div>
  );
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
