import { useQuery, gql } from "ui/lib/use-data.server";
import {
  type LayoutComponent,
  type ComponentContextType,
} from "api/__generated__/resolvers-types";
import cx from "classnames";

import Markdown, { MarkdownComponentFragment } from "./markdown.server";
import BookCarousel, {
  BookCarouselComponentFragment,
} from "./book-carousel.server";
import BookGrid, { BookGridComponentFragment } from "./book-grid.server";
import BookList, { BookListComponentFragment } from "./book-list.server";
import BookAuthors, {
  BookAuthorsComponentFragment,
} from "./book-authors.server";
import BookCategories, {
  BookCategoriesComponentFragment,
} from "./book-categories.server";
import BookDetails, {
  BookDetailsComponentFragment,
} from "./book-details.server";
import BookImage, { BookImageComponentFragment } from "./book-image.server";
import BookTitle, { BookTitleComponentFragment } from "./book-title.server";
import BookAction, { BookActionComponentFragment } from "./book-action.server";
import CreatedBy from "../common/created-by";

const LayoutComponentFragment = gql`
  fragment LayoutComponentFragment on LayoutComponent {
    id
    createdBy
    flexDirection
  }
`;

const ComponentFragment = gql`
  fragment ComponentFragment on Component {
    __typename
    ...LayoutComponentFragment
    ...MarkdownComponentFragment
    ...BookCarouselComponentFragment
    ...BookGridComponentFragment
    ...BookListComponentFragment
    ...BookAuthorsComponentFragment
    ...BookCategoriesComponentFragment
    ...BookDetailsComponentFragment
    ...BookImageComponentFragment
    ...BookTitleComponentFragment
    ...BookActionComponentFragment
  }
`;

// SUPPORT MAX 3 LEVELS OF LAYOUT!
const LAYOUT_QUERY = gql`
  query GetLayout(
    $id: ID!
    $contextType: ComponentContextType!
    $contextKey: String!
  ) {
    layout(id: $id, contextType: $contextType, contextKey: $contextKey) {
      __typename
      ...LayoutComponentFragment

      components {
        __typename
        ...ComponentFragment

        ... on LayoutComponent {
          components {
            __typename
            ...ComponentFragment

            ... on LayoutComponent {
              components {
                __typename
                ...ComponentFragment
              }
            }
          }
        }
      }
    }
  }

  ${LayoutComponentFragment}
  ${ComponentFragment}
  ${MarkdownComponentFragment}
  ${BookCarouselComponentFragment}
  ${BookGridComponentFragment}
  ${BookListComponentFragment}
  ${BookTitleComponentFragment}
  ${BookImageComponentFragment}
  ${BookAuthorsComponentFragment}
  ${BookCategoriesComponentFragment}
  ${BookDetailsComponentFragment}
  ${BookActionComponentFragment}
`;

const COMPONENT_MAP = {
  LayoutComponent: Layout,
  BookCarouselComponent: BookCarousel,
  BookGridComponent: BookGrid,
  BookListComponent: BookList,
  BookAuthorsComponent: BookAuthors,
  BookCategoriesComponent: BookCategories,
  BookDetailsComponent: BookDetails,
  BookImageComponent: BookImage,
  BookTitleComponent: BookTitle,
  BookActionComponent: BookAction,
  MarkdownComponent: Markdown,
};

type LayoutProps = LayoutComponent & { root: boolean };

function Layout({ createdBy, root, flexDirection, components }: LayoutProps) {
  return (
    <>
      {root && (
        <div className="border-b border-slate-100 py-2">
          <div className="container mx-auto flex justify-end">
            <CreatedBy createdByType="Layout" createdBy={createdBy} />
          </div>
        </div>
      )}
      <div
        className={cx("flex", {
          "flex-row": flexDirection === "row",
          "flex-col": flexDirection === "col",
        })}
      >
        {components.map((component) => {
          // @ts-ignore
          const Component = COMPONENT_MAP[component.__typename];
          if (!Component) {
            return null;
          }

          return <Component key={component.id} {...component} />;
        })}
      </div>
    </>
  );
}

export default function LayoutContainer({
  id,
  contextType,
  contextKey,
}: {
  id: string;
  contextType: ComponentContextType;
  contextKey: string;
}) {
  const data = useQuery<{ layout: LayoutComponent }>(
    `Component::${id}`,
    LAYOUT_QUERY,
    { id, contextType, contextKey }
  );

  return <Layout {...data.layout} root />;
}
