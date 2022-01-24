import { useContext, useEffect, useState } from "react";
import { gql } from "ui/lib/use-data.client";
import { BookSourceType } from "api/__generated__/resolvers-types";
import { LayoutContext } from "./container";

export const BookImageComponentFragment = gql`
  fragment BookImageComponentFragment on BookImageComponent {
    id
    bookSourceType
    sourceKey
  }
`;

export const BookActionComponentFragment = gql`
  fragment BookActionComponentFragment on BookActionComponent {
    id
    bookSourceType
    sourceKey
  }
`;

export const BookTitleComponentFragment = gql`
  fragment BookTitleComponentFragment on BookTitleComponent {
    id
    bookSourceType
    sourceKey
  }
`;

export const BookAuthorsComponentFragment = gql`
  fragment BookAuthorsComponentFragment on BookAuthorsComponent {
    id
    bookSourceType
    sourceKey
  }
`;

export const BookCategoriesComponentFragment = gql`
  fragment BookCategoriesComponentFragment on BookCategoriesComponent {
    id
    bookSourceType
    sourceKey
  }
`;

export const BookDetailsComponentFragment = gql`
  fragment BookDetailsComponentFragment on BookDetailsComponent {
    id
    bookSourceType
    sourceKey
  }
`;

export default function BookEdit(props: {
  __typename: string;
  id: string;
  bookSourceType: BookSourceType;
  sourceKey: string;
  pageSize: number;
}) {
  const { updateBookComponent } = useContext(LayoutContext);
  const [sourceTypeState, setSourceType] = useState(props.bookSourceType);
  const [sourceKeyState, setSourceKey] = useState(props.sourceKey);

  const validOpts = Object.values(BookSourceType);

  useEffect(() => {
    setSourceType(props.bookSourceType);
  }, [props.bookSourceType]);

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
            setSourceType(opt ?? BookSourceType.None);
          }}
        >
          {validOpts.map((opt) => (
            <option key={opt} value={opt}>
              {opt === BookSourceType.None ? "USE_PAGE_CONTEXT" : opt}
            </option>
          ))}
        </select>
      </div>
      {[BookSourceType.Book].includes(sourceTypeState) && (
        <div className="bg-gray-50 border my-4 p-4 flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
          <b>Google Book ID:</b>
          <input
            value={sourceKeyState}
            placeholder="Book ID"
            onChange={(e) => {
              setSourceKey(e.target.value);
            }}
          />
        </div>
      )}
      <button
        onClick={() => {
          updateBookComponent({
            componentId: props.id,
            bookSourceType: sourceTypeState,
            sourceKey: sourceKeyState,
          });
        }}
      >
        Save List Component
      </button>
    </div>
  );
}
