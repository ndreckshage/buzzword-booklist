import { useRouter } from "next/router";
import { Suspense } from "react";
import GoogleBooksTypeahead from "components/manage/lists/google-books-typeahead.client";
import { request, gql } from "lib/graphql-request";
import Image from "next/image";
import useData, { useMutation } from "lib/use-data.client";
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

const BookList = ({ listSlug }: { listSlug: string }) => {
  const {
    data,
    hydrateClient,
    refresh,
    isPending: getBooksPending,
  } = useData<{
    list: {
      title: string;
      books: {
        edges: {
          node: {
            title: string;
            googleBooksVolumeId: string;
            image: string;
          };
        }[];
      };
    };
  }>(`get-list::${listSlug}`, () => request(GET_LISTS_QUERY, { listSlug }));

  const [addBookMutation, { isPending: addBookPending }] = useMutation<
    boolean,
    { googleBooksVolumeId: string; listSlug: string }
  >((variables) => request(ADD_BOOK_TO_LIST_MUTATION, variables));

  const [removeBookMutation, { isPending: removeBookPending }] = useMutation(
    (variables) => request(REMOVE_BOOK_FROM_LIST_MUTATION, variables)
  );

  const isPending = getBooksPending || addBookPending || removeBookPending;

  return (
    <>
      <>
        <div
          className={cx("transition-opacity", {
            "opacity-100": !isPending,
            "opacity-50": isPending,
          })}
        >
          {data.list.books.edges.map(
            ({ node: { googleBooksVolumeId, image, title } }) => (
              <div key={googleBooksVolumeId} className="flex">
                <Image src={image} alt={title} width={100} height={150} />
                <div>
                  <p>{title}</p>
                  <p
                    className="cursor-pointer"
                    onClick={() => {
                      removeBookMutation({
                        googleBooksVolumeId,
                        listSlug,
                      }).then(refresh);
                    }}
                  >
                    Remove
                  </p>
                </div>
              </div>
            )
          )}
        </div>
        {hydrateClient}
      </>
      <>
        <div>
          <GoogleBooksTypeahead
            addBook={({ googleBooksVolumeId }) => {
              addBookMutation({ googleBooksVolumeId, listSlug }).then(refresh);
            }}
          />
        </div>
      </>
    </>
  );
};

export default function EditList() {
  const router = useRouter();
  const listSlug = router.query.list;

  // @NOTE next params dont work with streaming / nextjs yet
  // @NOTE AND dynamic routes dont work client side, so adjusting to query params
  // const listSlug = router.asPath.match(/\/manage\/lists\/(.*)\/edit/)?.[1];
  // if (!listSlug) {
  //   return <>Bad Route Match: {router.asPath}</>;
  // }

  if (typeof listSlug !== "string") {
    return <p>No list to edit!</p>;
  }

  return (
    <Suspense fallback="Loading book list...">
      <BookList listSlug={listSlug} />
    </Suspense>
  );
}
