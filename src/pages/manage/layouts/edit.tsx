import { Suspense, useReducer } from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation, gql } from "ui/lib/use-data.client";
import cx from "classnames";
import {
  BookCarouselComponent,
  BookGridComponent,
  BookListComponent,
  HeroComponent,
  type LayoutComponent,
} from "api/__generated__/resolvers-types";

const LayoutComponentFragment = gql`
  fragment LayoutComponentFragment on LayoutComponent {
    id
    createdBy
    flexDirection
  }
`;

const BookCarouselComponentFragment = gql`
  fragment BookCarouselComponentFragment on BookCarouselComponent {
    id
    title
    link {
      title
      href
      variant
    }
    bookCards {
      id
      href
      image
    }
  }
`;

const BookGridComponentFragment = gql`
  fragment BookGridComponentFragment on BookGridComponent {
    id
    title
    bookCards {
      id
      href
      image
    }
  }
`;

const HeroComponentFragment = gql`
  fragment HeroComponentFragment on HeroComponent {
    id
    title
    subTitle
  }
`;

const BookListComponentFragment = gql`
  fragment BookListComponentFragment on BookListComponent {
    id
    title
    bookCards {
      id
      href
      image
    }
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
  query GetLayout($id: ID!) {
    layout(id: $id, contextType: NONE, contextKey: "") {
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

const MOVE_COMPONENT_MUTATION = gql`
  mutation MoveComponentInLayout($layoutId: ID!, $componentOrder: [ID!]!) {
    updateLayoutComponent(layoutId: $layoutId, componentOrder: $componentOrder)
  }
`;

const REMOVE_COMPONENT_MUTATION = gql`
  mutation RemoveComponentInLayout($layoutId: ID!, $componentId: ID!) {
    removeComponentInLayout(layoutId: $layoutId, componentId: $componentId)
  }
`;

const move = <T,>(origArr: T[], fromIndex: number, toIndex: number) => {
  const arr = [...origArr];
  var el = arr[fromIndex];
  arr.splice(fromIndex, 1);
  arr.splice(toIndex < 0 ? 0 : toIndex, 0, el);
  return arr;
};

const getReorderedIds = (
  components: { id: string }[],
  componentToMove: { id: string },
  moveBy: number
) => {
  const currentIndex = components.findIndex((c) => c.id === componentToMove.id);
  const reordered = move(components, currentIndex, currentIndex + moveBy).map(
    (c) => c.id
  );

  return reordered;
};

const COMPONENT_MAP = {
  LayoutComponent: Layout,
  BookCarouselComponent: BookCarousel,
  BookGridComponent: BookGrid,
  BookListComponent: BookList,
  HeroComponent: Hero,
};

function Layout(
  props: LayoutComponent & {
    moveComponentMutation: (args: {
      layoutId: string;
      componentOrder: string[];
    }) => Promise<boolean>;
    removeComponentMutation: (args: {
      layoutId: string;
      componentId: string;
    }) => Promise<boolean>;
    refresh: () => void;
  }
) {
  return (
    <div className="border border-red-500 m-2 p-2">
      <p>Layout Component</p>
      <div
        className={cx("flex", {
          "flex-row": props.flexDirection === "row",
          "flex-col": props.flexDirection === "col",
        })}
      >
        <select value={props.flexDirection} onChange={(e) => {}}>
          {["row", "col"].map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {props.components.map((component) => {
          // @ts-ignore
          const Component = COMPONENT_MAP[component.__typename];
          if (!Component) {
            return null;
          }

          return (
            <div key={component.id} className="border border-blue-500 m-2 p-2">
              <button
                onClick={() =>
                  props
                    .moveComponentMutation({
                      layoutId: props.id,
                      componentOrder: getReorderedIds(
                        props.components,
                        component,
                        -1
                      ),
                    })
                    .then(props.refresh)
                }
              >
                move up
              </button>{" "}
              |{" "}
              <button
                onClick={() =>
                  props
                    .moveComponentMutation({
                      layoutId: props.id,
                      componentOrder: getReorderedIds(
                        props.components,
                        component,
                        1
                      ),
                    })
                    .then(props.refresh)
                }
              >
                move down
              </button>{" "}
              |{" "}
              <button
                onClick={() =>
                  props
                    .removeComponentMutation({
                      layoutId: props.id,
                      componentId: component.id,
                    })
                    .then(props.refresh)
                }
              >
                remove
              </button>
              <Component
                {...component}
                moveComponentMutation={props.moveComponentMutation}
                refresh={props.refresh}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BookCarousel(props: BookCarouselComponent) {
  return <p>BookCarousel</p>;
}

function BookGrid(props: BookGridComponent) {
  return <p>BookGrid</p>;
}

function BookList(props: BookListComponent) {
  return <p>BookList</p>;
}

function Hero(props: HeroComponent) {
  return (
    <div>
      <p>Hero</p>
      <p>Title: {props.title}</p>
      <p>Subtitle: {props.subTitle}</p>
    </div>
  );
}

const EditLayout = ({ id }: { id: string }) => {
  const {
    data,
    hydrateClient,
    refresh,
    isPending: getLayoutPending,
  } = useQuery<{ layout: LayoutComponent }>(`EditLayout::${id}`, LAYOUT_QUERY, {
    id,
  });

  const [moveComponentMutation, { isPending: moveComponentPending }] =
    useMutation<boolean>(MOVE_COMPONENT_MUTATION);

  const [removeComponentMutation, { isPending: removeComponentPending }] =
    useMutation<boolean>(REMOVE_COMPONENT_MUTATION);

  const isPending =
    getLayoutPending || moveComponentPending || removeComponentPending;

  return (
    <>
      <div
        className={cx("my-5 transition-opacity", {
          "opacity-100": !isPending,
          "opacity-50": isPending,
        })}
      >
        <Layout
          {...data.layout}
          moveComponentMutation={moveComponentMutation}
          removeComponentMutation={removeComponentMutation}
          refresh={refresh}
        />
      </div>
      {hydrateClient}
    </>
  );
};

export default function EditLayoutPage() {
  const router = useRouter();
  const layoutId = router.query.layout;

  // // @NOTE next params dont work with streaming / nextjs yet
  //  // @NOTE AND dynamic routes dont work client side, so adjusting to query params
  // const pid = router.asPath.match(/\/manage\/layouts\/(.*)\/edit/)?.[1];
  // if (!pid) {
  //   return <>Bad Route Match: {router.asPath}</>;
  // }

  if (typeof layoutId !== "string") {
    return <p>No layout to edit!</p>;
  }

  return (
    <Suspense fallback="Loading layout...">
      <EditLayout id={layoutId} />
    </Suspense>
  );
}
