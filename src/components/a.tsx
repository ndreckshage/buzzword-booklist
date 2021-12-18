import fetchGraphQL from "../lib/fetchGraphQL";
import { useEffect, useState } from "react";

const A = () => {
  const [layout, setLayout] = useState<{
    __typename: string;
    components: {
      __typename: string;
      id: string;
      title: string;
    }[];
  } | null>(null);

  useEffect(() => {
    let isMounted = true;

    fetchGraphQL(
      `
      query Example {
        layout(layoutKey: "home-page") {
          __typename
          ... on SingleColumnLayout {
            id
            components {
              __typename
              ... on BookCarouselComponent {
                id
                title
              }
            }
          }
        }
      }
    `,
      {}
    ).then((response) => {
      if (!isMounted) {
        return;
      }

      setLayout(response.data.layout);
    });

    return () => {
      isMounted = false;
    };
  }, [fetchGraphQL]);

  if (!layout) {
    return <>loading layout...</>;
  }

  return (
    <>
      {layout.components.map((component) => (
        <div key={component.id}>
          <p>Type: {component.__typename}</p>
          <p>ID: {component.id}</p>
          <p>Title: {component.title}</p>
        </div>
      ))}
    </>
  );
};

export default A;
