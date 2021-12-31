import { useQuery, gql } from "ui/lib/use-data.server";
import {
  type Component,
  type LayoutComponent,
} from "api/__generated__/resolvers-types";
import cx from "classnames";

import Hero, { HeroComponentFragment } from "./hero.server";
import BookCarousel, {
  BookCarouselComponentFragment,
} from "./book-carousel.server";

const LayoutComponentFragment = gql`
  fragment LayoutComponentFragment on LayoutComponent {
    id
    createdBy
    styleOptions {
      flexDirection
    }
  }
`;

const ComponentFragment = gql`
  fragment ComponentFragment on Component {
    __typename
    ...LayoutComponentFragment
    ...HeroComponentFragment
    ...BookCarouselComponentFragment
  }

  ${LayoutComponentFragment}
  ${HeroComponentFragment}
  ${BookCarouselComponentFragment}
`;

// SUPPORT MAX 3 LEVELS OF LAYOUT!
const LAYOUT_QUERY = gql`
  query GetLayout($id: ID!) {
    component(id: $id) {
      ...ComponentFragment

      ... on LayoutComponent {
        components {
          ...ComponentFragment

          ... on LayoutComponent {
            components {
              ...ComponentFragment

              ... on LayoutComponent {
                components {
                  ...ComponentFragment
                }
              }
            }
          }
        }
      }
    }
  }

  ${ComponentFragment}
`;

const COMPONENT_MAP = {
  LayoutComponent: Layout,
  BookCarouselComponent: BookCarousel,
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
  styleOptions,
  components,
}: LayoutProps) {
  return (
    <div className="m-5 p-5 border border-violet-500">
      <p>Layout: {id}</p>
      {root && <CreatedBy user={createdBy} />}
      <div
        className={cx("flex", {
          "flex-row": styleOptions.flexDirection === "row",
          "flex-col": styleOptions.flexDirection === "col",
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

export default function LayoutRoot({ id }: { id: string }) {
  const data = useQuery<{ component: Component }>(
    `Component::${id}`,
    LAYOUT_QUERY,
    { id }
  );

  if (data.component.__typename !== "LayoutComponent") {
    return null;
  }

  return <Layout {...data.component} root />;
}
