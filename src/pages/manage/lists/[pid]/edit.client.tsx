import { useRouter } from "next/router";
import { useState, useReducer } from "react";
import GoogleBooksTypeahead from "components/manage/lists/google-books-typeahead.client";
import TextInput from "components/common/text-input";
import Text, { TextTypes } from "components/common/text";
import { type GoogleBook } from "lib/google-books-api";
import fetchGraphQL from "lib/fetch-graphql";
import slugify from "slugify";

enum BookReducerActionTypes {
  Add = "add",
  Remove = "remove",
}

type BookReducerActions =
  | { type: BookReducerActionTypes.Add; payload: GoogleBook }
  | { type: BookReducerActionTypes.Remove; payload: string };

const bookReducer = (state: GoogleBook[], action: BookReducerActions) => {
  switch (action.type) {
    case "add": {
      if (
        state.find(
          ({ googleBooksVolumeId }) =>
            googleBooksVolumeId === action.payload.googleBooksVolumeId
        )
      ) {
        return state;
      }

      return state.concat(action.payload);
    }

    case "remove": {
      const index = state.findIndex(
        ({ googleBooksVolumeId }) => googleBooksVolumeId === action.payload
      );

      return state.slice(0, index).concat(state.slice(index + 1));
    }

    default:
      throw new Error();
  }
};

export default function EditList() {
  const router = useRouter();
  // @NOTE next params dont work with streaming / nextjs yet
  const listSlug = router.asPath.match(/\/manage\/lists\/(.*)\/edit/)?.[1];
  if (!listSlug) {
    return <>Bad Route Match: {router.asPath}</>;
  }

  const [addedBooks, dispatch] = useReducer(bookReducer, []);

  return (
    <>
      <div>
        {addedBooks.map((book) => (
          <div key={book.googleBooksVolumeId} className="flex">
            <img src={book.image} alt={book.title} />
            <div>
              <p>{book.title}</p>
              <p
                onClick={() => {
                  dispatch({
                    type: BookReducerActionTypes.Remove,
                    payload: book.googleBooksVolumeId,
                  });
                }}
              >
                Remove
              </p>
            </div>
          </div>
        ))}
      </div>
      <div>
        <GoogleBooksTypeahead
          addBook={async ({ googleBooksVolumeId }) => {
            console.log("add book", googleBooksVolumeId);
            // dispatch({ type: BookReducerActionTypes.Add, payload: book });

            await fetchGraphQL(
              `
            mutation AddBookToList($listSlug: String!, $googleBooksVolumeId: String!) {
              addBookToList(listSlug: $listSlug, googleBooksVolumeId: $googleBooksVolumeId)
            }
            `,
              { listSlug, googleBooksVolumeId }
            );
          }}
        />
      </div>
    </>
  );
}
