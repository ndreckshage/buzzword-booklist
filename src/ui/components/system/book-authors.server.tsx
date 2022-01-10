import gql from "graphql-tag";
import { type BookAuthorsComponent } from "api/__generated__/resolvers-types";
import Link from "./link.client";
import { Fragment } from "react";

export default function BookAuthorsComponent(props: BookAuthorsComponent) {
  return (
    <p>
      Authors:{" "}
      {props.links.map((link, ndx) => (
        <Fragment key={link.href}>
          <Link {...link} />
          {ndx < props.links.length - 1 ? ", " : ""}
        </Fragment>
      ))}
    </p>
  );
}

export const BookAuthorsComponentFragment = gql`
  fragment BookAuthorsComponentFragment on BookAuthorsComponent {
    id
    links {
      href
      title
      variant
    }
  }
`;
