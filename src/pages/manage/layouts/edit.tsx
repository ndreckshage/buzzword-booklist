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
  MutationCreateComponentInLayoutArgs,
} from "api/__generated__/resolvers-types";

const LayoutComponentFragment = gql`
  fragment LayoutComponentFragment on LayoutComponent {
    id
    title
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
  }
`;

const ComponentFragment = gql`
  fragment ComponentFragment on Component {
    __typename
    ...LayoutComponentFragment
    ...BookCarouselComponentFragment
    ...BookGridComponentFragment
    ...BookListComponentFragment
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
  ${BookCarouselComponentFragment}
  ${BookGridComponentFragment}
  ${BookListComponentFragment}
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
  BookCarouselComponent = "BookCarouselComponent",
  BookGridComponent = "BookGridComponent",
  BookListComponent = "BookListComponent",
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

  const validOpts = [
    ComponentTypes.LayoutComponent,
    ComponentTypes.BookCarouselComponent,
    ComponentTypes.BookGridComponent,
    ComponentTypes.BookListComponent,
    ComponentTypes.BookImageComponent,
    ComponentTypes.BookTitleComponent,
    ComponentTypes.BookActionComponent,
    ComponentTypes.BookAuthorsComponent,
    ComponentTypes.BookCategoriesComponent,
    ComponentTypes.BookDetailsComponent,
    ComponentTypes.MarkdownComponent,
  ];

  return (
    <div className="border border-red-500 m-2 p-2">
      <p>Layout Component: {props.title}</p>
      <a
        href={`/manage/layouts/show?layout=${props.id}`}
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
            {opt === ComponentContextType.None ? "USE PAGE CONTEXT" : opt}
          </option>
        ))}
      </select>
      {sourceTypeState !== ComponentContextType.None && (
        <input
          value={sourceKeyState}
          placeholder="Source Key"
          onChange={(e) => {
            setSourceKey(e.target.value);
          }}
        />
      )}
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
          updateText(e.target.value);
        }}
      />
      <button
        onClick={() => {
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
  createComponentMutation: (args: MutationCreateComponentInLayoutArgs) => void;
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

  const [createComponentMutation, { isPending: createComponentPending }] =
    useMutation<boolean>(CREATE_COMPONENT_IN_LAYOUT_MUTATION);

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
