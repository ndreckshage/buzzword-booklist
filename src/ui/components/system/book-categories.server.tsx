import gql from "graphql-tag";
import { type BookCategoriesComponent } from "api/__generated__/resolvers-types";
import Link from "./link.client";

export default function BookCategoriesComponent(
  props: BookCategoriesComponent
) {
  return (
    <div>
      <b>Categories:</b>{" "}
      <ul>
        {props.links.map((link, ndx) => (
          <li key={link.href}>
            <Link {...link} />
          </li>
        ))}
      </ul>
    </div>
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
