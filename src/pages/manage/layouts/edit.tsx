import {
  createContext,
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/router";
import { useQuery, useMutation, gql } from "ui/lib/use-data.client";
import cx from "classnames";
import {
  MarkdownComponent,
  ComponentContextType,
  type LayoutComponent,
  type MutationUpdateLayoutComponentArgs,
  type MutationRemoveComponentInLayoutArgs,
  type MutationUpdateMarkdownComponentArgs,
  MutationUpdateBooklistComponentArgs,
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
    sourceType
    sourceKey
  }
`;

const BookGridComponentFragment = gql`
  fragment BookGridComponentFragment on BookGridComponent {
    id
    title
    sourceType
    sourceKey
  }
`;

const BookListComponentFragment = gql`
  fragment BookListComponentFragment on BookListComponent {
    id
    title
    sourceType
    sourceKey
  }
`;

const MarkdownComponentFragment = gql`
  fragment MarkdownComponentFragment on MarkdownComponent {
    id
    text
  }
`;

const ComponentFragment = gql`
  fragment ComponentFragment on Component {
    __typename
    ...LayoutComponentFragment
    ...BookCarouselComponentFragment
    ...BookGridComponentFragment
    ...BookListComponentFragment
    ...MarkdownComponentFragment
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
  ${MarkdownComponentFragment}
  ${BookCarouselComponentFragment}
  ${BookGridComponentFragment}
  ${BookListComponentFragment}
`;

const UPDATE_LAYOUT_COMPONENT_MUTATION = gql`
  mutation UpdateLayoutCompenent(
    $layoutId: ID!
    $componentOrder: [ID!]
    $flexDirection: String
  ) {
    updateLayoutComponent(
      layoutId: $layoutId
      componentOrder: $componentOrder
      flexDirection: $flexDirection
    )
  }
`;

const REMOVE_COMPONENT_MUTATION = gql`
  mutation RemoveComponentInLayout($layoutId: ID!, $componentId: ID!) {
    removeComponentInLayout(layoutId: $layoutId, componentId: $componentId)
  }
`;

const UPDATE_MARKDOWN_MUTATION = gql`
  mutation UpdateMarkdownComponent($componentId: ID!, $text: String!) {
    updateMarkdownComponent(componentId: $componentId, text: $text)
  }
`;

const UPDATE_BOOKLIST_COMPONENT_MUTATION = gql`
  mutation UpdateBooklistComponent(
    $componentId: ID!
    $sourceType: ComponentContextType!
    $sourceKey: String!
  ) {
    updateBooklistComponent(
      componentId: $componentId
      sourceType: $sourceType
      sourceKey: $sourceKey
    )
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
  BookCarouselComponent: BookList,
  BookGridComponent: BookList,
  BookListComponent: BookList,
  MarkdownComponent: Markdown,
};

function Layout(props: LayoutComponent) {
  const { updateLayoutMutation, removeComponentMutation } =
    useContext(LayoutContext);

  return (
    <div className="border border-red-500 m-2 p-2">
      <p>Layout Component</p>
      <div
        className={cx("flex", {
          "flex-row": props.flexDirection === "row",
          "flex-col": props.flexDirection === "col",
        })}
      >
        <select
          value={props.flexDirection}
          onChange={(e) => {
            updateLayoutMutation({
              layoutId: props.id,
              flexDirection: e.target.value,
            });
          }}
        >
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
                  updateLayoutMutation({
                    layoutId: props.id,
                    componentOrder: getReorderedIds(
                      props.components,
                      component,
                      -1
                    ),
                  })
                }
              >
                move up
              </button>{" "}
              |{" "}
              <button
                onClick={() =>
                  updateLayoutMutation({
                    layoutId: props.id,
                    componentOrder: getReorderedIds(
                      props.components,
                      component,
                      1
                    ),
                  })
                }
              >
                move down
              </button>{" "}
              |{" "}
              <button
                onClick={() =>
                  removeComponentMutation({
                    layoutId: props.id,
                    componentId: component.id,
                  })
                }
              >
                remove
              </button>
              <Component {...component} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BookList(props: {
  __typename: string;
  id: string;
  sourceType: ComponentContextType | null;
  sourceKey: string | null;
}) {
  const { updateBooklistComponent } = useContext(LayoutContext);
  const [sourceTypeState, setSourceType] = useState(
    props.sourceType ?? ComponentContextType.None
  );
  const [sourceKeyState, setSourceKey] = useState(props.sourceKey ?? "");

  const validOpts = [
    ComponentContextType.Author,
    ComponentContextType.Category,
    ComponentContextType.List,
    ComponentContextType.None,
  ];

  useEffect(() => {
    setSourceType(props.sourceType ?? ComponentContextType.None);
  }, [props.sourceType]);

  useEffect(() => {
    setSourceKey(props.sourceKey ?? "");
  }, [props.sourceKey]);

  return (
    <div>
      <p>{props.__typename}</p>
      <select
        value={sourceTypeState}
        onChange={(e) => {
          const opt = validOpts.find((o) => o === e.target.value);
          setSourceType(opt ?? ComponentContextType.None);
        }}
      >
        {validOpts.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <input
        value={sourceKeyState}
        placeholder="Source Key"
        onChange={(e) => {
          setSourceKey(e.target.value);
        }}
      />
      <button
        onClick={() => {
          updateBooklistComponent({
            componentId: props.id,
            sourceType: sourceTypeState,
            sourceKey: sourceKeyState,
          });
        }}
      >
        Save changes
      </button>
    </div>
  );
}

function Markdown(props: MarkdownComponent) {
  const { updateMarkdownComponent } = useContext(LayoutContext);
  const [textState, updateText] = useState(props.text);
  const [, forceUpdate] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // workaround for a streaming bug, or somethign
  useEffect(() => {
    if (textareaRef.current?.value !== textState) {
      forceUpdate((v) => v + 1);
    }
  }, [textareaRef]);

  useEffect(() => {
    updateText(props.text);
  }, [props.text]);

  return (
    <div>
      <p>Markdown</p>
      <textarea
        value={textState}
        ref={textareaRef}
        onChange={(e) => {
          console.log("trigger change");
          updateText(e.target.value);
        }}
      />
      <button
        onClick={() => {
          console.log("save markdown");
          updateMarkdownComponent({
            componentId: props.id,
            text: textState,
          });
        }}
      >
        Save
      </button>
    </div>
  );
}

const LayoutContext = createContext<{
  updateLayoutMutation: (args: MutationUpdateLayoutComponentArgs) => void;
  removeComponentMutation: (args: MutationRemoveComponentInLayoutArgs) => void;
  updateMarkdownComponent: (args: MutationUpdateMarkdownComponentArgs) => void;
  updateBooklistComponent: (args: MutationUpdateBooklistComponentArgs) => void;
}>(
  // @ts-ignore
  null
);

const EditLayout = ({ id }: { id: string }) => {
  const {
    data,
    hydrateClient,
    refresh,
    isPending: getLayoutPending,
  } = useQuery<{ layout: LayoutComponent }>(`EditLayout::${id}`, LAYOUT_QUERY, {
    id,
  });

  const [updateLayoutMutation, { isPending: updateLayoutPending }] =
    useMutation<boolean>(UPDATE_LAYOUT_COMPONENT_MUTATION);

  const [removeComponentMutation, { isPending: removeComponentPending }] =
    useMutation<boolean>(REMOVE_COMPONENT_MUTATION);

  const [updateMarkdownComponent, { isPending: updateMarkdownPending }] =
    useMutation<boolean>(UPDATE_MARKDOWN_MUTATION);

  const [updateBooklistComponent, { isPending: updateBooklistPending }] =
    useMutation<boolean>(UPDATE_BOOKLIST_COMPONENT_MUTATION);

  const isPending =
    getLayoutPending ||
    updateLayoutPending ||
    removeComponentPending ||
    updateMarkdownPending ||
    updateBooklistPending;

  return (
    <>
      <div
        className={cx("my-5 transition-opacity", {
          "opacity-100": !isPending,
          "opacity-50": isPending,
        })}
      >
        <LayoutContext.Provider
          value={{
            updateLayoutMutation: (arg) =>
              updateLayoutMutation(arg).then(refresh),
            removeComponentMutation: (arg) =>
              removeComponentMutation(arg).then(refresh),
            updateMarkdownComponent: (arg) =>
              updateMarkdownComponent(arg).then(refresh),
            updateBooklistComponent: (arg) =>
              updateBooklistComponent(arg).then(refresh),
          }}
        >
          <Layout {...data.layout} />
        </LayoutContext.Provider>
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
