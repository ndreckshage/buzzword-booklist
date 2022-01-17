import { useRouter } from "next/router";
import { Suspense } from "react";
import GoogleBooksTypeahead from "ui/components/manage/lists/google-books-typeahead.client";
import Image from "next/image";
import { useQuery, useMutation, gql } from "ui/lib/use-data.client";
import cx from "classnames";

const GET_LISTS_QUERY = gql`
  query GetList($listKey: String!) {
    currentUser {
      name
    }
    list(listKey: $listKey) {
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
  currentUser?: {
    name: string;
  };
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
    $listKey: String!
    $googleBooksVolumeId: String!
  ) {
    removeBookFromList(
      listKey: $listKey
      googleBooksVolumeId: $googleBooksVolumeId
    )
  }
`;

const ADD_BOOK_TO_LIST_MUTATION = gql`
  mutation AddBookToList($listKey: String!, $googleBooksVolumeId: String!) {
    addBookToList(listKey: $listKey, googleBooksVolumeId: $googleBooksVolumeId)
  }
`;

const EditList = ({ listKey }: { listKey: string }) => {
  const {
    data,
    hydrateClient,
    refresh,
    isPending: getBooksPending,
  } = useQuery<GetListsResponse>(`get-list::${listKey}`, GET_LISTS_QUERY, {
    listKey,
  });

  const [addBookMutation, { isPending: addBookPending }] = useMutation<{
    addBookToList: boolean;
  }>(ADD_BOOK_TO_LIST_MUTATION);

  const [removeBookMutation, { isPending: removeBookPending }] = useMutation<{
    removeBookFromList: boolean;
  }>(REMOVE_BOOK_FROM_LIST_MUTATION);

  const isPending = getBooksPending || addBookPending || removeBookPending;

  if (data.list.createdBy !== data.currentUser?.name) {
    return <p>Not Authorized</p>;
  }

  console.log(data.list);

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
                      listKey,
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
              addBookMutation({ googleBooksVolumeId, listKey }).then(refresh);
            }}
          />
        </div>
      </>
    </>
  );
};

export default function EditListPage() {
  const router = useRouter();
  const listKey = router.query.list;

  // @NOTE next params dont work with streaming / nextjs yet
  // @NOTE AND dynamic routes dont work client side, so adjusting to query params
  // const listKey = router.asPath.match(/\/manage\/lists\/(.*)\/edit/)?.[1];
  // if (!listKey) {
  //   return <>Bad Route Match: {router.asPath}</>;
  // }

  if (typeof listKey !== "string") {
    return <p>No list to edit!</p>;
  }

  return (
    <Suspense fallback="Loading book list...">
      <EditList listKey={listKey} />
    </Suspense>
  );
}
