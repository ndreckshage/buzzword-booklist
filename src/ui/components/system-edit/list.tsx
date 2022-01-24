import { useContext, useEffect, useState } from "react";
import { gql } from "ui/lib/use-data.client";
import { ListSourceType } from "api/__generated__/resolvers-types";
import { LayoutContext } from "./container";

export const CarouselComponentFragment = gql`
  fragment CarouselComponentFragment on CarouselComponent {
    id
    title
    listSourceType
    sourceKey
    pageSize
  }
`;

export const GridComponentFragment = gql`
  fragment GridComponentFragment on GridComponent {
    id
    title
    listSourceType
    sourceKey
    pageSize
  }
`;

export const ListComponentFragment = gql`
  fragment ListComponentFragment on ListComponent {
    id
    title
    listSourceType
    sourceKey
    pageSize
  }
`;

const contextTypeSourceKeyMap = new Map([
  [ListSourceType.Author, "Author Key"],
  [ListSourceType.Category, "Category Key"],
  [ListSourceType.List, "List Key"],
]);

export default function List(props: {
  __typename: string;
  id: string;
  listSourceType: ListSourceType;
  sourceKey: string;
  pageSize: number;
}) {
  const { updateListComponent } = useContext(LayoutContext);
  const [sourceTypeState, setSourceType] = useState(props.listSourceType);
  const [sourceKeyState, setSourceKey] = useState(props.sourceKey);
  const [pageSizeState, setPageSize] = useState(props.pageSize);

  const validOpts = Object.values(ListSourceType);

  const sourceKeyName = contextTypeSourceKeyMap.get(sourceTypeState);

  useEffect(() => {
    setSourceType(props.listSourceType);
  }, [props.listSourceType]);

  useEffect(() => {
    setSourceKey(props.sourceKey);
  }, [props.sourceKey]);

  return (
    <div>
      <div className="bg-gray-50 border my-4 p-4 flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
        <b>Source Type:</b>
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
      </div>

      {[
        ListSourceType.Author,
        ListSourceType.Category,
        ListSourceType.List,
      ].includes(sourceTypeState) && (
        <div className="bg-gray-50 border my-4 p-4 flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
          <b>{sourceKeyName}:</b>
          <input
            value={sourceKeyState}
            placeholder="Source Key"
            onChange={(e) => {
              setSourceKey(e.target.value);
            }}
          />
        </div>
      )}
      <div className="bg-gray-50 border my-4 p-4 flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
        <b>Max List Size:</b>
        <input
          type="number"
          value={pageSizeState}
          onChange={(e) => setPageSize(parseInt(e.target.value, 10))}
        />
      </div>
      <button
        onClick={() => {
          updateListComponent({
            componentId: props.id,
            listSourceType: sourceTypeState,
            sourceKey: sourceKeyState,
            pageSize: pageSizeState,
          });
        }}
      >
        Save List Component
      </button>
    </div>
  );
}
