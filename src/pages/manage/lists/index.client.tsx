import Link from "next/link";
import { useQuery, gql } from "ui/lib/use-data.client";
import { Suspense } from "react";

const GET_LISTS_QUERY = gql`
  query GetLists {
    currentUser {
      lists {
        id
        key
        title
      }
    }
  }
`;

function ManageLists() {
  const { data, hydrateClient, isPending } = useQuery<{
    currentUser?: {
      lists: {
        id: string;
        key: string;
        title: string;
      }[];
    };
  }>("currentUser::getLists", GET_LISTS_QUERY);

  return (
    <>
      <p>Manage Lists</p>
      <Link href="/manage/lists/create">
        <a>Create List</a>
      </Link>
      <hr className="my-5" />
      <ul>
        {data.currentUser?.lists.map((list) => (
          <li key={list.id}>
            <Link href={`/manage/lists/edit?list=${list.key}`}>
              <a>Edit {list.title}</a>
            </Link>
          </li>
        ))}
      </ul>
      {hydrateClient}
    </>
  );
}

export default function ManageListsPage() {
  return (
    <Suspense fallback="Loading lists...">
      <ManageLists />
    </Suspense>
  );
}
