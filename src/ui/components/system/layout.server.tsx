import { useQuery, gql } from "ui/lib/use-data.server";

import Hero from "./hero.server";

const LAYOUT_QUERY = gql`
  query GetLayout($layoutRef: String!) {
    layout(layoutRef: $layoutRef) {
      id
      components {
        __typename

        ... on LayoutComponent {
          id
          components {
            __typename

            ... on HeroComponent {
              id
              title
              subTitle
            }
          }
        }

        ... on HeroComponent {
          id
          title
          subTitle
        }
      }
    }
  }
`;

const COMPONENT_MAP = {
  LayoutComponent: Layout,
  HeroComponent: Hero,
};

export default function Layout({ layoutRef }: { layoutRef: string }) {
  const data = useQuery(layoutRef, LAYOUT_QUERY, { layoutRef });
  console.log("d", data.layout.components);

  // return data.layout.components.map((component) => {
  //   // const Component = COMPONENT_MAP[component.__typename];

  //   // if (component.__typename === "LayoutComponent") {
  //   //   return <p>todo -recursive layout</p>;
  //   // }

  //   // return <Component {...component} />;
  // });

  return <p>hi</p>;
}
