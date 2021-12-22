import type { GoogleBook } from "lib/google-books-api";
import type { SuspenseWrapPromise } from "lib/suspense-wrap-promise";

type Props = {
  resource: SuspenseWrapPromise<GoogleBook[]>;
  addBook(book: GoogleBook): void;
};

const GoogleBooksList = (props: Props) => {
  if (!props.resource) return <div>What book??</div>;
  const books = props.resource.read();

  if (books && books.length > 0) {
    return (
      <div className="flex">
        {books.map((book, index) => (
          <div
            key={index}
            className="m-5 cursor-pointer"
            onClick={() => props.addBook(book)}
          >
            <img src={book.image} alt={book.title} />
          </div>
        ))}
      </div>
    );
  }

  return <div>No results available.</div>;
};

export default GoogleBooksList;
