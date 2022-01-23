import { useQuery, gql } from "ui/lib/use-data.server";
import {
  type LayoutComponent,
  LayoutContextType,
} from "api/__generated__/resolvers-types";
import cx from "classnames";

import Markdown, { MarkdownComponentFragment } from "./markdown.server";
import Carousel, { CarouselComponentFragment } from "./carousel.server";
import Grid, { GridComponentFragment } from "./grid.server";
import List, { ListComponentFragment } from "./list.server";
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
import LayoutContextPicker from "./layout-context-picker.client";

const LayoutComponentFragment = gql`
  fragment LayoutComponentFragment on LayoutComponent {
    id
    layoutCreatedBy: createdBy
    flexDirection
    container
  }
`;

const ComponentFragment = gql`
  fragment ComponentFragment on Component {
    __typename
    ...LayoutComponentFragment
    ...MarkdownComponentFragment
    ...CarouselComponentFragment
    ...GridComponentFragment
    ...ListComponentFragment
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
    $contextType: LayoutContextType!
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
  ${CarouselComponentFragment}
  ${GridComponentFragment}
  ${ListComponentFragment}
  ${BookTitleComponentFragment}
  ${BookImageComponentFragment}
  ${BookAuthorsComponentFragment}
  ${BookCategoriesComponentFragment}
  ${BookDetailsComponentFragment}
  ${BookActionComponentFragment}
`;

const COMPONENT_MAP = {
  LayoutComponent: Layout,
  CarouselComponent: Carousel,
  GridComponent: Grid,
  ListComponent: List,
  BookAuthorsComponent: BookAuthors,
  BookCategoriesComponent: BookCategories,
  BookDetailsComponent: BookDetails,
  BookImageComponent: BookImage,
  BookTitleComponent: BookTitle,
  BookActionComponent: BookAction,
  MarkdownComponent: Markdown,
};

type LayoutProps = LayoutComponent & {
  root: boolean;
  className?: string;
};

function Layout({
  __typename,
  layoutCreatedBy,
  root,
  flexDirection,
  container,
  components,
  className,
  showContextPicker,
}: LayoutProps & { layoutCreatedBy: string; showContextPicker: boolean }) {
  return (
    <div className={__typename}>
      {root && (
        <div className="border-b border-slate-100 py-2">
          <div className="container mx-auto px-4 flex justify-between md:items-center flex-col-reverse md:flex-row space-y-2 space-y-reverse">
            {showContextPicker && <LayoutContextPicker />}
            <CreatedBy createdByType="Layout" createdBy={layoutCreatedBy} />
          </div>
        </div>
      )}
      <div
        className={cx("flex", className, {
          "container mx-auto px-4 overflow-hidden": container,
          "my-5 md:my-10": container && root,
          "flex-col space-y-5": flexDirection === "col",
          "flex-col md:flex-row md:space-x-5": flexDirection === "row",
        })}
      >
        {components.map((component) => {
          // @ts-ignore
          const Component = COMPONENT_MAP[component.__typename];
          if (!Component) {
            return (
              <div
                key={component.__typename}
                className="container mx-auto px-4 space-y-5 md:space-y-10"
              >
                <p>Component for {component.__typename} not found</p>
              </div>
            );
          }

          return <Component key={component.id} {...component} />;
        })}
      </div>
    </div>
  );
}

export default function LayoutContainer({
  id,
  contextType,
  contextKey,
  className,
  showContextPicker,
}: {
  id: string;
  contextType?: LayoutContextType;
  contextKey?: string;
  className?: string;
  showContextPicker?: boolean;
}) {
  const data = useQuery<{
    layout: LayoutComponent & { layoutCreatedBy: string };
  }>(`Component::${id}`, LAYOUT_QUERY, {
    id,
    contextType: contextType ?? LayoutContextType.None,
    contextKey: contextKey ?? "",
  });

  return (
    <Layout
      {...data.layout}
      className={className ?? ""}
      showContextPicker={showContextPicker!!}
      root
    />
  );
}
