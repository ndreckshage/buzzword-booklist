import { useQuery, gql } from "ui/lib/use-data.server";
import cx from "classnames";

import Hero, { HeroComponentFragment } from "./hero.server";
import BookCarousel, {
  BookCarouselComponentFragment,
} from "./book-carousel.server";

const LAYOUT_QUERY = gql`
  query GetLayout($id: ID!) {
    layoutComponent(id: $id, layoutContext: {}) {
      id
      createdBy
      styleOptions {
        flexDirection
      }
      components {
        __typename

        ... on LayoutComponent {
          id
        }

        ...HeroComponentFragment
        ...BookCarouselComponentFragment
      }
    }
  }
  ${HeroComponentFragment}
  ${BookCarouselComponentFragment}
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

export default function Layout({ id, root }: { id: string; root: boolean }) {
  const data = useQuery<{
    layoutComponent: {
      id: string;
      createdBy: string;
      styleOptions: {
        flexDirection: string;
      };
      components: {
        __typename: string;
        id: string;
      }[];
    };
  }>(`Layout::${id}`, LAYOUT_QUERY, { id });

  return (
    <div className="m-5 p-5 border border-violet-500">
      <p>Layout: {data.layoutComponent.id}</p>
      {root && <CreatedBy user={data.layoutComponent.createdBy} />}
      <div
        className={cx("flex", {
          "flex-row": data.layoutComponent.styleOptions.flexDirection === "row",
          "flex-col": data.layoutComponent.styleOptions.flexDirection === "col",
        })}
      >
        {data.layoutComponent.components.map((component) => {
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
