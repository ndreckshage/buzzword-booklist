import React, { useState, Suspense } from "react";
import fetchGoogleBoooksQuery, { GoogleBook } from "ui/lib/google-books-api";
import TextInput from "ui/components/common/text-input";
import Image from "next/image";
import { useData } from "ui/lib/use-data.client";
import cx from "classnames";

type BooksProps = {
  query: string;
  addBook: (book: GoogleBook) => void;
};

const Books = ({ query, addBook }: BooksProps) => {
  const { data, hydrateClient, isPending } = useData<GoogleBook[]>(
    `book-typeahead::${query}`,
    () => fetchGoogleBoooksQuery(query)
  );

  return (
    <div
      className={cx("transition-opacity", {
        "opacity-100": !isPending,
        "opacity-50": isPending,
      })}
    >
      {data && data.length > 0 && (
        <div className="flex">
          {data.map((book, index) => (
            <div
              key={index}
              className="m-5 cursor-pointer"
              onClick={() => addBook(book)}
            >
              {book.image ? (
                <Image
                  src={book.image}
                  alt={book.title}
                  width={100}
                  height={150}
                />
              ) : (
                "Missing Image"
              )}
            </div>
          ))}
        </div>
      )}
      {hydrateClient}
    </div>
  );
};

type GoogleBooksTypeaheadProps = {
  addBook: (book: GoogleBook) => void;
};

const GoogleBooksTypeahead = (props: GoogleBooksTypeaheadProps) => {
  const [inputValue, setInputValue] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const addBook = (book: GoogleBook) => {
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
        <Books addBook={addBook} query={inputValue} />
      </Suspense>
    </>
  );
};

export default GoogleBooksTypeahead;
