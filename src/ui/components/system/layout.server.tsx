import { useQuery, gql } from "ui/lib/use-data.server";
import {
  type LayoutComponent,
  type ComponentContextType,
} from "api/__generated__/resolvers-types";
import cx from "classnames";

import Hero, { HeroComponentFragment } from "./hero.server";
import BookCarousel, {
  BookCarouselComponentFragment,
} from "./book-carousel.server";
import BookGrid, { BookGridComponentFragment } from "./book-grid.server";
import BookList, { BookListComponentFragment } from "./book-list.server";

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
    ...HeroComponentFragment
    ...BookCarouselComponentFragment
    ...BookGridComponentFragment
    ...BookListComponentFragment
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
  ${HeroComponentFragment}
  ${BookCarouselComponentFragment}
  ${BookGridComponentFragment}
  ${BookListComponentFragment}
`;

const COMPONENT_MAP = {
  LayoutComponent: Layout,
  BookCarouselComponent: BookCarousel,
  BookGridComponent: BookGrid,
  BookListComponent: BookList,
  HeroComponent: Hero,
};

const CreatedBy = ({ user }: { user: string }) => (
  <div>
    Created by:
    <img
      src={`https://avatars.githubusercontent.com/${user}?s=50`}
      width={50}
      height={50}
    />
    <a href={`https://github.com/${user}`} target="_blank">
      {user}
    </a>
  </div>
);

type LayoutProps = LayoutComponent & { root: boolean };

function Layout({
  id,
  createdBy,
  root,
  flexDirection,
  components,
}: LayoutProps) {
  return (
    <div className="m-5 p-5 border border-violet-500">
      <p>Layout: {id}</p>
      {root && <CreatedBy user={createdBy} />}
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

          return (
            <div key={component.id} className="m-5 p-5 border border-green-500">
              <Component key={component.id} {...component} />
            </div>
          );
        })}
      </div>
    </div>
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
