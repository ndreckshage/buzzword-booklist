import { createContext } from "react";
import { useQuery, useMutation, gql } from "ui/lib/use-data.client";
import cx from "classnames";

import {
  type LayoutComponent,
  type MutationUpdateLayoutComponentArgs,
  type MutationRemoveComponentInLayoutArgs,
  type MutationUpdateMarkdownComponentArgs,
  MutationUpdateListComponentArgs,
  MutationUpdateBookComponentArgs,
  MutationCreateComponentInLayoutArgs,
} from "api/__generated__/resolvers-types";

import Layout, { LayoutComponentFragment } from "./layout";
import { MarkdownComponentFragment } from "./markdown";

import {
  CarouselComponentFragment,
  GridComponentFragment,
  ListComponentFragment,
} from "./list";

import {
  BookActionComponentFragment,
  BookAuthorsComponentFragment,
  BookCategoriesComponentFragment,
  BookDetailsComponentFragment,
  BookImageComponentFragment,
  BookTitleComponentFragment,
} from "./book";

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

const UPDATE_LIST_COMPONENT_MUTATION = gql`
  mutation updateListComponent(
    $componentId: ID!
    $listSourceType: ListSourceType!
    $sourceKey: String!
    $pageSize: Int!
  ) {
    updateListComponent(
      componentId: $componentId
      listSourceType: $listSourceType
      sourceKey: $sourceKey
      pageSize: $pageSize
    )
  }
`;

const UPDATE_BOOK_COMPONENT_MUTATION = gql`
  mutation updateBookComponent(
    $componentId: ID!
    $bookSourceType: BookSourceType!
    $sourceKey: String!
  ) {
    updateBookComponent(
      componentId: $componentId
      bookSourceType: $bookSourceType
      sourceKey: $sourceKey
    )
  }
`;

export const LayoutContext = createContext<{
  createComponentMutation: (args: MutationCreateComponentInLayoutArgs) => void;
  updateLayoutMutation: (args: MutationUpdateLayoutComponentArgs) => void;
  removeComponentMutation: (args: MutationRemoveComponentInLayoutArgs) => void;
  updateMarkdownComponent: (args: MutationUpdateMarkdownComponentArgs) => void;
  updateListComponent: (args: MutationUpdateListComponentArgs) => void;
  updateBookComponent: (args: MutationUpdateBookComponentArgs) => void;
}>(
  // @ts-ignore
  null
);

export default function EditLayoutContainer({ id }: { id: string }) {
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

  const [updateListComponent, { isPending: updateListPending }] =
    useMutation<boolean>(UPDATE_LIST_COMPONENT_MUTATION);

  const [updateBookComponent, { isPending: updateBookPending }] =
    useMutation<boolean>(UPDATE_BOOK_COMPONENT_MUTATION);

  const isPending =
    getLayoutPending ||
    createComponentPending ||
    updateLayoutPending ||
    removeComponentPending ||
    updateMarkdownPending ||
    updateListPending ||
    updateBookPending;

  return (
    <>
      <div
        className={cx(
          "container mx-auto px-4 my-5 md:my-10 transition-opacity",
          {
            "opacity-100": !isPending,
            "opacity-50": isPending,
          }
        )}
      >
        <p className="md:hidden bg-red-500 text-white p-5 rounded-md text-xl mb-5">
          Layout Editing is easier on desktop!
        </p>
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
            updateBookComponent: (arg) =>
              updateBookComponent(arg).then(refresh),
          }}
        >
          <Layout {...data.layout} root />
        </LayoutContext.Provider>
      </div>
      {hydrateClient}
    </>
  );
}
