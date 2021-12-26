import { useRouter } from "next/router";
import { useState, useEffect, useTransition } from "react";
import GoogleBooksTypeahead from "components/manage/lists/google-books-typeahead.client";
import TextInput from "components/common/text-input";
import Text, { TextTypes } from "components/common/text";
import { type GoogleBook } from "lib/google-books-api";
import { request, gql } from "lib/graphql-request";
import useQuery from "lib/use-query.client";
import cx from "classnames";

const GET_LISTS_QUERY = gql`
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
`;

const REMOVE_BOOK_FROM_LIST_MUTATION = gql`
  mutation RemoveBookFromList(
    $listSlug: String!
    $googleBooksVolumeId: String!
  ) {
    removeBookFromList(
      listSlug: $listSlug
      googleBooksVolumeId: $googleBooksVolumeId
    )
  }
`;

const ADD_BOOK_TO_LIST_MUTATION = gql`
  mutation AddBookToList($listSlug: String!, $googleBooksVolumeId: String!) {
    addBookToList(
      listSlug: $listSlug
      googleBooksVolumeId: $googleBooksVolumeId
    )
  }
`;

export default function EditList() {
  const router = useRouter();
  const [isRefreshing, startTransition] = useTransition({
    timeoutMs: 5000,
  });

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

  const { data, hydrateClient, refetch } = useQuery(
    `GET_LISTS::${listSlug}`,
    () => request(GET_LISTS_QUERY, { listSlug })
  );

  return (
    <>
      <div
        className={cx("transition-opacity", {
          "opacity-100": !isRefreshing,
          "opacity-50": isRefreshing,
        })}
      >
        {data.list.books.edges.map(({ node: book }) => (
          <div key={book.googleBooksVolumeId} className="flex">
            <img src={book.image} alt={book.title} />
            <div>
              <p>{book.title}</p>
              <p
                onClick={() => {
                  startTransition(async () => {
                    await request(REMOVE_BOOK_FROM_LIST_MUTATION, {
                      googleBooksVolumeId: book.googleBooksVolumeId,
                      listSlug,
                    });

                    refetch();
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
          addBook={({ googleBooksVolumeId }) => {
            console.log("add book", googleBooksVolumeId);
            startTransition(async () => {
              await request(ADD_BOOK_TO_LIST_MUTATION, {
                listSlug,
                googleBooksVolumeId,
              });

              refetch();
            });
          }}
        />
      </div>
      {hydrateClient}
    </>
  );
}
