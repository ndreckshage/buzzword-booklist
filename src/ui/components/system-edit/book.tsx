import { gql } from "ui/lib/use-data.client";

export const BookImageComponentFragment = gql`
  fragment BookImageComponentFragment on BookImageComponent {
    id
  }
`;

export const BookActionComponentFragment = gql`
  fragment BookActionComponentFragment on BookActionComponent {
    id
  }
`;

export const BookTitleComponentFragment = gql`
  fragment BookTitleComponentFragment on BookTitleComponent {
    id
  }
`;

export const BookAuthorsComponentFragment = gql`
  fragment BookAuthorsComponentFragment on BookAuthorsComponent {
    id
  }
`;

export const BookCategoriesComponentFragment = gql`
  fragment BookCategoriesComponentFragment on BookCategoriesComponent {
    id
  }
`;

export const BookDetailsComponentFragment = gql`
  fragment BookDetailsComponentFragment on BookDetailsComponent {
    id
  }
`;

export default function BookComponent(props: {
  __typename: string;
  id: string;
}) {
  return (
    <div>
      <p>{props.__typename}</p>
    </div>
  );
}
