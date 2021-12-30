import { useRouter } from "next/router";
import { Suspense } from "react";
import GoogleBooksTypeahead from "ui/components/manage/lists/google-books-typeahead.client";
import Image from "next/image";
import { useQuery, useMutation, gql } from "ui/lib/use-data.client";
import cx from "classnames";

const GET_LISTS_QUERY = gql`
  query GetList($listSlug: String!) {
    currentUser
    list(listSlug: $listSlug) {
      title
      createdBy
      books {
        title
        googleBooksVolumeId
        image
      }
    }
  }
`;

type GetListsResponse = {
  currentUser: string | null;
  list: {
    title: string;
    createdBy: string;
    books: {
      title: string;
      googleBooksVolumeId: string;
      image: string;
    }[];
  };
};

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

const EditList = ({ listSlug }: { listSlug: string }) => {
  const {
    data,
    hydrateClient,
    refresh,
    isPending: getBooksPending,
  } = useQuery<GetListsResponse>(`get-list::${listSlug}`, GET_LISTS_QUERY, {
    listSlug,
  });

  const [addBookMutation, { isPending: addBookPending }] = useMutation<{
    addBookToList: boolean;
  }>(ADD_BOOK_TO_LIST_MUTATION);

  const [removeBookMutation, { isPending: removeBookPending }] = useMutation<{
    removeBookFromList: boolean;
  }>(REMOVE_BOOK_FROM_LIST_MUTATION);

  const isPending = getBooksPending || addBookPending || removeBookPending;

  if (data.list.createdBy !== data.currentUser) {
    return <p>Not Authorized</p>;
  }

  return (
    <>
      <>
        <div
          className={cx("transition-opacity", {
            "opacity-100": !isPending,
            "opacity-50": isPending,
          })}
        >
          {data.list.books.map(({ googleBooksVolumeId, image, title }) => (
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
          ))}
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

export default function EditListPage() {
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
      <EditList listSlug={listSlug} />
    </Suspense>
  );
}
