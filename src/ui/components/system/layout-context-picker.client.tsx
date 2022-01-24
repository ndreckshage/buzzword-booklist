import { useRouter } from "next/router";
import { LayoutContextType } from "api/__generated__/resolvers-types";
import { useState } from "react";

const sampleKeyMap = new Map([
  [LayoutContextType.Author, "haruki-murakami"],
  [LayoutContextType.Book, "AJUqyrOSO38C"],
  [LayoutContextType.Category, "fiction-literary"],
  [LayoutContextType.List, "bookshoporg-top-50-bestsellers-2021"],
  [LayoutContextType.None, ""],
]);

const contextTypeSourceKeyMap = new Map([
  [LayoutContextType.Author, "Author Key"],
  [LayoutContextType.Book, "Google Book ID"],
  [LayoutContextType.Category, "Category Key"],
  [LayoutContextType.List, "List Key"],
  [LayoutContextType.None, ""],
]);

export default function LayoutContextPicker() {
  const router = useRouter();

  const originalContextType = (router.query.contextType ??
    LayoutContextType.None) as LayoutContextType;

  const originalContextKey = router.query.contextKey ?? "";

  const [contextType, setContextType] = useState(originalContextType);
  const [contextKey, setContextKey] = useState(originalContextKey);

  const contextTypeDiff = originalContextType !== contextType;
  const contextKeyDiff = originalContextKey !== contextKey;
  const contextDiff = contextTypeDiff || contextKeyDiff;

  const sourceKeyName = contextTypeSourceKeyMap.get(contextType ?? "");

  return (
    <div className="flex flex-col space-y-2 md:space-x-2 md:space-y-0 md:flex-row md:items-center">
      <div>
        <b>Context Type:</b>{" "}
        <select
          value={contextType}
          onChange={(e) => {
            const value = e.target.value as LayoutContextType;
            setContextType(value);
            setContextKey(sampleKeyMap.get(value) ?? "");
          }}
        >
          {Object.values(LayoutContextType).map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>{" "}
      </div>
      {contextType !== LayoutContextType.None && (
        <div>
          <b>{sourceKeyName}:</b>{" "}
          <input
            type="text"
            value={contextKey}
            onChange={(e) => {
              setContextKey(e.target.value);
            }}
          />
        </div>
      )}
      {contextDiff && (
        <button
          onClick={() => {
            router.push(
              `/layouts/show?layout=${router.query.layout}&contextType=${contextType}&contextKey=${contextKey}`
            );
          }}
        >
          Update Context
        </button>
      )}
    </div>
  );
}
