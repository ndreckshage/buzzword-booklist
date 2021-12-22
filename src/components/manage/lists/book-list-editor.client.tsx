import { useState, useReducer } from "react";
import GoogleBooksTypeahead from "./google-books-typeahead.client";
import TextInput from "components/common/text-input";
import { type GoogleBook } from "lib/google-books-api";

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
          ({ googleBooksId }) => googleBooksId === action.payload.googleBooksId
        )
      ) {
        return state;
      }

      return state.concat(action.payload);
    }

    case "remove": {
      const index = state.findIndex(
        ({ googleBooksId }) => googleBooksId === action.payload
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

  return (
    <div>
      <form>
        <label>
          List Title:
          <TextInput
            name="list_title"
            placeholder="List title"
            value={listTitle}
            onChange={handleChange}
          />
        </label>
        <div>
          {addedBooks.map((book) => (
            <div key={book.googleBooksId} className="flex">
              <img src={book.image} alt={book.title} />

              <div>
                <p>{book.title}</p>
                <p
                  onClick={() => {
                    dispatch({
                      type: BookReducerActionTypes.Remove,
                      payload: book.googleBooksId,
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
        <button onClick={() => {}}>Create List</button>
      </form>
    </div>
  );
};

export default BookListEditor;
