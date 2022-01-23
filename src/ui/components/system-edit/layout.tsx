import { useContext, useState } from "react";
import { gql } from "ui/lib/use-data.client";
import cx from "classnames";
import { type LayoutComponent } from "api/__generated__/resolvers-types";
import { LayoutContext } from "./container";
import List from "./list";
import Book from "./book";
import Markdown from "./markdown";

export const LayoutComponentFragment = gql`
  fragment LayoutComponentFragment on LayoutComponent {
    id
    title
    createdBy
    flexDirection
    container
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
  CarouselComponent: List,
  GridComponent: List,
  ListComponent: List,
  BookImageComponent: Book,
  BookTitleComponent: Book,
  BookActionComponent: Book,
  BookAuthorsComponent: Book,
  BookCategoriesComponent: Book,
  BookDetailsComponent: Book,
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

export default function Layout(props: LayoutComponent & { root?: boolean }) {
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
    <>
      {props.root && (
        <div className="flex items-center mb-5 space-x-2">
          <h2 className="m-0">Layout Component: {props.title}</h2>
          <a
            href={`/layouts/show?layout=${props.id}`}
            target="_blank"
            rel="noreferrer"
          >
            View in new tab
          </a>
        </div>
      )}
      <div className="border border-indigo-500 p-5">
        <div className="bg-gray-50 border my-4 p-4 flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
          <b>Add Component to Layout:</b>
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
        <div className="bg-gray-50 border my-4 p-4 flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
          <b>Component Direction:</b>
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
        <div className="bg-gray-50 border my-4 p-4 flex items-center space-x-2">
          <b>Component Container:</b>
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
        <h3>Components:</h3>
        <div
          className={cx("flex", {
            "flex-col space-y-5": props.flexDirection === "col",
            "flex-col md:flex-row md:space-x-5": props.flexDirection === "row",
          })}
        >
          {props.components.map((component, ndx) => {
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
              <div
                key={component.id}
                className={cx("border border-green-500 p-5")}
              >
                <h3>{component.__typename}</h3>
                <div className="bg-gray-50 border my-4 p-4 flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
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
                    Move Up
                  </button>
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
                    Move Down
                  </button>
                  <button
                    onClick={() =>
                      removeComponentMutation({
                        layoutId: props.id,
                        componentId: component.id,
                      })
                    }
                  >
                    Remove
                  </button>
                </div>
                <Component {...component} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
