import gql from "graphql-tag";
import { type BookActionComponent } from "api/__generated__/resolvers-types";
import Link from "./link.client";
import { Fragment } from "react";

export default function BooksActionComponent(props: BookActionComponent) {
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
