import fetchGraphQL from "../lib/fetchGraphQL";

const cache: any = {};

function useData(key: any, fetcher: any) {
  if (!cache[key]) {
    let data: any = undefined;
    let promise: any = null;
    cache[key] = () => {
      if (data !== undefined) return data;
      if (!promise) promise = fetcher().then((r: any) => (data = r));
      throw promise;
    };
  }

  return cache[key]();
}

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const B = ({ sleepMs, cacheKey }: { sleepMs: number; cacheKey: string }) => {
  const data: {
    layout: {
      components: {
        id: string;
        __typename: string;
        title: string;
      }[];
    };
  } = useData(cacheKey, () =>
    sleep(sleepMs).then(() =>
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
      )
        .then((response) => response.data)
        .catch(console.error)
    )
  );

  return (
    <>
      {data.layout.components.map((component) => (
        <div key={component.id}>
          <p>Type: {component.__typename}</p>
          <p>ID: {component.id}</p>
          <p>Title: {component.title}</p>
        </div>
      ))}
    </>
  );
};

export default B;
