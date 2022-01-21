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
  ListSourceType,
  type LayoutComponent,
  type MutationUpdateLayoutComponentArgs,
  type MutationRemoveComponentInLayoutArgs,
  type MutationUpdateMarkdownComponentArgs,
  MutationUpdateListComponentArgs,
  MutationCreateComponentInLayoutArgs,
} from "api/__generated__/resolvers-types";

const LayoutComponentFragment = gql`
  fragment LayoutComponentFragment on LayoutComponent {
    id
    title
    createdBy
    flexDirection
    container
  }
`;

const CarouselComponentFragment = gql`
  fragment CarouselComponentFragment on CarouselComponent {
    id
    title
    sourceType
    sourceKey
    pageSize
  }
`;

const GridComponentFragment = gql`
  fragment GridComponentFragment on GridComponent {
    id
    title
    sourceType
    sourceKey
    pageSize
  }
`;

const ListComponentFragment = gql`
  fragment ListComponentFragment on ListComponent {
    id
    title
    sourceType
    sourceKey
    pageSize
  }
`;

const BookImageComponentFragment = gql`
  fragment BookImageComponentFragment on BookImageComponent {
    id
  }
`;

const BookActionComponentFragment = gql`
  fragment BookActionComponentFragment on BookActionComponent {
    id
  }
`;

const BookTitleComponentFragment = gql`
  fragment BookTitleComponentFragment on BookTitleComponent {
    id
  }
`;
const BookAuthorsComponentFragment = gql`
  fragment BookAuthorsComponentFragment on BookAuthorsComponent {
    id
  }
`;

const BookCategoriesComponentFragment = gql`
  fragment BookCategoriesComponentFragment on BookCategoriesComponent {
    id
  }
`;

const BookDetailsComponentFragment = gql`
  fragment BookDetailsComponentFragment on BookDetailsComponent {
    id
  }
`;

const MarkdownComponentFragment = gql`
  fragment MarkdownComponentFragment on MarkdownComponent {
    id
    text
    backgroundColor
  }
`;

const ComponentFragment = gql`
  fragment ComponentFragment on Component {
    __typename
    ...LayoutComponentFragment
    ...CarouselComponentFragment
    ...GridComponentFragment
    ...ListComponentFragment
    ...BookImageComponentFragment
    ...BookActionComponentFragment
    ...BookTitleComponentFragment
    ...BookAuthorsComponentFragment
    ...BookCategoriesComponentFragment
    ...BookDetailsComponentFragment
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
  ${CarouselComponentFragment}
  ${GridComponentFragment}
  ${ListComponentFragment}
  ${BookImageComponentFragment}
  ${BookActionComponentFragment}
  ${BookTitleComponentFragment}
  ${BookAuthorsComponentFragment}
  ${BookCategoriesComponentFragment}
  ${BookDetailsComponentFragment}
  ${MarkdownComponentFragment}
`;

const CREATE_COMPONENT_IN_LAYOUT_MUTATION = gql`
  mutation CreateComponentInLayout($layoutId: ID!, $componentType: String!) {
    createComponentInLayout(layoutId: $layoutId, componentType: $componentType)
  }
`;

const UPDATE_LAYOUT_COMPONENT_MUTATION = gql`
  mutation UpdateLayoutCompenent(
    $layoutId: ID!
    $componentOrder: [ID!]
    $flexDirection: String
    $container: Boolean
  ) {
    updateLayoutComponent(
      layoutId: $layoutId
      componentOrder: $componentOrder
      flexDirection: $flexDirection
      container: $container
    )
  }
`;

const REMOVE_COMPONENT_MUTATION = gql`
  mutation RemoveComponentInLayout($layoutId: ID!, $componentId: ID!) {
    removeComponentInLayout(layoutId: $layoutId, componentId: $componentId)
  }
`;

const UPDATE_MARKDOWN_MUTATION = gql`
  mutation UpdateMarkdownComponent(
    $componentId: ID!
    $text: String!
    $backgroundColor: String!
  ) {
    updateMarkdownComponent(
      componentId: $componentId
      text: $text
      backgroundColor: $backgroundColor
    )
  }
`;

const UPDATE_BOOKLIST_COMPONENT_MUTATION = gql`
  mutation updateListComponent(
    $componentId: ID!
    $sourceType: ListSourceType!
    $sourceKey: String!
    $pageSize: Int!
  ) {
    updateListComponent(
      componentId: $componentId
      sourceType: $sourceType
      sourceKey: $sourceKey
      pageSize: $pageSize
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
  CarouselComponent: BookList,
  GridComponent: BookList,
  ListComponent: BookList,
  BookImageComponent: BookComponent,
  BookTitleComponent: BookComponent,
  BookActionComponent: BookComponent,
  BookAuthorsComponent: BookComponent,
  BookCategoriesComponent: BookComponent,
  BookDetailsComponent: BookComponent,
  MarkdownComponent: Markdown,
};

enum ComponentTypes {
  LayoutComponent = "LayoutComponent",
  CarouselComponent = "CarouselComponent",
  GridComponent = "GridComponent",
  ListComponent = "ListComponent",
  BookImageComponent = "BookImageComponent",
  BookTitleComponent = "BookTitleComponent",
  BookActionComponent = "BookActionComponent",
  BookAuthorsComponent = "BookAuthorsComponent",
  BookCategoriesComponent = "BookCategoriesComponent",
  BookDetailsComponent = "BookDetailsComponent",
  MarkdownComponent = "MarkdownComponent",
}

function Layout(props: LayoutComponent) {
  const {
    createComponentMutation,
    updateLayoutMutation,
    removeComponentMutation,
  } = useContext(LayoutContext);

  const [createComponentType, setCreateComponentType] = useState(
    ComponentTypes.LayoutComponent
  );

  const validOpts = Object.values(ComponentTypes);

  return (
    <div className="border border-red-500 m-2 p-2">
      <p>Layout Component: {props.title}</p>
      <a
        href={`/layouts/show?layout=${props.id}`}
        target="_blank"
        rel="noreferrer"
      >
        View in new tab
      </a>
      <div className="border border-purple-500 m-2 p-2">
        <p>Add Component to Layout:</p>
        <select
          value={createComponentType}
          onChange={(e) => {
            const opt = validOpts.find((o) => o === e.target.value);
            setCreateComponentType(opt ?? ComponentTypes.LayoutComponent);
          }}
        >
          {validOpts.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            createComponentMutation({
              layoutId: props.id,
              componentType: createComponentType,
            });
          }}
        >
          Add Component to Layout
        </button>
      </div>
      <div className="border border-purple-500 m-2 p-2">
        <p>Component Direction:</p>
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
      </div>
      <div className="border border-purple-500 m-2 p-2">
        <p>Component Container:</p>
        <input
          type="checkbox"
          checked={props.container}
          onChange={(e) => {
            updateLayoutMutation({
              layoutId: props.id,
              container: e.target.checked,
            });
          }}
        />
      </div>
      <p>Components:</p>
      <div
        className={cx("flex", {
          "flex-row": props.flexDirection === "row",
          "flex-col": props.flexDirection === "col",
        })}
      >
        {props.components.map((component) => {
          // @ts-ignore
          const Component = COMPONENT_MAP[component.__typename];
          if (!Component) {
            return (
              <p key={component.id}>
                Missing component! {component.__typename}
              </p>
            );
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
  sourceType: ListSourceType;
  sourceKey: string;
  pageSize: number;
}) {
  const { updateListComponent } = useContext(LayoutContext);
  const [sourceTypeState, setSourceType] = useState(props.sourceType);
  const [sourceKeyState, setSourceKey] = useState(props.sourceKey);
  const [pageSizeState, setPageSize] = useState(props.pageSize);

  const validOpts = Object.values(ListSourceType);

  useEffect(() => {
    setSourceType(props.sourceType);
  }, [props.sourceType]);

  useEffect(() => {
    setSourceKey(props.sourceKey);
  }, [props.sourceKey]);

  return (
    <div>
      <p>{props.__typename}</p>
      <select
        value={sourceTypeState}
        onChange={(e) => {
          const opt = validOpts.find((o) => o === e.target.value);
          setSourceType(opt ?? ListSourceType.None);
        }}
      >
        {validOpts.map((opt) => (
          <option key={opt} value={opt}>
            {opt === ListSourceType.None ? "USE_PAGE_CONTEXT" : opt}
          </option>
        ))}
      </select>
      {[
        ListSourceType.Author,
        ListSourceType.Category,
        ListSourceType.List,
      ].includes(sourceTypeState) && (
        <input
          value={sourceKeyState}
          placeholder="Source Key"
          onChange={(e) => {
            setSourceKey(e.target.value);
          }}
        />
      )}
      <input
        type="number"
        value={pageSizeState}
        onChange={(e) => setPageSize(parseInt(e.target.value, 10))}
      />
      <button
        onClick={() => {
          updateListComponent({
            componentId: props.id,
            sourceType: sourceTypeState,
            sourceKey: sourceKeyState,
            pageSize: pageSizeState,
          });
        }}
      >
        Save changes
      </button>
    </div>
  );
}

function BookComponent(props: { __typename: string; id: string }) {
  return (
    <div>
      <p>{props.__typename}</p>
    </div>
  );
}

function Markdown(props: MarkdownComponent) {
  const { updateMarkdownComponent } = useContext(LayoutContext);
  const [textState, updateText] = useState(props.text);
  const [backgroundColor, updateBackgroundColor] = useState(
    props.backgroundColor
  );
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
        className="resize"
        onChange={(e) => {
          updateText(e.target.value);
        }}
      />
      <p>Background color:</p>
      <select
        value={backgroundColor}
        onChange={(e) => {
          updateBackgroundColor(e.target.value);
        }}
      >
        {["inherit", "emerald-500", "indigo-500"].map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <div className="border border-purple-500 m-2 p-2">
        <button
          onClick={() => {
            updateMarkdownComponent({
              componentId: props.id,
              text: textState,
              backgroundColor,
            });
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

const LayoutContext = createContext<{
  createComponentMutation: (args: MutationCreateComponentInLayoutArgs) => void;
  updateLayoutMutation: (args: MutationUpdateLayoutComponentArgs) => void;
  removeComponentMutation: (args: MutationRemoveComponentInLayoutArgs) => void;
  updateMarkdownComponent: (args: MutationUpdateMarkdownComponentArgs) => void;
  updateListComponent: (args: MutationUpdateListComponentArgs) => void;
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

  const [createComponentMutation, { isPending: createComponentPending }] =
    useMutation<boolean>(CREATE_COMPONENT_IN_LAYOUT_MUTATION);

  const [updateLayoutMutation, { isPending: updateLayoutPending }] =
    useMutation<boolean>(UPDATE_LAYOUT_COMPONENT_MUTATION);

  const [removeComponentMutation, { isPending: removeComponentPending }] =
    useMutation<boolean>(REMOVE_COMPONENT_MUTATION);

  const [updateMarkdownComponent, { isPending: updateMarkdownPending }] =
    useMutation<boolean>(UPDATE_MARKDOWN_MUTATION);

  const [updateListComponent, { isPending: updateBooklistPending }] =
    useMutation<boolean>(UPDATE_BOOKLIST_COMPONENT_MUTATION);

  const isPending =
    getLayoutPending ||
    createComponentPending ||
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
            createComponentMutation: (arg) =>
              createComponentMutation(arg).then(refresh),
            updateLayoutMutation: (arg) =>
              updateLayoutMutation(arg).then(refresh),
            removeComponentMutation: (arg) =>
              removeComponentMutation(arg).then(refresh),
            updateMarkdownComponent: (arg) =>
              updateMarkdownComponent(arg).then(refresh),
            updateListComponent: (arg) =>
              updateListComponent(arg).then(refresh),
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
