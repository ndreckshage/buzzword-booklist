import { useQuery, gql } from "ui/lib/use-data.server";

import Hero, { HeroComponentFragment } from "./hero.server";
import BookCarousel, {
  BookCarouselComponentFragment,
} from "./book-carousel.server";

const LAYOUT_QUERY = gql`
  query GetLayout($id: ID!) {
    layout(id: $id) {
      id
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

export default function Layout({ id }: { id: string }) {
  const data = useQuery<{
    layout: {
      id: string;
      components: {
        __typename: string;
        id: string;
      }[];
    };
  }>(`Layout::${id}`, LAYOUT_QUERY, { id });

  return (
    <div>
      <p>Layout: {data.layout.id}</p>
      {data.layout.components.map((component) => {
        // @ts-ignore
        const Component = COMPONENT_MAP[component.__typename];
        if (!Component) {
          return null;
        }

        return <Component key={component.id} {...component} />;
      })}
    </div>
  );
}
