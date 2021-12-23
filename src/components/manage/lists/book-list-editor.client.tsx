import { useState, useReducer } from "react";
import GoogleBooksTypeahead from "./google-books-typeahead.client";
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

const BookListEditor = () => {
  const [listTitle, setListTitle] = useState("");
  const [addedBooks, dispatch] = useReducer(bookReducer, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setListTitle(e.target.value);
  };

  const listSlug = slugify(listTitle, { lower: true, strict: true });

  return (
    <div>
      <form className="flex flex-col space-y-4">
        <label>
          List Title:
          <TextInput
            name="list_title"
            placeholder="List title"
            value={listTitle}
            onChange={handleChange}
          />
        </label>
        <Text as={TextTypes.p}>URL: /collections/lists/{listSlug}</Text>
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
            addBook={(book) => {
              dispatch({ type: BookReducerActionTypes.Add, payload: book });
            }}
          />
        </div>
        <button
          className="block bg-blue-500 text-white p-5 rounded-md"
          onClick={async (e) => {
            e.preventDefault();

            const list = await fetchGraphQL(
              `
              mutation UpsertList($listInput: ListInput!) {
                upsertList(listInput: $listInput) {
                  id
                  title
                  slug
                  books {
                    id
                    title
                  }
                }
              }
            `,
              {
                listInput: {
                  title: listTitle,
                  googleBooksVolumeIds: addedBooks.map(
                    (addedBook) => addedBook.googleBooksVolumeId
                  ),
                },
              }
            );

            console.log("list created!", list);
          }}
        >
          Create List
        </button>
      </form>
    </div>
  );
};

export default BookListEditor;
