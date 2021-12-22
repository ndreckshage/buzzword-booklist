// @ts-ignore useTransition not available
import React, { useState, Suspense, useTransition } from "react";
import fetchGoogleBoooksQuery, { GoogleBook } from "lib/google-books-api";
import TextInput from "components/common/text-input";
import GoogleBooksList from "./google-books-list.client";
import cx from "classnames";

type Props = {
  addBook: (book: GoogleBook) => void;
};

const GoogleBooksTypeahead = (props: Props) => {
  const [inputValue, setInputValue] = useState("");
  const [resource, setResource] = useState(fetchGoogleBoooksQuery(""));
  const [isRefreshing, startTransition] = useTransition({
    timeoutMs: 5000,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    startTransition(() => {
      setResource(fetchGoogleBoooksQuery(e.target.value));
    });
  };

  const addBook = (book: GoogleBook) => {
    setInputValue("");
    setResource(fetchGoogleBoooksQuery(""));
    props.addBook(book);
  };

  return (
    <>
      <label className="relative block">
        <span className="sr-only">Search</span>
        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
          <svg className="h-5 w-5 fill-gray-300" viewBox="0 0 20 20">
            <path
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        </span>
        <TextInput
          placeholder="Search for a book..."
          name="search"
          onChange={handleChange}
          overrideClassNames="pl-9"
          value={inputValue}
        />
      </label>
      <Suspense fallback={"Loading books (slowly)..."}>
        <div
          className={cx("transition-opacity", {
            "opacity-100": !isRefreshing,
            "opacity-50": isRefreshing,
          })}
        >
          <GoogleBooksList resource={resource} addBook={addBook} />
        </div>
      </Suspense>
    </>
  );
};

export default GoogleBooksTypeahead;
