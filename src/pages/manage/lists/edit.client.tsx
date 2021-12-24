import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import GoogleBooksTypeahead from "components/manage/lists/google-books-typeahead.client";
import TextInput from "components/common/text-input";
import Text, { TextTypes } from "components/common/text";
import { type GoogleBook } from "lib/google-books-api";
import fetchGraphQL from "lib/fetch-graphql";

export default function EditList() {
  const router = useRouter();

  const listSlug = router.query.list;
  if (!listSlug) {
    return <p>No list to edit!</p>;
  }

  // @NOTE next params dont work with streaming / nextjs yet
  // @NOTE AND dynamic routes dont work client side, so adjusting to query params
  // const listSlug = router.asPath.match(/\/manage\/lists\/(.*)\/edit/)?.[1];
  // if (!listSlug) {
  //   return <>Bad Route Match: {router.asPath}</>;
  // }

  const [listBooks, setListBooks] = useState([]);

  const fetchLists = () => {
    fetchGraphQL(
      `
      query GetList($listSlug: String!) {
        list(listSlug: $listSlug) {
          title
          books {
            edges {
              node {
                title
                googleBooksVolumeId
                image
              }
            }
          }
        }
      }
    `,
      { listSlug }
    ).then((response) => {
      setListBooks(response.data.list.books.edges.map((edge) => edge.node));
    });
  };

  useEffect(() => {
    fetchLists();
    return () => {};
  }, []);

  return (
    <>
      <div>
        {listBooks.map((book) => (
          <div key={book.googleBooksVolumeId} className="flex">
            <img src={book.image} alt={book.title} />
            <div>
              <p>{book.title}</p>
              <p
                onClick={async () => {
                  await fetchGraphQL(
                    `
                  mutation RemoveBookFromList($listSlug: String!, $googleBooksVolumeId: String!) {
                    removeBookFromList(listSlug: $listSlug, googleBooksVolumeId: $googleBooksVolumeId)
                  }
                  `,
                    { googleBooksVolumeId: book.googleBooksVolumeId, listSlug }
                  );

                  fetchLists();
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

            await fetchGraphQL(
              `
            mutation AddBookToList($listSlug: String!, $googleBooksVolumeId: String!) {
              addBookToList(listSlug: $listSlug, googleBooksVolumeId: $googleBooksVolumeId)
            }
            `,
              { listSlug, googleBooksVolumeId }
            );

            fetchLists();
          }}
        />
      </div>
    </>
  );
}
