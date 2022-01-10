import gql from "graphql-tag";
import { type BookCategoriesComponent } from "api/__generated__/resolvers-types";
import { Fragment } from "react";
import Link from "./link.client";

export default function BookCategoriesComponent(
  props: BookCategoriesComponent
) {
  return (
    <p>
      Categories:{" "}
      {props.links.map((link, ndx) => (
        <Fragment key={link.href}>
          <Link {...link} />
          {ndx < props.links.length - 1 ? ", " : ""}
        </Fragment>
      ))}
    </p>
  );
}

export const BookCategoriesComponentFragment = gql`
  fragment BookCategoriesComponentFragment on BookCategoriesComponent {
    id
    links {
      href
      title
      variant
    }
  }
`;
